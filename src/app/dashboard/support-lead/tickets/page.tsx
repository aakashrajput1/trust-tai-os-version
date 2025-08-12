'use client'

import { useState } from 'react'
import { 
  Ticket, 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreHorizontal,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import SupportLeadNav from '@/components/ui/SupportLeadNav'

interface Ticket {
  id: string
  title: string
  client: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignee: string
  slaDue: string
  slaStatus: 'ok' | 'warning' | 'breached'
  timeLeft: string
  createdAt: string
  category: string
  team: string
}

export default function SupportLeadTicketsPage() {
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSLA, setSelectedSLA] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const ticketsPerPage = 20

  const tickets: Ticket[] = [
    {
      id: 'TKT-001',
      title: 'Payment Gateway Not Working',
      client: 'Acme Corp',
      priority: 'critical',
      status: 'open',
      assignee: 'Mike Agent',
      slaDue: '2024-02-10T15:30:00Z',
      slaStatus: 'warning',
      timeLeft: '25m',
      createdAt: '2024-02-10T10:00:00Z',
      category: 'Technical',
      team: 'Technical Support'
    },
    {
      id: 'TKT-002',
      title: 'Login Authentication Failed',
      client: 'TechStart Inc',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Sarah Agent',
      slaDue: '2024-02-10T16:00:00Z',
      slaStatus: 'ok',
      timeLeft: '2h 15m',
      createdAt: '2024-02-10T11:30:00Z',
      category: 'Technical',
      team: 'Technical Support'
    },
    {
      id: 'TKT-003',
      title: 'Database Connection Error',
      client: 'Global Solutions',
      priority: 'high',
      status: 'open',
      assignee: 'Unassigned',
      slaDue: '2024-02-10T14:45:00Z',
      slaStatus: 'breached',
      timeLeft: 'Overdue',
      createdAt: '2024-02-10T09:15:00Z',
      category: 'Technical',
      team: 'Technical Support'
    },
    {
      id: 'TKT-004',
      title: 'API Response Time Slow',
      client: 'DataFlow Systems',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'John Agent',
      slaDue: '2024-02-10T17:30:00Z',
      slaStatus: 'ok',
      timeLeft: '4h 45m',
      createdAt: '2024-02-10T12:45:00Z',
      category: 'Performance',
      team: 'Technical Support'
    },
    {
      id: 'TKT-005',
      title: 'User Interface Bug',
      client: 'Innovate Labs',
      priority: 'low',
      status: 'open',
      assignee: 'Unassigned',
      slaDue: '2024-02-11T10:00:00Z',
      slaStatus: 'ok',
      timeLeft: '18h 30m',
      createdAt: '2024-02-10T13:20:00Z',
      category: 'UI/UX',
      team: 'General Support'
    },
    {
      id: 'TKT-006',
      title: 'Billing System Error',
      client: 'Finance Corp',
      priority: 'critical',
      status: 'in-progress',
      assignee: 'Lisa Agent',
      slaDue: '2024-02-10T16:30:00Z',
      slaStatus: 'warning',
      timeLeft: '45m',
      createdAt: '2024-02-10T14:00:00Z',
      category: 'Billing',
      team: 'General Support'
    },
    {
      id: 'TKT-007',
      title: 'Email Notifications Delayed',
      client: 'Marketing Solutions',
      priority: 'medium',
      status: 'resolved',
      assignee: 'Mike Agent',
      slaDue: '2024-02-10T18:00:00Z',
      slaStatus: 'ok',
      timeLeft: 'Completed',
      createdAt: '2024-02-10T15:30:00Z',
      category: 'Communication',
      team: 'General Support'
    },
    {
      id: 'TKT-008',
      title: 'Mobile App Crash',
      client: 'MobileTech Inc',
      priority: 'high',
      status: 'open',
      assignee: 'Unassigned',
      slaDue: '2024-02-11T12:00:00Z',
      slaStatus: 'ok',
      timeLeft: '20h 45m',
      createdAt: '2024-02-10T16:15:00Z',
      category: 'Mobile',
      team: 'Technical Support'
    }
  ]

  const filteredTickets = tickets.filter(ticket => {
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus
    const matchesSLA = selectedSLA === 'all' || ticket.slaStatus === selectedSLA
    const matchesClient = selectedClient === 'all' || ticket.client === selectedClient
    const matchesTeam = selectedTeam === 'all' || ticket.team === selectedTeam
    const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.client.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPriority && matchesStatus && matchesSLA && matchesClient && matchesTeam && matchesSearch
  })

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Ticket]
    let bValue: any = b[sortBy as keyof Ticket]
    
    if (sortBy === 'createdAt' || sortBy === 'slaDue') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const totalPages = Math.ceil(sortedTickets.length / ticketsPerPage)
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'breached': return 'bg-red-100 text-red-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'ok': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const handleSelectAll = () => {
    if (selectedTickets.size === paginatedTickets.length) {
      setSelectedTickets(new Set())
    } else {
      setSelectedTickets(new Set(paginatedTickets.map(ticket => ticket.id)))
    }
  }

  const handleSelectTicket = (ticketId: string) => {
    const newSelected = new Set(selectedTickets)
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId)
    } else {
      newSelected.add(ticketId)
    }
    setSelectedTickets(newSelected)
  }

  const handleBulkAction = (action: string) => {
    console.log(`${action} for tickets:`, Array.from(selectedTickets))
    setSelectedTickets(new Set())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <SupportLeadNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Ticket Queue
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Manage all team tickets and assignments
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm">
                    <Upload className="w-4 h-4" />
                    <span>Import CSV</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm">
                    <Ticket className="w-4 h-4" />
                    <span>New Ticket</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                {/* Saved Views and Quick Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Saved Views</option>
                      <option value="urgent-finance">Urgent Finance Tickets</option>
                      <option value="critical-security">Critical Security Issues</option>
                      <option value="overdue-tickets">Overdue Tickets</option>
                      <option value="unassigned">Unassigned Tickets</option>
                    </select>
                    <Button variant="outline" size="sm" className="text-xs">
                      Save Current View
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Quick Search:</span>
                    <input
                      type="text"
                      placeholder="Ticket ID (e.g., TKT-001)"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-32 sm:w-40"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                  {/* Search */}
                  <div className="sm:col-span-2 lg:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* SLA Filter */}
                  <div>
                    <select
                      value={selectedSLA}
                      onChange={(e) => setSelectedSLA(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All SLA</option>
                      <option value="ok">OK</option>
                      <option value="warning">Warning</option>
                      <option value="breached">Breached</option>
                    </select>
                  </div>

                  {/* Team Filter */}
                  <div>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Teams</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="General Support">General Support</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedTickets.size > 0 && (
              <div className="mb-6 sm:mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedTickets.size} ticket(s) selected
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('assign')}
                      >
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('escalate')}
                      >
                        Escalate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('close')}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tickets Table */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedTickets.size === paginatedTickets.length && paginatedTickets.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                        <button
                          onClick={() => handleSort('id')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>Ticket ID</span>
                          {sortBy === 'id' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                        <button
                          onClick={() => handleSort('title')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>Title</span>
                          {sortBy === 'title' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">
                        <button
                          onClick={() => handleSort('client')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>Client</span>
                          {sortBy === 'client' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                        <button
                          onClick={() => handleSort('priority')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>Priority</span>
                          {sortBy === 'priority' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                        <button
                          onClick={() => handleSort('slaDue')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>SLA Due</span>
                          {sortBy === 'slaDue' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>Status</span>
                          {sortBy === 'status' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden md:table-cell">
                        <button
                          onClick={() => handleSort('assignee')}
                          className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                        >
                          <span>Assignee</span>
                          {sortBy === 'assignee' && (
                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <input
                            type="checkbox"
                            checked={selectedTickets.has(ticket.id)}
                            onChange={() => handleSelectTicket(ticket.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">{ticket.id}</p>
                            <p className="text-xs text-gray-500">{ticket.category}</p>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-32 sm:max-w-48">{ticket.title}</p>
                            <p className="text-xs text-gray-500">{ticket.team}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{ticket.client}</p>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{ticket.client}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <span className={`px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className={`px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${getSLAStatusColor(ticket.slaStatus)}`}>
                              {ticket.slaStatus}
                            </span>
                            <span className="text-xs text-gray-500">{ticket.timeLeft}</span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <span className={`px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          {ticket.assignee === 'Unassigned' ? (
                            <span className="text-red-600 font-medium">Unassigned</span>
                          ) : (
                            ticket.assignee
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-3 sm:px-4 py-3 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-700">
                      Showing {((currentPage - 1) * ticketsPerPage) + 1} to {Math.min(currentPage * ticketsPerPage, sortedTickets.length)} of {sortedTickets.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="text-xs"
                      >
                        Previous
                      </Button>
                      <span className="text-xs sm:text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedPriority('all')
                  setSelectedStatus('all')
                  setSelectedSLA('all')
                  setSelectedClient('all')
                  setSelectedTeam('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

