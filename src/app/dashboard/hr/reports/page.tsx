'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import {
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Filter,
  Calendar,
  Building,
  UserPlus,
  UserX,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  Settings,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

// Mock data for HR Reports & Analytics
const mockHiringTrends = [
  { month: 'Jan', hired: 8, applied: 45, interviews: 12 },
  { month: 'Feb', hired: 12, applied: 52, interviews: 18 },
  { month: 'Mar', hired: 15, applied: 68, interviews: 25 },
  { month: 'Apr', hired: 10, applied: 41, interviews: 16 },
  { month: 'May', hired: 18, applied: 75, interviews: 28 },
  { month: 'Jun', hired: 22, applied: 89, interviews: 35 }
]

const mockAttritionData = {
  currentYear: 8.5,
  previousYear: 12.3,
  byDepartment: [
    { department: 'Engineering', rate: 6.2, trend: 'down' },
    { department: 'Sales', rate: 11.8, trend: 'up' },
    { department: 'Marketing', rate: 9.1, trend: 'stable' },
    { department: 'Support', rate: 7.5, trend: 'down' }
  ]
}

const mockHeadcountData = {
  total: 156,
  byDepartment: [
    { department: 'Engineering', count: 48, growth: 12.5 },
    { department: 'Sales', count: 35, growth: 8.3 },
    { department: 'Marketing', count: 30, growth: 15.2 },
    { department: 'Support', count: 43, growth: 6.8 }
  ],
  byRole: [
    { role: 'Individual Contributors', count: 89, percentage: 57.1 },
    { role: 'Team Leads', count: 34, percentage: 21.8 },
    { role: 'Managers', count: 22, percentage: 14.1 },
    { role: 'Executives', count: 11, percentage: 7.0 }
  ]
}

const mockLeaveTrends = {
  monthly: [
    { month: 'Jan', sick: 12, casual: 8, unpaid: 3 },
    { month: 'Feb', sick: 15, casual: 10, unpaid: 2 },
    { month: 'Mar', sick: 18, casual: 12, unpaid: 4 },
    { month: 'Apr', sick: 14, casual: 9, unpaid: 3 },
    { month: 'May', sick: 20, casual: 15, unpaid: 5 },
    { month: 'Jun', sick: 16, casual: 11, unpaid: 3 }
  ],
  byDepartment: [
    { department: 'Engineering', avgDays: 3.2, trend: 'stable' },
    { department: 'Sales', avgDays: 4.1, trend: 'up' },
    { department: 'Marketing', avgDays: 2.8, trend: 'down' },
    { department: 'Support', avgDays: 3.5, trend: 'stable' }
  ]
}

const mockPerformanceData = {
  averageRating: 4.2,
  byDepartment: [
    { department: 'Engineering', rating: 4.4, trend: 'up' },
    { department: 'Sales', rating: 3.9, trend: 'stable' },
    { department: 'Marketing', rating: 4.1, trend: 'up' },
    { department: 'Support', rating: 4.3, trend: 'up' }
  ],
  reviewCompletion: 87.5
}

