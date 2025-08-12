import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: goals, error } = await supabase
      .from('goals')
      .select(`
        *,
        rewards:goal_rewards(
          id,
          reward_type,
          reward_value,
          trigger_condition,
          is_auto_triggered
        ),
        kpis:goal_kpis(
          id,
          kpi_name,
          target_value,
          current_value,
          measurement_unit
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json({ goals: goals || [] })
    
  } catch (error) {
    console.error('Error fetching goals:', error)
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
      description, 
      target_date, 
      goal_type,
      team_id,
      rewards,
      kpis 
    } = body
    
    if (!name || !description || !target_date || !goal_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .insert({
        name,
        description,
        target_date,
        goal_type,
        team_id,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (goalError) throw goalError
    
    // Create rewards if provided
    if (rewards && Array.isArray(rewards)) {
      const rewardsToInsert = rewards.map((reward: any) => ({
        goal_id: goal.id,
        reward_type: reward.type,
        reward_value: reward.value,
        trigger_condition: reward.condition,
        is_auto_triggered: reward.autoTrigger || false,
        created_at: new Date().toISOString()
      }))
      
      const { error: rewardsError } = await supabase
        .from('goal_rewards')
        .insert(rewardsToInsert)
      
      if (rewardsError) throw rewardsError
    }
    
    // Create KPIs if provided
    if (kpis && Array.isArray(kpis)) {
      const kpisToInsert = kpis.map((kpi: any) => ({
        goal_id: goal.id,
        kpi_name: kpi.name,
        target_value: kpi.target,
        current_value: kpi.current || 0,
        measurement_unit: kpi.unit,
        created_at: new Date().toISOString()
      }))
      
      const { error: kpisError } = await supabase
        .from('goal_kpis')
        .insert(kpisToInsert)
      
      if (kpisError) throw kpisError
    }
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin',
        action: 'goal_created',
        details: `Created goal ${name} with ${rewards?.length || 0} rewards and ${kpis?.length || 0} KPIs`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ goal }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
