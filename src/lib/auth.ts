import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUserRole() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null
  
  const { data: userDetails } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()
    
  return userDetails?.role || null
}

export async function redirectIfLoggedIn() {
  const session = await getSession()
  
  if (session) {
    const role = await getUserRole()
    
    if (role) {
      // User has a role, redirect to their dashboard
      const rolePath = role.toLowerCase().replace(/\s+/g, '-')
      return `/dashboard/${rolePath}`
    } else {
      // User doesn't have a role yet, redirect to onboarding
      return '/onboarding'
    }
  }
  
  return null
}

export async function getUserDetails() {
  const supabase = createServerComponentClient({ cookies })
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function requireOnboarding() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const userDetails = await getUserDetails()
  if (!userDetails?.role) {
    redirect('/onboarding')
  }

  return session
} 