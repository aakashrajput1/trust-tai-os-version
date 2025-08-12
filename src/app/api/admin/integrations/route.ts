import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: integrations, error } = await supabase
      .from('integrations')
      .select(`
        *,
        logs:integration_logs(
          id,
          status,
          message,
          created_at
        )
      `)
      .order('name')
    
    if (error) throw error
    
    return NextResponse.json({ integrations: integrations || [] })
    
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      type, 
      config, 
      status = 'inactive',
      description 
    } = body
    
    if (!name || !type || !config) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if integration already exists
    const { data: existingIntegration } = await supabase
      .from('integrations')
      .select('id')
      .eq('name', name)
      .single()
    
    if (existingIntegration) {
      return NextResponse.json(
        { error: 'Integration with this name already exists' },
        { status: 409 }
      )
    }
    
    // Create integration
    const { data: integration, error } = await supabase
      .from('integrations')
      .insert({
        name,
        type,
        config,
        status,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin',
        action: 'integration_created',
        details: `Created integration ${name} of type ${type}`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ integration }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating integration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
