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

interface ReviewFilters {
  status?: 'pending' | 'approved' | 'rejected'
  role?: string
  search?: string
}

// GET /api/admin/reviews - Get all user reviews
export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 GET /api/admin/reviews - Authentication bypassed for testing')
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'all'
    const role = searchParams.get('role') || 'all'
    const search = searchParams.get('search') || ''

    // Build query
    let query = supabaseAdmin
      .from('user_reviews')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (role !== 'all') {
      query = query.eq('role', role)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit - 1
    query = query.range(start, end)

    const { data: reviews, count, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    // Get counts for different statuses
    const { data: statusCounts } = await supabaseAdmin
      .from('user_reviews')
      .select('status')

    const counts = {
      pending: statusCounts?.filter(r => r.status === 'pending').length || 0,
      approved: statusCounts?.filter(r => r.status === 'approved').length || 0,
      rejected: statusCounts?.filter(r => r.status === 'rejected').length || 0,
      total: statusCounts?.length || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviews || [],
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
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/reviews - Approve or reject a user
export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 POST /api/admin/reviews - Authentication bypassed for testing')
    
    const { reviewId, action, adminNotes } = await request.json()

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Review ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Get the review
    const { data: review, error: fetchError } = await supabaseAdmin
      .from('user_reviews')
      .select('*')
      .eq('id', reviewId)
      .single()

    if (fetchError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    if (review.status !== 'pending') {
      return NextResponse.json(
        { error: 'Review has already been processed' },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected'
    const adminId = 'admin-bypass' // In real app, get from auth

    // Update review status
    const { error: updateError } = await supabaseAdmin
      .from('user_reviews')
      .update({
        status: newStatus,
        admin_notes: adminNotes || null,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)

    if (updateError) {
      console.error('Error updating review:', updateError)
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      )
    }

    // If approved, create user profile and confirm email
    if (action === 'approve') {
      const { error: profileError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: review.user_id,
          email: review.email,
          name: review.name,
          role: review.role,
          department: review.department,
          position: review.position,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // Don't fail the approval if profile creation fails
      }

      // Confirm user email
      const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
        review.user_id,
        { email_confirm: true }
      )

      if (confirmError) {
        console.error('Error confirming user email:', confirmError)
      }

      // Send approval email
      try {
        await sendApprovalEmail(review)
      } catch (emailError) {
        console.error('Error sending approval email:', emailError)
      }
    } else {
      // If rejected, send rejection email
      try {
        await sendRejectionEmail(review, adminNotes)
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError)
      }
    }

    // Log the action
    await logAuditEvent(supabaseAdmin, {
      userId: adminId,
      action: `user_${action}d`,
      resource: 'user_reviews',
      resourceId: reviewId,
      details: { 
        userEmail: review.email,
        userRole: review.role,
        action,
        adminNotes
      }
    })

    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`,
      data: {
        reviewId,
        status: newStatus,
        action
      }
    })

  } catch (error) {
    console.error('Review action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendApprovalEmail(review: any) {
  // In a real app, implement email service
  console.log(`📧 Approval email sent to ${review.email}`)
  
  const emailContent = `
    Congratulations! Your account has been approved.
    
    Name: ${review.name}
    Email: ${review.email}
    Role: ${review.role}
    
    You can now login to the platform at: https://yourplatform.com/login
    
    Welcome to Trust TAI OS!
  `
  
  console.log('Approval email content:', emailContent)
}

async function sendRejectionEmail(review: any, adminNotes?: string) {
  // In a real app, implement email service
  console.log(`📧 Rejection email sent to ${review.email}`)
  
  const emailContent = `
    Your account application has been reviewed.
    
    Name: ${review.name}
    Email: ${review.email}
    Role: ${review.role}
    
    Status: Rejected
    ${adminNotes ? `Notes: ${adminNotes}` : ''}
    
    If you have any questions, please contact support.
  `
  
  console.log('Rejection email content:', emailContent)
}

async function logAuditEvent(supabase: any, eventData: {
  userId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
}) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: eventData.userId,
        action: eventData.action,
        resource_type: eventData.resource,
        resource_id: eventData.resourceId,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: 'Admin API',
        severity: 'medium',
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}


