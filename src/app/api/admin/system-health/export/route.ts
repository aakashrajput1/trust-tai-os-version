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

    // Check if user has admin role (only Admin can export system health)
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
    const days = parseInt(searchParams.get('days') || '30')

    // Get system health data for export
    const exportData = await getSystemHealthExportData(supabase, days)

    // Log the export action
    await logAuditEvent(supabase, {
      userId: session.user.id,
      action: 'system_health_exported',
      resource: 'system_health',
      details: { 
        exportFormat: format,
        days: days,
        recordCount: exportData.length
      }
    })

    // Return based on format
    if (format === 'csv') {
      const csvData = convertToCSV(exportData)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="system-health-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    // Default to JSON
    return NextResponse.json({
      success: true,
      data: exportData,
      message: `Exported ${exportData.length} system health records`
    })

  } catch (error) {
    console.error('Export system health error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getSystemHealthExportData(supabase: any, days: number): Promise<any[]> {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    // Get system metrics
    const { data: metrics } = await supabase
      .from('system_metrics')
      .select('*')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true })

    // Get error logs
    const { data: errorLogs } = await supabase
      .from('error_logs')
      .select('*')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true })

    // Get system alerts
    const { data: alerts } = await supabase
      .from('system_alerts')
      .select('*')
      .gte('created_at', startDate)
      .order('created_at', { ascending: true })

    // Get audit logs for system events
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', startDate)
      .in('category', ['system_config', 'system_health'])
      .order('created_at', { ascending: true })

    // Combine and format data
    const exportData: any[] = []

    // Add metrics
    if (metrics) {
      metrics.forEach((metric: any) => {
        exportData.push({
          type: 'metric',
          timestamp: metric.created_at,
          component: metric.component || 'system',
          metric_type: metric.metric_type,
          metric_value: metric.metric_value,
          metric_unit: metric.metric_unit,
          status: metric.status
        })
      })
    }

    // Add error logs
    if (errorLogs) {
      errorLogs.forEach((log: any) => {
        exportData.push({
          type: 'error',
          timestamp: log.created_at,
          component: log.component,
          level: log.level,
          message: log.message,
          user_id: log.user_id,
          ip_address: log.ip_address
        })
      })
    }

    // Add alerts
    if (alerts) {
      alerts.forEach((alert: any) => {
        exportData.push({
          type: 'alert',
          timestamp: alert.created_at,
          component: alert.component,
          alert_type: alert.type,
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          is_resolved: alert.is_resolved
        })
      })
    }

    // Add audit logs
    if (auditLogs) {
      auditLogs.forEach((log: any) => {
        exportData.push({
          type: 'audit',
          timestamp: log.created_at,
          user_id: log.user_id,
          action: log.action,
          resource: log.resource,
          severity: log.severity,
          category: log.category
        })
      })
    }

    return exportData

  } catch (error) {
    console.error('Error getting system health export data:', error)
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
        category: 'system_config',
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}
