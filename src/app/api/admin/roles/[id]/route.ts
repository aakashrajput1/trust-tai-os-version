import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Role, UpdateRoleRequest, Permission } from '@/types/admin'

export async function GET(
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

    // Check if user has admin role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Executive')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const roleId = params.id

    // Get role by ID with permissions and user count
    const role = await getRoleById(supabase, roleId)

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: role
    })

  } catch (error) {
    console.error('Get role error:', error)
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
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can update roles)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const roleId = params.id
    const updateData: UpdateRoleRequest = await request.json()

    // Check if role exists
    const existingRole = await getRoleById(supabase, roleId)
    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    // Prevent updating system roles
    if (existingRole.isSystem) {
      return NextResponse.json(
        { error: 'Cannot update system roles' },
        { status: 400 }
      )
    }

    // Update role
    const updatedRole = await updateRole(supabase, roleId, updateData)

    // Log the action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'role_updated',
      resource: 'roles',
      resourceId: roleId,
      details: { 
        updatedFields: Object.keys(updateData),
        previousName: existingRole.name,
        newName: updateData.name || existingRole.name
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully'
    })

  } catch (error) {
    console.error('Update role error:', error)
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
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can delete roles)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const roleId = params.id

    // Check if role exists
    const existingRole = await getRoleById(supabase, roleId)
    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 })
    }

    // Prevent deleting system roles
    if (existingRole.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system roles' },
        { status: 400 }
      )
    }

    // Check if role is assigned to any users
    if (existingRole.userCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete role. ${existingRole.userCount} users are currently assigned to this role.` },
        { status: 400 }
      )
    }

    // Delete role permissions first
    const { error: permissionsError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)

    if (permissionsError) {
      console.error('Error deleting role permissions:', permissionsError)
    }

    // Delete the role
    const { error: deleteError } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)

    if (deleteError) throw deleteError

    // Log the action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'role_deleted',
      resource: 'roles',
      resourceId: roleId,
      details: { 
        deletedRoleName: existingRole.name,
        deletedRoleDescription: existingRole.description
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    })

  } catch (error) {
    console.error('Delete role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getRoleById(supabase: any, roleId: string): Promise<Role | null> {
  try {
    // Get role with permissions
    const { data: role, error } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions(
          permission_id,
          permissions(*)
        )
      `)
      .eq('id', roleId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    // Get user count for this role
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', role.name)

    // Transform permissions
    const permissions: Permission[] = (role.role_permissions || []).map((rp: any) => ({
      id: rp.permissions.id,
      name: rp.permissions.name,
      resource: rp.permissions.resource,
      action: rp.permissions.action,
      scope: rp.permissions.scope
    }))

    const transformedRole: Role = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions,
      isSystem: role.is_system || false,
      createdAt: role.created_at,
      updatedAt: role.updated_at,
      userCount: userCount || 0,
      metadata: role.metadata
    }

    return transformedRole

  } catch (error) {
    console.error('Error getting role by ID:', error)
    throw error
  }
}

async function updateRole(
  supabase: any, 
  roleId: string, 
  updateData: UpdateRoleRequest
): Promise<Role> {
  try {
    // Build update object
    const updateObject: any = {
      updated_at: new Date().toISOString()
    }

    if (updateData.name !== undefined) updateObject.name = updateData.name
    if (updateData.description !== undefined) updateObject.description = updateData.description
    if (updateData.metadata !== undefined) updateObject.metadata = updateData.metadata

    // Update role
    const { data: updatedRole, error: updateError } = await supabase
      .from('roles')
      .update(updateObject)
      .eq('id', roleId)
      .select()
      .single()

    if (updateError) throw updateError

    // Update permissions if provided
    if (updateData.permissions !== undefined) {
      // Remove existing permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId)

      if (deleteError) {
        console.error('Error deleting existing permissions:', deleteError)
      }

      // Add new permissions
      if (updateData.permissions.length > 0) {
        const permissionAssignments = updateData.permissions.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId,
          created_at: new Date().toISOString()
        }))

        const { error: permissionError } = await supabase
          .from('role_permissions')
          .insert(permissionAssignments)

        if (permissionError) {
          console.error('Error assigning new permissions:', permissionError)
        }
      }
    }

    // Get the updated role with permissions
    const updatedRoleWithPermissions = await getRoleById(supabase, roleId)
    if (!updatedRoleWithPermissions) {
      throw new Error('Failed to retrieve updated role')
    }

    return updatedRoleWithPermissions

  } catch (error) {
    console.error('Error updating role:', error)
    throw error
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
        severity: 'low',
        category: 'role_management',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
