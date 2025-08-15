import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/custom-fields
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userRole || !['admin', 'executive'].includes(userRole.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const entity_type = searchParams.get('entity_type') || 'all'
    const category = searchParams.get('category') || 'all'
    const status = searchParams.get('status') || 'all'

    // Build query
    let query = supabase
      .from('custom_fields')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (entity_type !== 'all') {
      query = query.eq('entity_type', entity_type)
    }
    if (category !== 'all') {
      query = query.eq('category', category)
    }
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: fields, error, count } = await query

    if (error) {
      console.error('Error fetching custom fields:', error)
      return NextResponse.json({ error: 'Failed to fetch custom fields' }, { status: 500 })
    }

    return NextResponse.json({
      fields,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in custom fields GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/custom-fields
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: userRole } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      field_key,
      entity_type,
      field_type,
      validation_rules,
      display_settings,
      conditional_logic,
      help_text,
      category
    } = body

    // Validate required fields
    if (!name || !field_key || !entity_type || !field_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if field_key already exists for this entity_type
    const { data: existingField } = await supabase
      .from('custom_fields')
      .select('id')
      .eq('field_key', field_key)
      .eq('entity_type', entity_type)
      .single()

    if (existingField) {
      return NextResponse.json({ error: 'Field key already exists for this entity type' }, { status: 400 })
    }

    // Create custom field
    const { data: field, error: fieldError } = await supabase
      .from('custom_fields')
      .insert({
        name,
        description: description || '',
        field_key,
        entity_type,
        field_type,
        validation_rules: validation_rules || {},
        display_settings: display_settings || {
          show_in_list: true,
          show_in_details: true,
          show_in_reports: true,
          order: 0
        },
        conditional_logic: conditional_logic || {},
        help_text: help_text || '',
        category: category || 'general',
        created_by: user.id,
        is_active: true
      })
      .select()
      .single()

    if (fieldError) {
      console.error('Error creating custom field:', fieldError)
      return NextResponse.json({ error: 'Failed to create custom field' }, { status: 500 })
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'create',
        resource: 'custom_fields',
        resource_id: field.id,
        details: `Created custom field: ${name} (${field_key})`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Custom field created successfully',
      field
    }, { status: 201 })

  } catch (error) {
    console.error('Error in custom fields POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


