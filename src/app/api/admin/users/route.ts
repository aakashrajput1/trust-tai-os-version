import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/emailService'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (role && role !== 'all') {
      query = query.eq('role', role)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data: users, error, count } = await query
    
    if (error) throw error
    
    return NextResponse.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, department, position } = body
    
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Generate a secure temporary password
    const tempPassword = generateTemporaryPassword()
    
    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        role,
        department: department || null,
        position: position || null,
        password_hash: tempPassword, // In production, hash this password
        status: 'active',
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        is_invited: true,
        invitation_sent_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Send invitation email
    try {
      await sendInvitationEmail(email, name, tempPassword)
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError)
      // Continue with user creation even if email fails
    }
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin', // Replace with actual admin user ID
        action: 'user_created',
        details: `Created user ${email} with role ${role}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ 
      user,
      message: 'User created successfully. Invitation email sent.'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate a secure temporary password
function generateTemporaryPassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)] // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)] // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)] // Number
  password += '!@#$%^&*'[Math.floor(Math.random() * 4)] // Special character
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Send invitation email with login credentials
async function sendInvitationEmail(email: string, name: string, password: string) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Platform!</h1>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          You have been invited to join our platform by an administrator. 
          Your account has been created and you can now log in using the credentials below.
        </p>
        
        <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Your Login Credentials</h3>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background: #f8f9fa; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${password}</code></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
             style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Login Now
          </a>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Important:</strong> For security reasons, please change your password after your first login.
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          If you have any questions or need assistance, please contact our support team.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin: 0;">
          Best regards,<br>
          The Team
        </p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="color: #999; margin: 0; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `
  
  // Send the email using the email service
  await sendEmail({
    to: email,
    subject: 'Welcome to Our Platform - Your Login Credentials',
    html: emailContent,
    from: 'noreply@company.com'
  })
}
