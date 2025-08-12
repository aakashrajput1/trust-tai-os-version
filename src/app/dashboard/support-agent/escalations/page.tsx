'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  FileText,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

// Mock data for escalations
const mockEscalations = [
  {
    id: 1,
    ticketId: 'TK-2024-015',
    ticketTitle: 'Critical: Payment gateway integration failing',
    client: 'TechStart Inc.',
    reason: 'Technical complexity beyond current expertise',
    urgency: 'high',
    status: 'pending',
    requestedAt: '2024-01-25T15:30:00Z',
    assignedTo: 'Support Lead',
    notes: 'Client experiencing significant revenue impact. Need senior technical expertise.',
    estimatedResolution: '2024-01-26T10:00:00Z'
  },
  {
    id: 2,
    ticketId: 'TK-2024-018',
    ticketTitle: 'User authentication bug in mobile app',
    client: 'MobileCorp',
    reason: 'Requires development team involvement',
    urgency: 'medium',
    status: 'approved',
    requestedAt: '2024-01-24T14:00:00Z',
    assignedTo: 'Development Team',
    notes: 'Bug confirmed in production. Development team will investigate and deploy fix.',
    estimatedResolution: '2024-01-27T16:00:00Z'
  },
  {
    id: 3,
    ticketId: 'TK-2024-020',
    ticketTitle: 'Feature request: Dark mode toggle',
    client: 'DesignStudio',
    reason: 'Requires product team review',
    urgency: 'low',
    status: 'rejected',
    requestedAt: '2024-01-23T11:00:00Z',
    assignedTo: 'Product Team',
    notes: 'Feature request rejected due to current roadmap priorities.',
    estimatedResolution: null
  }
]

const urgencyColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  inProgress: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-gray-100 text-gray-800 border-gray-200'
}

const escalationReasons = [
  'Technical complexity beyond current expertise',
  'Requires development team involvement',
  'Requires product team review',
  'Client relationship escalation',
  'SLA breach risk',
  'Security concern',
  'Legal/compliance issue',
  'Other'
]

