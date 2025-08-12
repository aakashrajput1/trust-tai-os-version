'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading')
        setMessage('Completing authentication...')

        // Get the current session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          console.error('Session error:', sessionError)
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          setTimeout(() => router.push('/login'), 3000)
          return
        }

        console.log('OAuth authentication successful for user:', session.user.id)

        // Check if user profile exists and has a role
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          console.log('Creating profile for OAuth user...')
          
          const { error: createError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || 
                     session.user.user_metadata?.full_name || 
                     session.user.email!.split('@')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (createError) {
            console.error('Failed to create profile:', createError)
            // Don't fail completely, just log the error
          }
        }

        // Check if user has already selected a role
        if (userProfile?.role) {
          // User has already completed onboarding, redirect to their dashboard
          const rolePath = userProfile.role.toLowerCase().replace(/\s+/g, '-')
          console.log('User has role, redirecting to dashboard:', rolePath)
          setStatus('success')
          setMessage('Redirecting to your dashboard...')
          setTimeout(() => router.push(`/dashboard/${rolePath}`), 1000)
        } else {
          // User hasn't completed onboarding yet
          console.log('User has no role, redirecting to onboarding')
          setStatus('success')
          setMessage('Redirecting to role selection...')
          setTimeout(() => router.push('/onboarding'), 1000)
        }

      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
