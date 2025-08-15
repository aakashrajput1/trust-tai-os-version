import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { User } from '@/types/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can toggle MFA)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const userId = params.id

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, name, email, mfa_enabled')
      .eq('id', userId)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      throw fetchError
    }

    // Toggle MFA status
    const newMfaStatus = !existingUser.mfa_enabled

    // Update user MFA status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        mfa_enabled: newMfaStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) throw updateError

    // Log the action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'user_mfa_toggled',
      resource: 'users',
      resourceId: userId,
      details: { 
        previousMfaStatus: existingUser.mfa_enabled,
        newMfaStatus: newMfaStatus,
        targetUserName: existingUser.name,
        targetUserEmail: existingUser.email
      }
    })

    // Transform to User interface
    const transformedUser: User = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      department: updatedUser.department,
      position: updatedUser.position,
      mfa_enabled: updatedUser.mfa_enabled || false,
      lastActive: updatedUser.last_active || updatedUser.updated_at,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      location: updatedUser.location,
      managerId: updatedUser.manager_id,
      permissions: updatedUser.permissions || [],
      metadata: updatedUser.metadata
    }

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: `MFA ${newMfaStatus ? 'enabled' : 'disabled'} successfully`
    })

  } catch (error) {
    console.error('Toggle MFA error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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
        resource: eventData.resource,
        resource_id: eventData.resourceId,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: 'Admin API',
        severity: 'medium',
        category: 'security',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
