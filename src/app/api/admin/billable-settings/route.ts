import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { data: settings, error } = await supabase
      .from('billable_settings')
      .select(`
        *,
        rules:billable_rules(*),
        rates:billing_rates(*)
      `)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        settings: {
          default_hourly_rate: 50,
          overtime_multiplier: 1.5,
          holiday_multiplier: 2.0,
          rules: [],
          rates: []
        }
      })
    }
    
    return NextResponse.json({ settings })
    
  } catch (error) {
    console.error('Error fetching billable settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      default_hourly_rate, 
      overtime_multiplier, 
      holiday_multiplier,
      rules,
      rates 
    } = body
    
    if (!default_hourly_rate || !overtime_multiplier || !holiday_multiplier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('billable_settings')
      .select('id')
      .limit(1)
      .single()
    
    let settingsId: string
    
    if (existingSettings) {
      // Update existing settings
      const { data: updatedSettings, error: updateError } = await supabase
        .from('billable_settings')
        .update({
          default_hourly_rate,
          overtime_multiplier,
          holiday_multiplier,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      settingsId = existingSettings.id
    } else {
      // Create new settings
      const { data: newSettings, error: createError } = await supabase
        .from('billable_settings')
        .insert({
          default_hourly_rate,
          overtime_multiplier,
          holiday_multiplier,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (createError) throw createError
      settingsId = newSettings.id
    }
    
    // Update rules if provided
    if (rules && Array.isArray(rules)) {
      // Delete existing rules
      await supabase
        .from('billable_rules')
        .delete()
        .eq('settings_id', settingsId)
      
      // Insert new rules
      if (rules.length > 0) {
        const rulesToInsert = rules.map((rule: any) => ({
          settings_id: settingsId,
          rule_type: rule.type,
          rule_name: rule.name,
          rule_condition: rule.condition,
          rule_value: rule.value,
          is_billable: rule.isBillable,
          created_at: new Date().toISOString()
        }))
        
        const { error: rulesError } = await supabase
          .from('billable_rules')
          .insert(rulesToInsert)
        
        if (rulesError) throw rulesError
      }
    }
    
    // Update rates if provided
    if (rates && Array.isArray(rates)) {
      // Delete existing rates
      await supabase
        .from('billing_rates')
        .delete()
        .eq('settings_id', settingsId)
      
      // Insert new rates
      if (rates.length > 0) {
        const ratesToInsert = rates.map((rate: any) => ({
          settings_id: settingsId,
          role_id: rate.roleId,
          project_type: rate.projectType,
          hourly_rate: rate.hourlyRate,
          created_at: new Date().toISOString()
        }))
        
        const { error: ratesError } = await supabase
          .from('billing_rates')
          .insert(ratesToInsert)
        
        if (ratesError) throw ratesError
      }
    }
    
    // Log the action
    await supabase
      .from('audit_logs')
      .insert({
        user_id: 'admin',
        action: 'billable_settings_updated',
        details: `Updated billable settings with ${rules?.length || 0} rules and ${rates?.length || 0} rates`,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
    
    return NextResponse.json({ 
      message: 'Billable settings updated successfully',
      settingsId 
    })
    
  } catch (error) {
    console.error('Error updating billable settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
