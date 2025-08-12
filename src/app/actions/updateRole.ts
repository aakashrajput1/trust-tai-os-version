'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function updateUserRole(role: string) {
  const supabase = createServerActionClient({ cookies })
  
  try {
    console.log('Starting updateUserRole for role:', role)
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('User authentication error:', userError)
      throw new Error('User not authenticated')
    }

    console.log('User authenticated:', user.id)

    // Update user role - user should exist due to trigger
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        role: role,
        role_selected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      
      // If user doesn't exist (edge case), create them
      if (updateError.code === 'PGRST116') {
        console.log('User not found, creating profile...')
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.user_metadata?.full_name || '',
            role: role,
            role_selected_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Insert error:', insertError)
          throw new Error(`Failed to create user profile: ${insertError.message}`)
        }
      } else {
        throw new Error(`Failed to update user role: ${updateError.message}`)
      }
    }

    console.log('User role updated successfully')

    // Return success response with the role path for client-side navigation
    const rolePath = role.toLowerCase().replace(/\s+/g, '-')
    const result = { success: true, rolePath: `/dashboard/${rolePath}` }
    console.log('Returning result:', result)
    return result
    
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}