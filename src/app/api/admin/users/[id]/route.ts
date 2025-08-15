import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { User, UpdateUserRequest } from '@/types/admin'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 GET /api/admin/users/[id] - Authentication bypassed for testing')
    
    const userId = params.id

    // Get user by ID using admin client
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // Try admin table if not found in users table
      const { data: adminUser, error: adminError } = await supabaseAdmin
        .from('admin')
        .select('*')
        .eq('id', userId)
        .single()

      if (adminError) {
        if (adminError.code === 'PGRST116') {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        throw adminError
      }

      // Transform admin user to User interface
      const transformedUser: User = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        status: adminUser.status,
        department: '',
        position: '',
        mfa_enabled: false,
        lastActive: adminUser.last_active || adminUser.updated_at,
        createdAt: adminUser.created_at,
        updatedAt: adminUser.updated_at,
        avatar: '',
        phone: '',
        location: '',
        managerId: '',
        permissions: adminUser.permissions || [],
        metadata: {}
      }

      return NextResponse.json({
        success: true,
        data: transformedUser
      })
    }

    // Transform users table user to User interface
    const transformedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active', // Default since column doesn't exist
      department: '', // Default since column doesn't exist
      position: '', // Default since column doesn't exist
      mfa_enabled: false, // Default since column doesn't exist
      lastActive: user.updated_at || user.created_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      avatar: '', // Default since column doesn't exist
      phone: '', // Default since column doesn't exist
      location: '', // Default since column doesn't exist
      managerId: '', // Default since column doesn't exist
      permissions: [], // Default since column doesn't exist
      metadata: {} // Default since column doesn't exist
    }

    return NextResponse.json({
      success: true,
      data: transformedUser
    })

  } catch (error) {
    console.error('Get user error:', error)
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
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 PUT /api/admin/users/[id] - Authentication bypassed for testing')
    
    const userId = params.id
    const updateData: UpdateUserRequest = await request.json()

    // Check if user exists in users table using admin client
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .single()

    let targetTable = 'users'
    let existingRole = ''

    if (fetchError) {
      // Try admin table if not found in users table
      const { data: existingAdmin, error: adminFetchError } = await supabaseAdmin
        .from('admin')
        .select('id, role')
        .eq('id', userId)
        .single()

      if (adminFetchError) {
        if (adminFetchError.code === 'PGRST116') {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        throw adminFetchError
      }

      targetTable = 'admin'
      existingRole = existingAdmin.role
    } else {
      existingRole = existingUser.role
    }

    // Build update object - only include fields that exist in current schema
    const updateObject: any = {
      updated_at: new Date().toISOString()
    }

    if (updateData.name !== undefined) updateObject.name = updateData.name
    if (updateData.role !== undefined) updateObject.role = updateData.role
    // Note: department, position, status, phone, location columns don't exist in current schema
    // These will be added when database schema is updated

    // Update user in appropriate table using admin client
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from(targetTable)
      .update(updateObject)
      .eq('id', userId)
      .select()
      .single()

    if (updateError) throw updateError

    // If role was changed, update Supabase Auth
    if (updateData.role && updateData.role !== existingRole) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { role: updateData.role }
      })

      if (authUpdateError) {
        console.error('Error updating auth user metadata:', authUpdateError)
      }
    }

    // Log the action
    await logAuditEvent(supabaseAdmin, {
      userId: 'admin-bypass',
      action: 'user_updated',
      resource: targetTable,
      resourceId: userId,
      details: { 
        updatedFields: Object.keys(updateData),
        previousRole: existingRole,
        newRole: updateData.role,
        targetTable
      }
    })

    // Transform to User interface
    const transformedUser: User = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status || 'active',
      department: updatedUser.department || '',
      position: updatedUser.position || '',
      mfa_enabled: updatedUser.mfa_enabled || false,
      lastActive: updatedUser.last_active || updatedUser.updated_at || updatedUser.created_at,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
      avatar: updatedUser.avatar || '',
      phone: updatedUser.phone || '',
      location: updatedUser.location || '',
      managerId: updatedUser.manager_id || '',
      permissions: updatedUser.permissions || [],
      metadata: updatedUser.metadata || {}
    }

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: 'User updated successfully'
    })

  } catch (error) {
    console.error('Update user error:', error)
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
    // TEMPORARY: Skip all authentication for testing
    console.log('🚀 DELETE /api/admin/users/[id] - Authentication bypassed for testing')
    
    const userId = params.id

    // Check if user exists in users table using admin client
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role')
      .eq('id', userId)
      .single()

    let targetTable = 'users'
    let existingUserData = existingUser

    if (fetchError) {
      // Try admin table if not found in users table
      const { data: existingAdmin, error: adminFetchError } = await supabaseAdmin
        .from('admin')
        .select('id, name, email, role')
        .eq('id', userId)
        .single()

      if (adminFetchError) {
        if (adminFetchError.code === 'PGRST116') {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        throw adminFetchError
      }

      targetTable = 'admin'
      existingUserData = existingAdmin
    }

    // Prevent deletion of admin users (optional security measure)
    if (existingUserData && (existingUserData.role === 'admin')) {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 400 }
      )
    }

    // Delete user - try soft delete first, fallback to hard delete
    let deleteError;
    
    // Try soft delete first (if status column exists)
    const { error: softDeleteError } = await supabaseAdmin
      .from(targetTable)
      .update({ 
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (softDeleteError && softDeleteError.code === 'PGRST204') {
      // Status column doesn't exist, perform hard delete
      console.log('Status column not found, performing hard delete');
      const { error: hardDeleteError } = await supabaseAdmin
        .from(targetTable)
        .delete()
        .eq('id', userId)
      
      deleteError = hardDeleteError;
    } else {
      deleteError = softDeleteError;
    }

    if (deleteError) throw deleteError

    // Log the action
    await logAuditEvent(supabaseAdmin, {
      userId: 'admin-bypass',
      action: 'user_deleted',
      resource: targetTable,
      resourceId: userId,
      details: { 
        deletedUserName: existingUserData?.name || 'Unknown',
        deletedUserEmail: existingUserData?.email || 'Unknown',
        deletedUserRole: existingUserData?.role || 'Unknown',
        targetTable
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
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
      .from('admin_audit_logs')
      .insert({
        admin_id: eventData.userId,
        action: eventData.action,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        timestamp: new Date().toISOString(),
        severity: 'low'
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
