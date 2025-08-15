'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { updateUserRole } from '@/app/actions/updateRole'
import { 
  Crown, 
  Users, 
  Code, 
  Headphones, 
  HelpCircle, 
  UserCheck, 
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useRoles } from '@/hooks/useRoles'

// Icon mapping for dynamic roles
const iconMap: { [key: string]: any } = {
  'Crown': Crown,
  'Users': Users,
  'Code': Code,
  'Headphones': Headphones,
  'HelpCircle': HelpCircle,
  'UserCheck': UserCheck,
  'TrendingUp': TrendingUp,
  'Shield': Crown, // Default for admin
}

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { roles, loading: rolesLoading, error: rolesError } = useRoles()

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName)
    setError(null) // Clear any previous errors
  }

  const handleFinish = async () => {
    if (!selectedRole) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Calling updateUserRole with role:', selectedRole)
      const result = await updateUserRole(selectedRole)
      
      console.log('Result from updateUserRole:', result)
      
      if (result?.success && result?.rolePath) {
        console.log('Navigating to:', result.rolePath)
        
        // Add a small delay to show success state
        setTimeout(() => {
          router.push(result.rolePath)
          // Note: Don't set loading to false here as navigation will unmount this component
        }, 500)
      } else {
        throw new Error('Failed to update role - no success response')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setLoading(false) // Only set loading to false on error
    }
  }

  const getSelectedRoleData = () => {
    return roles.find(role => role.name === selectedRole)
  }

  // Render loading state while fetching roles
  if (rolesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    )
  }

  // Render error state if roles failed to load
  if (rolesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Roles</h2>
          <p className="text-gray-600 mb-4">{rolesError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Trust TAI OS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's get you set up! Choose your role to customize your experience and access the right tools for your work.
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Select Your Role
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const IconComponent = iconMap[role.icon_name || 'Users'] || Users
              const isSelected = selectedRole === role.name
              
              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.name)}
                  className={`
                    relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${role.color_scheme || 'from-gray-500 to-gray-600'} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {role.display_name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {role.description || 'No description available'}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Continue button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleFinish}
              disabled={!selectedRole || loading}
              className={`
                px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
                ${selectedRole && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Setting up...
                </div>
              ) : (
                'Continue to Dashboard'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>You can change your role later in your profile settings.</p>
        </div>
      </div>
    </div>
  )
}