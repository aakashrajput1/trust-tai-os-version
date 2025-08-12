'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import SupportLeadNav from '@/components/ui/SupportLeadNav'
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react'

// Mock report data
const mockReportData = {
  summary: {
    totalTickets: 1247,
    resolvedTickets: 1154,
    avgResolutionTime: 4.2,
    slaCompliance: 92.5,
    customerSatisfaction: 4.8,
    teamEfficiency: 87.3
  },
  trends: {
    daily: [
      { date: '2024-01-20', tickets: 45, resolved: 42, breaches: 3 },
      { date: '2024-01-21', tickets: 52, resolved: 48, breaches: 4 },
      { date: '2024-01-22', tickets: 38, resolved: 36, breaches: 2 },
      { date: '2024-01-23', tickets: 61, resolved: 58, breaches: 3 },
      { date: '2024-01-24', tickets: 49, resolved: 47, breaches: 2 },
      { date: '2024-01-25', tickets: 55, resolved: 52, breaches: 3 },
      { date: '2024-01-26', tickets: 42, resolved: 40, breaches: 2 }
    ],
    weekly: [
      { week: 'Week 1', tickets: 320, resolved: 298, breaches: 22 },
      { week: 'Week 2', tickets: 345, resolved: 325, breaches: 20 },
      { week: 'Week 3', tickets: 312, resolved: 295, breaches: 17 },
      { week: 'Week 4', tickets: 358, resolved: 336, breaches: 22 }
    ]
  },
  teamPerformance: [
    {
      team: 'Technical Support',
      agents: 8,
      ticketsHandled: 456,
      avgResolutionTime: 3.8,
      slaCompliance: 94.2,
      satisfaction: 4.7
    },
    {
      team: 'General Support',
      agents: 12,
      ticketsHandled: 523,
      avgResolutionTime: 4.5,
      slaCompliance: 91.8,
      satisfaction: 4.6
    },
    {
      team: 'Security Team',
      agents: 5,
      ticketsHandled: 268,
      avgResolutionTime: 5.2,
      slaCompliance: 89.5,
      satisfaction: 4.4
    }
  ],
  topIssues: [
    { issue: 'Login Authentication', count: 156, avgResolution: 2.3, priority: 'high' },
    { issue: 'Payment Processing', count: 134, avgResolution: 4.1, priority: 'critical' },
    { issue: 'API Timeout', count: 98, avgResolution: 3.7, priority: 'medium' },
    { issue: 'Database Connection', count: 87, avgResolution: 5.2, priority: 'high' },
    { issue: 'Mobile App Crashes', count: 76, avgResolution: 2.8, priority: 'medium' }
  ]
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [selectedReport, setSelectedReport] = useState('overview')
  const { addNotification } = useNotifications()

  const exportReport = (format: 'csv' | 'pdf' | 'excel') => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: `Exporting ${selectedReport} report as ${format.toUpperCase()}`
    })
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300'
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300'
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300'
      case 'low': return 'text-green-700 bg-green-100 border-green-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600'
    if (compliance >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <SupportLeadNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center mb-3 sm:mb-4">
            <Link 
              href="/dashboard/support-lead"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Support Reports</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Comprehensive analytics and performance insights
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <button 
                onClick={() => exportReport('pdf')}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              
              <button 
                onClick={() => exportReport('excel')}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export Excel</span>
                <span className="sm:hidden">Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setSelectedReport('overview')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  selectedReport === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setSelectedReport('trends')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  selectedReport === 'trends'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <LineChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Trends
                </div>
              </button>
              <button
                onClick={() => setSelectedReport('teams')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  selectedReport === 'teams'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Team Performance
                </div>
              </button>
              <button
                onClick={() => setSelectedReport('issues')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  selectedReport === 'issues'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Top Issues
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on selected report */}
        {selectedReport === 'overview' && (
          <>
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Tickets</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {mockReportData.summary.totalTickets.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Resolved</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                        {mockReportData.summary.resolvedTickets.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Avg Resolution</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {mockReportData.summary.avgResolutionTime}h
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">SLA Compliance</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className={`text-lg sm:text-xl lg:text-2xl font-bold ${getComplianceColor(mockReportData.summary.slaCompliance)}`}>
                        {mockReportData.summary.slaCompliance}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
                    <Target className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Satisfaction</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {mockReportData.summary.customerSatisfaction}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Team Efficiency</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {mockReportData.summary.teamEfficiency}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Performance Highlights</h2>
                </div>
                
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">SLA Compliance Improved</p>
                        <p className="text-xs text-green-600">Up 2.1% from last period</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Resolution Time Reduced</p>
                        <p className="text-xs text-blue-600">Down 0.5h from last period</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Critical Issues Increased</p>
                        <p className="text-xs text-yellow-600">Up 15% from last period</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recommendations</h2>
                </div>
                
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Increase Security Team Resources</h3>
                      <p className="text-xs text-gray-600">Security tickets showing higher breach rates</p>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Implement Payment Gateway Monitoring</h3>
                      <p className="text-xs text-gray-600">Payment issues causing critical SLA breaches</p>
                    </div>
                    
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Enhance Mobile App Testing</h3>
                      <p className="text-xs text-gray-600">Mobile crashes affecting user experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedReport === 'trends' && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Daily Trends */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Daily Ticket Trends</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-4">
                  <div className="text-center">
                    <LineChart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Daily trends chart would be rendered here</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {mockReportData.trends.daily.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="text-sm font-bold text-gray-900">{day.tickets}</div>
                      <div className="text-xs text-green-600">{day.resolved} resolved</div>
                      <div className="text-xs text-red-600">{day.breaches} breaches</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Trends */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Weekly Performance</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {mockReportData.trends.weekly.map((week, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{week.week}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {week.tickets} tickets • {week.resolved} resolved
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-gray-900">{week.resolved}</div>
                        <div className="text-xs text-red-600">{week.breaches} breaches</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'teams' && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Team Performance Table */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Performance Overview</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Team</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Agents</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tickets</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Avg Time</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">SLA %</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockReportData.teamPerformance.map((team, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{team.team}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">{team.agents}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">{team.ticketsHandled}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">{team.avgResolutionTime}h</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`text-sm font-medium ${getComplianceColor(team.slaCompliance)}`}>
                            {team.slaCompliance}%
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">{team.satisfaction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Efficiency Chart */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Efficiency Comparison</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Team efficiency chart would be rendered here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'issues' && (
          <div className="space-y-4 sm:space-y-6 lg:gap-8">
            {/* Top Issues Table */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Top Issues by Volume</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Issue Type</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Count</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Avg Resolution</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockReportData.topIssues.map((issue, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{issue.issue}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">{issue.count}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">{issue.avgResolution}h</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(issue.priority)}`}>
                            {issue.priority}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <button className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Issue Distribution Chart */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Issue Distribution</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Issue distribution chart would be rendered here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
