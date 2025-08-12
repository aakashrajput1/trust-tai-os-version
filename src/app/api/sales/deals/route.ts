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
    const stage = searchParams.get('stage')
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assigned_to')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build the base query
    let query = supabase
      .from('deals')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (stage && stage !== 'all') {
      query = query.eq('stage', stage)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (assignedTo && assignedTo !== 'all') {
      query = query.eq('assigned_to', assignedTo)
    }
    if (search) {
      query = query.or(`deal_name.ilike.%${search}%,company_name.ilike.%${search}%,contact_name.ilike.%${search}%`)
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: deals, error, count } = await query

    if (error) {
      console.error('Error fetching deals:', error)
      return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
    }

    return NextResponse.json({
      deals: deals || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching deals:', error)
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
    if (!body.deal_name || !body.company_name || !body.value) {
      return NextResponse.json({ 
        error: 'Missing required fields: deal_name, company_name, value' 
      }, { status: 400 })
    }

    // Create new deal
    const { data: deal, error } = await supabase
      .from('deals')
      .insert([{
        ...body,
        created_by: user.id,
        assigned_to: body.assigned_to || user.id,
        stage: body.stage || 'prospecting',
        status: body.status || 'open',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating deal:', error)
      return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
    }

    return NextResponse.json({ deal }, { status: 201 })

  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
