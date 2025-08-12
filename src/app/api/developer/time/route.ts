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

    // Verify user role is Developer or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['developer', 'project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const weekStart = searchParams.get('weekStart')
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    // Mock time entries - replace with actual database queries
    const mockTimeEntries = [
      {
        id: 1,
        userId: user.id,
        date: '2024-01-25',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        task: 'Refactor user registration API',
        taskId: 'task-4',
        hours: 3.5,
        description: 'Implemented validation layer and error handling',
        status: 'approved',
        billable: true,
        submittedAt: '2024-01-25T17:30:00Z',
        approvedAt: '2024-01-25T18:00:00Z',
        approvedBy: 'Sarah M.'
      },
      {
        id: 2,
        userId: user.id,
        date: '2024-01-25',
        project: 'Mobile App Integration',
        projectId: 2,
        task: 'Fix responsive layout bug',
        taskId: 'task-5',
        hours: 1.5,
        description: 'Fixed navigation menu issue on iOS devices',
        status: 'approved',
        billable: true,
        submittedAt: '2024-01-25T15:00:00Z',
        approvedAt: '2024-01-25T16:00:00Z',
        approvedBy: 'Anna K.'
      },
      {
        id: 3,
        userId: user.id,
        date: '2024-01-24',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        task: 'Code review',
        taskId: null,
        hours: 2,
        description: 'Reviewed authentication module pull requests',
        status: 'pending',
        billable: false,
        submittedAt: '2024-01-24T16:00:00Z',
        approvedAt: null,
        approvedBy: null
      },
      {
        id: 4,
        userId: user.id,
        date: '2024-01-24',
        project: 'Documentation',
        projectId: 3,
        task: 'Update API documentation',
        taskId: 'task-8',
        hours: 2.5,
        description: 'Documented new authentication endpoints',
        status: 'approved',
        billable: false,
        submittedAt: '2024-01-24T18:00:00Z',
        approvedAt: '2024-01-24T19:00:00Z',
        approvedBy: 'John D.'
      },
      {
        id: 5,
        userId: user.id,
        date: '2024-01-23',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        task: 'Database optimization',
        taskId: 'task-2',
        hours: 4,
        description: 'Optimized user profile queries and added indexes',
        status: 'approved',
        billable: true,
        submittedAt: '2024-01-23T17:45:00Z',
        approvedAt: '2024-01-23T18:30:00Z',
        approvedBy: 'Sarah M.'
      },
      {
        id: 6,
        userId: user.id,
        date: '2024-01-23',
        project: 'Team Meeting',
        projectId: null,
        task: 'Sprint planning',
        taskId: null,
        hours: 1,
        description: 'Attended sprint planning meeting',
        status: 'approved',
        billable: false,
        submittedAt: '2024-01-23T11:00:00Z',
        approvedAt: '2024-01-23T11:30:00Z',
        approvedBy: 'Sarah M.'
      },
      {
        id: 7,
        userId: user.id,
        date: '2024-01-22',
        project: 'Security Enhancement',
        projectId: 4,
        task: 'API rate limiting',
        taskId: 'task-7',
        hours: 6,
        description: 'Implemented rate limiting with Redis',
        status: 'approved',
        billable: true,
        submittedAt: '2024-01-22T18:30:00Z',
        approvedAt: '2024-01-22T19:00:00Z',
        approvedBy: 'John D.'
      }
    ]

    // Filter time entries
    let filteredEntries = mockTimeEntries

    // Filter by week if provided
    if (weekStart) {
      const weekStartDate = new Date(weekStart)
      const weekEndDate = new Date(weekStartDate)
      weekEndDate.setDate(weekStartDate.getDate() + 6)
      
      filteredEntries = filteredEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= weekStartDate && entryDate <= weekEndDate
      })
    }

    // Filter by project if provided
    if (projectId && projectId !== 'all') {
      filteredEntries = filteredEntries.filter(entry => 
        entry.projectId?.toString() === projectId
      )
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      filteredEntries = filteredEntries.filter(entry => entry.status === status)
    }

    // Calculate summary statistics
    const summary = {
      totalEntries: filteredEntries.length,
      totalHours: filteredEntries.reduce((sum, entry) => sum + entry.hours, 0),
      billableHours: filteredEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0),
      nonBillableHours: filteredEntries.filter(entry => !entry.billable).reduce((sum, entry) => sum + entry.hours, 0),
      approvedHours: filteredEntries.filter(entry => entry.status === 'approved').reduce((sum, entry) => sum + entry.hours, 0),
      pendingHours: filteredEntries.filter(entry => entry.status === 'pending').reduce((sum, entry) => sum + entry.hours, 0),
      rejectedHours: filteredEntries.filter(entry => entry.status === 'rejected').reduce((sum, entry) => sum + entry.hours, 0)
    }

    // Group by project for breakdown
    const projectBreakdown = filteredEntries.reduce((acc, entry) => {
      const projectKey = entry.project || 'Other'
      if (!acc[projectKey]) {
        acc[projectKey] = {
          project: projectKey,
          totalHours: 0,
          billableHours: 0,
          entries: 0
        }
      }
      acc[projectKey].totalHours += entry.hours
      if (entry.billable) acc[projectKey].billableHours += entry.hours
      acc[projectKey].entries += 1
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      timeEntries: filteredEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      summary,
      projectBreakdown: Object.values(projectBreakdown),
      weekStart: weekStart || null,
      filters: {
        projectId: projectId || 'all',
        status: status || 'all'
      }
    })

  } catch (error) {
    console.error('Error fetching time entries:', error)
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

    const body = await request.json()
    const { 
      date, 
      project, 
      projectId, 
      task, 
      taskId, 
      hours, 
      description, 
      billable 
    } = body

    // Validate required fields
    if (!date || !project || !task || !hours || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate hours is a positive number
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      return NextResponse.json({ error: 'Hours must be a positive number between 0 and 24' }, { status: 400 })
    }

    // Mock time entry creation - replace with actual database insert
    const newTimeEntry = {
      id: Date.now(),
      userId: user.id,
      date,
      project,
      projectId: projectId || null,
      task,
      taskId: taskId || null,
      hours: parseFloat(hours),
      description,
      billable: billable !== false, // Default to true if not specified
      status: 'pending',
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null
    }

    return NextResponse.json({ 
      message: 'Time entry created successfully',
      timeEntry: newTimeEntry 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating time entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, hours, description, billable } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Time entry ID is required' }, { status: 400 })
    }

    // Validate hours if provided
    if (hours !== undefined && (isNaN(hours) || hours <= 0 || hours > 24)) {
      return NextResponse.json({ error: 'Hours must be a positive number between 0 and 24' }, { status: 400 })
    }

    // Mock time entry update - replace with actual database update
    // In real implementation, verify user owns the time entry and it's still editable (status = pending)
    const updatedTimeEntry = {
      id,
      hours: hours !== undefined ? parseFloat(hours) : undefined,
      description: description || undefined,
      billable: billable !== undefined ? billable : undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    }

    return NextResponse.json({ 
      message: 'Time entry updated successfully',
      timeEntry: updatedTimeEntry 
    })

  } catch (error) {
    console.error('Error updating time entry:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

