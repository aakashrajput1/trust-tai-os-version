import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PUT /api/roles/[id] - Update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.display_name) {
      return NextResponse.json(
        { error: 'Name and display_name are required' },
        { status: 400 }
      )
    }

    // Check if role exists
    const { data: existingRole, error: fetchError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Check if name is already taken by another role
    const { data: duplicateRole, error: duplicateError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', body.name)
      .neq('id', id)
      .single()

    if (duplicateRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 409 }
      )
    }

    // Update the role
    const { data: updatedRole, error: updateError } = await supabase
      .from('roles')
      .update({
        name: body.name,
        display_name: body.display_name,
        description: body.description || null,
        icon_name: body.icon_name || 'Users',
        color_scheme: body.color_scheme || 'from-blue-500 to-blue-600',
        permissions: body.permissions || [],
        is_active: body.is_active !== undefined ? body.is_active : true,
        sort_order: body.sort_order || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating role:', updateError)
      return NextResponse.json(
        { error: 'Failed to update role' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedRole)
  } catch (error) {
    console.error('Error in PUT /api/roles/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/roles/[id] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if role exists
    const { data: existingRole, error: fetchError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of system roles
    if (existingRole.is_system_role) {
      return NextResponse.json(
        { error: 'Cannot delete system roles' },
        { status: 403 }
      )
    }

    // Check if role is being used by any users
    const { data: usersWithRole, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('role', existingRole.name)
      .limit(1)

    if (usersError) {
      console.error('Error checking users with role:', usersError)
      return NextResponse.json(
        { error: 'Failed to check role usage' },
        { status: 500 }
      )
    }

    if (usersWithRole && usersWithRole.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that is assigned to users' },
        { status: 409 }
      )
    }

    // Delete the role
    const { error: deleteError } = await supabase
      .from('roles')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting role:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete role' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/roles/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


