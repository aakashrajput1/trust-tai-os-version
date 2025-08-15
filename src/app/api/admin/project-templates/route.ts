import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/project-templates
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
    const category = searchParams.get('category') || 'all'

    // Build query
    let query = supabase
      .from('project_templates')
      .select(`
        *,
        phases:project_template_phases(*),
        workflow:workflows(name, description)
      `)

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }
    if (category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: templates, error, count } = await query

    if (error) {
      console.error('Error fetching project templates:', error)
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
    }

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in project templates GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/project-templates
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
      category,
      estimated_duration,
      phases,
      default_team_structure,
      custom_fields_schema,
      workflow_id
    } = body

    // Validate required fields
    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create template
    const { data: template, error: templateError } = await supabase
      .from('project_templates')
      .insert({
        name,
        description,
        category,
        estimated_duration: estimated_duration || 0,
        default_team_structure: default_team_structure || {},
        custom_fields_schema: custom_fields_schema || [],
        workflow_id,
        created_by: user.id,
        is_active: true
      })
      .select()
      .single()

    if (templateError) {
      console.error('Error creating template:', templateError)
      return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
    }

    // Create phases if provided
    if (phases && phases.length > 0) {
      const phasesData = phases.map((phase: any, index: number) => ({
        template_id: template.id,
        name: phase.name,
        description: phase.description || '',
        duration: phase.duration || 0,
        order: phase.order || index + 1,
        is_active: true
      }))

      const { error: phasesError } = await supabase
        .from('project_template_phases')
        .insert(phasesData)

      if (phasesError) {
        console.error('Error creating phases:', phasesError)
        // Continue anyway, phases are optional
      }
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'create',
        resource: 'project_templates',
        resource_id: template.id,
        details: `Created project template: ${name}`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Project template created successfully',
      template
    }, { status: 201 })

  } catch (error) {
    console.error('Error in project templates POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


