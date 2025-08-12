'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  MessageSquare,
  AlertCircle,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Tag,
  FileText
} from 'lucide-react'

// Mock data for tickets
const mockTickets = [
  {
    id: 'TK-2024-015',
    title: 'Critical: Payment gateway integration failing',
    client: 'TechStart Inc.',
    priority: 'critical',
    status: 'in-progress',
    slaDue: '2024-01-25T16:00:00Z',
    assignee: 'Current User',
    created: '2024-01-25T14:30:00Z',
    lastUpdated: '2024-01-25T15:45:00Z',
    timeSpent: 1.25,
    category: 'Technical Issue'
  },
  {
    id: 'TK-2024-018',
    title: 'User authentication bug in mobile app',
    client: 'MobileCorp',
    priority: 'high',
    status: 'open',
    slaDue: '2024-01-26T10:00:00Z',
    assignee: 'Current User',
    created: '2024-01-25T12:00:00Z',
    lastUpdated: '2024-01-25T12:00:00Z',
    timeSpent: 0,
    category: 'Bug Report'
  },
  {
    id: 'TK-2024-020',
    title: 'Feature request: Dark mode toggle',
    client: 'DesignStudio',
    priority: 'medium',
    status: 'waiting',
    slaDue: '2024-01-28T18:00:00Z',
    assignee: 'Current User',
    created: '2024-01-25T09:00:00Z',
    lastUpdated: '2024-01-25T14:00:00Z',
    timeSpent: 0.5,
    category: 'Feature Request'
  },
  {
    id: 'TK-2024-022',
    title: 'Database connection timeout errors',
    client: 'DataFlow Systems',
    priority: 'high',
    status: 'open',
    slaDue: '2024-01-26T14:00:00Z',
    assignee: 'Current User',
    created: '2024-01-25T11:30:00Z',
    lastUpdated: '2024-01-25T11:30:00Z',
    timeSpent: 0,
    category: 'Technical Issue'
  }
]

const priorityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  waiting: 'bg-purple-100 text-purple-800 border-purple-200',
  resolved: 'bg-green-100 text-green-800 border-green-200'
}

export default function TicketQueue() {
  const [tickets, setTickets] = useState(mockTickets)
  const [filteredTickets, setFilteredTickets] = useState(mockTickets)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [ticketsPerPage] = useState(20)
  const [sortBy, setSortBy] = useState('slaDue')
  const [sortOrder, setSortOrder] = useState('asc')

  // Filter and search tickets
  useEffect(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.client.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPriority = !selectedPriority || ticket.priority === selectedPriority
      const matchesStatus = !selectedStatus || ticket.status === selectedStatus
      const matchesClient = !selectedClient || ticket.client === selectedClient
      
      return matchesSearch && matchesPriority && matchesStatus && matchesClient
    })

    // Sort tickets
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]
      
      if (sortBy === 'slaDue' || sortBy === 'created' || sortBy === 'lastUpdated') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTickets(filtered)
    setCurrentPage(1)
  }, [tickets, searchTerm, selectedPriority, selectedStatus, selectedClient, sortBy, sortOrder])

  // Calculate SLA time remaining
  const getSLATimeRemaining = (slaDue: string) => {
    const now = new Date()
    const due = new Date(slaDue)
    const diff = due.getTime() - now.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes <= 0) return { time: Math.abs(minutes), overdue: true }
    if (minutes <= 60) return { time: minutes, warning: true }
    return { time: minutes, normal: true }
  }

  // Format time remaining
  const formatTimeRemaining = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Handle bulk actions
  const handleBulkAction = (action: string, ticketIds: string[]) => {
    // Implement bulk actions
    console.log(`${action} for tickets:`, ticketIds)
  }

  // Get unique clients for filter
  const uniqueClients = Array.from(new Set(tickets.map(ticket => ticket.client)))

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket)
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Ticket Queue</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage and track your assigned support tickets
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Tickets</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {filteredTickets.length}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ticket ID, title, or client..."
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
                {filteredTickets.length} of {tickets.length} tickets
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="waiting">Waiting</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Clients</option>
                  {uniqueClients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSelectedPriority('')
                    setSelectedStatus('')
                    setSelectedClient('')
                    setSearchTerm('')
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA Due
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTickets.map((ticket) => {
                const slaInfo = getSLATimeRemaining(ticket.slaDue)
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">TK</span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {ticket.id}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {ticket.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(ticket.created).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{ticket.client}</div>
                      <div className="text-xs text-gray-500">{ticket.category}</div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {slaInfo.overdue ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : slaInfo.warning ? (
                          <Clock className="w-4 h-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <div className={`text-sm font-medium ${
                          slaInfo.overdue ? 'text-red-600' : 
                          slaInfo.warning ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {slaInfo.overdue ? 'OVERDUE' : formatTimeRemaining(slaInfo.time)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(ticket.slaDue).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{ticket.timeSpent}h</div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/support-agent/tickets/${ticket.id}`}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/support-agent/tickets/${ticket.id}`}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Reply"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedPriority('')
                setSelectedStatus('')
                setSelectedClient('')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border mt-6">
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstTicket + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastTicket, filteredTickets.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredTickets.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
