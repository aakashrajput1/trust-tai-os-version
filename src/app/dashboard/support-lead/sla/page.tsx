'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import SupportLeadNav from '@/components/ui/SupportLeadNav'
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  CheckCircle,
  XCircle,
  Eye,
  FileText
} from 'lucide-react'

// Mock SLA data
const mockSlaMetrics = {
  overall: {
    compliance: 92.5,
    totalTickets: 1247,
    compliantTickets: 1154,
    breachedTickets: 93,
    averageResolutionTime: 4.2, // hours
    trend: 2.1 // percentage change
  },
  byPriority: {
    critical: { compliance: 85.0, target: 95.0, avgTime: 1.8, breaches: 12 },
    high: { compliance: 90.5, target: 90.0, avgTime: 3.2, breaches: 28 },
    medium: { compliance: 94.2, target: 85.0, avgTime: 6.1, breaches: 35 },
    low: { compliance: 97.8, target: 80.0, avgTime: 12.5, breaches: 18 }
  },
  byTeam: {
    'Integration Team': { compliance: 88.5, tickets: 156, breaches: 18 },
    'Security Team': { compliance: 91.2, tickets: 203, breaches: 18 },
    'Infrastructure Team': { compliance: 95.8, tickets: 298, breaches: 12 },
    'Database Team': { compliance: 89.3, tickets: 187, breaches: 20 },
    'API Team': { compliance: 94.1, tickets: 234, breaches: 14 },
    'Mobile Team': { compliance: 92.7, tickets: 169, breaches: 11 }
  },
  byClient: {
    'TechStart Inc.': { compliance: 87.5, tickets: 124, breaches: 15 },
    'Digital Solutions Ltd': { compliance: 93.2, tickets: 156, breaches: 11 },
    'Enterprise Corp': { compliance: 89.8, tickets: 203, breaches: 21 },
    'StartUp Hub': { compliance: 95.1, tickets: 87, breaches: 4 },
    'Mobile Tech Co': { compliance: 91.3, tickets: 98, breaches: 9 }
  }
}

const mockBreachedTickets = [
  {
    id: 'TK-2024-002',
    title: 'User authentication not working',
    client: 'Digital Solutions Ltd',
    priority: 'critical',
    team: 'Security Team',
    assignee: 'Mike Rodriguez',
    breachTime: 15, // minutes over SLA
    created: '2024-01-25T15:15:00Z',
    slaDeadline: '2024-01-25T15:45:00Z',
    resolvedAt: null,
    breachReason: 'Complex OAuth provider issue requiring escalation'
  },
  {
    id: 'TK-2024-025',
    title: 'Database performance degradation',
    client: 'Enterprise Corp',
    priority: 'high',
    team: 'Database Team',
    assignee: 'David Wilson',
    breachTime: 45,
    created: '2024-01-25T12:00:00Z',
    slaDeadline: '2024-01-25T14:00:00Z',
    resolvedAt: '2024-01-25T14:45:00Z',
    breachReason: 'Required emergency maintenance window'
  },
  {
    id: 'TK-2024-018',
    title: 'Payment processing errors',
    client: 'TechStart Inc.',
    priority: 'critical',
    team: 'Integration Team',
    assignee: 'Sarah Chen',
    breachTime: 30,
    created: '2024-01-25T09:30:00Z',
    slaDeadline: '2024-01-25T10:00:00Z',
    resolvedAt: '2024-01-25T10:30:00Z',
    breachReason: 'Third-party payment gateway outage'
  },
  {
    id: 'TK-2024-031',
    title: 'Mobile app login failures',
    client: 'Mobile Tech Co',
    priority: 'high',
    team: 'Mobile Team',
    assignee: 'Anna Kim',
    breachTime: 120,
    created: '2024-01-24T16:00:00Z',
    slaDeadline: '2024-01-24T18:00:00Z',
    resolvedAt: '2024-01-24T20:00:00Z',
    breachReason: 'iOS specific bug requiring Apple developer support'
  },
  {
    id: 'TK-2024-027',
    title: 'API rate limiting issues',
    client: 'DevCorp Solutions',
    priority: 'medium',
    team: 'API Team',
    assignee: 'Emma Davis',
    breachTime: 240,
    created: '2024-01-24T10:00:00Z',
    slaDeadline: '2024-01-24T14:00:00Z',
    resolvedAt: '2024-01-24T18:00:00Z',
    breachReason: 'Complex rate limiting configuration required'
  }
]

