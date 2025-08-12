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
    const status = searchParams.get('status')
    const dealId = searchParams.get('deal_id')
    const assignedTo = searchParams.get('assigned_to')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build the base query
    let query = supabase
      .from('quotes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (dealId && dealId !== 'all') {
      query = query.eq('deal_id', dealId)
    }
    if (assignedTo && assignedTo !== 'all') {
      query = query.eq('assigned_to', assignedTo)
    }
    if (search) {
      query = query.or(`quote_number.ilike.%${search}%,deal_name.ilike.%${search}%,company_name.ilike.%${search}%`)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: quotes, error, count } = await query

    if (error) {
      console.error('Error fetching quotes:', error)
      return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
    }

    return NextResponse.json({
      quotes: quotes || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching quotes:', error)
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

    const body = await request.json()
    
    // Validate required fields
    if (!body.deal_id || !body.total_amount || !body.items) {
      return NextResponse.json({ 
        error: 'Missing required fields: deal_id, total_amount, items' 
      }, { status: 400 })
    }

    // Generate quote number
    const quoteNumber = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create new quote
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert([{
        ...body,
        quote_number: quoteNumber,
        created_by: user.id,
        assigned_to: body.assigned_to || user.id,
        status: body.status || 'draft',
        created_at: new Date().toISOString(),
        valid_until: body.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days default
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating quote:', error)
      return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
    }

    return NextResponse.json({ quote }, { status: 201 })

  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
