import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Check if session exists and is valid
    const { data: sessionData, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at, is_active')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single()

    if (sessionError || !sessionData) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Check if session is expired
    if (new Date(sessionData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    // Get admin data
    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('id, name, email, role, status')
      .eq('id', sessionData.admin_id)
      .eq('status', 'active')
      .single()

    if (adminError || !adminData) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: adminData
    })

  } catch (error) {
    console.error('Verify session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
