import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/task-categories
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
    const status = searchParams.get('status') || 'all'
    const parent_id = searchParams.get('parent_id') || 'all'

    // Build query
    let query = supabase
      .from('task_categories')
      .select(`
        *,
        parent_category:task_categories!task_categories_parent_category_id_fkey(name),
        child_categories:task_categories!task_categories_parent_category_id_fkey(count)
      `)

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }
    if (parent_id !== 'all') {
      if (parent_id === 'null') {
        query = query.is('parent_category_id', null)
      } else {
        query = query.eq('parent_category_id', parent_id)
      }
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: categories, error, count } = await query

    if (error) {
      console.error('Error fetching task categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in task categories GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/task-categories
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
      color,
      icon,
      parent_category_id,
      default_priority,
      billable,
      requires_approval,
      auto_assign_rules,
      time_tracking_rules
    } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create category
    const { data: category, error: categoryError } = await supabase
      .from('task_categories')
      .insert({
        name,
        description,
        color: color || '#3B82F6',
        icon: icon || 'tag',
        parent_category_id: parent_category_id || null,
        default_priority: default_priority || 'medium',
        billable: billable !== undefined ? billable : true,
        requires_approval: requires_approval !== undefined ? requires_approval : false,
        auto_assign_rules: auto_assign_rules || {},
        time_tracking_rules: time_tracking_rules || {},
        created_by: user.id,
        is_active: true
      })
      .select()
      .single()

    if (categoryError) {
      console.error('Error creating task category:', categoryError)
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'create',
        resource: 'task_categories',
        resource_id: category.id,
        details: `Created task category: ${name}`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Task category created successfully',
      category
    }, { status: 201 })

  } catch (error) {
    console.error('Error in task categories POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


