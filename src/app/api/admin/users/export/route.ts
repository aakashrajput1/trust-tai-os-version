import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can export users)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const exportOptions = await request.json()

    // Get users data for export
    const exportData = await getUsersExportData(supabase, exportOptions)

    // Log the export action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'users_exported',
      resource: 'users',
      details: { 
        exportFormat: exportOptions.format,
        filters: exportOptions.filters,
        recordCount: exportData.length
      }
    })

    // Return based on format
    if (exportOptions.format === 'csv') {
      const csvData = convertToCSV(exportData)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="users-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Default to JSON
    return NextResponse.json({
      success: true,
      data: exportData,
      message: `Exported ${exportData.length} users`
    })

  } catch (error) {
    console.error('Export users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getUsersExportData(supabase: any, exportOptions: any): Promise<any[]> {
  try {
    let query = supabase
      .from('users')
      .select(`
        *,
        roles!users_role_fkey(
          name,
          description
        )
      `)

    // Apply filters if provided
    if (exportOptions.filters) {
      const filters = exportOptions.filters

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role)
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.department) {
        query = query.eq('department', filters.department)
      }

      if (filters.dateRange) {
        query = query.gte('created_at', filters.dateRange.start)
        query = query.lte('created_at', filters.dateRange.end)
      }

      if (filters.mfaEnabled !== undefined) {
        query = query.eq('mfa_enabled', filters.mfaEnabled)
      }
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Limit export size to prevent memory issues
    query = query.limit(10000)

    const { data: users, error } = await query

    if (error) throw error

    // Transform users for export
    const exportData = (users || []).map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department,
      position: user.position,
      mfa_enabled: user.mfa_enabled,
      last_active: user.last_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      phone: user.phone,
      location: user.location,
      manager_id: user.manager_id,
      avatar: user.avatar
    }))

    return exportData

  } catch (error) {
    console.error('Error getting users export data:', error)
    throw error
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
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
        category: 'user_management',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
