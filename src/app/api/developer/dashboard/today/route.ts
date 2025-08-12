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
    const projectId = searchParams.get('projectId')

    // Get today's date
    const today = new Date().toISOString().split('T')[0]

    // Mock tasks for today - replace with actual database queries
    const mockTodaysTasks = [
      {
        id: 'task-1',
        title: 'Implement user authentication API',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        priority: 'high',
        estimatedHours: 6,
        status: 'in-progress',
        completed: false,
        dueTime: '5:00 PM',
        dueDate: today,
        assigneeId: user.id,
        description: 'Build REST API endpoints for user authentication',
        tags: ['backend', 'api', 'auth']
      },
      {
        id: 'task-2',
        title: 'Fix responsive layout issues',
        project: 'Mobile App Integration',
        projectId: 2,
        priority: 'medium',
        estimatedHours: 3,
        status: 'todo',
        completed: false,
        dueTime: '3:00 PM',
        dueDate: today,
        assigneeId: user.id,
        description: 'Fix navigation menu layout on mobile devices',
        tags: ['frontend', 'mobile', 'css']
      },
      {
        id: 'task-3',
        title: 'Code review for team member',
        project: 'Code Quality',
        projectId: null,
        priority: 'medium',
        estimatedHours: 1,
        status: 'todo',
        completed: false,
        dueTime: '11:00 AM',
        dueDate: today,
        assigneeId: user.id,
        description: 'Review pull request for authentication module',
        tags: ['review', 'quality']
      }
    ]

    // Filter by project if specified
    let filteredTasks = mockTodaysTasks
    if (projectId && projectId !== 'all') {
      filteredTasks = filteredTasks.filter(task => 
        task.projectId?.toString() === projectId
      )
    }

    // Calculate task statistics
    const taskStats = {
      total: filteredTasks.length,
      completed: filteredTasks.filter(task => task.completed).length,
      inProgress: filteredTasks.filter(task => task.status === 'in-progress').length,
      pending: filteredTasks.filter(task => task.status === 'todo').length,
      overdue: filteredTasks.filter(task => {
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`)
        return dueDateTime < new Date() && !task.completed
      }).length,
      estimatedHours: filteredTasks.reduce((sum, task) => sum + task.estimatedHours, 0)
    }

    return NextResponse.json({
      tasks: filteredTasks,
      date: today,
      stats: taskStats,
      user: {
        id: user.id,
        email: user.email,
        role: userProfile.role
      }
    })

  } catch (error) {
    console.error('Error fetching today\'s tasks:', error)
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
    const { taskId, completed, status } = body

    // Validate required fields
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Mock task update - replace with actual database update
    const updatedTask = {
      id: taskId,
      completed: completed !== undefined ? completed : undefined,
      status: status || undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    }

    // In real implementation, verify user owns the task or has permission to update it

    return NextResponse.json({ 
      message: 'Task updated successfully',
      task: updatedTask 
    })

  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

