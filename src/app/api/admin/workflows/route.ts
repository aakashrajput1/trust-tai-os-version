import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/workflows
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
    const status = searchParams.get('status') || 'all'

    // Build query
    let query = supabase
      .from('workflows')
      .select(`
        *,
        states:workflow_states(*),
        transitions:workflow_transitions(*),
        created_by_user:users!workflows_created_by_fkey(name, email)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (entity_type !== 'all') {
      query = query.eq('entity_type', entity_type)
    }
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: workflows, error, count } = await query

    if (error) {
      console.error('Error fetching workflows:', error)
      return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 })
    }

    return NextResponse.json({
      workflows,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in workflows GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/workflows
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
      entity_type,
      states,
      transitions
    } = body

    // Validate required fields
    if (!name || !description || !entity_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate states
    if (!states || states.length === 0) {
      return NextResponse.json({ error: 'At least one state is required' }, { status: 400 })
    }

    // Check if workflow name already exists
    const { data: existingWorkflow } = await supabase
      .from('workflows')
      .select('id')
      .eq('name', name)
      .single()

    if (existingWorkflow) {
      return NextResponse.json({ error: 'Workflow name already exists' }, { status: 400 })
    }

    // Create workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .insert({
        name,
        description,
        entity_type,
        created_by: user.id,
        is_active: true
      })
      .select()
      .single()

    if (workflowError) {
      console.error('Error creating workflow:', workflowError)
      return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 })
    }

    // Create states
    if (states && states.length > 0) {
      const statesData = states.map((state: any, index: number) => ({
        workflow_id: workflow.id,
        name: state.name,
        description: state.description || '',
        type: state.type || 'active',
        color: state.color || '#3B82F6',
        icon: state.icon || 'circle',
        order: state.order || index + 1,
        permissions: state.permissions || {},
        automation_rules: state.automation_rules || {},
        validation_rules: state.validation_rules || {},
        is_active: true
      }))

      const { error: statesError } = await supabase
        .from('workflow_states')
        .insert(statesData)

      if (statesError) {
        console.error('Error creating workflow states:', statesError)
        // Continue anyway, states are optional
      }
    }

    // Create transitions
    if (transitions && transitions.length > 0) {
      const transitionsData = transitions.map((transition: any) => ({
        workflow_id: workflow.id,
        name: transition.name,
        from_state: transition.from_state,
        to_state: transition.to_state,
        conditions: transition.conditions || [],
        actions: transition.actions || [],
        ui_settings: transition.ui_settings || {},
        is_active: true
      }))

      const { error: transitionsError } = await supabase
        .from('workflow_transitions')
        .insert(transitionsData)

      if (transitionsError) {
        console.error('Error creating workflow transitions:', transitionsError)
        // Continue anyway, transitions are optional
      }
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'create',
        resource: 'workflows',
        resource_id: workflow.id,
        details: `Created workflow: ${name}`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Workflow created successfully',
      workflow
    }, { status: 201 })

  } catch (error) {
    console.error('Error in workflows POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


