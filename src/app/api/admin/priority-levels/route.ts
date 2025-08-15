import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/priority-levels
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

    // Build query
    let query = supabase
      .from('priority_levels')
      .select('*')
      .order('level', { ascending: true })

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: priorities, error, count } = await query

    if (error) {
      console.error('Error fetching priority levels:', error)
      return NextResponse.json({ error: 'Failed to fetch priorities' }, { status: 500 })
    }

    return NextResponse.json({
      priorities,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in priority levels GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/priority-levels
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
      level,
      color,
      icon,
      badge_style,
      sla_hours,
      auto_escalation,
      notification_rules,
      workflow_rules
    } = body

    // Validate required fields
    if (!name || !description || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if level already exists
    const { data: existingPriority } = await supabase
      .from('priority_levels')
      .select('id')
      .eq('level', level)
      .single()

    if (existingPriority) {
      return NextResponse.json({ error: 'Priority level already exists' }, { status: 400 })
    }

    // Create priority level
    const { data: priority, error: priorityError } = await supabase
      .from('priority_levels')
      .insert({
        name,
        description,
        level,
        color: color || '#3B82F6',
        icon: icon || 'flag',
        badge_style: badge_style || 'default',
        sla_hours: sla_hours || 24,
        auto_escalation: auto_escalation || {},
        notification_rules: notification_rules || {},
        workflow_rules: workflow_rules || {},
        created_by: user.id,
        is_active: true
      })
      .select()
      .single()

    if (priorityError) {
      console.error('Error creating priority level:', priorityError)
      return NextResponse.json({ error: 'Failed to create priority level' }, { status: 500 })
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'create',
        resource: 'priority_levels',
        resource_id: priority.id,
        details: `Created priority level: ${name} (Level ${level})`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Priority level created successfully',
      priority
    }, { status: 201 })

  } catch (error) {
    console.error('Error in priority levels POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


