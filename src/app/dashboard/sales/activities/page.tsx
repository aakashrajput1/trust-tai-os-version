'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Phone,
  Mail,
  Video,
  MapPin,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Download,
  Eye,
  Target,
  MessageSquare,
  FileText,
  TrendingUp,
  BarChart3
} from 'lucide-react'

// Mock data for sales activities
const mockActivities = [
  {
    id: 1,
    type: 'call',
    title: 'Follow-up call with TechCorp',
    description: 'Discussed proposal feedback and next steps',
    lead: 'TechCorp Solutions',
    deal: 'Enterprise Software License',
    owner: 'Sarah Johnson',
    date: '2024-01-20',
    time: '14:00',
    duration: 30,
    outcome: 'positive',
    notes: 'Client is interested in moving forward. Need to send revised proposal by Friday.',
    nextAction: 'Send revised proposal',
    nextActionDate: '2024-01-22'
  },
  {
    id: 2,
    type: 'meeting',
    title: 'Product demo for InnovateSoft',
    description: 'Demonstrated new features and pricing options',
    lead: 'InnovateSoft Inc',
    deal: 'Cloud Migration Project',
    owner: 'Mike Chen',
    date: '2024-01-20',
    time: '10:00',
    duration: 60,
    outcome: 'positive',
    notes: 'Demo went well. Client asked about implementation timeline and support options.',
    nextAction: 'Send implementation proposal',
    nextActionDate: '2024-01-23'
  },
  {
    id: 3,
    type: 'email',
    title: 'Proposal sent to DataFlow',
    description: 'Sent comprehensive proposal for analytics platform',
    lead: 'DataFlow Systems',
    deal: 'Data Analytics Platform',
    owner: 'Lisa Wang',
    date: '2024-01-19',
    time: '16:30',
    duration: 0,
    outcome: 'pending',
    notes: 'Proposal includes 3 pricing tiers and implementation timeline.',
    nextAction: 'Follow up on proposal',
    nextActionDate: '2024-01-24'
  },
  {
    id: 4,
    type: 'meeting',
    title: 'Contract negotiation with CloudTech',
    description: 'Finalized terms and conditions for security audit',
    lead: 'CloudTech Solutions',
    deal: 'Security Audit Service',
    owner: 'David Rodriguez',
    date: '2024-01-19',
    time: '11:00',
    duration: 45,
    outcome: 'positive',
    notes: 'Contract terms agreed upon. Waiting for legal review.',
    nextAction: 'Send contract for signature',
    nextActionDate: '2024-01-21'
  },
  {
    id: 5,
    type: 'call',
    title: 'Discovery call with Digital Dynamics',
    description: 'Initial conversation about mobile app requirements',
    lead: 'Digital Dynamics',
    deal: 'Mobile App Development',
    owner: 'Sarah Johnson',
    date: '2024-01-18',
    time: '15:00',
    duration: 25,
    outcome: 'positive',
    notes: 'Client has clear vision for the app. Need to schedule technical discussion.',
    nextAction: 'Schedule technical discussion',
    nextActionDate: '2024-01-25'
  },
  {
    id: 6,
    type: 'email',
    title: 'Follow-up email to FutureTech',
    description: 'Sent additional information about API integration',
    lead: 'FutureTech Labs',
    deal: 'API Integration Service',
    owner: 'Mike Chen',
    date: '2024-01-18',
    time: '09:00',
    duration: 0,
    outcome: 'neutral',
    notes: 'Provided technical specifications and pricing. Awaiting response.',
    nextAction: 'Wait for client response',
    nextActionDate: '2024-01-25'
  },
  {
    id: 7,
    type: 'meeting',
    title: 'Stakeholder presentation for NextGen',
    description: 'Presented solution to executive team',
    lead: 'NextGen Technologies',
    deal: 'Consulting Services',
    owner: 'David Rodriguez',
    date: '2024-01-17',
    time: '13:00',
    duration: 90,
    outcome: 'positive',
    notes: 'Executive team was impressed. Need to prepare detailed proposal.',
    nextAction: 'Prepare detailed proposal',
    nextActionDate: '2024-01-26'
  },
  {
    id: 8,
    type: 'call',
    title: 'Check-in call with Smart Solutions',
    description: 'Regular check-in on training program progress',
    lead: 'Smart Solutions',
    deal: 'Training Program',
    owner: 'Lisa Wang',
    date: '2024-01-17',
    time: '16:00',
    duration: 20,
    outcome: 'positive',
    notes: 'Client is satisfied with progress. Discussed additional training needs.',
    nextAction: 'Propose additional training modules',
    nextActionDate: '2024-01-22'
  }
]

const activityTypes = [
  { value: 'all', label: 'All Activities', icon: BarChart3 },
  { value: 'call', label: 'Calls', icon: Phone },
  { value: 'meeting', label: 'Meetings', icon: Video },
  { value: 'email', label: 'Emails', icon: Mail }
]

