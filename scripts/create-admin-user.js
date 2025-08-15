// Script to create an admin user for testing
// Run this with: node scripts/create-admin-user.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@trusttai.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
        role: 'Admin'
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return
    }

    console.log('Auth user created:', authData.user.id)

    // Insert user profile into users table with conflict handling
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        name: 'Admin User',
        email: 'admin@trusttai.com',
        role: 'Admin',
        status: 'active',
        mfa_enabled: false,
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      return
    }

    console.log('User profile created:', profileData)
    console.log('\n✅ Admin user created successfully!')
    console.log('Email: admin@trusttai.com')
    console.log('Password: admin123456')
    console.log('\nYou can now login to the admin panel with these credentials.')

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createAdminUser()



