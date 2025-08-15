import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  AuditLog, 
  AuditLogResponse, 
  AuditLogFilters, 
  AuditLogPagination,
  AuditCategory 
} from '@/types/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Executive')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const userId = searchParams.get('userId') || ''
    const action = searchParams.get('action') || ''
    const resource = searchParams.get('resource') || ''
    const severity = searchParams.get('severity') || ''
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    // Build filters
    const filters: AuditLogFilters = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      userId: userId || undefined,
      action: action || undefined,
      resource: resource || undefined,
      severity: severity || undefined,
      category: category as AuditCategory || undefined,
      search: search || undefined
    }

    // Get audit logs with filters
    const auditLogResponse = await getAuditLogsWithFilters(supabase, filters, page, limit)

    return NextResponse.json({
      success: true,
      data: auditLogResponse
    })

  } catch (error) {
    console.error('Get audit logs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role (only Admin can export audit logs)
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userProfile || userProfile.role !== 'Admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const exportOptions = await request.json()

    // Export audit logs
    const exportData = await exportAuditLogs(supabase, exportOptions)

    // Log the export action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'audit_logs_exported',
      resource: 'audit_logs',
      details: { 
        exportFormat: exportOptions.format,
        filters: exportOptions.filters,
        recordCount: exportData.length
      }
    })

    return NextResponse.json({
      success: true,
      data: exportData,
      message: `Exported ${exportData.length} audit log records`
    })

  } catch (error) {
    console.error('Export audit logs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getAuditLogsWithFilters(
  supabase: any, 
  filters: AuditLogFilters, 
  page: number, 
  limit: number
): Promise<AuditLogResponse> {
  try {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        users!audit_logs_user_id_fkey(
          name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.action) {
      query = query.ilike('action', `%${filters.action}%`)
    }

    if (filters.resource) {
      query = query.ilike('resource', `%${filters.resource}%`)
    }

    if (filters.severity) {
      query = query.eq('severity', filters.severity)
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.search) {
      query = query.or(`action.ilike.%${filters.search}%,resource.ilike.%${filters.search}%,details::text.ilike.%${filters.search}%`)
    }

    // Get total count
    const { count: total } = await query

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    // Apply sorting (most recent first)
    query = query.order('created_at', { ascending: false })

    const { data: auditLogs, error } = await query

    if (error) throw error

    // Transform audit logs to match interface
    const transformedLogs: AuditLog[] = (auditLogs || []).map((log: any) => ({
      id: log.id,
      timestamp: log.created_at,
      userId: log.user_id,
      userName: log.users?.name || 'Unknown User',
      userEmail: log.users?.email || 'unknown@example.com',
      action: log.action,
      resource: log.resource,
      resourceId: log.resource_id,
      details: log.details || {},
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      severity: log.severity,
      category: log.category,
      metadata: log.metadata
    }))

    const totalPages = Math.ceil((total || 0) / limit)

    const pagination: AuditLogPagination = {
      page,
      limit,
      total: total || 0,
      totalPages
    }

    return {
      logs: transformedLogs,
      pagination,
      filters
    }

  } catch (error) {
    console.error('Error getting audit logs with filters:', error)
    throw error
  }
}

async function exportAuditLogs(supabase: any, exportOptions: any): Promise<any[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        users!audit_logs_user_id_fkey(
          name,
          email
        )
      `)

    // Apply filters if provided
    if (exportOptions.filters) {
      const filters = exportOptions.filters

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate)
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate)
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId)
      }

      if (filters.action) {
        query = query.ilike('action', `%${filters.action}%`)
      }

      if (filters.resource) {
        query = query.ilike('resource', `%${filters.resource}%`)
      }

      if (filters.severity) {
        query = query.eq('severity', filters.severity)
      }

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.search) {
        query = query.or(`action.ilike.%${filters.search}%,resource.ilike.%${filters.search}%,details::text.ilike.%${filters.search}%`)
      }
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Limit export size to prevent memory issues
    query = query.limit(10000)

    const { data: auditLogs, error } = await query

    if (error) throw error

    // Transform for export
    const exportData = (auditLogs || []).map((log: any) => ({
      id: log.id,
      timestamp: log.created_at,
      userId: log.user_id,
      userName: log.users?.name || 'Unknown User',
      userEmail: log.users?.email || 'unknown@example.com',
      action: log.action,
      resource: log.resource,
      resourceId: log.resource_id,
      details: JSON.stringify(log.details || {}),
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      severity: log.severity,
      category: log.category,
      metadata: JSON.stringify(log.metadata || {})
    }))

    return exportData

  } catch (error) {
    console.error('Error exporting audit logs:', error)
    throw error
  }
}

async function logAuditEvent(supabase: any, eventData: {
  userId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
}) {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        user_id: eventData.userId,
        action: eventData.action,
        resource: eventData.resource,
        resource_id: eventData.resourceId,
        details: eventData.details,
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: 'Admin API',
        severity: 'low',
        category: 'audit',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
