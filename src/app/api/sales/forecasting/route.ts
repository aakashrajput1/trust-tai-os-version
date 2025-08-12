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
    const period = searchParams.get('period') || 'quarter'
    const repFilter = searchParams.get('rep')
    const stageFilter = searchParams.get('stage')

    // Calculate date ranges based on period
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }

    // Build the base query for deals
    let dealsQuery = supabase
      .from('deals')
      .select('*')
      .gte('expected_close_date', startDate.toISOString())
      .lte('expected_close_date', endDate.toISOString())

    // Apply filters
    if (repFilter && repFilter !== 'all') {
      dealsQuery = dealsQuery.eq('assigned_to', repFilter)
    }
    if (stageFilter && stageFilter !== 'all') {
      dealsQuery = dealsQuery.eq('stage', stageFilter)
    }

    const { data: deals, error: dealsError } = await dealsQuery

    if (dealsError) {
      console.error('Error fetching deals for forecasting:', dealsError)
      return NextResponse.json({ error: 'Failed to fetch deals data' }, { status: 500 })
    }

    const dealsData = deals || []

    // Calculate forecasting metrics
    const totalPipelineValue = dealsData.reduce((sum, deal) => sum + (deal.value || 0), 0)
    
    const stageBreakdown = {
      prospecting: dealsData.filter(deal => deal.stage === 'prospecting').reduce((sum, deal) => sum + (deal.value || 0), 0),
      proposal: dealsData.filter(deal => deal.stage === 'proposal').reduce((sum, deal) => sum + (deal.value || 0), 0),
      negotiation: dealsData.filter(deal => deal.stage === 'negotiation').reduce((sum, deal) => sum + (deal.value || 0), 0),
      closedWon: dealsData.filter(deal => deal.status === 'closed_won').reduce((sum, deal) => sum + (deal.value || 0), 0)
    }

    // Calculate win probability by stage
    const winProbabilities = {
      prospecting: 0.1, // 10%
      proposal: 0.3,    // 30%
      negotiation: 0.7, // 70%
      closedWon: 1.0    // 100%
    }

    // Calculate weighted forecast
    const weightedForecast = Object.entries(stageBreakdown).reduce((sum, [stage, value]) => {
      return sum + (value * (winProbabilities[stage as keyof typeof winProbabilities] || 0))
    }, 0)

    // Monthly breakdown for the period
    const monthlyBreakdown = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const monthDeals = dealsData.filter(deal => {
        const closeDate = new Date(deal.expected_close_date)
        return closeDate >= monthStart && closeDate <= monthEnd
      })
      
      monthlyBreakdown.push({
        month: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value: monthDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
        count: monthDeals.length,
        weightedValue: monthDeals.reduce((sum, deal) => {
          const stage = deal.stage as keyof typeof winProbabilities
          return sum + ((deal.value || 0) * (winProbabilities[stage] || 0))
        }, 0)
      })
      
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Top deals by value
    const topDeals = dealsData
      .sort((a, b) => (b.value || 0) - (a.value || 0))
      .slice(0, 10)
      .map(deal => ({
        id: deal.id,
        deal_name: deal.deal_name,
        company_name: deal.company_name,
        value: deal.value,
        stage: deal.stage,
        expected_close_date: deal.expected_close_date,
        probability: winProbabilities[deal.stage as keyof typeof winProbabilities] || 0,
        weighted_value: (deal.value || 0) * (winProbabilities[deal.stage as keyof typeof winProbabilities] || 0)
      }))

    return NextResponse.json({
      forecasting: {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPipelineValue,
        weightedForecast: Math.round(weightedForecast * 100) / 100,
        confidence: Math.round((weightedForecast / totalPipelineValue) * 100)
      },
      stageBreakdown,
      monthlyBreakdown,
      topDeals,
      filters: {
        rep: repFilter || 'all',
        stage: stageFilter || 'all'
      }
    })

  } catch (error) {
    console.error('Error fetching sales forecasting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
