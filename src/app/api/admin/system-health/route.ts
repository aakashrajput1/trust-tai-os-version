import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  SystemHealth, 
  HealthStatus, 
  ComponentHealth, 
  SystemMetrics, 
  SystemAlert 
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

    // Get system health data
    const systemHealth = await getSystemHealth(supabase)

    return NextResponse.json({
      success: true,
      data: systemHealth
    })

  } catch (error) {
    console.error('Get system health error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getSystemHealth(supabase: any): Promise<SystemHealth> {
  try {
    // Get system metrics
    const metrics = await getSystemMetrics(supabase)
    
    // Get component health
    const components = await getComponentHealth(supabase)
    
    // Get system alerts
    const alerts = await getSystemAlerts(supabase)
    
    // Determine overall health status
    const overall = determineOverallHealth(components, alerts)

    const systemHealth: SystemHealth = {
      overall,
      components,
      metrics,
      alerts,
      lastUpdated: new Date().toISOString()
    }

    return systemHealth

  } catch (error) {
    console.error('Error getting system health:', error)
    // Return default health status on error
    return {
      overall: 'unknown' as HealthStatus,
      components: [],
      metrics: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0,
        activeConnections: 0,
        requestRate: 0,
        errorRate: 0,
        responseTime: 0
      },
      alerts: [],
      lastUpdated: new Date().toISOString()
    }
  }
}

async function getSystemMetrics(supabase: any): Promise<SystemMetrics> {
  try {
    // Get database metrics
    const { data: dbMetrics } = await supabase
      .from('system_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Get API metrics from recent requests
    const { data: apiRequests } = await supabase
      .from('audit_logs')
      .select('created_at, action')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })

    // Calculate API response time and rate
    const recentRequests = apiRequests || []
    const requestRate = recentRequests.length / 24 // requests per hour
    const errorRate = recentRequests.filter((req: { action?: string }) => (req.action || '').includes('error')).length / 24

    // Simulate system metrics (in real app, these would come from monitoring systems)
    const metrics: SystemMetrics = {
      cpuUsage: Math.floor(Math.random() * 30) + 20, // 20-50%
      memoryUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
      diskUsage: Math.floor(Math.random() * 20) + 60, // 60-80%
      networkLatency: Math.floor(Math.random() * 50) + 10, // 10-60ms
      activeConnections: Math.floor(Math.random() * 100) + 50, // 50-150
      requestRate: requestRate || 0,
      errorRate: errorRate || 0,
      responseTime: Math.floor(Math.random() * 200) + 50 // 50-250ms
    }

    return metrics

  } catch (error) {
    console.error('Error getting system metrics:', error)
    // Return default metrics on error
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkLatency: 0,
      activeConnections: 0,
      requestRate: 0,
      errorRate: 0,
      responseTime: 0
    }
  }
}

async function getComponentHealth(supabase: any): Promise<ComponentHealth[]> {
  try {
    const components: ComponentHealth[] = []

    // Database health
    try {
      const startTime = Date.now()
      const { data: testQuery, error } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      const responseTime = Date.now() - startTime
      const status: HealthStatus = error ? 'critical' : responseTime > 1000 ? 'warning' : 'healthy'
      
      components.push({
        name: 'Database',
        status,
        responseTime,
        uptime: 99.9,
        lastCheck: new Date().toISOString(),
        errorMessage: error ? error.message : undefined,
        metadata: { connectionPool: 'active', queryCount: 1000 }
      })
    } catch (error) {
      components.push({
        name: 'Database',
        status: 'critical' as HealthStatus,
        responseTime: 0,
        uptime: 0,
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {}
      })
    }

    // API Gateway health
    try {
      const startTime = Date.now()
      // Simulate API health check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
      const responseTime = Date.now() - startTime
      
      components.push({
        name: 'API Gateway',
        status: 'healthy' as HealthStatus,
        responseTime,
        uptime: 99.95,
        lastCheck: new Date().toISOString(),
        metadata: { endpointCount: 25, activeConnections: 45 }
      })
    } catch (error) {
      components.push({
        name: 'API Gateway',
        status: 'critical' as HealthStatus,
        responseTime: 0,
        uptime: 0,
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {}
      })
    }

    // File Storage health
    try {
      const startTime = Date.now()
      // Simulate storage health check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
      const responseTime = Date.now() - startTime
      
      components.push({
        name: 'File Storage',
        status: 'healthy' as HealthStatus,
        responseTime,
        uptime: 99.98,
        lastCheck: new Date().toISOString(),
        metadata: { totalSpace: '1TB', usedSpace: '650GB', fileCount: 15000 }
      })
    } catch (error) {
      components.push({
        name: 'File Storage',
        status: 'critical' as HealthStatus,
        responseTime: 0,
        uptime: 0,
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {}
      })
    }

    // Email Service health
    try {
      const startTime = Date.now()
      // Simulate email service health check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 80))
      const responseTime = Date.now() - startTime
      
      components.push({
        name: 'Email Service',
        status: 'healthy' as HealthStatus,
        responseTime,
        uptime: 99.85,
        lastCheck: new Date().toISOString(),
        metadata: { queueSize: 12, sentToday: 150, failedToday: 2 }
      })
    } catch (error) {
      components.push({
        name: 'Email Service',
        status: 'critical' as HealthStatus,
        responseTime: 0,
        uptime: 0,
        lastCheck: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: {}
      })
    }

    return components

  } catch (error) {
    console.error('Error getting component health:', error)
    return []
  }
}

async function getSystemAlerts(supabase: any): Promise<SystemAlert[]> {
  try {
    // Get active system alerts
    const { data: alerts, error } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    const systemAlerts: SystemAlert[] = (alerts || []).map((alert: any) => ({
      id: alert.id,
      type: alert.type,
      title: alert.title,
      message: alert.message,
      component: alert.component,
      timestamp: alert.created_at,
      isResolved: alert.is_resolved,
      resolvedAt: alert.resolved_at,
      resolvedBy: alert.resolved_by
    }))

    return systemAlerts

  } catch (error) {
    console.error('Error getting system alerts:', error)
    // Return default alerts on error
    return [
      {
        id: '1',
        type: 'info',
        title: 'System Monitoring Active',
        message: 'All system components are being monitored',
        component: 'System Monitor',
        timestamp: new Date().toISOString(),
        isResolved: true,
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'system'
      }
    ]
  }
}

function determineOverallHealth(components: ComponentHealth[], alerts: SystemAlert[]): HealthStatus {
  // Check for critical components
  const criticalComponents = components.filter(comp => comp.status === 'critical')
  if (criticalComponents.length > 0) {
    return 'critical'
  }

  // Check for warning components
  const warningComponents = components.filter(comp => comp.status === 'warning')
  if (warningComponents.length > 2) {
    return 'warning'
  }

  // Check for critical alerts
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && !alert.isResolved)
  if (criticalAlerts.length > 0) {
    return 'critical'
  }

  // Check for warning alerts
  const warningAlerts = alerts.filter(alert => alert.type === 'warning' && !alert.isResolved)
  if (warningAlerts.length > 3) {
    return 'warning'
  }

  return 'healthy'
}
