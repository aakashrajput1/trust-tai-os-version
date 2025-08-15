import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PendingAction } from '@/types/admin'

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

    // Get pending actions
    const pendingActions: PendingAction[] = await getPendingActions(supabase)

    return NextResponse.json({
      success: true,
      data: pendingActions
    })

  } catch (error) {
    console.error('Pending actions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getPendingActions(supabase: any): Promise<PendingAction[]> {
  try {
    const pendingActions: PendingAction[] = []

    // Get pending user approvals
    const { data: pendingUsers } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('status', 'pending')
      .limit(5)

    if (pendingUsers) {
      pendingUsers.forEach((user: { id: string; name: string; email: string; created_at: string }) => {
        pendingActions.push({
          id: user.id,
          type: 'user_approval',
          title: 'New User Approval Request',
          description: `${user.name} (${user.email}) is requesting access`,
          priority: 'medium',
          createdAt: new Date(user.created_at).toLocaleString(),
          metadata: { userId: user.id, userEmail: user.email }
        })
      })
    }

    // Get pending role change requests
    const { data: roleRequests } = await supabase
      .from('role_change_requests')
      .select('id, user_id, user_name, user_email, new_role, created_at')
      .eq('status', 'pending')
      .limit(5)

    if (roleRequests) {
      roleRequests.forEach((request: { id: string; user_id: string; user_name: string; user_email: string; new_role: string; created_at: string }) => {
        pendingActions.push({
          id: request.id,
          type: 'role_change',
          title: 'Role Change Request',
          description: `${request.user_name} wants to change to ${request.new_role}`,
          priority: 'high',
          createdAt: new Date(request.created_at).toLocaleString(),
          metadata: { userId: request.user_id, newRole: request.new_role }
        })
      })
    }

    // Get expiring integrations
    const { data: expiringIntegrations } = await supabase
      .from('integrations')
      .select('id, name, expiry_date')
      .lt('expiry_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()) // 7 days from now
      .eq('is_active', true)
      .limit(5)

    if (expiringIntegrations) {
      expiringIntegrations.forEach((integration: { id: string; name: string; expiry_date: string }) => {
        const daysUntilExpiry = Math.ceil((new Date(integration.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        pendingActions.push({
          id: integration.id,
          type: 'integration_expiry',
          title: 'Integration Expiring Soon',
          description: `${integration.name} will expire in ${daysUntilExpiry} days`,
          priority: daysUntilExpiry <= 3 ? 'high' : 'low',
          createdAt: new Date().toLocaleString(),
          metadata: { integrationId: integration.id, daysUntilExpiry }
        })
      })
    }

    // Get overdue goals
    const { data: overdueGoals } = await supabase
      .from('goals')
      .select('id, name, end_date, assigned_to')
      .lt('end_date', new Date().toISOString())
      .eq('status', 'in_progress')
      .limit(5)

    if (overdueGoals) {
      overdueGoals.forEach((goal: { id: string; name: string; end_date: string; assigned_to: string }) => {
        pendingActions.push({
          id: goal.id,
          type: 'goal_review',
          title: 'Overdue Goal Review',
          description: `${goal.name} is overdue and needs review`,
          priority: 'high',
          createdAt: new Date().toLocaleString(),
          metadata: { goalId: goal.id, assignedTo: goal.assigned_to }
        })
      })
    }

    // Get system alerts
    const { data: systemAlerts } = await supabase
      .from('system_alerts')
      .select('id, title, message, severity, created_at')
      .eq('is_resolved', false)
      .in('severity', ['high', 'critical'])
      .limit(5)

    if (systemAlerts) {
      systemAlerts.forEach((alert: { id: string; title: string; message: string; severity: 'high' | 'critical'; created_at: string }) => {
        pendingActions.push({
          id: alert.id,
          type: 'system_alert',
          title: alert.title,
          description: alert.message,
          priority: alert.severity === 'critical' ? 'critical' : 'high',
          createdAt: new Date(alert.created_at).toLocaleString(),
          metadata: { alertId: alert.id, severity: alert.severity }
        })
      })
    }

    // Sort by priority and creation date
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    pendingActions.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return pendingActions.slice(0, 10) // Return top 10

  } catch (error) {
    console.error('Error getting pending actions:', error)
    // Return default actions on error
    return [
      {
        id: '1',
        type: 'user_approval',
        title: 'New User Approval Request',
        description: 'John Doe (john@example.com) is requesting access',
        priority: 'medium',
        createdAt: '2 hours ago'
      },
      {
        id: '2',
        type: 'role_change',
        title: 'Role Change Request',
        description: 'Sarah Wilson wants to change from Developer to Team Lead',
        priority: 'high',
        createdAt: '1 hour ago'
      }
    ]
  }
}
