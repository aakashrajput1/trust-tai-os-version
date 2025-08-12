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
    const timeRange = searchParams.get('timeRange') || '6months'
    const metric = searchParams.get('metric') || 'revenue'
    const repFilter = searchParams.get('rep')
    const clientFilter = searchParams.get('client')

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
      case '1year':
        startDate = new Date(now.getFullYear() - 1, 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    }

    // Build queries
    let dealsQuery = supabase
      .from('deals')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    let leadsQuery = supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    // Apply filters
    if (repFilter && repFilter !== 'all') {
      dealsQuery = dealsQuery.eq('assigned_to', repFilter)
      leadsQuery = leadsQuery.eq('assigned_to', repFilter)
    }
    if (clientFilter && clientFilter !== 'all') {
      dealsQuery = dealsQuery.eq('company_name', clientFilter)
      leadsQuery = leadsQuery.eq('company_name', clientFilter)
    }

    // Execute queries
    const [dealsResult, leadsResult] = await Promise.all([
      dealsQuery,
      leadsQuery
    ])

    if (dealsResult.error) {
      console.error('Error fetching deals for analytics:', dealsResult.error)
      return NextResponse.json({ error: 'Failed to fetch deals data' }, { status: 500 })
    }

    if (leadsResult.error) {
      console.error('Error fetching leads for analytics:', leadsResult.error)
      return NextResponse.json({ error: 'Failed to fetch leads data' }, { status: 500 })
    }

    const deals = dealsResult.data || []
    const leads = leadsResult.data || []

    // Calculate overview metrics
    const overview = {
      totalRevenue: deals
        .filter(deal => deal.status === 'closed_won')
        .reduce((sum, deal) => sum + (deal.value || 0), 0),
      dealsCount: deals.length,
      leadsCount: leads.length,
      conversionRate: leads.length > 0 ? (deals.length / leads.length) * 100 : 0,
      averageDealSize: deals.length > 0 ? 
        deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0
    }

    // Calculate growth rates (mock data for now)
    const previousPeriod = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
    const overviewGrowth = {
      revenueGrowth: 12.5,
      dealsGrowth: 8.2,
      conversionGrowth: 2.1,
      dealSizeGrowth: -3.2
    }

    // Pipeline analysis
    const pipeline = {
      prospecting: {
        count: deals.filter(deal => deal.stage === 'prospecting').length,
        value: deals.filter(deal => deal.stage === 'prospecting').reduce((sum, deal) => sum + (deal.value || 0), 0)
      },
      proposal: {
        count: deals.filter(deal => deal.stage === 'proposal').length,
        value: deals.filter(deal => deal.stage === 'proposal').reduce((sum, deal) => sum + (deal.value || 0), 0)
      },
      negotiation: {
        count: deals.filter(deal => deal.stage === 'negotiation').length,
        value: deals.filter(deal => deal.stage === 'negotiation').reduce((sum, deal) => sum + (deal.value || 0), 0)
      },
      closedWon: {
        count: deals.filter(deal => deal.status === 'closed_won').length,
        value: deals.filter(deal => deal.status === 'closed_won').reduce((sum, deal) => sum + (deal.value || 0), 0)
      }
    }

    // Monthly trends
    const monthlyTrends = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= now) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const monthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.created_at)
        return dealDate >= monthStart && dealDate <= monthEnd
      })
      
      const monthRevenue = monthDeals
        .filter(deal => deal.status === 'closed_won')
        .reduce((sum, deal) => sum + (deal.value || 0), 0)
      
      monthlyTrends.push({
        month: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        deals: monthDeals.length,
        target: 100000 // Mock target
      })
      
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Top performers
    const repPerformance = deals.reduce((acc, deal) => {
      const repId = deal.assigned_to
      if (!acc[repId]) {
        acc[repId] = { revenue: 0, deals: 0 }
      }
      if (deal.status === 'closed_won') {
        acc[repId].revenue += deal.value || 0
      }
      acc[repId].deals += 1
      return acc
    }, {} as Record<string, { revenue: number; deals: number }>)

    const topPerformers = Object.entries(repPerformance)
      .map(([repId, stats]) => {
        const typedStats = stats as { revenue: number; deals: number }
        return {
          repId,
          revenue: typedStats.revenue,
          deals: typedStats.deals,
          conversion: leads.filter(lead => lead.assigned_to === repId).length > 0 ? 
            (typedStats.deals / leads.filter(lead => lead.assigned_to === repId).length) * 100 : 0
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Client analysis
    const clientAnalysis = deals.reduce((acc, deal) => {
      const clientName = deal.company_name
      if (!acc[clientName]) {
        acc[clientName] = { revenue: 0, deals: 0, lastDeal: deal.created_at }
      }
      if (deal.status === 'closed_won') {
        acc[clientName].revenue += deal.value || 0
      }
      acc[clientName].deals += 1
      if (new Date(deal.created_at) > new Date(acc[clientName].lastDeal)) {
        acc[clientName].lastDeal = deal.created_at
      }
      return acc
    }, {} as Record<string, { revenue: number; deals: number; lastDeal: string }>)

    const topClients = Object.entries(clientAnalysis)
      .map(([clientName, stats]) => {
        const typedStats = stats as { revenue: number; deals: number; lastDeal: string }
        return {
          clientName,
          ...typedStats
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    return NextResponse.json({
      overview: {
        ...overview,
        growth: overviewGrowth
      },
      pipeline,
      monthlyTrends,
      topPerformers,
      topClients,
      filters: {
        timeRange,
        metric,
        rep: repFilter || 'all',
        client: clientFilter || 'all'
      },
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching sales analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
