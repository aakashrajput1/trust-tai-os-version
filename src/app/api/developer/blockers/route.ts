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
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const projectId = searchParams.get('projectId')

    // Mock blockers/help requests - replace with actual database queries
    // Only return requests submitted by this user
    const mockBlockers = [
      {
        id: 1,
        userId: user.id,
        type: 'blocker',
        title: 'Third-party API authentication failing',
        description: 'Unable to authenticate with the payment gateway API. Getting 401 errors consistently even with valid credentials.',
        task: 'Implement payment processing',
        taskId: 'task-123',
        project: 'E-commerce Platform v2.0',
        projectId: 1,
        priority: 'high',
        status: 'open',
        submittedAt: '2024-01-25T10:30:00Z',
        acknowledgedAt: null,
        resolvedAt: null,
        assignedTo: 'Sarah M.',
        assignedToRole: 'PM',
        tags: ['api', 'authentication', 'payment'],
        updates: [
          {
            id: 1,
            authorId: user.id,
            author: 'You',
            message: 'Issue submitted. This is blocking payment integration development.',
            timestamp: '2024-01-25T10:30:00Z',
            type: 'comment'
          }
        ]
      },
      {
        id: 2,
        userId: user.id,
        type: 'help',
        title: 'Need guidance on database optimization',
        description: 'Looking for best practices on optimizing queries for the user profile system. Current queries are taking 2-3 seconds.',
        task: 'Optimize user profile queries',
        taskId: 'task-124',
        project: 'Performance Optimization',
        projectId: 2,
        priority: 'medium',
        status: 'in-progress',
        submittedAt: '2024-01-24T14:15:00Z',
        acknowledgedAt: '2024-01-24T15:00:00Z',
        resolvedAt: null,
        assignedTo: 'John D.',
        assignedToRole: 'Tech Lead',
        tags: ['database', 'performance', 'optimization'],
        updates: [
          {
            id: 1,
            authorId: user.id,
            author: 'You',
            message: 'Need help with query optimization strategies.',
            timestamp: '2024-01-24T14:15:00Z',
            type: 'comment'
          },
          {
            id: 2,
            authorId: 'john-d',
            author: 'John D.',
            message: 'I can help with this. Let\'s schedule a session to review your queries and indexing strategy.',
            timestamp: '2024-01-24T15:00:00Z',
            type: 'comment'
          },
          {
            id: 3,
            authorId: user.id,
            author: 'You',
            message: 'That would be great! I\'m available this afternoon.',
            timestamp: '2024-01-24T15:30:00Z',
            type: 'comment'
          }
        ]
      },
      {
        id: 3,
        userId: user.id,
        type: 'blocker',
        title: 'Development environment setup issues',
        description: 'Docker containers are failing to start properly on the new development machine. Getting port conflicts.',
        task: 'Environment setup',
        taskId: null,
        project: 'DevOps',
        projectId: 3,
        priority: 'high',
        status: 'resolved',
        submittedAt: '2024-01-23T09:00:00Z',
        acknowledgedAt: '2024-01-23T09:30:00Z',
        resolvedAt: '2024-01-23T11:00:00Z',
        assignedTo: 'Mike R.',
        assignedToRole: 'DevOps',
        tags: ['docker', 'environment', 'setup'],
        updates: [
          {
            id: 1,
            authorId: user.id,
            author: 'You',
            message: 'Docker setup is preventing me from starting development work.',
            timestamp: '2024-01-23T09:00:00Z',
            type: 'comment'
          },
          {
            id: 2,
            authorId: 'mike-r',
            author: 'Mike R.',
            message: 'I\'ll help you resolve this. Can you share the error logs?',
            timestamp: '2024-01-23T09:30:00Z',
            type: 'comment'
          },
          {
            id: 3,
            authorId: 'mike-r',
            author: 'Mike R.',
            message: 'Issue resolved. Updated docker-compose with different port mappings.',
            timestamp: '2024-01-23T11:00:00Z',
            type: 'resolution'
          }
        ]
      }
    ]

    // Filter requests
    let filteredBlockers = mockBlockers

    if (status && status !== 'all') {
      filteredBlockers = filteredBlockers.filter(blocker => blocker.status === status)
    }

    if (type && type !== 'all') {
      filteredBlockers = filteredBlockers.filter(blocker => blocker.type === type)
    }

    if (projectId && projectId !== 'all') {
      filteredBlockers = filteredBlockers.filter(blocker => 
        blocker.projectId?.toString() === projectId
      )
    }

    // Calculate summary statistics
    const summary = {
      total: filteredBlockers.length,
      open: filteredBlockers.filter(b => b.status === 'open').length,
      inProgress: filteredBlockers.filter(b => b.status === 'in-progress').length,
      resolved: filteredBlockers.filter(b => b.status === 'resolved').length,
      blockers: filteredBlockers.filter(b => b.type === 'blocker').length,
      helpRequests: filteredBlockers.filter(b => b.type === 'help').length,
      highPriority: filteredBlockers.filter(b => b.priority === 'high' && b.status !== 'resolved').length
    }

    return NextResponse.json({
      requests: filteredBlockers.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ),
      summary,
      filters: {
        status: status || 'all',
        type: type || 'all',
        projectId: projectId || 'all'
      }
    })

  } catch (error) {
    console.error('Error fetching blockers:', error)
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
      type, 
      title, 
      description, 
      task, 
      taskId, 
      project, 
      projectId, 
      priority, 
      tags 
    } = body

    // Validate required fields
    if (!type || !title || !description || !project || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate type
    if (!['blocker', 'help'].includes(type)) {
      return NextResponse.json({ error: 'Type must be either "blocker" or "help"' }, { status: 400 })
    }

    // Validate priority
    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json({ error: 'Priority must be low, medium, or high' }, { status: 400 })
    }

    // Determine assignee based on project and type
    // In real implementation, this would be based on project settings or team structure
    const getAssignee = (projectName: string, requestType: string) => {
      if (requestType === 'blocker') {
        // Blockers typically go to PM first
        return { assignedTo: 'Sarah M.', assignedToRole: 'PM' }
      } else {
        // Help requests might go to tech leads or specific experts
        if (projectName.includes('Performance') || projectName.includes('Database')) {
          return { assignedTo: 'John D.', assignedToRole: 'Tech Lead' }
        } else if (projectName.includes('DevOps') || projectName.includes('Docker')) {
          return { assignedTo: 'Mike R.', assignedToRole: 'DevOps' }
        } else {
          return { assignedTo: 'Sarah M.', assignedToRole: 'PM' }
        }
      }
    }

    const { assignedTo, assignedToRole } = getAssignee(project, type)

    // Mock request creation - replace with actual database insert
    const newRequest = {
      id: Date.now(),
      userId: user.id,
      type,
      title,
      description,
      task: task || null,
      taskId: taskId || null,
      project,
      projectId: projectId || null,
      priority,
      status: 'open',
      submittedAt: new Date().toISOString(),
      acknowledgedAt: null,
      resolvedAt: null,
      assignedTo,
      assignedToRole,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()) : []),
      updates: [
        {
          id: 1,
          authorId: user.id,
          author: 'You',
          message: `${type === 'blocker' ? 'Blocker' : 'Help request'} submitted: ${description}`,
          timestamp: new Date().toISOString(),
          type: 'creation'
        }
      ]
    }

    // In real implementation, send real-time notification to assigned person
    // await sendNotification(assignedTo, {
    //   type: 'blocker_assigned',
    //   title: `New ${type}: ${title}`,
    //   message: `${user.email} needs help with ${project}`,
    //   requestId: newRequest.id
    // })

    return NextResponse.json({ 
      message: `${type === 'blocker' ? 'Blocker' : 'Help request'} submitted successfully`,
      request: newRequest 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating blocker/help request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

