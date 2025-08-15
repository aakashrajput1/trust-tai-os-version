import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  Role, 
  CreateRoleRequest, 
  UpdateRoleRequest, 
  Permission,
  PermissionTemplate 
} from '@/types/admin'

export async function GET(request: NextRequest) {
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

    // Get all roles with user counts
    const roles = await getRolesWithUserCounts(supabase)

    return NextResponse.json({
      success: true,
      data: roles
    })

  } catch (error) {
    console.error('Get roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can create roles)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const roleData: CreateRoleRequest = await request.json()

    // Validate required fields
    if (!roleData.name || !roleData.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Check if role already exists
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleData.name)
      .single()

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 409 }
      )
    }

    // Create role
    const newRole = await createRole(supabase, roleData)

    // Log the action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'role_created',
      resource: 'roles',
      resourceId: newRole.id,
      details: { roleName: roleData.name, permissions: roleData.permissions }
    })

    return NextResponse.json({
      success: true,
      data: newRole,
      message: 'Role created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getRolesWithUserCounts(supabase: any): Promise<Role[]> {
  try {
    // Get all roles
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false })

    if (rolesError) throw rolesError

    // Get user count for each role
    const rolesWithCounts: Role[] = await Promise.all(
      (roles || []).map(async (role: any) => {
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', role.name)

        // Get permissions for this role
        const { data: permissions } = await supabase
          .from('role_permissions')
          .select('permission_id, permissions(*)')
          .eq('role_id', role.id)

        const rolePermissions: Permission[] = (permissions || []).map((rp: any) => ({
          id: rp.permissions.id,
          name: rp.permissions.name,
          resource: rp.permissions.resource,
          action: rp.permissions.action,
          scope: rp.permissions.scope
        }))

        return {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: rolePermissions,
          isSystem: role.is_system || false,
          createdAt: role.created_at,
          updatedAt: role.updated_at,
          userCount: userCount || 0,
          metadata: role.metadata
        }
      })
    )

    return rolesWithCounts

  } catch (error) {
    console.error('Error getting roles with user counts:', error)
    throw error
  }
}

async function createRole(supabase: any, roleData: CreateRoleRequest): Promise<Role> {
  try {
    // Create role
    const { data: newRole, error: roleError } = await supabase
      .from('roles')
      .insert({
        name: roleData.name,
        description: roleData.description,
        is_system: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: roleData.metadata || {}
      })
      .select()
      .single()

    if (roleError) throw roleError

    // Assign permissions if provided
    if (roleData.permissions && roleData.permissions.length > 0) {
      const permissionAssignments = roleData.permissions.map(permissionId => ({
        role_id: newRole.id,
        permission_id: permissionId,
        created_at: new Date().toISOString()
      }))

      const { error: permissionError } = await supabase
        .from('role_permissions')
        .insert(permissionAssignments)

      if (permissionError) {
        console.error('Error assigning permissions:', permissionError)
        // Continue with role creation even if permission assignment fails
      }
    }

    // Get the created role with permissions
    const { data: roleWithPermissions } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions(
          permission_id,
          permissions(*)
        )
      `)
      .eq('id', newRole.id)
      .single()

    const permissions: Permission[] = (roleWithPermissions?.role_permissions || []).map((rp: any) => ({
      id: rp.permissions.id,
      name: rp.permissions.name,
      resource: rp.permissions.resource,
      action: rp.permissions.action,
      scope: rp.permissions.scope
    }))

    const createdRole: Role = {
      id: newRole.id,
      name: newRole.name,
      description: newRole.description,
      permissions,
      isSystem: newRole.is_system || false,
      createdAt: newRole.created_at,
      updatedAt: newRole.updated_at,
      userCount: 0,
      metadata: newRole.metadata
    }

    return createdRole

  } catch (error) {
    console.error('Error creating role:', error)
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
