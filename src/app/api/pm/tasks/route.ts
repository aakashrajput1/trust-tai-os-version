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

    // Verify user role is PM or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || !['project-manager', 'executive'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignee = searchParams.get('assignee')
    const project = searchParams.get('project')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Mock tasks data - replace with actual database queries
    const mockTasks = [
      {
        id: 'task-1',
        title: 'Design user authentication flow',
        description: 'Create wireframes and user flow for the new authentication system',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        status: 'todo',
        priority: 'high',
        assignee: { id: 2, name: 'Sarah M.', avatar: 'SM' },
        dueDate: '2024-01-25',
        tags: ['frontend', 'design'],
        comments: 3,
        attachments: 2,
        estimatedHours: 16,
        actualHours: 0,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      },
      {
        id: 'task-2',
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment pipeline',
        project: 'Mobile App Integration',
        projectId: 2,
        status: 'todo',
        priority: 'medium',
        assignee: { id: 3, name: 'Mike R.', avatar: 'MR' },
        dueDate: '2024-01-30',
        tags: ['devops', 'backend'],
        comments: 1,
        attachments: 0,
        estimatedHours: 20,
        actualHours: 0,
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-18T11:15:00Z'
      },
      {
        id: 'task-3',
        title: 'Implement user registration API',
        description: 'Build REST API endpoints for user registration with validation',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        status: 'in-progress',
        priority: 'high',
        assignee: { id: 3, name: 'Mike R.', avatar: 'MR' },
        dueDate: '2024-01-28',
        tags: ['backend', 'api'],
        comments: 5,
        attachments: 3,
        estimatedHours: 24,
        actualHours: 16,
        createdAt: '2024-01-10T08:00:00Z',
        updatedAt: '2024-01-22T16:45:00Z'
      },
      {
        id: 'task-4',
        title: 'Create responsive product cards',
        description: 'Develop reusable product card components for different screen sizes',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        status: 'in-progress',
        priority: 'medium',
        assignee: { id: 2, name: 'Sarah M.', avatar: 'SM' },
        dueDate: '2024-01-26',
        tags: ['frontend', 'components'],
        comments: 2,
        attachments: 1,
        estimatedHours: 12,
        actualHours: 8,
        createdAt: '2024-01-12T10:30:00Z',
        updatedAt: '2024-01-21T13:20:00Z'
      },
      {
        id: 'task-5',
        title: 'Product listing page layout',
        description: 'Frontend implementation of the product listing with filters and sorting',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        status: 'review',
        priority: 'medium',
        assignee: { id: 2, name: 'Sarah M.', avatar: 'SM' },
        dueDate: '2024-01-24',
        tags: ['frontend', 'layout'],
        comments: 8,
        attachments: 4,
        estimatedHours: 18,
        actualHours: 20,
        createdAt: '2024-01-08T14:00:00Z',
        updatedAt: '2024-01-23T10:10:00Z'
      },
      {
        id: 'task-6',
        title: 'E2E testing for checkout flow',
        description: 'Create comprehensive end-to-end tests for the complete checkout process',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        status: 'testing',
        priority: 'high',
        assignee: { id: 5, name: 'Tom B.', avatar: 'TB' },
        dueDate: '2024-01-27',
        tags: ['testing', 'e2e'],
        comments: 1,
        attachments: 0,
        estimatedHours: 16,
        actualHours: 12,
        createdAt: '2024-01-14T11:00:00Z',
        updatedAt: '2024-01-22T09:30:00Z'
      },
      {
        id: 'task-7',
        title: 'User persona research',
        description: 'Conducted interviews and created detailed user personas',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        status: 'done',
        priority: 'medium',
        assignee: { id: 4, name: 'Anna K.', avatar: 'AK' },
        dueDate: '2024-01-20',
        tags: ['research', 'ux'],
        comments: 12,
        attachments: 8,
        estimatedHours: 32,
        actualHours: 30,
        createdAt: '2024-01-05T09:00:00Z',
        updatedAt: '2024-01-20T17:00:00Z'
      }
    ]

    // Filter tasks
    let filteredTasks = mockTasks

    // Filter by project manager's projects only
    // In real implementation, you'd join with projects table to check ownership
    
    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }
    
    if (priority && priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }
    
    if (assignee && assignee !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.assignee.name === assignee)
    }
    
    if (project && project !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.project === project)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

    // Group tasks by status for kanban view
    const tasksByStatus = {
      todo: filteredTasks.filter(task => task.status === 'todo'),
      'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
      review: filteredTasks.filter(task => task.status === 'review'),
      testing: filteredTasks.filter(task => task.status === 'testing'),
      done: filteredTasks.filter(task => task.status === 'done')
    }

    return NextResponse.json({
      tasks: paginatedTasks,
      tasksByStatus,
      total: filteredTasks.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTasks.length / limit),
      summary: {
        totalTasks: filteredTasks.length,
        todoTasks: tasksByStatus.todo.length,
        inProgressTasks: tasksByStatus['in-progress'].length,
        reviewTasks: tasksByStatus.review.length,
        testingTasks: tasksByStatus.testing.length,
        doneTasks: tasksByStatus.done.length,
        overdueTasks: filteredTasks.filter(task => new Date(task.dueDate) < new Date()).length
      }
    })

  } catch (error) {
    console.error('Error fetching tasks:', error)
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
    const { 
      title, 
      description, 
      projectId, 
      priority, 
      assigneeId, 
      dueDate, 
      tags, 
      estimatedHours 
    } = body

    // Validate required fields
    if (!title || !projectId || !priority || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock task creation - replace with actual database insert
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      description: description || '',
      projectId,
      project: 'Project Name', // Would be fetched from projects table
      status: 'todo',
      priority,
      assignee: assigneeId ? { id: assigneeId, name: 'Assignee Name', avatar: 'AN' } : null,
      dueDate,
      tags: tags || [],
      comments: 0,
      attachments: 0,
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id
    }

    return NextResponse.json({ task: newTask }, { status: 201 })

  } catch (error) {
    console.error('Error creating task:', error)
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
    const { taskId, status, priority, assigneeId, dueDate, actualHours } = body

    // Validate required fields
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Mock task update - replace with actual database update
    const updatedTask = {
      id: taskId,
      status: status || undefined,
      priority: priority || undefined,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      actualHours: actualHours || undefined,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    }

    return NextResponse.json({ 
      message: 'Task updated successfully',
      task: updatedTask 
    })

  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

