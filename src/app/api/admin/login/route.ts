import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Check admin credentials in admin table
    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('id, name, email, role, status, login_count')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    if (adminError || !adminData) {
      console.log('Admin not found error:', adminError)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Admin found:', { id: adminData.id, email: adminData.email, role: adminData.role })

    // Simple password check for now
    if (password !== 'admin123') {
      console.log('Password verification failed')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login and login count
    await supabase
      .from('admin')
      .update({
        last_login: new Date().toISOString(),
        login_count: adminData.login_count + 1,
        last_active: new Date().toISOString()
      })
      .eq('id', adminData.id)

    // Create admin session data (without sessions table for now)
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    const sessionData = {
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      role: adminData.role,
      sessionToken,
      expiresAt
    }

    console.log('Admin login successful:', sessionData)

    return NextResponse.json({
      success: true,
      admin: sessionData,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
