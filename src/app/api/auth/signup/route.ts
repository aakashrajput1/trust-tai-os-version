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

interface SignupRequest {
  name: string
  email: string
  password: string
  role: string
  department?: string
  position?: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/auth/signup - Processing signup request')
    
    const userData: SignupRequest = await request.json()
    
    console.log('📥 Signup data received:', {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      position: userData.position
    })

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      console.log('❌ Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      console.log(`❌ User with email ${userData.email} already exists`)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if user is already in approval queue (pending approval)
    const { data: existingPendingUser, error: pendingCheckError } = await supabaseAdmin
      .from('users')
      .select('id, email, isApproved, isRejected')
      .eq('email', userData.email)
      .single()

    if (existingPendingUser) {
      if (!existingPendingUser.isApproved && !existingPendingUser.isRejected) {
        console.log(`❌ User with email ${userData.email} already pending approval`)
        return NextResponse.json(
          { error: 'An account with this email is already pending approval' },
          { status: 400 }
        )
      } else if (existingPendingUser.isApproved) {
        console.log(`❌ User with email ${userData.email} already approved`)
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      } else if (existingPendingUser.isRejected) {
        console.log(`❌ User with email ${userData.email} was previously rejected`)
        return NextResponse.json(
          { error: 'This email was previously rejected. Please contact support.' },
          { status: 400 }
        )
      }
    }

    console.log('✅ Validation passed, creating user account')

    // Create user in Supabase Auth (but don't confirm email yet)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: false, // Don't confirm email yet - wait for admin approval
      user_metadata: {
        name: userData.name,
        role: userData.role,
        department: userData.department,
        position: userData.position
      }
    })

    if (authError) {
      console.error('❌ Auth error creating user:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    console.log('✅ Auth user created:', authUser.user.id)

    // Create user profile with pending approval status
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department || null,
        position: userData.position || null,
        isApproved: false,
        isRejected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('❌ Error creating user profile:', profileError)
      // If we can't create profile, we should clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json(
        { error: 'Failed to process signup request' },
        { status: 500 }
      )
    }

    console.log('✅ User profile created with pending approval status')

    // Send notification email to admin (optional)
    try {
      await sendAdminNotification(userData)
    } catch (emailError) {
      console.error('❌ Error sending admin notification:', emailError)
      // Don't fail the signup if email fails
    }

    // Log the action
    await logAuditEvent(supabaseAdmin, {
      userId: 'system',
      action: 'user_signup_pending',
      resource: 'users',
      resourceId: authUser.user.id,
      details: { 
        userEmail: userData.email,
        userRole: userData.role,
        userName: userData.name
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Signup successful! Your account is pending admin approval.',
      data: {
        userId: authUser.user.id,
        email: userData.email,
        status: 'pending_review'
      }
    })

  } catch (error) {
    console.error('❌ Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendAdminNotification(userData: SignupRequest) {
  // In a real app, implement email service to notify admin
  console.log(`📧 Admin notification: New user signup - ${userData.name} (${userData.email}) - Role: ${userData.role}`)
  
  // Example email template:
  const emailContent = `
    New User Signup Request
    
    Name: ${userData.name}
    Email: ${userData.email}
    Role: ${userData.role}
    Department: ${userData.department || 'Not specified'}
    Position: ${userData.position || 'Not specified'}
    
    Please review this user's account in the admin dashboard.
  `
  
  console.log('Email content:', emailContent)
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
        user_agent: 'Signup API',
        severity: 'low',
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
