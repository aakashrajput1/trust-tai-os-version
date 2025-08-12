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

    // Verify user role is Sales or higher
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!['sales', 'executive', 'admin'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')
    const repFilter = searchParams.get('rep')

    // Set default date range if not provided
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const start = startDate ? new Date(startDate) : monthStart
    const end = endDate ? new Date(endDate) : monthEnd

    // Build the base query
    let leadsQuery = supabase
      .from('leads')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    let dealsQuery = supabase
      .from('deals')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())

    // Apply rep filter if specified
    if (repFilter && repFilter !== 'all') {
      leadsQuery = leadsQuery.eq('assigned_to', repFilter)
      dealsQuery = dealsQuery.eq('assigned_to', repFilter)
    }

    // Execute queries
    const [leadsResult, dealsResult] = await Promise.all([
      leadsQuery,
      dealsQuery
    ])

    if (leadsResult.error) {
      console.error('Error fetching leads:', leadsResult.error)
      return NextResponse.json({ error: 'Failed to fetch leads data' }, { status: 500 })
    }

    if (dealsResult.error) {
      console.error('Error fetching deals:', dealsResult.error)
      return NextResponse.json({ error: 'Failed to fetch deals data' }, { status: 500 })
    }

    const leads = leadsResult.data || []
    const deals = dealsResult.data || []

    // Calculate metrics
    const totalLeads = leads.length
    const totalDeals = deals.length
    
    const dealsWon = deals.filter(deal => deal.status === 'closed_won').length
    const dealsLost = deals.filter(deal => deal.status === 'closed_lost').length
    
    const totalRevenue = deals
      .filter(deal => deal.status === 'closed_won')
      .reduce((sum, deal) => sum + (deal.value || 0), 0)
    
    const forecastedRevenue = deals
      .filter(deal => ['proposal', 'negotiation'].includes(deal.stage))
      .reduce((sum, deal) => sum + (deal.value || 0), 0)

    // Calculate conversion rates
    const leadToDealConversion = totalLeads > 0 ? (totalDeals / totalLeads) * 100 : 0
    const dealWinRate = (dealsWon + dealsLost) > 0 ? (dealsWon / (dealsWon + dealsLost)) * 100 : 0

    // Pipeline overview
    const pipelineOverview = {
      prospecting: leads.filter(lead => lead.status === 'new').length,
      proposal: deals.filter(deal => deal.stage === 'proposal').length,
      negotiation: deals.filter(deal => deal.stage === 'negotiation').length,
      closedWon: dealsWon,
      closedLost: dealsLost
    }

    // Top performing reps (mock data for now)
    const topReps = [
      { name: 'Sarah Johnson', revenue: 45000, deals: 8, avatar: 'SJ' },
      { name: 'Mike Chen', revenue: 38000, deals: 6, avatar: 'MC' },
      { name: 'Lisa Rodriguez', revenue: 32000, deals: 5, avatar: 'LR' },
      { name: 'David Kim', revenue: 28000, deals: 4, avatar: 'DK' }
    ]

    return NextResponse.json({
      metrics: {
        totalLeads,
        totalDeals,
        dealsWon,
        dealsLost,
        totalRevenue,
        forecastedRevenue,
        leadToDealConversion: Math.round(leadToDealConversion * 100) / 100,
        dealWinRate: Math.round(dealWinRate * 100) / 100
      },
      pipelineOverview,
      topReps,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      filters: {
        rep: repFilter || 'all'
      }
    })

  } catch (error) {
    console.error('Error fetching sales metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
