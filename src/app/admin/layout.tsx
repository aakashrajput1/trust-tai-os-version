'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  Shield, 
  FileText, 
  Activity, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  User,
  BarChart3,
  Database,
  Globe,
  Target,
  Award,
  Clock,
  Lock,
  Eye,
  Building,
  Smartphone,
  FolderOpen,
  Brain,
  HelpCircle
} from 'lucide-react'
import { RealTimeNotificationProvider, NotificationBell } from '@/components/ui/RealTimeNotificationProvider'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Approvals', href: '/admin/approvals', icon: Clock },
  { name: 'Roles', href: '/admin/roles', icon: Shield },
  { name: 'Audit', href: '/admin/audit', icon: FileText },
  { name: 'System Health', href: '/admin/system-health', icon: Activity },
  { name: 'Integrations', href: '/admin/integrations', icon: Globe },
  { name: 'Goals & Rewards', href: '/admin/goals', icon: Target },
  { name: 'Billable Settings', href: '/admin/billable', icon: Award },
  { name: 'Client Management', href: '/admin/clients', icon: Building },
  { name: 'Projects & Tasks', href: '/admin/projects', icon: FolderOpen },
  { name: 'AI Configuration', href: '/admin/ai', icon: Brain },
  { name: 'Security & Compliance', href: '/admin/security', icon: Lock },
  { name: 'Mobile & Notifications', href: '/admin/notifications', icon: Smartphone },
  { name: 'Help & Support', href: '/admin/help', icon: HelpCircle },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminData, setAdminData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Move useEffect before any conditional returns
  useEffect(() => {
    // Only check session if not on login page
    if (pathname !== '/admin/login') {
      checkAdminSession()
    } else {
      setLoading(false)
    }
  }, [pathname])

  const checkAdminSession = async () => {
    try {
      console.log('Checking admin session...')
      const storedData = localStorage.getItem('adminData')
      console.log('Stored admin data:', storedData)
      
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        console.log('Parsed admin data:', parsedData)
        
        // Check if the session is still valid (client-side only for now)
        if (parsedData.expiresAt && new Date(parsedData.expiresAt) > new Date()) {
          console.log('Admin session is valid, setting admin data')
          setAdminData(parsedData)
          setLoading(false)
        } else {
          console.log('Admin session expired, redirecting to login')
          localStorage.removeItem('adminData')
          router.push('/admin/login')
        }
      } else {
        console.log('No admin data found, redirecting to login')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error checking admin session:', error)
      localStorage.removeItem('adminData')
      router.push('/admin/login')
    }
  }

  const handleSignOut = async () => {
    try {
      // Call logout API to invalidate session
      const storedData = localStorage.getItem('adminData')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionToken: parsedData.sessionToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('adminData')
      router.push('/admin/login')
    }
  }

  // If we're on the login page, don't apply the admin layout
  if (pathname === '/admin/login') {
    console.log('On admin login page, rendering without layout')
    return <>{children}</>
  }

  console.log('Admin layout pathname:', pathname)
  console.log('Admin layout loading:', loading)
  console.log('Admin layout adminData:', adminData)
  console.log('Admin layout will render with sidebar')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!adminData) {
    return null
  }

  return (
    <RealTimeNotificationProvider adminId={adminData.id}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top navigation */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Real-time Notifications */}
              <NotificationBell />

              {/* Admin Profile */}
              <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-x-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{adminData.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Sign Out</span>
                </button>
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
    </RealTimeNotificationProvider>
  )
}
