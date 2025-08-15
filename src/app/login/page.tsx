'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { LoginPageProtection } from '@/components/ui/LoginPageProtection'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [ssoLoading, setSsoLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  console.log("supabase", supabase)

  const handleSSOLogin = async (provider: 'google' | 'azure') => {
    setSsoLoading(provider)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(`${provider} OAuth error:`, error)
        setError(`Failed to sign in with ${provider}: ${error.message}`)
      } else {
        console.log(`${provider} OAuth success:`, data)
        // The user will be redirected to the OAuth provider
      }
    } catch (error) {
      console.error(`Unexpected ${provider} OAuth error:`, error)
      setError(`An unexpected error occurred with ${provider} sign-in`)
    } finally {
      setSsoLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // Validate name for signup
        if (!name.trim()) {
          setError('Name is required')
          setLoading(false)
          return
        }

        console.log('Starting signup for:', email)

        // Use our custom signup API instead of Supabase auth
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email,
            password: password,
            role: 'user' // Default role for login page signup
          })
        })

        const signUpData = await response.json()
        console.log('Signup response:', signUpData)

        if (!response.ok) {
          console.error('Signup error:', signUpData.error)
          setError(signUpData.error || 'Signup failed')
          return
        }

        if (signUpData.success) {
          console.log('Signup successful, pending admin approval')
          setSuccess('Signup successful! Your account is pending admin approval. You will receive an email notification once approved.')
          
          // Clear form
          setEmail('')
          setPassword('')
          setName('')
          setIsSignUp(false)
          
          // Show success message for 5 seconds
          setTimeout(() => {
            setSuccess(null)
          }, 5000)
        }
      } else {
        // Sign In Logic
        console.log('Starting signin for:', email)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        console.log('Signin response:', { data, error })

        if (error) {
          console.error('Signin error:', error)
          setError(error.message)
        } else if (data.user) {
          console.log('User signed in:', data.user.id)
          
          // Check if user profile exists in users table
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

          console.log('User profile check:', { userProfile, profileError })

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create it for existing user
            console.log('Creating missing profile for existing user')
            
            const { error: createProfileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (createProfileError) {
              console.error('Failed to create profile for existing user:', createProfileError)
              // Don't block login, just log the error
              console.log('Continuing with login despite profile creation failure...')
            }
          }
          
          // Check if user has already selected a role
          if (userProfile?.role) {
            // User has already completed onboarding, redirect to their dashboard
            const rolePath = userProfile.role.toLowerCase().replace(/\s+/g, '-')
            console.log('User has role, redirecting to dashboard:', rolePath)
            router.push(`/dashboard/${rolePath}`)
          } else {
            // User hasn't completed onboarding yet
            console.log('User has no role, redirecting to onboarding')
            router.push('/onboarding')
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Test connection function
  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count', { count: 'exact' })
      console.log('Connection test result:', { data, error })
      
      // Test auth status
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session ? 'Active' : 'None')
      
      return { connected: !error, error }
    } catch (err) {
      console.error('Connection test failed:', err)
      return { connected: false, error: err }
    }
  }

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    // Clear name when switching to sign in
    if (!isSignUp) {
      setName('')
    }
  }

  return (
    <LoginPageProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Join us and start your journey today'
              : 'Sign in to continue to your dashboard'
            }
          </p>
          
          {/* Debug button - remove in production */}
          <button 
            onClick={testConnection}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            Test Connection
          </button>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name field - only show during signup */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required={isSignUp}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className={`${error.includes('Check your email') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-xl p-4`}>
                <p className={`text-sm ${error.includes('Check your email') ? 'text-green-600' : 'text-red-600'}`}>{error}</p>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-green-50 border-green-200 border rounded-xl p-4">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {!loading && <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* SSO Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="mt-6 space-y-3">
            {/* Google SSO */}
            <button
              onClick={() => handleSSOLogin('google')}
              disabled={ssoLoading !== null}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
            >
              {ssoLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                </>
              )}
            </button>

            {/* Microsoft/Azure SSO */}
            <button
              onClick={() => handleSSOLogin('azure')}
              disabled={ssoLoading !== null}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
            >
              {ssoLoading === 'azure' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path fill="#00A4EF" d="M0 0h11.2v11.2H0z"/>
                    <path fill="#F25022" d="M12.8 0H24v11.2H12.8z"/>
                    <path fill="#7FBA00" d="M0 12.8h11.2V24H0z"/>
                    <path fill="#FFB900" d="M12.8 12.8H24V24H12.8z"/>
                  </svg>
                  <span className="font-medium">Continue with Microsoft</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle between sign in and sign up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={handleToggleSignUp}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                {isSignUp ? 'Sign in' : 'Create account'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
    </LoginPageProtection>
  )
}