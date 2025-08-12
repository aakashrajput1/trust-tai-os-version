'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Calendar,
  Settings,
  Menu,
  X,
  Home,
  Bell,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  DollarSign,
  FileText,
  PieChart,
  Activity,
  Building,
  UserCheck
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  description?: string
  badge?: string
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/sales',
    icon: <Home className="w-5 h-5" />,
    description: 'Sales overview and metrics'
  },
  {
    name: 'Leads Management',
    href: '/dashboard/sales/leads',
    icon: <Users className="w-5 h-5" />,
    description: 'Manage sales leads'
  },
  {
    name: 'Deals Pipeline',
    href: '/dashboard/sales/deals',
    icon: <Target className="w-5 h-5" />,
    description: 'Track deal progress'
  },
  {
    name: 'Revenue Forecasting',
    href: '/dashboard/sales/forecast',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Revenue predictions'
  },
  {
    name: 'Client Accounts',
    href: '/dashboard/sales/accounts',
    icon: <Building className="w-5 h-5" />,
    description: 'Customer management'
  },
  {
    name: 'Activity Tracker',
    href: '/dashboard/sales/activities',
    icon: <Activity className="w-5 h-5" />,
    description: 'Sales activities log'
  },
  {
    name: 'Reports & Analytics',
    href: '/dashboard/sales/reports',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Sales insights and trends'
  },
  {
    name: 'Profile & Settings',
    href: '/dashboard/sales/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Profile and preferences'
  }
]

export default function SalesNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('user')
    sessionStorage.clear()
    
    // Redirect to login page
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col bg-white shadow-xl">
          {/* Mobile sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Sales Portal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-500 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <div className="mr-3 text-gray-400 group-hover:text-gray-500">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-green-500" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile user menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sales Rep</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
            {/* Desktop sidebar header */}
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Sales Portal</span>
              </div>
            </div>

            {/* Desktop navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-green-100 text-green-700 border-r-2 border-green-500 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <div className={`mr-3 transition-colors ${
                      isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      )}
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-green-500" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop user menu */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sales Rep</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page title - hidden on mobile when sidebar is open */}
            <div className={`lg:hidden ${sidebarOpen ? 'hidden' : 'block'}`}>
              <h1 className="text-lg font-semibold text-gray-900">Sales Portal</h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">Sales Rep</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/dashboard/sales/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
