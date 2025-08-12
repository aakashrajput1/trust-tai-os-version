'use client'

import { useState, useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'
import { 
  Users, 
  Shield, 
  Clock, 
  Settings, 
  Target, 
  FileText, 
  Activity, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  User
} from 'lucide-react'
import { NotificationDropdown } from '@/components/ui/NotificationDropdown'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Activity },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Roles & Permissions', href: '/admin/roles', icon: Shield },
  { name: 'Billable Hours', href: '/admin/billable', icon: Clock },
  { name: 'Integrations', href: '/admin/integrations', icon: Settings },
  { name: 'Goals & Rewards', href: '/admin/goals', icon: Target },
  { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
  { name: 'System Health', href: '/admin/system-health', icon: Activity },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()


  // Check if current page is login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Only check user if not on login page
    if (!isLoginPage) {
      checkUser()
    } else {
      setLoading(false)
    }
  }, [isLoginPage])

  const checkUser = async () => {
    try {
      // Check if admin data exists in localStorage (from our custom login)
      const adminData = localStorage.getItem('adminData')
      
      if (!adminData) {
        router.push('/admin/login')
        return
      }

      const admin = JSON.parse(adminData)
      
      // Check if admin is still valid
      if (!admin || !admin.email || admin.status !== 'active') {
        localStorage.removeItem('adminData')
        router.push('/admin/login')
        return
      }

      setUser(admin)
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('adminData')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    // Clear admin data from localStorage
    localStorage.removeItem('adminData')
    router.push('/admin/login')
  }

  // If on login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </a>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Admin Portal</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </a>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
