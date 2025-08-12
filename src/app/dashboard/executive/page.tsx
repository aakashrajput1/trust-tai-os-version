'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Award,
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  BarChart3,
  Eye,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ExecutiveNav from '@/components/ui/ExecutiveNav'

interface KPI {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
}

interface Department {
  id: string
  name: string
  performance: number
  color: string
}

interface LeaderboardEntry {
  id: string
  name: string
  role: string
  billableHours: number
  avatar: string
}

export default function ExecutiveDashboard() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [kpis, setKpis] = useState<KPI[]>([
    {
      title: 'Revenue',
      value: '$2.4M',
      change: 12.5,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Utilization',
      value: '87%',
      change: -2.1,
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'SLA Compliance',
      value: '94%',
      change: 5.2,
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Team Satisfaction',
      value: '8.7/10',
      change: 1.3,
      icon: <Users className="w-5 h-5" />,
      color: 'text-orange-600'
    }
  ])

  const [departments] = useState<Department[]>([
    { id: '1', name: 'Engineering', performance: 92, color: 'bg-green-500' },
    { id: '2', name: 'Sales', performance: 88, color: 'bg-blue-500' },
    { id: '3', name: 'Marketing', performance: 85, color: 'bg-yellow-500' },
    { id: '4', name: 'Support', performance: 78, color: 'bg-red-500' },
    { id: '5', name: 'HR', performance: 90, color: 'bg-purple-500' },
    { id: '6', name: 'Finance', performance: 95, color: 'bg-indigo-500' }
  ])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { id: '1', name: 'John Smith', role: 'Senior Developer', billableHours: 42, avatar: 'JS' },
    { id: '2', name: 'Sarah Johnson', role: 'Project Manager', billableHours: 38, avatar: 'SJ' },
    { id: '3', name: 'Mike Davis', role: 'Designer', billableHours: 35, avatar: 'MD' },
    { id: '4', name: 'Lisa Wilson', role: 'Developer', billableHours: 33, avatar: 'LW' },
    { id: '5', name: 'Tom Brown', role: 'Analyst', billableHours: 31, avatar: 'TB' }
  ])

  const handleDepartmentClick = (departmentId: string) => {
    router.push(`/dashboard/executive/department/${departmentId}`)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ExecutiveNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Executive Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Welcome back, Executive. Here's your company overview.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Period Selector */}
                  <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                    {['week', 'month', 'quarter'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedPeriod === period
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                  <Button variant="outline" className="flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {kpis.map((kpi, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 rounded-lg ${kpi.color.replace('text-', 'bg-')} bg-opacity-10`}>
                      {kpi.icon}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(kpi.change)}%</span>
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Department Heatmap */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Department Performance</h2>
                    <Button variant="outline" size="sm" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        onClick={() => handleDepartmentClick(dept.id)}
                        className="relative p-3 sm:p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{dept.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">{dept.performance}%</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${dept.color}`}
                              style={{ width: `${dept.performance}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Leaderboard */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Weekly Leaderboard</h2>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">View All</Button>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {leaderboard.map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <span className="text-sm font-semibold text-blue-600">{entry.avatar}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{entry.name}</p>
                            <p className="text-sm text-gray-500 truncate">{entry.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{entry.billableHours}h</p>
                          <p className="text-xs sm:text-sm text-gray-500">This week</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Weekly Summary</h2>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Mail className="w-4 h-4" />
                    <span>Send to Email</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">🎯 Key Achievements</h3>
                      <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                        <li>• Revenue increased by 12.5% this month</li>
                        <li>• Engineering team achieved 92% utilization</li>
                        <li>• SLA compliance improved to 94%</li>
                      </ul>
                    </div>
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">📊 Performance Insights</h3>
                      <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                        <li>• Sales team showing strong momentum</li>
                        <li>• Support team needs attention (78% performance)</li>
                        <li>• Marketing campaigns driving growth</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">⚠️ Areas of Concern</h3>
                      <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                        <li>• Support team performance declining</li>
                        <li>• Utilization rate dropped by 2.1%</li>
                        <li>• Need to address team satisfaction</li>
                      </ul>
                    </div>
                    <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">🚀 Recommendations</h3>
                      <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
                        <li>• Implement support team training</li>
                        <li>• Review utilization strategies</li>
                        <li>• Schedule team building activities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button className="flex items-center justify-center space-x-2 h-12">
                    <Users className="w-4 h-4" />
                    <span>Praise Team</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <BarChart3 className="w-4 h-4" />
                    <span>View All Dashboards</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12 sm:col-span-2 lg:col-span-1">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 