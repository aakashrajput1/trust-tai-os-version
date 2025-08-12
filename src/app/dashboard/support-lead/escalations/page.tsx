'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import SupportLeadNav from '@/components/ui/SupportLeadNav'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Send,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react'

// Mock escalation data
const mockEscalations = [
  {
    id: 'ESC-2024-001',
    ticketId: 'TK-2024-002',
    title: 'Critical authentication system failure',
    description: 'Multiple OAuth providers failing simultaneously. This requires immediate management attention and potential external vendor engagement.',
    requester: 'Mike Rodriguez',
    requesterId: 'mike-rodriguez',
    requesterRole: 'Security Support Specialist',
    requesterTeam: 'Security Team',
    status: 'pending',
    priority: 'critical',
    category: 'Technical',
    reason: 'Requires vendor escalation and management approval',
    client: 'Digital Solutions Ltd',
    estimatedImpact: 'High - Affecting 500+ users unable to login',
    requestedAt: '2024-01-25T15:30:00Z',
    approvedAt: null,
    approvedBy: null,
    rejectedAt: null,
    rejectedBy: null,
    comments: [
      {
        id: 1,
        author: 'Mike Rodriguez',
        role: 'Support Agent',
        message: 'This issue is beyond our standard resolution procedures. OAuth providers (Google, Microsoft) are returning inconsistent responses. Need to engage with vendor support teams.',
        timestamp: '2024-01-25T15:30:00Z'
      }
    ],
    attachments: [
      { id: 1, name: 'error_logs.txt', size: '2.3 MB' },
      { id: 2, name: 'network_trace.har', size: '1.8 MB' }
    ]
  },
  {
    id: 'ESC-2024-002',
    ticketId: 'TK-2024-025',
    title: 'Emergency database maintenance required',
    description: 'Database performance has degraded significantly. Requires immediate maintenance window approval to prevent complete service outage.',
    requester: 'David Wilson',
    requesterId: 'david-wilson',
    requesterRole: 'Database Support Specialist',
    requesterTeam: 'Database Team',
    status: 'approved',
    priority: 'high',
    category: 'Infrastructure',
    reason: 'Emergency maintenance window needed',
    client: 'Enterprise Corp',
    estimatedImpact: 'Medium - 2 hour maintenance window required',
    requestedAt: '2024-01-25T12:00:00Z',
    approvedAt: '2024-01-25T12:15:00Z',
    approvedBy: 'Sarah Mitchell (Support Lead)',
    rejectedAt: null,
    rejectedBy: null,
    comments: [
      {
        id: 1,
        author: 'David Wilson',
        role: 'Support Agent',
        message: 'Database queries are taking 10x longer than normal. We need emergency maintenance approval to prevent complete outage.',
        timestamp: '2024-01-25T12:00:00Z'
      },
      {
        id: 2,
        author: 'Sarah Mitchell',
        role: 'Support Lead',
        message: 'Approved. Coordinate with operations team for emergency maintenance window. Client has been notified.',
        timestamp: '2024-01-25T12:15:00Z'
      }
    ],
    attachments: [
      { id: 1, name: 'performance_metrics.pdf', size: '1.2 MB' },
      { id: 2, name: 'maintenance_plan.docx', size: '856 KB' }
    ]
  },
  {
    id: 'ESC-2024-003',
    ticketId: 'TK-2024-018',
    title: 'Payment processing system outage',
    description: 'Critical payment gateway integration has failed. Multiple clients unable to process transactions. Requires immediate vendor escalation.',
    requester: 'Anna Kim',
    requesterId: 'anna-kim',
    requesterRole: 'Payment Support Specialist',
    requesterTeam: 'Payment Team',
    status: 'rejected',
    priority: 'critical',
    category: 'Financial',
    reason: 'Insufficient documentation provided for escalation',
    client: 'Payment Solutions Inc',
    estimatedImpact: 'Critical - Affecting all payment processing',
    requestedAt: '2024-01-25T10:00:00Z',
    approvedAt: null,
    approvedBy: null,
    rejectedAt: '2024-01-25T10:30:00Z',
    rejectedBy: 'Sarah Mitchell (Support Lead)',
    comments: [
      {
        id: 1,
        author: 'Anna Kim',
        role: 'Support Agent',
        message: 'Payment gateway is completely down. All transaction attempts are failing. Need immediate escalation to payment processor.',
        timestamp: '2024-01-25T10:00:00Z'
      },
      {
        id: 2,
        author: 'Sarah Mitchell',
        role: 'Support Lead',
        message: 'Rejected - Please provide error logs and transaction IDs before escalation can be approved.',
        timestamp: '2024-01-25T10:30:00Z'
      }
    ],
    attachments: [
      { id: 1, name: 'payment_errors.log', size: '3.1 MB' }
    ]
  }
]

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState(mockEscalations)
  const [filteredEscalations, setFilteredEscalations] = useState(mockEscalations)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null)
  const [expandedEscalations, setExpandedEscalations] = useState<string[]>([])
  const [actionComment, setActionComment] = useState('')
  const { addNotification } = useNotifications()

  // Filter escalations
  useEffect(() => {
    let filtered = escalations.filter(esc => {
      const matchesSearch = esc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           esc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           esc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           esc.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || esc.status === filterStatus
      const matchesPriority = filterPriority === 'all' || esc.priority === filterPriority
      const matchesCategory = filterCategory === 'all' || esc.category === filterCategory
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    
    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
      
      if (aPriority !== bPriority) return bPriority - aPriority
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    })
    
    setFilteredEscalations(filtered)
  }, [escalations, searchTerm, filterStatus, filterPriority, filterCategory])

  const approveEscalation = (escalationId: string) => {
    const comment = actionComment.trim()
    if (!comment) {
      addNotification({
        type: 'error',
        title: 'Comment Required',
        message: 'Please provide a comment for the approval'
      })
      return
    }

    setEscalations(prev => prev.map(esc => 
      esc.id === escalationId 
        ? {
            ...esc,
            status: 'approved' as const,
            approvedAt: new Date().toISOString(),
            approvedBy: 'You (Support Lead)',
            comments: [...esc.comments, {
              id: Date.now(),
              author: 'You',
              role: 'Support Lead',
              message: comment,
              timestamp: new Date().toISOString()
            }]
          }
        : esc
    ))

    addNotification({
      type: 'success',
      title: 'Escalation Approved',
      message: `${escalationId} has been approved`
    })

    setActionComment('')
    setSelectedEscalation(null)
  }

  const rejectEscalation = (escalationId: string) => {
    const comment = actionComment.trim()
    if (!comment) {
      addNotification({
        type: 'error',
        title: 'Comment Required',
        message: 'Please provide a reason for rejection'
      })
      return
    }

    setEscalations(prev => prev.map(esc => 
      esc.id === escalationId 
        ? {
            ...esc,
            status: 'rejected' as const,
            rejectedAt: new Date().toISOString(),
            rejectedBy: 'You (Support Lead)',
            comments: [...esc.comments, {
              id: Date.now(),
              author: 'You',
              role: 'Support Lead',
              message: comment,
              timestamp: new Date().toISOString()
            }]
          }
        : esc
    ))

    addNotification({
      type: 'success',
      title: 'Escalation Rejected',
      message: `${escalationId} has been rejected`
    })

    setActionComment('')
    setSelectedEscalation(null)
  }

  const toggleExpanded = (escalationId: string) => {
    setExpandedEscalations(prev => 
      prev.includes(escalationId) 
        ? prev.filter(id => id !== escalationId)
        : [...prev, escalationId]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const refreshData = () => {
    addNotification({
      type: 'info',
      title: 'Data Refreshed',
      message: 'Latest escalation data has been loaded'
    })
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
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Escalations & Approvals</h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Review and manage escalation requests from support agents
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button 
                    onClick={refreshData}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {escalations.filter(e => e.status === 'pending').length}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Pending Review</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {escalations.filter(e => e.status === 'approved').length}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {escalations.filter(e => e.status === 'rejected').length}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Rejected</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {escalations.filter(e => e.priority === 'critical' && e.status === 'pending').length}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Critical Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search escalations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Technical">Technical</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Financial">Financial</option>
                    <option value="Security">Security</option>
                  </select>

                  <div className="flex items-center text-sm text-gray-600">
                    <Filter className="w-4 h-4 mr-2" />
                    {filteredEscalations.length} escalations
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Audit Log</h2>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="w-4 h-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">ESC-2024-002 approved by Sarah Mitchell</p>
                        <p className="text-xs text-gray-500">Emergency database maintenance required</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">ESC-2024-003 rejected by Sarah Mitchell</p>
                        <p className="text-xs text-gray-500">Insufficient documentation provided</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">ESC-2024-001 submitted by Mike Rodriguez</p>
                        <p className="text-xs text-gray-500">Critical authentication system failure</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Escalations List */}
            <div className="space-y-4">
              {filteredEscalations.map((escalation) => {
                const isExpanded = expandedEscalations.includes(escalation.id)
                const isSelected = selectedEscalation === escalation.id
                
                return (
                  <div key={escalation.id} className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{escalation.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(escalation.status)}`}>
                              {escalation.status}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(escalation.priority)}`}>
                              {escalation.priority}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">ID:</span>
                              <span className="font-mono text-gray-900 ml-1">{escalation.id}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Ticket:</span>
                              <span className="font-mono text-blue-600 ml-1">{escalation.ticketId}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Requester:</span>
                              <span className="text-gray-900 ml-1">{escalation.requester}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Client:</span>
                              <span className="text-gray-900 ml-1">{escalation.client}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mt-3 text-sm">{escalation.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {escalation.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setSelectedEscalation(escalation.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedEscalation(escalation.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          
                          <button
                            onClick={() => toggleExpanded(escalation.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Action Modal */}
                      {isSelected && escalation.status === 'pending' && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {selectedEscalation === escalation.id ? 'Add comment for action:' : ''}
                              </label>
                              <textarea
                                value={actionComment}
                                onChange={(e) => setActionComment(e.target.value)}
                                placeholder="Provide a comment for approval or reason for rejection..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Button
                                size="sm"
                                onClick={() => approveEscalation(escalation.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectEscalation(escalation.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedEscalation(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Comments */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Comments ({escalation.comments.length})
                              </h4>
                              
                              <div className="space-y-3">
                                {escalation.comments.map((comment) => (
                                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="font-medium text-sm text-gray-900">
                                        {comment.author} ({comment.role})
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatDateTime(comment.timestamp).time}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Details and Attachments */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Additional Details</h4>
                              
                              <div className="space-y-3 text-sm">
                                <div>
                                  <span className="font-medium text-gray-600">Reason:</span>
                                  <p className="text-gray-900 mt-1">{escalation.reason}</p>
                                </div>
                                
                                {escalation.attachments.length > 0 && (
                                  <div>
                                    <span className="font-medium text-gray-600">Attachments:</span>
                                    <div className="mt-2 space-y-2">
                                      {escalation.attachments.map((file) => (
                                        <div key={file.id} className="flex items-center space-x-2 text-sm">
                                          <FileText className="w-4 h-4 text-gray-400" />
                                          <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                            {file.name}
                                          </span>
                                          <span className="text-gray-500">({file.size})</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {escalation.status !== 'pending' && (
                                  <div>
                                    <span className="font-medium text-gray-600">
                                      {escalation.status === 'approved' ? 'Approved by:' : 'Rejected by:'}
                                    </span>
                                    <p className="text-gray-900 mt-1">
                                      {escalation.approvedBy || escalation.rejectedBy}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDateTime(escalation.approvedAt || escalation.rejectedAt || '').date} at {formatDateTime(escalation.approvedAt || escalation.rejectedAt || '').time}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {filteredEscalations.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No escalations found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all'
                      ? 'Try adjusting your filters or search terms'
                      : 'No escalation requests have been submitted yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

