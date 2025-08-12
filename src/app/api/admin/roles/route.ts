import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: roles, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions:role_permissions(
          id,
          permission_name,
          permission_type,
          resource,
          action
        )
      `)
      .order('name')
    
    if (error) throw error
    
    return NextResponse.json({ roles: roles || [] })
    
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body
    
    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if role already exists
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', name)
      .single()
    
    if (existingRole) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 409 }
      )
    }
    
    // Create role
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert({
        name,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (roleError) throw roleError
    
    // Create permissions for the role
    const permissionsToInsert = permissions.map((permission: any) => ({
      role_id: role.id,
      permission_name: permission.name,
      permission_type: permission.type,
      resource: permission.resource,
      action: permission.action,
      created_at: new Date().toISOString()
    }))
    
    const { error: permissionsError } = await supabase
      .from('role_permissions')
      .insert(permissionsToInsert)
    
    if (permissionsError) throw permissionsError
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin',
        action: 'role_created',
        details: `Created role ${name} with ${permissions.length} permissions`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ role }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
