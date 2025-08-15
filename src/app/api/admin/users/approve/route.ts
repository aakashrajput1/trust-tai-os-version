import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// GET /api/admin/users/approve - Get users pending approval
export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 GET /api/admin/users/approve - Authentication bypassed for testing')
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    // Build query for users pending approval (both isApproved and isRejected are false)
    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .eq('isApproved', false)
      .eq('isRejected', false)
      .order('created_at', { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit - 1
    query = query.range(start, end)

    const { data: pendingUsers, count, error } = await query

    if (error) {
      console.error('Error fetching pending users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch pending users' },
        { status: 500 }
      )
    }

    // Debug: Log the raw data to see if there are any issues
    console.log('Raw pending users data:', JSON.stringify(pendingUsers, null, 2))

    // Get counts for different approval statuses
    const { data: allUsers } = await supabaseAdmin
      .from('users')
      .select('isApproved, isRejected')

    const counts = {
      pending: allUsers?.filter(u => !u.isApproved && !u.isRejected).length || 0,
      approved: allUsers?.filter(u => u.isApproved && !u.isRejected).length || 0,
      rejected: allUsers?.filter(u => u.isRejected).length || 0,
      total: allUsers?.length || 0
    }

    // Ensure all data is serializable
    const serializableUsers = (pendingUsers || []).map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      department: user.department || null,
      position: user.position || null,
      isApproved: Boolean(user.isApproved),
      isRejected: Boolean(user.isRejected),
      created_at: user.created_at,
      updated_at: user.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: {
        users: serializableUsers,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        counts
      }
    })

  } catch (error) {
    console.error('Get pending users error:', error)
    
    // Check if it's a JSON serialization error
    if (error instanceof Error && error.message.includes('JSON')) {
      console.error('JSON serialization error detected')
      return NextResponse.json(
        { error: 'Data serialization error' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users/approve - Approve or reject a user
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 POST /api/admin/users/approve - Authentication bypassed for testing')
    
    const { userId, action, adminNotes } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Get the user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already processed
    if (user.isApproved || user.isRejected) {
      return NextResponse.json(
        { error: 'User has already been processed' },
        { status: 400 }
      )
    }

    const adminId = 'admin-bypass' // In real app, get from auth

    // Update user approval status
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (action === 'approve') {
      updateData.isApproved = true
      updateData.isRejected = false
    } else {
      updateData.isApproved = false
      updateData.isRejected = true
    }

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user approval status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user approval status' },
        { status: 500 }
      )
    }

    // If approved, confirm user email
    if (action === 'approve') {
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      )

      if (confirmError) {
        console.error('Error confirming user email:', confirmError)
      }

      // Send approval email
      try {
        await sendApprovalEmail(user)
      } catch (emailError) {
        console.error('Error sending approval email:', emailError)
      }
    } else {
      // If rejected, send rejection email
      try {
        await sendRejectionEmail(user, adminNotes)
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError)
      }
    }

    // Log the action
    try {
      await logAuditEvent(supabaseAdmin, {
        userId: adminId,
        action: `user_${action}d`,
        resource: 'users',
        resourceId: userId,
        details: { 
          userEmail: user.email,
          userRole: user.role,
          action,
          adminNotes
        }
      })
    } catch (auditError) {
      console.error('Error logging audit event:', auditError)
      // Don't fail the entire operation if audit logging fails
    }

    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`,
      data: {
        userId,
        action,
        isApproved: action === 'approve',
        isRejected: action === 'reject'
      }
    })

  } catch (error) {
    console.error('User approval action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
import { sendEmail } from '@/lib/emailService'
import { getEmailTemplate } from '@/lib/emailTemplates'

async function sendApprovalEmail(user: any) {
  try {
    console.log('Sending approval email to:', user.email, 'with name:', user.name, 'role:', user.role)
    const emailTemplate = getEmailTemplate('accountApproved', user.email, undefined, user.name || 'User', user.role || 'User')
    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })
    console.log('Approval email sent to:', user.email)
  } catch (error) {
    console.error('Error sending approval email:', error)
    // Don't throw the error to prevent the entire operation from failing
  }
}

async function sendRejectionEmail(user: any, adminNotes?: string) {
  try {
    console.log('Sending rejection email to:', user.email, 'with name:', user.name, 'role:', user.role, 'notes:', adminNotes)
    const emailTemplate = getEmailTemplate('accountRejected', user.email, undefined, user.name || 'User', user.role || 'User', adminNotes)
    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })
    console.log('Rejection email sent to:', user.email, 'Notes:', adminNotes)
  } catch (error) {
    console.error('Error sending rejection email:', error)
    // Don't throw the error to prevent the entire operation from failing
  }
}

async function logAuditEvent(supabase: any, event: any) {
  try {
    // Ensure all data is serializable
    const serializableDetails = JSON.parse(JSON.stringify(event.details))
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: event.userId,
        action: event.action,
        resource_type: event.resource,
        resource_id: event.resourceId,
        details: serializableDetails,
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: 'Admin Approval API',
        severity: 'medium',
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
    throw error // Re-throw to be caught by the caller
  }
}
