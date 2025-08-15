import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can export roles)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Get roles data for export
    const exportData = await getRolesExportData(supabase)

    // Log the export action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'roles_exported',
      resource: 'roles',
      details: { 
        exportFormat: format,
        recordCount: exportData.length
      }
    })

    // Return based on format
    if (format === 'csv') {
      const csvData = convertToCSV(exportData)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="roles-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Default to JSON
    return NextResponse.json({
      success: true,
      data: exportData,
      message: `Exported ${exportData.length} roles`
    })

  } catch (error) {
    console.error('Export roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getRolesExportData(supabase: any): Promise<any[]> {
  try {
    // Get all roles with permissions and user counts
    const { data: roles, error } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions(
          permission_id,
          permissions(*)
        )
      `)
      .order('name', { ascending: true })

    if (error) throw error

    // Transform roles for export
    const exportData = (roles || []).map((role: any) => {
      const permissions = (role.role_permissions || []).map((rp: any) => ({
        id: rp.permissions.id,
        name: rp.permissions.name,
        resource: rp.permissions.resource,
        action: rp.permissions.action,
        scope: rp.permissions.scope
      }))

      return {
        id: role.id,
        name: role.name,
        description: role.description,
        is_system: role.is_system,
        created_at: role.created_at,
        updated_at: role.updated_at,
        permissions: permissions,
        permission_count: permissions.length,
        metadata: role.metadata
      }
    })

    return exportData

  } catch (error) {
    console.error('Error getting roles export data:', error)
    throw error
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  // Flatten the data structure for CSV
  const flattenedData = data.map((role: any) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    is_system: role.is_system,
    created_at: role.created_at,
    updated_at: role.updated_at,
    permission_count: role.permission_count,
    permissions: role.permissions.map((p: any) => `${p.name}:${p.action}:${p.resource}`).join(';'),
    metadata: JSON.stringify(role.metadata || {})
  }))

  const headers = Object.keys(flattenedData[0]) as Array<keyof typeof flattenedData[0]>
  const csvRows = [
    headers.join(','),
    ...flattenedData.map((row: any) => 
      headers.map((header: any) => {
        const value = row[header as any]
        if (value === null || value === undefined) {
          return ''
        }
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return String(value)
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}

async function logAuditEvent(supabase: any, eventData: {
  userId: string
  action: string
  resource: string
  details: Record<string, any>
}) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: eventData.userId,
        action: eventData.action,
        resource: eventData.resource,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: 'Admin API',
        severity: 'low',
        category: 'role_management',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
