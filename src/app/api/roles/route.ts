import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get all active roles
    const { data: roles, error } = await supabase
      .from('roles')
      .select(`
        id,
        name,
        display_name,
        description,
        icon_name,
        color_scheme,
        permissions,
        is_active,
        is_system_role,
        sort_order,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('display_name', { ascending: true })

    if (error) {
      console.error('Error fetching roles:', error)
      return NextResponse.json(
        { error: 'Failed to fetch roles' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      roles: roles || []
    })

  } catch (error) {
    console.error('Roles API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { name, display_name, description, icon_name, color_scheme, permissions } = await request.json()

    // Validate required fields
    if (!name || !display_name) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      )
    }

    // Check if role name already exists
    const { data: existingRole } = await supabase
      .from('roles')
      .select('id')
      .eq('name', name)
      .single()

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 409 }
      )
    }

    // Create new role
    const { data: newRole, error } = await supabase
      .from('roles')
      .insert({
        name,
        display_name,
        description,
        icon_name,
        color_scheme,
        permissions: permissions || {},
        sort_order: 999 // Add at the end
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating role:', error)
      return NextResponse.json(
        { error: 'Failed to create role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      role: newRole
    })

  } catch (error) {
    console.error('Create role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
