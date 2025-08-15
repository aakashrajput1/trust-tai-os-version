import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// GET /api/admin/project-templates/{id}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Get template with phases and workflow
    const { data: template, error } = await supabase
      .from('project_templates')
      .select(`
        *,
        phases:project_template_phases(*),
        workflow:workflows(*),
        created_by_user:users!project_templates_created_by_fkey(name, email)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching template:', error)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ template })

  } catch (error) {
    console.error('Error in project template GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/project-templates/{id}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body = await request.json()
    const {
      name,
      description,
      category,
      estimated_duration,
      phases,
      default_team_structure,
      custom_fields_schema,
      workflow_id,
      is_active
    } = body

    // Validate required fields
    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update template
    const { data: template, error: templateError } = await supabase
      .from('project_templates')
      .update({
        name,
        description,
        category,
        estimated_duration: estimated_duration || 0,
        default_team_structure: default_team_structure || {},
        custom_fields_schema: custom_fields_schema || [],
        workflow_id,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (templateError) {
      console.error('Error updating template:', templateError)
      return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
    }

    // Update phases if provided
    if (phases) {
      // Delete existing phases
      await supabase
        .from('project_template_phases')
        .delete()
        .eq('template_id', id)

      // Create new phases
      if (phases.length > 0) {
        const phasesData = phases.map((phase: any, index: number) => ({
          template_id: id,
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
          console.error('Error updating phases:', phasesError)
        }
      }
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'update',
        resource: 'project_templates',
        resource_id: id,
        details: `Updated project template: ${name}`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Project template updated successfully',
      template
    })

  } catch (error) {
    console.error('Error in project template PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/project-templates/{id}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Check if template exists
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('project_templates')
      .select('name')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete phases first
    await supabase
      .from('project_template_phases')
      .delete()
      .eq('template_id', id)

    // Delete template
    const { error: deleteError } = await supabase
      .from('project_templates')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting template:', deleteError)
      return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'delete',
        resource: 'project_templates',
        resource_id: id,
        details: `Deleted project template: ${existingTemplate.name}`,
        severity: 'high',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Project template deleted successfully'
    })

  } catch (error) {
    console.error('Error in project template DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