export default function HRReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const { addNotification } = useNotifications()

  const handleExportReport = (type: string) => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: `Generating ${type} report...`
    })
    // In real implementation, this would generate and download the report
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'stable':
        return <Activity className="w-4 h-4 text-gray-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'stable':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/hr"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to HR Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">HR Reports & Analytics</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into workforce metrics and trends
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <button
                onClick={() => handleExportReport('comprehensive')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export All
              </button>
              <Link
                href="/dashboard/hr/settings"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('hiring')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hiring'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2 inline" />
              Hiring Trends
            </button>
            <button
              onClick={() => setActiveTab('attrition')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attrition'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserX className="w-4 h-4 mr-2 inline" />
              Attrition Analysis
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2 inline" />
              Performance Metrics
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{mockHeadcountData.total}</p>
                    <p className="text-sm text-green-600">+12.5% from last year</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hired This Year</p>
                    <p className="text-2xl font-bold text-gray-900">85</p>
                    <p className="text-sm text-green-600">+18.2% from last year</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <UserX className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Attrition Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{mockAttritionData.currentYear}%</p>
                    <p className="text-sm text-green-600">-3.8% from last year</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.averageRating}</p>
                    <p className="text-sm text-green-600">+0.3 from last year</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Headcount */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Department Headcount</h2>
                <button
                  onClick={() => handleExportReport('department-headcount')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Export Report
                </button>
              </div>
              <div className="space-y-4">
                {mockHeadcountData.byDepartment.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                      <span className="text-sm text-gray-500">({dept.count} employees)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Growth:</span>
                      <span className={`text-sm font-medium ${getTrendColor(dept.growth > 0 ? 'up' : 'down')}`}>
                        {dept.growth > 0 ? '+' : ''}{dept.growth}%
                      </span>
                      {getTrendIcon(dept.growth > 0 ? 'up' : 'down')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Distribution */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Role Distribution</h2>
                <button
                  onClick={() => handleExportReport('role-distribution')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Export Report
                </button>
              </div>
              <div className="space-y-4">
                {mockHeadcountData.byRole.map((role) => (
                  <div key={role.role} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{role.role}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">{role.count} employees</span>
                      <span className="text-sm text-gray-500">({role.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hiring Trends Tab */}
        {activeTab === 'hiring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Monthly Hiring Trends</h2>
                <button
                  onClick={() => handleExportReport('hiring-trends')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Export Report
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hired
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interviews
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockHiringTrends.map((trend) => (
                      <tr key={trend.month} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trend.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.hired}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.applied}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trend.interviews}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {((trend.hired / trend.applied) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Total Hired</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {mockHiringTrends.reduce((sum, trend) => sum + trend.hired, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Last 6 months</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Total Applications</h3>
                <div className="text-3xl font-bold text-green-600">
                  {mockHiringTrends.reduce((sum, trend) => sum + trend.applied, 0)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Last 6 months</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Avg Conversion</h3>
                <div className="text-3xl font-bold text-purple-600">
                  {((mockHiringTrends.reduce((sum, trend) => sum + trend.hired, 0) / 
                     mockHiringTrends.reduce((sum, trend) => sum + trend.applied, 0)) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-2">Hired vs Applied</p>
              </div>
            </div>
          </div>
        )}

        {/* Attrition Analysis Tab */}
        {activeTab === 'attrition' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Attrition by Department</h2>
                <button
                  onClick={() => handleExportReport('attrition-analysis')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Export Report
                </button>
              </div>
              <div className="space-y-4">
                {mockAttritionData.byDepartment.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Rate: {dept.rate}%</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(dept.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(dept.trend)}`}>
                          {dept.trend === 'up' ? 'Increasing' : dept.trend === 'down' ? 'Decreasing' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Year-over-Year Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Year</h3>
                <div className="text-3xl font-bold text-red-600">{mockAttritionData.currentYear}%</div>
                <p className="text-sm text-gray-600 mt-2">Overall attrition rate</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Previous Year</h3>
                <div className="text-3xl font-bold text-gray-600">{mockAttritionData.previousYear}%</div>
                <p className="text-sm text-green-600 mt-2">Improved by {mockAttritionData.previousYear - mockAttritionData.currentYear}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance by Department</h2>
                <button
                  onClick={() => handleExportReport('performance-metrics')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Export Report
                </button>
              </div>
              <div className="space-y-4">
                {mockPerformanceData.byDepartment.map((dept) => (
                  <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Rating: {dept.rating}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(dept.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(dept.trend)}`}>
                          {dept.trend === 'up' ? 'Improving' : dept.trend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Average Rating</h3>
                <div className="text-3xl font-bold text-blue-600">{mockPerformanceData.averageRating}</div>
                <p className="text-sm text-gray-600 mt-2">Company-wide average</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Completion</h3>
                <div className="text-3xl font-bold text-green-600">{mockPerformanceData.reviewCompletion}%</div>
                <p className="text-sm text-gray-600 mt-2">Of scheduled reviews</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
