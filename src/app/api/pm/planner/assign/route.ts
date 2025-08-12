import { NextRequest, NextResponse } from 'next/server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user role is PM or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || !['project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { assignments, weekStart } = body

    // Validate required fields
    if (!assignments || !Array.isArray(assignments) || !weekStart) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate each assignment
    for (const assignment of assignments) {
      if (!assignment.taskId || !assignment.memberId || !assignment.day || !assignment.hours) {
        return NextResponse.json({ error: 'Invalid assignment data' }, { status: 400 })
      }
    }

    // Check for conflicts and overbooking
    const conflicts = []
    const memberHours: { [key: string]: number } = {}

    for (const assignment of assignments) {
      const memberWeekKey = `${assignment.memberId}-${weekStart}`
      memberHours[memberWeekKey] = (memberHours[memberWeekKey] || 0) + assignment.hours
      
      // Check if member is overbooked (assuming 40 hours per week limit)
      if (memberHours[memberWeekKey] > 40) {
        conflicts.push({
          type: 'overbooking',
          memberId: assignment.memberId,
          totalHours: memberHours[memberWeekKey],
          weekStart
        })
      }
    }

    // If conflicts exist, return them without saving
    if (conflicts.length > 0) {
      return NextResponse.json({ 
        error: 'Assignment conflicts detected',
        conflicts 
      }, { status: 409 })
    }

    // Mock assignment save - replace with actual database operations
    const savedAssignments = assignments.map((assignment: any) => ({
      id: `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...assignment,
      weekStart,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    }))

    // In real implementation, you would:
    // 1. Start a database transaction
    // 2. Delete existing assignments for the week
    // 3. Insert new assignments
    // 4. Update task assignees if needed
    // 5. Create notifications for team members
    // 6. Commit transaction

    return NextResponse.json({ 
      message: 'Assignments saved successfully',
      assignments: savedAssignments,
      summary: {
        totalAssignments: savedAssignments.length,
        affectedMembers: Array.from(new Set(assignments.map((a: any) => a.memberId))).length,
        weekStart
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error saving assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const weekStart = searchParams.get('weekStart')
    const memberId = searchParams.get('memberId')

    if (!weekStart) {
      return NextResponse.json({ error: 'Week start date is required' }, { status: 400 })
    }

    // Mock assignments data - replace with actual database query
    const mockAssignments = [
      {
        id: 'assignment-1',
        taskId: 'task-1',
        taskTitle: 'Design user authentication flow',
        memberId: 'member-2',
        memberName: 'Sarah M.',
        day: 'monday',
        hours: 8,
        weekStart,
        createdAt: '2024-01-22T10:00:00Z'
      },
      {
        id: 'assignment-2',
        taskId: 'task-2',
        taskTitle: 'API integration work',
        memberId: 'member-1',
        memberName: 'John D.',
        day: 'tuesday',
        hours: 6,
        weekStart,
        createdAt: '2024-01-22T10:00:00Z'
      }
    ]

    // Filter by member if specified
    let filteredAssignments = mockAssignments
    if (memberId) {
      filteredAssignments = filteredAssignments.filter(a => a.memberId === memberId)
    }

    return NextResponse.json({
      assignments: filteredAssignments,
      weekStart,
      summary: {
        totalAssignments: filteredAssignments.length,
        totalHours: filteredAssignments.reduce((sum, a) => sum + a.hours, 0)
      }
    })

  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

