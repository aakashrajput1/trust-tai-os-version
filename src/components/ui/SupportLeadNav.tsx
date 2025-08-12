'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Headphones, 
  Ticket, 
  Clock, 
  Users, 
  AlertTriangle,
  Settings,
  Menu,
  X,
  Home,
  TrendingUp,
  Bell,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Calendar,
  FileText,
  Target,
  BarChart3
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
    href: '/dashboard/support-lead',
    icon: <Home className="w-5 h-5" />,
    description: 'Overview and metrics'
  },
  {
    name: 'Ticket Queue',
    href: '/dashboard/support-lead/tickets',
    icon: <Ticket className="w-5 h-5" />,
    description: 'All team tickets'
  },
  {
    name: 'SLA Tracking',
    href: '/dashboard/support-lead/sla',
    icon: <Clock className="w-5 h-5" />,
    description: 'SLA compliance & breaches'
  },
  {
    name: 'Team Load',
    href: '/dashboard/support-lead/team-load',
    icon: <Users className="w-5 h-5" />,
    description: 'Agent workload view'
  },
  {
    name: 'Escalations',
    href: '/dashboard/support-lead/escalations',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Approvals & escalations'
  },
  {
    name: 'Reports',
    href: '/dashboard/support-lead/reports',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Support metrics'
  },
  {
    name: 'Settings',
    href: '/dashboard/support-lead/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Profile and preferences'
  }
]

export default function SupportLeadNav() {
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
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard/support-lead" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Support Lead</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={`mr-3 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                  {item.badge && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">Sarah Support Lead</p>
                  <p className="text-xs text-gray-500 truncate">sarah@company.com</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar for mobile */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Support Lead</span>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Content wrapper */}
        <div className="flex-1 overflow-auto">
          {/* Spacer for mobile top bar */}
          <div className="lg:hidden h-16"></div>
        </div>
      </div>
    </div>
  )
}

