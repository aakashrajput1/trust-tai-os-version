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
    const team = searchParams.get('team')
    const client = searchParams.get('client')
    const priority = searchParams.get('priority')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Mock SLA overview data - replace with actual database queries
    const mockSlaData = {
      summary: {
        totalTickets: 1247,
        compliantTickets: 1154,
        breachedTickets: 93,
        overallCompliance: 92.5,
        averageResolutionTime: 4.2,
        targetCompliance: 95.0
      },

      byState: {
        ok: {
          count: 1154,
          percentage: 92.5,
          avgResolutionTime: 3.8
        },
        warning: {
          count: 48,
          percentage: 3.8,
          avgResolutionTime: 7.2,
          definition: 'Within 80-100% of SLA deadline'
        },
        breached: {
          count: 45,
          percentage: 3.6,
          avgOverrun: 2.3, // hours
          definition: 'Exceeded SLA deadline'
        }
      },

      byPriority: {
        critical: {
          slaTarget: 2, // hours
          compliance: 85.0,
          avgResolutionTime: 1.8,
          totalTickets: 89,
          breachedTickets: 13,
          breachReasons: [
            { reason: 'Third-party vendor delays', count: 5 },
            { reason: 'Complex technical issues', count: 4 },
            { reason: 'Resource unavailability', count: 3 },
            { reason: 'Client delayed response', count: 1 }
          ]
        },
        high: {
          slaTarget: 4, // hours
          compliance: 90.5,
          avgResolutionTime: 3.2,
          totalTickets: 312,
          breachedTickets: 30,
          breachReasons: [
            { reason: 'Investigation complexity', count: 12 },
            { reason: 'Cross-team coordination', count: 8 },
            { reason: 'Technical documentation gaps', count: 6 },
            { reason: 'External dependencies', count: 4 }
          ]
        },
        medium: {
          slaTarget: 8, // hours
          compliance: 94.2,
          avgResolutionTime: 6.1,
          totalTickets: 456,
          breachedTickets: 26,
          breachReasons: [
            { reason: 'Lower priority queue', count: 15 },
            { reason: 'Resource allocation', count: 7 },
            { reason: 'Testing requirements', count: 4 }
          ]
        },
        low: {
          slaTarget: 24, // hours
          compliance: 97.8,
          avgResolutionTime: 12.5,
          totalTickets: 390,
          breachedTickets: 9,
          breachReasons: [
            { reason: 'Feature request complexity', count: 5 },
            { reason: 'Documentation requirements', count: 4 }
          ]
        }
      },

      byTeam: {
        'Integration Team': {
          compliance: 88.5,
          totalTickets: 156,
          breachedTickets: 18,
          avgResolutionTime: 4.1,
          improvement: -2.3, // percentage change from last period
          topBreachReasons: ['API complexity', 'Third-party integration delays']
        },
        'Security Team': {
          compliance: 91.2,
          totalTickets: 203,
          breachedTickets: 18,
          avgResolutionTime: 3.8,
          improvement: 1.7,
          topBreachReasons: ['Investigation complexity', 'Coordination requirements']
        },
        'Infrastructure Team': {
          compliance: 95.8,
          totalTickets: 298,
          breachedTickets: 12,
          avgResolutionTime: 3.2,
          improvement: 3.2,
          topBreachReasons: ['Emergency maintenance', 'Capacity planning']
        },
        'Database Team': {
          compliance: 89.3,
          totalTickets: 187,
          breachedTickets: 20,
          avgResolutionTime: 5.5,
          improvement: -1.8,
          topBreachReasons: ['Query optimization complexity', 'Data migration issues']
        },
        'API Team': {
          compliance: 94.1,
          totalTickets: 234,
          breachedTickets: 14,
          avgResolutionTime: 3.9,
          improvement: 2.5,
          topBreachReasons: ['Rate limiting configuration', 'Documentation updates']
        },
        'Mobile Team': {
          compliance: 92.7,
          totalTickets: 169,
          breachedTickets: 11,
          avgResolutionTime: 4.3,
          improvement: 1.2,
          topBreachReasons: ['Platform-specific issues', 'App store processes']
        }
      },

      byClient: {
        'TechStart Inc.': {
          compliance: 87.5,
          totalTickets: 124,
          breachedTickets: 15,
          avgResolutionTime: 4.8,
          contractSla: 95.0,
          riskLevel: 'high'
        },
        'Digital Solutions Ltd': {
          compliance: 93.2,
          totalTickets: 156,
          breachedTickets: 11,
          avgResolutionTime: 3.6,
          contractSla: 90.0,
          riskLevel: 'low'
        },
        'Enterprise Corp': {
          compliance: 89.8,
          totalTickets: 203,
          breachedTickets: 21,
          avgResolutionTime: 4.2,
          contractSla: 92.0,
          riskLevel: 'medium'
        },
        'StartUp Hub': {
          compliance: 95.1,
          totalTickets: 87,
          breachedTickets: 4,
          avgResolutionTime: 3.1,
          contractSla: 85.0,
          riskLevel: 'low'
        },
        'Mobile Tech Co': {
          compliance: 91.3,
          totalTickets: 98,
          breachedTickets: 9,
          avgResolutionTime: 3.9,
          contractSla: 90.0,
          riskLevel: 'low'
        }
      },

      trends: {
        daily: [
          { date: '2024-01-18', compliance: 89.2, breaches: 8, totalTickets: 45 },
          { date: '2024-01-19', compliance: 91.5, breaches: 6, totalTickets: 52 },
          { date: '2024-01-20', compliance: 88.7, breaches: 9, totalTickets: 48 },
          { date: '2024-01-21', compliance: 93.1, breaches: 5, totalTickets: 41 },
          { date: '2024-01-22', compliance: 90.8, breaches: 7, totalTickets: 43 },
          { date: '2024-01-23', compliance: 94.2, breaches: 4, totalTickets: 38 },
          { date: '2024-01-24', compliance: 92.5, breaches: 6, totalTickets: 47 },
          { date: '2024-01-25', compliance: 92.8, breaches: 5, totalTickets: 42 }
        ],
        weekly: [
          { week: '2024-W1', compliance: 90.1, breaches: 35, totalTickets: 312 },
          { week: '2024-W2', compliance: 91.8, breaches: 28, totalTickets: 298 },
          { week: '2024-W3', compliance: 89.3, breaches: 42, totalTickets: 334 },
          { week: '2024-W4', compliance: 92.5, breaches: 31, totalTickets: 315 }
        ]
      },

      actionItems: [
        {
          type: 'breach_prevention',
          priority: 'high',
          title: 'Critical Priority SLA Improvement Needed',
          description: 'Critical tickets are below 95% target at 85% compliance',
          assignedTeam: 'Security Team',
          dueDate: '2024-02-01'
        },
        {
          type: 'team_performance',
          priority: 'medium',
          title: 'Integration Team Performance Review',
          description: 'Team showing declining SLA performance (-2.3%)',
          assignedTeam: 'Integration Team',
          dueDate: '2024-01-30'
        },
        {
          type: 'client_risk',
          priority: 'high',
          title: 'TechStart Inc. Contract Risk',
          description: 'Client SLA at 87.5%, contract requires 95%',
          assignedTeam: 'Account Management',
          dueDate: '2024-01-28'
        }
      ]
    }

    // Apply filters
    let filteredData = mockSlaData

    if (team && team !== 'all') {
      const teamData = mockSlaData.byTeam[team as keyof typeof mockSlaData.byTeam]
      if (teamData) {
        filteredData = {
          ...mockSlaData,
          summary: {
            ...mockSlaData.summary,
            totalTickets: teamData.totalTickets,
            breachedTickets: teamData.breachedTickets,
            overallCompliance: teamData.compliance,
            averageResolutionTime: teamData.avgResolutionTime
          },
          byTeam: { [team]: teamData } as typeof mockSlaData.byTeam
        }
      }
    }

    if (client && client !== 'all') {
      const clientData = mockSlaData.byClient[client as keyof typeof mockSlaData.byClient]
      if (clientData) {
        filteredData = {
          ...filteredData,
          byClient: { [client]: clientData } as typeof mockSlaData.byClient
        }
      }
    }

    if (priority && priority !== 'all') {
      const priorityData = mockSlaData.byPriority[priority as keyof typeof mockSlaData.byPriority]
      if (priorityData) {
        filteredData = {
          ...filteredData,
          byPriority: { [priority]: priorityData } as typeof mockSlaData.byPriority
        }
      }
    }

    return NextResponse.json({
      slaData: filteredData,
      filters: {
        team: team || 'all',
        client: client || 'all',
        priority: priority || 'all',
        startDate: startDate || null,
        endDate: endDate || null
      },
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching SLA overview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

