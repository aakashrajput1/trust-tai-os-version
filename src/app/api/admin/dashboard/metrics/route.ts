import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { DashboardMetrics } from '@/types/admin'

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

    // Get system metrics
    const metrics: DashboardMetrics = await getSystemMetrics(supabase)

    return NextResponse.json({
      success: true,
      data: metrics
    })

  } catch (error) {
    console.error('Dashboard metrics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getSystemMetrics(supabase: any): Promise<DashboardMetrics> {
  try {
    // Get user counts
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get integration counts
    const { data: integrations } = await supabase
      .from('integrations')
      .select('status')

    const integrationCounts = {
      total: integrations?.length || 0,
      active: integrations?.filter((i: { status?: string }) => i.status === 'active').length || 0,
      error: integrations?.filter((i: { status?: string }) => i.status === 'error').length || 0
    }

    // Get goal counts
    const { data: goals } = await supabase
      .from('goals')
      .select('status')

    const goalCounts = {
      total: goals?.length || 0,
      completed: goals?.filter((g: { status?: string }) => g.status === 'completed').length || 0,
      overdue: goals?.filter((g: { status?: string }) => g.status === 'overdue').length || 0
    }

    // Simulate system metrics (in real app, these would come from monitoring systems)
    const metrics: DashboardMetrics = {
      activeUsers: activeUsers || 0,
      totalUsers: totalUsers || 0,
      apiResponseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      dbHealth: 'healthy' as const,
      queueBacklog: Math.floor(Math.random() * 50),
      systemUptime: 99.98,
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      integrations: integrationCounts,
      goals: goalCounts
    }

    return metrics

  } catch (error) {
    console.error('Error getting system metrics:', error)
    // Return default metrics on error
    return {
      activeUsers: 0,
      totalUsers: 0,
      apiResponseTime: 0,
      dbHealth: 'unknown' as const,
      queueBacklog: 0,
      systemUptime: 0,
      lastBackup: new Date().toISOString(),
      integrations: { total: 0, active: 0, error: 0 },
      goals: { total: 0, completed: 0, overdue: 0 }
    }
  }
}
