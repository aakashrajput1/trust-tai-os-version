import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ErrorLog } from '@/types/admin'

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
    const limit = parseInt(searchParams.get('limit') || '100')
    const level = searchParams.get('level') || ''
    const component = searchParams.get('component') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const search = searchParams.get('search') || ''

    // Get error logs with filters
    const errorLogsResponse = await getErrorLogsWithFilters(
      supabase, 
      { level, component, startDate, endDate, search }, 
      page, 
      limit
    )

    return NextResponse.json({
      success: true,
      data: errorLogsResponse
    })

  } catch (error) {
    console.error('Get error logs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getErrorLogsWithFilters(
  supabase: any, 
  filters: {
    level?: string
    component?: string
    startDate?: string
    endDate?: string
    search?: string
  }, 
  page: number, 
  limit: number
): Promise<{ logs: ErrorLog[]; pagination: any }> {
  try {
    let query = supabase
      .from('error_logs')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.level) {
      query = query.eq('level', filters.level)
    }

    if (filters.component) {
      query = query.eq('component', filters.component)
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    if (filters.search) {
      query = query.or(`message.ilike.%${filters.search}%,stack.ilike.%${filters.search}%`)
    }

    // Get total count
    const { count: total } = await query

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    // Apply sorting (most recent first)
    query = query.order('created_at', { ascending: false })

    const { data: errorLogs, error } = await query

    if (error) throw error

    // Transform error logs to match interface
    const transformedLogs: ErrorLog[] = (errorLogs || []).map((log: any) => ({
      id: log.id,
      timestamp: log.created_at,
      level: log.level,
      message: log.message,
      stack: log.stack,
      component: log.component,
      userId: log.user_id,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      metadata: log.metadata || {}
    }))

    const totalPages = Math.ceil((total || 0) / limit)

    const pagination = {
      page,
      limit,
      total: total || 0,
      totalPages
    }

    return {
      logs: transformedLogs,
      pagination
    }

  } catch (error) {
    console.error('Error getting error logs with filters:', error)
    throw error
  }
}
