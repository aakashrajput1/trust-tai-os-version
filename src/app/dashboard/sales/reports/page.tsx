'use client'

import { useState, useMemo } from 'react'
import { 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Calendar,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  PieChart,
  Activity,
  Building,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Settings,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

// Mock data for sales reports
const mockReports = [
  {
    id: 1,
    name: 'Monthly Sales Performance',
    type: 'performance',
    description: 'Comprehensive overview of monthly sales metrics and KPIs',
    lastRun: '2024-01-20',
    nextRun: '2024-02-01',
    status: 'active',
    schedule: 'monthly',
    owner: 'Sarah Johnson',
    dataPoints: ['Revenue', 'Deals Closed', 'Conversion Rate', 'Sales Rep Performance'],
    format: 'PDF'
  },
  {
    id: 2,
    name: 'Lead Conversion Analysis',
    type: 'conversion',
    description: 'Detailed analysis of lead-to-deal conversion rates by source and stage',
    lastRun: '2024-01-19',
    nextRun: '2024-01-26',
    status: 'active',
    schedule: 'weekly',
    owner: 'Mike Chen',
    dataPoints: ['Lead Source', 'Conversion Rate', 'Time to Close', 'Deal Value'],
    format: 'Excel'
  },
  {
    id: 3,
    name: 'Pipeline Health Report',
    type: 'pipeline',
    description: 'Real-time pipeline status and deal progression analysis',
    lastRun: '2024-01-20',
    nextRun: '2024-01-21',
    status: 'active',
    schedule: 'daily',
    owner: 'Lisa Wang',
    dataPoints: ['Pipeline Value', 'Stage Distribution', 'Win Probability', 'Forecast Accuracy'],
    format: 'PDF'
  },
  {
    id: 4,
    name: 'Sales Rep Performance',
    type: 'performance',
    description: 'Individual sales representative performance metrics and rankings',
    lastRun: '2024-01-18',
    nextRun: '2024-01-25',
    status: 'active',
    schedule: 'weekly',
    owner: 'David Rodriguez',
    dataPoints: ['Quota Achievement', 'Deals Closed', 'Revenue Generated', 'Activity Metrics'],
    format: 'Excel'
  },
  {
    id: 5,
    name: 'Customer Lifetime Value',
    type: 'analytics',
    description: 'Customer LTV analysis and retention metrics',
    lastRun: '2024-01-15',
    nextRun: '2024-02-01',
    status: 'active',
    schedule: 'monthly',
    owner: 'Sarah Johnson',
    dataPoints: ['LTV by Segment', 'Retention Rate', 'Churn Analysis', 'Upsell Opportunities'],
    format: 'PDF'
  },
  {
    id: 6,
    name: 'Regional Sales Analysis',
    type: 'geographic',
    description: 'Sales performance breakdown by geographic regions',
    lastRun: '2024-01-17',
    nextRun: '2024-01-24',
    status: 'active',
    schedule: 'weekly',
    owner: 'Mike Chen',
    dataPoints: ['Revenue by Region', 'Market Penetration', 'Regional Growth', 'Territory Performance'],
    format: 'Excel'
  }
]

const reportTypes = [
  { value: 'all', label: 'All Reports', icon: BarChart3 },
  { value: 'performance', label: 'Performance', icon: TrendingUp },
  { value: 'conversion', label: 'Conversion', icon: Target },
  { value: 'pipeline', label: 'Pipeline', icon: Activity },
  { value: 'analytics', label: 'Analytics', icon: PieChart },
  { value: 'geographic', label: 'Geographic', icon: Building }
]

const scheduleOptions = [
  { value: 'all', label: 'All Schedules' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' }
]

const formatOptions = [
  { value: 'all', label: 'All Formats' },
  { value: 'PDF', label: 'PDF' },
  { value: 'Excel', label: 'Excel' },
  { value: 'CSV', label: 'CSV' }
]

// Mock data for quick stats
const quickStats = {
  totalReports: 24,
  activeReports: 18,
  scheduledReports: 12,
  customReports: 6
}

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    action: 'Report Generated',
    report: 'Monthly Sales Performance',
    user: 'Sarah Johnson',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    action: 'Report Scheduled',
    report: 'Lead Conversion Analysis',
    user: 'Mike Chen',
    time: '4 hours ago',
    status: 'pending'
  },
  {
    id: 3,
    action: 'Custom Report Created',
    report: 'Q1 Performance Review',
    user: 'Lisa Wang',
    time: '1 day ago',
    status: 'success'
  },
  {
    id: 4,
    action: 'Report Failed',
    report: 'Pipeline Health Report',
    user: 'David Rodriguez',
    time: '2 days ago',
    status: 'error'
  }
]

