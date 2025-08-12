import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Verify admin role (you can implement proper auth middleware later)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get system metrics
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, last_active')
      .eq('status', 'active')

    if (usersError) throw usersError

    const activeUsers = users?.length || 0
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const recentlyActive = users?.filter(user => 
      user.last_active && new Date(user.last_active) > oneHourAgo
    ).length || 0

    // Get pending actions
    const { data: pendingUsers, error: pendingUsersError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('status', 'pending')
      .limit(5)

    if (pendingUsersError) throw pendingUsersError

    const { data: pendingRoles, error: pendingRolesError } = await supabase
      .from('role_change_requests')
      .select('id, user_id, new_role, created_at')
      .eq('status', 'pending')
      .limit(5)

    if (pendingRolesError) throw pendingRolesError

    const pendingActions = [
      ...(pendingUsers?.map(user => ({
        id: user.id,
        type: 'user_approval' as const,
        title: 'New User Approval Request',
        description: `${user.name} (${user.email}) is requesting access`,
        priority: 'medium' as const,
        createdAt: new Date(user.created_at).toLocaleString()
      })) || []),
      ...(pendingRoles?.map(role => ({
        id: role.id,
        type: 'role_change' as const,
        title: 'Role Change Request',
        description: `User wants to change to ${role.new_role}`,
        priority: 'high' as const,
        createdAt: new Date(role.created_at).toLocaleString()
      })) || [])
    ]

    const metrics = {
      activeUsers: activeUsers,
      recentlyActiveUsers: recentlyActive,
      apiResponseTime: Math.floor(Math.random() * 100) + 100, // Mock for now
      dbHealth: 'healthy' as const,
      queueBacklog: Math.floor(Math.random() * 50), // Mock for now
      totalUsers: activeUsers + (pendingUsers?.length || 0)
    }

    return NextResponse.json({
      metrics,
      pendingActions,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
