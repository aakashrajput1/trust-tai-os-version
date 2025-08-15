'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface LoginPageProtectionProps {
  children: React.ReactNode
  isAdmin?: boolean
}

export function LoginPageProtection({ children, isAdmin = false }: LoginPageProtectionProps) {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAdmin) {
          // Check if admin data exists in localStorage
          const adminData = localStorage.getItem('adminData')
          
          if (adminData) {
            // Admin is logged in, redirect to admin dashboard
            router.push('/admin/dashboard')
            return
          }
        }

        // Check Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          if (isAdmin) {
            // Check if user has admin role
            const { data: userProfile } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single()

            if (userProfile?.role === 'Admin') {
              // User has admin role, redirect to admin dashboard
              router.push('/admin/dashboard')
              return
            }
          } else {
            // Regular user is logged in, check their role and redirect
            const { data: userProfile } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single()

            if (userProfile?.role) {
              // User has a role, redirect to their dashboard
              const rolePath = userProfile.role.toLowerCase().replace(/\s+/g, '-')
              router.push(`/dashboard/${rolePath}`)
            } else {
              // User doesn't have a role yet, redirect to onboarding
              router.push('/onboarding')
            }
            return
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [supabase.auth, router, isAdmin])

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