const outcomeOptions = [
  { value: 'all', label: 'All Outcomes' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
  { value: 'pending', label: 'Pending' }
]

const ownerOptions = [
  { value: 'all', label: 'All Owners' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Chen', label: 'Mike Chen' },
  { value: 'Lisa Wang', label: 'Lisa Wang' },
  { value: 'David Rodriguez', label: 'David Rodriguez' }
]

export default function ActivityTracker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    return mockActivities.filter(activity => {
      const matchesSearch = 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.deal.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === 'all' || activity.type === typeFilter
      const matchesOutcome = outcomeFilter === 'all' || activity.outcome === outcomeFilter
      const matchesOwner = ownerFilter === 'all' || activity.owner === ownerFilter
      
      let matchesDate = true
      if (dateRange !== 'all') {
        const activityDate = new Date(activity.date)
        const today = new Date()
        const daysDiff = Math.ceil((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch(dateRange) {
          case 'today':
            matchesDate = daysDiff === 0
            break
          case 'this-week':
            matchesDate = daysDiff >= 0 && daysDiff <= 7
            break
          case 'this-month':
            matchesDate = daysDiff >= 0 && daysDiff <= 30
            break
        }
      }

      return matchesSearch && matchesType && matchesOutcome && matchesOwner && matchesDate
    })
  }, [searchTerm, typeFilter, outcomeFilter, ownerFilter, dateRange])

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActivities = filteredActivities.slice(startIndex, endIndex)

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedActivities.size === currentActivities.length) {
      setSelectedActivities(new Set())
    } else {
      setSelectedActivities(new Set(currentActivities.map(activity => activity.id)))
    }
  }

  const handleSelectActivity = (activityId: number) => {
    const newSelected = new Set(selectedActivities)
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId)
    } else {
      newSelected.add(activityId)
    }
    setSelectedActivities(newSelected)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedActivities.size === 0) return
    
    switch(action) {
      case 'export':
        console.log('Exporting activities:', Array.from(selectedActivities))
        break
      case 'delete':
        console.log('Deleting activities:', Array.from(selectedActivities))
        break
    }
    
    setSelectedActivities(new Set())
  }

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'call': return <Phone className="w-5 h-5 text-blue-600" />
      case 'meeting': return <Video className="w-5 h-5 text-green-600" />
      case 'email': return <Mail className="w-5 h-5 text-purple-600" />
      default: return <MessageSquare className="w-5 h-5 text-gray-600" />
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch(outcome) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'neutral': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      case 'pending': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getOutcomeIcon = (outcome: string) => {
    switch(outcome) {
      case 'positive': return <CheckCircle className="w-4 h-4" />
      case 'neutral': return <Clock className="w-4 h-4" />
      case 'negative': return <AlertCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
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

  const formatTime = (timeString: string) => {
    return timeString
  }

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'N/A'
    return `${minutes} min`
  }

  // Group activities by date for calendar view
  const activitiesByDate = useMemo(() => {
    const grouped = filteredActivities.reduce((acc, activity) => {
      const date = activity.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(activity)
      return acc
    }, {} as Record<string, typeof mockActivities>)
    
    return Object.entries(grouped).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  }, [filteredActivities])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Activity Tracker</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Log and track sales activities with leads and deals
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Activities
            </button>
            <Link
              href="/dashboard/sales/activities/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Activity
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockActivities.filter(a => a.type === 'call').length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockActivities.filter(a => a.type === 'meeting').length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockActivities.filter(a => a.type === 'email').length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Positive Outcomes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockActivities.filter(a => a.outcome === 'positive').length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Activity Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {activityTypes.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Outcome Filter */}
            <div>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {outcomeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {ownerOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedActivities.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedActivities.size} activit{selectedActivities.size !== 1 ? 'ies' : 'y'} selected
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
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activities Content */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedActivities.size === currentActivities.length && currentActivities.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead/Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedActivities.has(activity.id)}
                        onChange={() => handleSelectActivity(activity.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500">{activity.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{activity.lead}</div>
                        <div className="text-sm text-gray-500">{activity.deal}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{activity.owner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(activity.date)}
                      </div>
                      <div className="text-xs text-gray-500">{formatTime(activity.time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(activity.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOutcomeColor(activity.outcome)}`}>
                        {getOutcomeIcon(activity.outcome)}
                        <span className="ml-1 capitalize">{activity.outcome}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/sales/activities/${activity.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/sales/activities/${activity.id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => console.log('Delete activity:', activity.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                Showing {startIndex + 1} to {Math.min(endIndex, filteredActivities.length)} of {filteredActivities.length} results
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
      ) : (
        /* Calendar View */
        <div className="space-y-6">
          {activitiesByDate.map(([date, activities]) => (
            <div key={date} className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{formatDate(date)}</h3>
                <p className="text-sm text-gray-500">{activities.length} activit{activities.length !== 1 ? 'ies' : 'y'}</p>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(activity.outcome)}`}>
                            {getOutcomeIcon(activity.outcome)}
                            <span className="ml-1 capitalize">{activity.outcome}</span>
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">Lead:</span> {activity.lead}
                          </div>
                          <div>
                            <span className="font-medium">Deal:</span> {activity.deal}
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span> {activity.owner}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {formatTime(activity.time)}
                          </div>
                        </div>
                        
                        {activity.notes && (
                          <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700">{activity.notes}</p>
                          </div>
                        )}
                        
                        {activity.nextAction && (
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Next Action:</span> {activity.nextAction}
                            </div>
                            <div className="text-sm text-gray-500">
                              Due: {formatDate(activity.nextActionDate)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/sales/activities/${activity.id}/edit`}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