export default function Escalations() {
  const [escalations, setEscalations] = useState(mockEscalations)
  const [filteredEscalations, setFilteredEscalations] = useState(mockEscalations)
  const [showNewForm, setShowNewForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterUrgency, setFilterUrgency] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // New escalation form state
  const [newEscalation, setNewEscalation] = useState({
    ticketId: '',
    reason: '',
    urgency: 'medium',
    notes: ''
  })

  // Filter escalations
  useEffect(() => {
    let filtered = escalations.filter(escalation => {
      const matchesSearch = escalation.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           escalation.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           escalation.client.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || escalation.status === filterStatus
      const matchesUrgency = filterUrgency === 'all' || escalation.urgency === filterUrgency
      
      return matchesSearch && matchesStatus && matchesUrgency
    })

    setFilteredEscalations(filtered)
  }, [escalations, searchTerm, filterStatus, filterUrgency])

  // Handle creating new escalation
  const handleCreateEscalation = () => {
    if (!newEscalation.ticketId || !newEscalation.reason) return

    const escalation = {
      id: Date.now(),
      ticketId: newEscalation.ticketId,
      ticketTitle: 'Sample Ticket Title', // In real app, fetch from ticket data
      client: 'Sample Client', // In real app, fetch from ticket data
      reason: newEscalation.reason,
      urgency: newEscalation.urgency as keyof typeof urgencyColors,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      assignedTo: 'Support Lead',
      notes: newEscalation.notes,
      estimatedResolution: null
    }

    setEscalations([escalation, ...escalations])
    setNewEscalation({
      ticketId: '',
      reason: '',
      urgency: 'medium',
      notes: ''
    })
    setShowNewForm(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterUrgency('all')
  }

  // Get status display text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending Approval'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      case 'inProgress': return 'In Progress'
      case 'resolved': return 'Resolved'
      default: return status
    }
  }

  // Get urgency display text
  const getUrgencyText = (urgency: string) => {
    switch(urgency) {
      case 'low': return 'Low'
      case 'medium': return 'Medium'
      case 'high': return 'High'
      case 'critical': return 'Critical'
      default: return urgency
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Escalations</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Request and track ticket escalations
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {escalations.filter(e => e.status === 'pending').length}
              </div>
            </div>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Escalation
            </button>
          </div>
        </div>
      </div>

      {/* New Escalation Form */}
      {showNewForm && (
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Request New Escalation</h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket ID *
                </label>
                <input
                  type="text"
                  value={newEscalation.ticketId}
                  onChange={(e) => setNewEscalation({ ...newEscalation, ticketId: e.target.value })}
                  placeholder="e.g., TK-2024-015"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>
                <select
                  value={newEscalation.urgency}
                  onChange={(e) => setNewEscalation({ ...newEscalation, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escalation Reason *
                </label>
                <select
                  value={newEscalation.reason}
                  onChange={(e) => setNewEscalation({ ...newEscalation, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Select a reason</option>
                  {escalationReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={newEscalation.notes}
                  onChange={(e) => setNewEscalation({ ...newEscalation, notes: e.target.value })}
                  placeholder="Provide additional context for the escalation..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewForm(false)
                  setNewEscalation({
                    ticketId: '',
                    reason: '',
                    urgency: 'medium',
                    notes: ''
                  })
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEscalation}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                Submit Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search escalations by ticket ID, title, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className="text-sm text-gray-500">
                {filteredEscalations.length} of {escalations.length} escalations
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="inProgress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="all">All Urgency Levels</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            )}

            {/* Filter Actions */}
            {(searchTerm || filterStatus !== 'all' || filterUrgency !== 'all') && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escalations List */}
      <div className="space-y-4">
        {filteredEscalations.map((escalation) => (
          <div key={escalation.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 sm:p-6">
              {/* Escalation Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-orange-600">ES</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{escalation.ticketId}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${urgencyColors[escalation.urgency as keyof typeof urgencyColors]}`}>
                        {getUrgencyText(escalation.urgency)}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColors[escalation.status as keyof typeof statusColors]}`}>
                        {getStatusText(escalation.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{escalation.ticketTitle}</div>
                    <div className="text-xs text-gray-500">{escalation.client}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    Requested {new Date(escalation.requestedAt).toLocaleDateString()}
                  </div>
                  {escalation.estimatedResolution && (
                    <div className="text-xs text-gray-500 mt-1">
                      Est. Resolution: {new Date(escalation.estimatedResolution).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Escalation Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Reason</div>
                  <div className="text-sm text-gray-900">{escalation.reason}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Assigned To</div>
                  <div className="text-sm text-gray-900">{escalation.assignedTo}</div>
                </div>
              </div>

              {/* Notes */}
              {escalation.notes && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                  <div className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                    {escalation.notes}
                  </div>
                </div>
              )}

              {/* Status-specific Information */}
              {escalation.status === 'approved' && escalation.estimatedResolution && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="text-sm text-green-800">
                      <span className="font-medium">Approved</span> - Estimated resolution by {new Date(escalation.estimatedResolution).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {escalation.status === 'rejected' && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <div className="text-sm text-red-800">
                      <span className="font-medium">Rejected</span> - This escalation request has been declined
                    </div>
                  </div>
                </div>
              )}

              {escalation.status === 'inProgress' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">In Progress</span> - Team is actively working on this escalation
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 mr-1" />
                    View Ticket
                  </button>
                </div>
                
                <div className="text-xs text-gray-500">
                  ID: {escalation.id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEscalations.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No escalations found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or create a new escalation request.</p>
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            Request Escalation
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {escalations.filter(e => e.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {escalations.filter(e => e.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {escalations.filter(e => e.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {escalations.filter(e => e.status === 'inProgress').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