const mockComplianceTrend = [
  { date: '2024-01-18', compliance: 89.2, breaches: 8 },
  { date: '2024-01-19', compliance: 91.5, breaches: 6 },
  { date: '2024-01-20', compliance: 88.7, breaches: 9 },
  { date: '2024-01-21', compliance: 93.1, breaches: 5 },
  { date: '2024-01-22', compliance: 90.8, breaches: 7 },
  { date: '2024-01-23', compliance: 94.2, breaches: 4 },
  { date: '2024-01-24', compliance: 92.5, breaches: 6 },
  { date: '2024-01-25', compliance: 92.5, breaches: 8 }
]

export default function SlaTrackingPage() {
  const [timeRange, setTimeRange] = useState('week')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [viewMode, setViewMode] = useState('overview') // overview, breaches, trends
  const { addNotification } = useNotifications()

  const refreshData = () => {
    addNotification({
      type: 'info',
      title: 'Data Refreshed',
      message: 'Latest SLA metrics have been loaded'
    })
  }

  const exportReport = (format: 'csv' | 'pdf') => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: `Exporting SLA report as ${format.toUpperCase()}`
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

  const getComplianceColor = (compliance: number, target: number) => {
    if (compliance >= target) return 'text-green-700'
    if (compliance >= target - 5) return 'text-yellow-700'
    return 'text-red-700'
  }

  const formatBreachTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">SLA Tracking & Breach Overview</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Monitor SLA compliance across teams, clients, and priorities
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <button 
                onClick={refreshData}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button 
                onClick={() => exportReport('csv')}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
              
              <button 
                onClick={() => exportReport('pdf')}
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-3 sm:px-6 overflow-x-auto">
              <button
                onClick={() => setViewMode('overview')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  viewMode === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setViewMode('breaches')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  viewMode === 'breaches'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Breaches ({mockBreachedTickets.length})
                </div>
              </button>
              <button
                onClick={() => setViewMode('trends')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  viewMode === 'trends'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Trends
                </div>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Teams</option>
                {Object.keys(mockSlaMetrics.byTeam).map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>

              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Clients</option>
                {Object.keys(mockSlaMetrics.byClient).map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {timeRange === 'today' ? 'Today' : 
                   timeRange === 'week' ? 'This Week' :
                   timeRange === 'month' ? 'This Month' : 'This Quarter'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'overview' && (
          <>
            {/* Overall Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Overall Compliance</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-green-600">
                        {mockSlaMetrics.overall.compliance}%
                      </span>
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 ml-1 sm:ml-2" />
                      <span className="text-xs sm:text-sm text-green-500 ml-1">
                        +{mockSlaMetrics.overall.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                    <Target className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Total Tickets</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                        {mockSlaMetrics.overall.totalTickets.toLocaleString()}
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
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Breached Tickets</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-red-600">
                        {mockSlaMetrics.overall.breachedTickets}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600">Avg Resolution</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
                        {mockSlaMetrics.overall.averageResolutionTime}h
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border mb-4 sm:mb-6 lg:mb-8">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">SLA Compliance by Priority</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {Object.entries(mockSlaMetrics.byPriority).map(([priority, data]) => (
                    <div key={priority} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}>
                          {priority}
                        </span>
                        <span className={`text-xs sm:text-sm font-medium ${getComplianceColor(data.compliance, data.target)}`}>
                          Target: {data.target}%
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span>Compliance</span>
                          <span className={`font-medium ${getComplianceColor(data.compliance, data.target)}`}>
                            {data.compliance}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              data.compliance >= data.target ? 'bg-green-500' : 
                              data.compliance >= data.target - 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(data.compliance, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Avg Time: {data.avgTime}h</div>
                        <div>Breaches: {data.breaches}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Team Performance</h2>
                </div>
                
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(mockSlaMetrics.byTeam).map(([team, data]) => (
                      <div key={team} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{team}</div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {data.tickets} tickets • {data.breaches} breaches
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-base sm:text-lg font-bold ${getComplianceColor(data.compliance, 90)}`}>
                            {data.compliance}%
                          </div>
                          <div className="text-xs text-gray-500">compliance</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
                <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Client Performance</h2>
                </div>
                
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(mockSlaMetrics.byClient).map(([client, data]) => (
                      <div key={client} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{client}</div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {data.tickets} tickets • {data.breaches} breaches
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-base sm:text-lg font-bold ${getComplianceColor(data.compliance, 90)}`}>
                            {data.compliance}%
                          </div>
                          <div className="text-xs text-gray-500">compliance</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {viewMode === 'breaches' && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
            <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                SLA Breached Tickets ({mockBreachedTickets.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ticket</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Client</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Team</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Assignee</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Breach Time</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockBreachedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div>
                          <div className="font-mono text-xs sm:text-sm font-medium text-blue-600">{ticket.id}</div>
                          <div className="text-xs sm:text-sm text-gray-900 line-clamp-2">{ticket.title}</div>
                          <div className="text-xs text-gray-500 mt-1 sm:hidden">
                            {ticket.client} • {ticket.team}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Created: {formatDateTime(ticket.created).date} {formatDateTime(ticket.created).time}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{ticket.client}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">{ticket.team}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">{ticket.assignee}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm font-medium text-red-600">
                          +{formatBreachTime(ticket.breachTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          SLA: {formatDateTime(ticket.slaDeadline).time}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        {ticket.resolvedAt ? (
                          <div>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border text-green-700 bg-green-100 border-green-300">
                              Resolved
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDateTime(ticket.resolvedAt).date} {formatDateTime(ticket.resolvedAt).time}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full border text-red-700 bg-red-100 border-red-300">
                            Active Breach
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center space-x-2">
                          <Link 
                            href={`/dashboard/support-lead/tickets/${ticket.id}`}
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Breach Reasons Summary */}
            <div className="p-3 sm:p-4 lg:p-6 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Common Breach Reasons</h3>
              <div className="space-y-2">
                {mockBreachedTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm">
                    <span className="font-mono text-blue-600 flex-shrink-0">{ticket.id}:</span>
                    <span className="text-gray-700">{ticket.breachReason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Compliance Trend Chart */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">SLA Compliance Trend</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="h-48 sm:h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <LineChart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Compliance trend chart would be rendered here</p>
                    <p className="text-xs text-gray-400">Integration with recharts library recommended</p>
                  </div>
                </div>
                
                {/* Trend Data Table */}
                <div className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Recent Trend Data</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {mockComplianceTrend.slice(-4).map((data, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="text-xs sm:text-sm text-gray-600">{new Date(data.date).toLocaleDateString()}</div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">{data.compliance}%</div>
                        <div className="text-xs sm:text-sm text-red-600">{data.breaches} breaches</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Performance Insights</h2>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">📈 Positive Trends</h3>
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                      <li>• Infrastructure Team showing consistent 95%+ compliance</li>
                      <li>• Medium priority tickets ahead of target by 9.2%</li>
                      <li>• Overall trend showing +2.1% improvement this week</li>
                      <li>• Mobile Team reduced average resolution time by 30%</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">⚠️ Areas for Improvement</h3>
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                      <li>• Critical priority tickets below 95% target</li>
                      <li>• Security Team experiencing higher breach rates</li>
                      <li>• Complex OAuth issues causing extended resolution times</li>
                      <li>• Third-party dependencies impacting payment processing</li>
                    </ul>
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

