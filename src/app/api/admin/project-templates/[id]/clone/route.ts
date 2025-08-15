import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// POST /api/admin/project-templates/{id}/clone
export async function POST(
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
    const { new_name, modifications } = body

    if (!new_name) {
      return NextResponse.json({ error: 'New name is required' }, { status: 400 })
    }

    // Get original template
    const { data: originalTemplate, error: fetchError } = await supabase
      .from('project_templates')
      .select(`
        *,
        phases:project_template_phases(*)
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Create cloned template
    const clonedTemplateData = {
      name: new_name,
      description: originalTemplate.description,
      category: originalTemplate.category,
      estimated_duration: modifications?.estimated_duration || originalTemplate.estimated_duration,
      default_team_structure: originalTemplate.default_team_structure,
      custom_fields_schema: originalTemplate.custom_fields_schema,
      workflow_id: originalTemplate.workflow_id,
      created_by: user.id,
      is_active: true
    }

    const { data: clonedTemplate, error: createError } = await supabase
      .from('project_templates')
      .insert(clonedTemplateData)
      .select()
      .single()

    if (createError) {
      console.error('Error creating cloned template:', createError)
      return NextResponse.json({ error: 'Failed to clone template' }, { status: 500 })
    }

    // Clone phases with modifications
    if (originalTemplate.phases && originalTemplate.phases.length > 0) {
      let phasesToClone = originalTemplate.phases

      // Apply modifications if provided
      if (modifications) {
        if (modifications.remove_phases) {
          phasesToClone = phasesToClone.filter((phase: any) => 
            !modifications.remove_phases.includes(phase.id)
          )
        }

        if (modifications.add_phases) {
          phasesToClone = [...phasesToClone, ...modifications.add_phases]
        }

        if (modifications.modify_tasks) {
          // Apply task modifications
          phasesToClone = phasesToClone.map((phase: any) => {
            const taskMod = modifications.modify_tasks.find((mod: any) => mod.phase_id === phase.id)
            if (taskMod) {
              return { ...phase, ...taskMod }
            }
            return phase
          })
        }
      }

      // Create cloned phases
      const clonedPhasesData = phasesToClone.map((phase: any, index: number) => ({
        template_id: clonedTemplate.id,
        name: phase.name,
        description: phase.description || '',
        duration: phase.duration || 0,
        order: phase.order || index + 1,
        is_active: true
      }))

      const { error: phasesError } = await supabase
        .from('project_template_phases')
        .insert(clonedPhasesData)

      if (phasesError) {
        console.error('Error cloning phases:', phasesError)
        // Continue anyway, phases are optional
      }
    }

    // Log audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'clone',
        resource: 'project_templates',
        resource_id: clonedTemplate.id,
        details: `Cloned project template from: ${originalTemplate.name} to: ${new_name}`,
        severity: 'medium',
        category: 'project_management'
      })

    return NextResponse.json({
      message: 'Project template cloned successfully',
      template: clonedTemplate
    }, { status: 201 })

  } catch (error) {
    console.error('Error in project template clone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


