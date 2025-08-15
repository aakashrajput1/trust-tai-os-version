import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user role is Admin or Executive
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['admin', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Mock access logs data - replace with actual database queries
    const mockAccessLogs = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        action: 'login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: '2024-02-10T10:30:00Z',
        status: 'success',
        location: 'New York, US'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        action: 'failed_login',
        ipAddress: '203.45.67.89',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        timestamp: '2024-02-10T09:15:00Z',
        status: 'failed',
        location: 'London, UK'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        action: 'data_export',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: '2024-02-10T08:45:00Z',
        status: 'success',
        location: 'New York, US'
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'Sarah Wilson',
        action: 'logout',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: '2024-02-10T07:30:00Z',
        status: 'success',
        location: 'New York, US'
      },
      {
        id: '5',
        userId: 'user5',
        userName: 'David Brown',
        action: 'password_change',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        timestamp: '2024-02-10T06:15:00Z',
        status: 'success',
        location: 'San Francisco, US'
      }
    ]

    // Apply filters
    let filteredLogs = mockAccessLogs

    if (status && status !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === status)
    }

    if (action && action !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === action)
    }

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId)
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate))
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate))
    }

    // Apply pagination
    const offset = (page - 1) * limit
    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching access logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user role is Admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || userProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { action, ipAddress, userAgent, status, location } = body

    // Validate required fields
    if (!action || !ipAddress || !userAgent || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock log creation - replace with actual database insert
    const newLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: 'Current User', // Would be fetched from user profile
      action,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      status,
      location: location || 'Unknown'
    }

    // Log the action for audit purposes
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'access_log_created',
        details: `Created access log for action: ${action}`,
        ip_address: ipAddress,
        timestamp: new Date().toISOString()
      })

    return NextResponse.json({ log: newLog }, { status: 201 })

  } catch (error) {
    console.error('Error creating access log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


