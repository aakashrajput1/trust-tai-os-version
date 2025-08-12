'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RoleCard } from '@/components/ui/RoleCard'
import { Button } from '@/components/ui/Button'
import { updateUserRole } from '@/app/actions/updateRole'
import { 
  Crown, 
  Users, 
  Code, 
  Headphones, 
  HelpCircle, 
  UserCheck, 
  TrendingUp,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react'

const roles = [
  {
    id: 'executive',
    title: 'Executive',
    icon: <Crown className="w-6 h-6" />,
    description: 'Strategic leadership and decision-making for the organization.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    icon: <Users className="w-6 h-6" />,
    description: 'Coordinate and manage project teams and deliverables.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'developer',
    title: 'Developer',
    icon: <Code className="w-6 h-6" />,
    description: 'Build and maintain software applications and systems.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'support-lead',
    title: 'Support Lead',
    icon: <Headphones className="w-6 h-6" />,
    description: 'Lead customer support team and handle complex issues.',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'support-agent',
    title: 'Support Agent',
    icon: <HelpCircle className="w-6 h-6" />,
    description: 'Provide customer support and resolve user issues.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'hr',
    title: 'HR',
    icon: <UserCheck className="w-6 h-6" />,
    description: 'Manage human resources and employee relations.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'sales',
    title: 'Sales',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Drive revenue growth and manage customer relationships.',
    color: 'from-pink-500 to-rose-500'
  }
]

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRoleSelect = (roleTitle: string) => {
    setSelectedRole(roleTitle)
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
    return roles.find(role => role.title === selectedRole)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome! Let's get you set up
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your role to customize your dashboard and experience. 
            You can change this later in your settings.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message - Show when processing */}
        {loading && selectedRole && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <div>
                <h3 className="text-sm font-medium text-green-800">Processing...</h3>
                <p className="text-sm text-green-700 mt-1">Setting up your {selectedRole} dashboard</p>
              </div>
            </div>
          </div>
        )}

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RoleCard
                title={role.title}
                icon={role.icon}
                description={role.description}
                selected={selectedRole === role.title}
                onSelect={() => handleRoleSelect(role.title)}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        {/* Finish Button - Only show when a role is selected */}
        {selectedRole && !loading && (
          <div className="text-center mb-8">
            <div className="inline-flex flex-col items-center space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Selected: {selectedRole}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {getSelectedRoleData()?.description}
                </p>
              </div>
              <Button
                onClick={handleFinish}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Finish Setup</span>
              </Button>
            </div>
          </div>
        )}

        {/* Loading State - More detailed */}
        {loading && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div className="text-left">
                <div className="text-gray-700 font-medium">Setting up your dashboard...</div>
                <div className="text-sm text-gray-500">This will only take a moment</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!loading && !selectedRole && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help choosing? Contact your administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}