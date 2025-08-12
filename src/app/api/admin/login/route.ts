import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Check if required environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseServiceKey && !supabaseAnonKey) {
  throw new Error('Either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

// Create Supabase client with Edge Runtime compatible configuration
const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown'

    const now = Date.now()
    const attemptData = loginAttempts.get(clientIP)

    if (attemptData) {
      const timeDiff = now - attemptData.lastAttempt

      // Reset attempts after 15 minutes
      if (timeDiff > 15 * 60 * 1000) {
        loginAttempts.delete(clientIP)
      } else if (attemptData.count >= 5) {
        // Block for 15 minutes after 5 failed attempts
        return NextResponse.json(
          { error: 'Too many login attempts. Please try again in 15 minutes.' },
          { status: 429 }
        )
      }
    }

    // Check admin credentials directly from admin table
    const supabase = createSupabaseClient()
    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('id, name, email, password_hash, role, status, permissions, login_count')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    if (adminError || !adminData) {
      // Update rate limiting
      const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      })

      // Log failed login attempt
      await logAdminLoginAttempt(email, clientIP, false, 'Admin not found or inactive')

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password using pgcrypto directly
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('verify_password', {
        p_email: email,
        p_password: password
      })

    if (passwordError || !passwordCheck) {
      // Update rate limiting
      const currentAttempts = loginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(clientIP, {
        count: currentAttempts.count + 1,
        lastAttempt: now
      })

      // Log failed login attempt
      await logAdminLoginAttempt(email, clientIP, false, 'Invalid password')

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update admin login stats
    await supabase
      .from('admin')
      .update({ 
        last_login: new Date().toISOString(),
        last_active: new Date().toISOString(),
        login_count: (adminData.login_count || 0) + 1,
        failed_login_attempts: 0
      })
      .eq('id', adminData.id)

    // Log successful login
    await logAdminLoginAttempt(email, clientIP, true, 'Login successful')

    // Clear rate limiting for this IP
    loginAttempts.delete(clientIP)

    // Return admin data (without sensitive information)
    return NextResponse.json({
      success: true,
      admin: {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
        status: adminData.status,
        permissions: adminData.permissions
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)

    // Log the error
    await logAdminLoginAttempt(
      'unknown',
      request.headers.get('x-forwarded-for') || 'unknown',
      false,
      'Internal server error'
    )

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function logAdminLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean,
  details: string
) {
  try {
    const supabase = createSupabaseClient()
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: null, // Will be null for failed logins
        action: success ? 'admin_login_success' : 'admin_login_failed',
        details: { email, details },
        ip_address: ipAddress,
        timestamp: new Date().toISOString(),
        severity: success ? 'info' : 'warning'
      })
  } catch (error) {
    console.error('Failed to log admin login attempt:', error)
  }
}

// Rate limiting info endpoint (for monitoring)
export async function GET() {
  return NextResponse.json({
    message: 'Admin login endpoint',
    rateLimitInfo: {
      maxAttempts: 5,
      blockDuration: '15 minutes',
      resetAfter: '15 minutes'
    },
    environment: {
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      supabaseUrl: !!supabaseUrl
    }
  })
}
