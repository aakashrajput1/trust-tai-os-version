import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin role (you can implement proper auth middleware later)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { enabled } = await request.json()
    const userId = params.id

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'enabled must be a boolean' }, { status: 400 })
    }

    // Update user's MFA status
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        mfa_enabled: enabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('MFA update error:', updateError)
      return NextResponse.json({ error: 'Failed to update MFA status' }, { status: 500 })
    }

    // Log the MFA change action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'system', // or actual admin user ID
        action: 'mfa_toggle',
        details: `MFA ${enabled ? 'enabled' : 'disabled'} for user ${userId}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        severity: 'medium',
        category: 'user_management',
        status: 'success',
        timestamp: new Date().toISOString()
      })

    return NextResponse.json({
      message: `MFA ${enabled ? 'enabled' : 'disabled'} successfully`,
      mfa_enabled: enabled
    })

  } catch (error) {
    console.error('MFA toggle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
