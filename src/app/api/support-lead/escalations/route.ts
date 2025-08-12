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

    // Verify user role is Support Lead or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['support-lead', 'executive', 'admin'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const requester = searchParams.get('requester')

    // Mock escalation data - replace with actual database queries
    const mockEscalations = [
      {
        id: 'ESC-2024-001',
        ticketId: 'TK-2024-002',
        title: 'Critical authentication system failure',
        description: 'Multiple OAuth providers failing simultaneously. This requires immediate management attention and potential external vendor engagement.',
        requester: 'Mike Rodriguez',
        requesterId: 'mike-rodriguez',
        requesterRole: 'Security Support Specialist',
        requesterTeam: 'Security Team',
        status: 'pending',
        priority: 'critical',
        category: 'Technical',
        reason: 'Requires vendor escalation and management approval',
        client: 'Digital Solutions Ltd',
        estimatedImpact: 'High - Affecting 500+ users unable to login',
        requestedAt: '2024-01-25T15:30:00Z',
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        slaDeadline: '2024-01-25T16:00:00Z',
        businessImpact: 'Critical - Revenue impact due to login failures',
        suggestedActions: [
          'Engage Google OAuth support team',
          'Implement temporary fallback authentication',
          'Notify affected clients via status page'
        ],
        attachments: [
          { id: 1, name: 'error_logs.txt', size: '2.3 MB', uploadedAt: '2024-01-25T15:30:00Z' },
          { id: 2, name: 'network_trace.har', size: '1.8 MB', uploadedAt: '2024-01-25T15:31:00Z' }
        ]
      },
      {
        id: 'ESC-2024-002',
        ticketId: 'TK-2024-025',
        title: 'Emergency database maintenance required',
        description: 'Database performance has degraded significantly. Requires immediate maintenance window approval to prevent complete service outage.',
        requester: 'David Wilson',
        requesterId: 'david-wilson',
        requesterRole: 'Database Support Specialist',
        requesterTeam: 'Database Team',
        status: 'approved',
        priority: 'high',
        category: 'Infrastructure',
        reason: 'Emergency maintenance window needed',
        client: 'Enterprise Corp',
        estimatedImpact: 'Medium - 2 hour maintenance window required',
        requestedAt: '2024-01-25T12:00:00Z',
        approvedAt: '2024-01-25T12:15:00Z',
        approvedBy: 'Sarah Mitchell (Support Lead)',
        rejectedAt: null,
        rejectedBy: null,
        slaDeadline: '2024-01-25T14:00:00Z',
        businessImpact: 'High - Performance degradation affecting all users',
        suggestedActions: [
          'Schedule 2-hour maintenance window',
          'Notify all clients 24 hours in advance',
          'Prepare rollback procedures'
        ],
        approvalComment: 'Approved. Coordinate with operations team for emergency maintenance window. Client has been notified.',
        attachments: [
          { id: 1, name: 'performance_metrics.pdf', size: '890 KB', uploadedAt: '2024-01-25T12:00:00Z' }
        ]
      }
    ]

    // Filter escalations based on query parameters
    let filteredEscalations = mockEscalations

    if (status && status !== 'all') {
      filteredEscalations = filteredEscalations.filter(esc => esc.status === status)
    }

    if (priority && priority !== 'all') {
      filteredEscalations = filteredEscalations.filter(esc => esc.priority === priority)
    }

    if (category && category !== 'all') {
      filteredEscalations = filteredEscalations.filter(esc => esc.category === category)
    }

    if (requester && requester !== 'all') {
      filteredEscalations = filteredEscalations.filter(esc => esc.requesterId === requester)
    }

    // Sort escalations by priority and date
    filteredEscalations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
      
      if (aPriority !== bPriority) return bPriority - aPriority
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    })

    // Calculate summary statistics
    const summary = {
      total: filteredEscalations.length,
      pending: filteredEscalations.filter(e => e.status === 'pending').length,
      approved: filteredEscalations.filter(e => e.status === 'approved').length,
      rejected: filteredEscalations.filter(e => e.status === 'rejected').length,
      critical: filteredEscalations.filter(e => e.priority === 'critical').length,
      avgResponseTime: '15 minutes', // Mock - calculate from actual data
      escalationRate: '2.3%' // Mock - percentage of tickets that get escalated
    }

    return NextResponse.json({
      escalations: filteredEscalations,
      summary,
      filters: {
        status: status || 'all',
        priority: priority || 'all',
        category: category || 'all',
        requester: requester || 'all'
      },
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching escalations:', error)
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

    // Verify user role is Support Lead or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['support-lead', 'executive', 'admin'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { escalationId, action, comment } = body

    // Validate required fields
    if (!escalationId || !action || !comment) {
      return NextResponse.json({ 
        error: 'Missing required fields: escalationId, action, comment' 
      }, { status: 400 })
    }

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action. Must be "approve" or "reject"' 
      }, { status: 400 })
    }

    // In real implementation, update the escalation in the database
    const updatedEscalation = {
      id: escalationId,
      status: action === 'approve' ? 'approved' : 'rejected',
      [action === 'approve' ? 'approvedAt' : 'rejectedAt']: new Date().toISOString(),
      [action === 'approve' ? 'approvedBy' : 'rejectedBy']: userProfile.name || user.email,
      comment,
      updatedBy: user.id
    }

    // Mock notification to the requester
    const notification = {
      type: 'escalation_response',
      title: `Escalation ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `Your escalation ${escalationId} has been ${action}d`,
      data: {
        escalationId,
        action,
        comment,
        respondedBy: userProfile.name || user.email
      }
    }

    // In real implementation:
    // 1. Update escalation status in database
    // 2. Send real-time notification to requester
    // 3. Update related ticket status if approved
    // 4. Log the action in audit trail

    return NextResponse.json({ 
      message: `Escalation ${action}d successfully`,
      escalation: updatedEscalation,
      notification 
    })

  } catch (error) {
    console.error('Error updating escalation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

