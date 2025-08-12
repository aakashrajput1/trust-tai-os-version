import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, role, status } = body
    
    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (status) updateData.status = status
    
    updateData.updated_at = new Date().toISOString()
    
    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin',
        action: 'user_updated',
        details: `Updated user ${params.id}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete - just update status to inactive
    const { error } = await supabase
      .from('users')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
    
    if (error) throw error
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin',
        action: 'user_deactivated',
        details: `Deactivated user ${params.id}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ message: 'User deactivated successfully' })
    
  } catch (error) {
    console.error('Error deactivating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, value } = body
    
    switch (action) {
      case 'change_role':
        const { error: roleError } = await supabase
          .from('users')
          .update({ 
            role: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', params.id)
        
        if (roleError) throw roleError
        
        // Log the action
        await supabase
          .from('audit_logs')
          .insert({
            user_id: 'admin',
            action: 'user_role_changed',
            details: `Changed role to ${value} for user ${params.id}`,
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            timestamp: new Date().toISOString()
          })
        
        break
        
      case 'change_status':
        const { error: statusError } = await supabase
          .from('users')
          .update({ 
            status: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', params.id)
        
        if (statusError) throw statusError
        
        // Log the action
        await supabase
          .from('audit_logs')
          .insert({
            user_id: 'admin',
            action: 'user_status_changed',
            details: `Changed status to ${value} for user ${params.id}`,
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            timestamp: new Date().toISOString()
          })
        
        break
        
      case 'reset_password':
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8)
        
        const { error: passwordError } = await supabase
          .from('users')
          .update({ 
            password_hash: tempPassword, // In production, hash this
            updated_at: new Date().toISOString()
          })
          .eq('id', params.id)
        
        if (passwordError) throw passwordError
        
        // Log the action
        await supabase
          .from('audit_logs')
          .insert({
            user_id: 'admin',
            action: 'user_password_reset',
            details: `Reset password for user ${params.id}`,
            ip_address: request.headers.get('x-forwarded-for') || 'unknown',
            timestamp: new Date().toISOString()
          })
        
        return NextResponse.json({ 
          message: 'Password reset successfully',
          temporaryPassword: tempPassword
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ message: 'Action completed successfully' })
    
  } catch (error) {
    console.error('Error performing user action:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