export default function SalesReports() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [scheduleFilter, setScheduleFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [selectedReports, setSelectedReports] = useState<Set<number>>(new Set())
  const [showCustomBuilder, setShowCustomBuilder] = useState(false)

  // Filter and search reports
  const filteredReports = useMemo(() => {
    return mockReports.filter(report => {
      const matchesSearch = 
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.owner.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      const matchesSchedule = scheduleFilter === 'all' || report.schedule === scheduleFilter
      const matchesFormat = formatFilter === 'all' || report.format === formatFilter

      return matchesSearch && matchesType && matchesSchedule && matchesFormat
    })
  }, [searchTerm, typeFilter, scheduleFilter, formatFilter])

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReports = filteredReports.slice(startIndex, endIndex)

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedReports.size === currentReports.length) {
      setSelectedReports(new Set())
    } else {
      setSelectedReports(new Set(currentReports.map(report => report.id)))
    }
  }

  const handleSelectReport = (reportId: number) => {
    const newSelected = new Set(selectedReports)
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId)
    } else {
      newSelected.add(reportId)
    }
    setSelectedReports(newSelected)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedReports.size === 0) return
    
    switch(action) {
      case 'export':
        console.log('Exporting reports:', Array.from(selectedReports))
        break
      case 'schedule':
        console.log('Scheduling reports:', Array.from(selectedReports))
        break
      case 'delete':
        console.log('Deleting reports:', Array.from(selectedReports))
        break
    }
    
    setSelectedReports(new Set())
  }

  const getReportTypeIcon = (type: string) => {
    const typeConfig = reportTypes.find(t => t.value === type)
    if (typeConfig) {
      const Icon = typeConfig.icon
      return <Icon className="w-5 h-5" />
    }
    return <BarChart3 className="w-5 h-5" />
  }

  const getReportTypeColor = (type: string) => {
    switch(type) {
      case 'performance': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'conversion': return 'text-green-600 bg-green-50 border-green-200'
      case 'pipeline': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'analytics': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'geographic': return 'text-indigo-600 bg-indigo-50 border-indigo-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <Clock className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleRunReport = (reportId: number) => {
    console.log('Running report:', reportId)
    // In real app, this would trigger the report generation
  }

  const handleScheduleReport = (reportId: number) => {
    console.log('Scheduling report:', reportId)
    // In real app, this would open scheduling modal
  }

  const handleExportReport = (reportId: number, format: string) => {
    console.log('Exporting report:', reportId, 'as', format)
    // In real app, this would trigger the export
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Generate insights and track sales performance with comprehensive reports
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowCustomBuilder(!showCustomBuilder)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Custom Report Builder
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.totalReports}</p>
              <p className="text-xs text-gray-500">Available reports</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Reports</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.activeReports}</p>
              <p className="text-xs text-gray-500">Currently running</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.scheduledReports}</p>
              <p className="text-xs text-gray-500">Auto-generated</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Custom Reports</p>
              <p className="text-2xl font-bold text-gray-900">{quickStats.customReports}</p>
              <p className="text-xs text-gray-500">User-created</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Report Builder */}
      {showCustomBuilder && (
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Custom Report Builder</h2>
            <p className="text-sm text-gray-600 mt-1">Create personalized reports with custom metrics and filters</p>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                <input
                  type="text"
                  placeholder="Enter report name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <option>Performance</option>
                  <option>Conversion</option>
                  <option>Pipeline</option>
                  <option>Analytics</option>
                  <option>Geographic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <option>One-time</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Metrics to Include</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Revenue', 'Deals', 'Leads', 'Conversion Rate', 'Pipeline Value', 'Win Rate', 'Sales Rep Performance', 'Customer LTV'].map((metric) => (
                    <label key={metric} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCustomBuilder(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Create Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Report Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {reportTypes.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Schedule Filter */}
            <div>
              <select
                value={scheduleFilter}
                onChange={(e) => setScheduleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {scheduleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Format Filter */}
            <div>
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {formatOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReports.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedReports.size} report{selectedReports.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('schedule')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedReports.size === currentReports.length && currentReports.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedReports.has(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Data points: {report.dataPoints.join(', ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                      {getReportTypeIcon(report.type)}
                      <span className="ml-1 capitalize">{report.type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {report.schedule.charAt(0).toUpperCase() + report.schedule.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(report.lastRun)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1 capitalize">{report.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{report.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleRunReport(report.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Run Report"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleScheduleReport(report.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Schedule Report"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportReport(report.id, report.format)}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title={`Export as ${report.format}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/sales/reports/${report.id}`}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/sales/reports/${report.id}/edit`}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Report"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : activity.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.report}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-900">{activity.user}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
