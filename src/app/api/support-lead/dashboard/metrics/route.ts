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
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const teamFilter = searchParams.get('team')

    // Mock dashboard metrics - replace with actual database queries
    const mockMetrics = {
      overview: {
        openTickets: 127,
        slaCompliance: 92.5,
        breachedTickets: 8,
        avgResolutionTime: 4.2, // hours
        clientSatisfaction: 4.6,
        totalTicketsThisPeriod: 1247,
        resolvedTicketsThisPeriod: 1120,
        escalationsThisPeriod: 15,
        teamUtilization: 78.5 // percentage
      },
      
      trends: {
        previousPeriod: {
          openTickets: 134,
          slaCompliance: 90.4,
          breachedTickets: 11,
          avgResolutionTime: 5.0,
          clientSatisfaction: 4.4
        },
        changes: {
          openTickets: -5.2, // percentage change
          slaCompliance: 2.3,
          breachedTickets: -27.3,
          avgResolutionTime: -16.0,
          clientSatisfaction: 4.5
        }
      },

      breakdown: {
        byPriority: {
          critical: { 
            count: 18, 
            slaCompliance: 85.0, 
            avgResolutionTime: 1.8,
            breaches: 3 
          },
          high: { 
            count: 45, 
            slaCompliance: 90.5, 
            avgResolutionTime: 3.2,
            breaches: 4 
          },
          medium: { 
            count: 52, 
            slaCompliance: 94.2, 
            avgResolutionTime: 6.1,
            breaches: 1 
          },
          low: { 
            count: 12, 
            slaCompliance: 97.8, 
            avgResolutionTime: 12.5,
            breaches: 0 
          }
        },

        byTeam: {
          'Integration Team': {
            openTickets: 23,
            slaCompliance: 88.5,
            avgResolutionTime: 4.1,
            utilization: 85.2,
            satisfaction: 4.5
          },
          'Security Team': {
            openTickets: 18,
            slaCompliance: 91.2,
            avgResolutionTime: 3.8,
            utilization: 92.1,
            satisfaction: 4.7
          },
          'Infrastructure Team': {
            openTickets: 31,
            slaCompliance: 95.8,
            avgResolutionTime: 3.2,
            utilization: 76.3,
            satisfaction: 4.8
          },
          'Database Team': {
            openTickets: 20,
            slaCompliance: 89.3,
            avgResolutionTime: 5.5,
            utilization: 88.7,
            satisfaction: 4.3
          },
          'API Team': {
            openTickets: 25,
            slaCompliance: 94.1,
            avgResolutionTime: 3.9,
            utilization: 71.5,
            satisfaction: 4.6
          },
          'Mobile Team': {
            openTickets: 10,
            slaCompliance: 92.7,
            avgResolutionTime: 4.3,
            utilization: 65.8,
            satisfaction: 4.7
          }
        },

        byClient: {
          'TechStart Inc.': {
            openTickets: 15,
            slaCompliance: 87.5,
            totalTickets: 124,
            satisfaction: 4.2
          },
          'Digital Solutions Ltd': {
            openTickets: 22,
            slaCompliance: 93.2,
            totalTickets: 156,
            satisfaction: 4.8
          },
          'Enterprise Corp': {
            openTickets: 28,
            slaCompliance: 89.8,
            totalTickets: 203,
            satisfaction: 4.5
          },
          'StartUp Hub': {
            openTickets: 8,
            slaCompliance: 95.1,
            totalTickets: 87,
            satisfaction: 4.9
          },
          'Mobile Tech Co': {
            openTickets: 12,
            slaCompliance: 91.3,
            totalTickets: 98,
            satisfaction: 4.6
          }
        },

        byCategory: {
          'Technical': { count: 48, avgResolutionTime: 4.8, slaCompliance: 89.2 },
          'Infrastructure': { count: 31, avgResolutionTime: 3.2, slaCompliance: 95.8 },
          'Security': { count: 18, avgResolutionTime: 3.8, slaCompliance: 91.2 },
          'Integration': { count: 23, avgResolutionTime: 4.1, slaCompliance: 88.5 },
          'Performance': { count: 7, avgResolutionTime: 6.2, slaCompliance: 85.7 }
        }
      },

      alerts: {
        slaBreaches: [
          {
            ticketId: 'TK-2024-002',
            client: 'Digital Solutions Ltd',
            breachTime: 15, // minutes
            priority: 'critical',
            assignee: 'Mike Rodriguez'
          },
          {
            ticketId: 'TK-2024-025',
            client: 'Enterprise Corp',
            breachTime: 45,
            priority: 'high',
            assignee: 'David Wilson'
          }
        ],
        overloadedAgents: [
          {
            agentId: 'mike-rodriguez',
            name: 'Mike Rodriguez',
            workload: 98,
            assignedTickets: 12,
            team: 'Security Team'
          }
        ],
        escalations: [
          {
            escalationId: 'ESC-2024-001',
            ticketId: 'TK-2024-002',
            priority: 'critical',
            requester: 'Mike Rodriguez',
            status: 'pending'
          }
        ]
      }
    }

    // Apply filters if specified
    let filteredMetrics = mockMetrics
    
    if (teamFilter && teamFilter !== 'all') {
      // Filter metrics by specific team
      const teamData = mockMetrics.breakdown.byTeam[teamFilter as keyof typeof mockMetrics.breakdown.byTeam]
      if (teamData) {
        filteredMetrics = {
          ...mockMetrics,
          overview: {
            ...mockMetrics.overview,
            openTickets: teamData.openTickets,
            slaCompliance: teamData.slaCompliance,
            avgResolutionTime: teamData.avgResolutionTime
          },
          breakdown: {
            ...mockMetrics.breakdown,
            byTeam: { [teamFilter]: teamData } as typeof mockMetrics.breakdown.byTeam
          }
        }
      }
    }

    // In real implementation, apply date filters here
    // if (startDate && endDate) {
    //   // Filter data by date range
    // }

    return NextResponse.json({
      metrics: filteredMetrics,
      period: {
        start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: endDate || new Date().toISOString(),
        type: !startDate && !endDate ? 'week' : 'custom'
      },
      filters: {
        team: teamFilter || 'all'
      },
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

