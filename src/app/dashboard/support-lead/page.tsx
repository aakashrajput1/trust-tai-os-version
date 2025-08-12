'use client'

import { useState } from 'react'
import { 
  Ticket, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Star,
  Download,
  Filter,
  Search,
  Eye,
  User,
  Calendar,
  ArrowRight,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  Target
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
}

interface Agent {
  id: string
  name: string
  team: string
  assignedTickets: number
  urgentTickets: number
  avgResolutionTime: string
  status: 'available' | 'busy' | 'offline'
}

export default function SupportLeadDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [selectedTeam, setSelectedTeam] = useState('all')

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
      createdAt: '2024-02-10T10:00:00Z'
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
      createdAt: '2024-02-10T11:30:00Z'
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
      createdAt: '2024-02-10T09:15:00Z'
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
      createdAt: '2024-02-10T12:45:00Z'
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
      createdAt: '2024-02-10T13:20:00Z'
    }
  ]

  const agents: Agent[] = [
    {
      id: '1',
      name: 'Mike Agent',
      team: 'Technical Support',
      assignedTickets: 8,
      urgentTickets: 2,
      avgResolutionTime: '2.5h',
      status: 'busy'
    },
    {
      id: '2',
      name: 'Sarah Agent',
      team: 'Technical Support',
      assignedTickets: 5,
      urgentTickets: 1,
      avgResolutionTime: '1.8h',
      status: 'available'
    },
    {
      id: '3',
      name: 'John Agent',
      team: 'General Support',
      assignedTickets: 12,
      urgentTickets: 3,
      avgResolutionTime: '3.2h',
      status: 'busy'
    },
    {
      id: '4',
      name: 'Lisa Agent',
      team: 'General Support',
      assignedTickets: 3,
      urgentTickets: 0,
      avgResolutionTime: '1.5h',
      status: 'available'
    }
  ]

  const slaWarnings = tickets.filter(ticket => ticket.slaStatus === 'warning' || ticket.slaStatus === 'breached')
  const activeTickets = tickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in-progress')

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
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                    Support Lead Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Monitor team performance and SLA compliance
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto text-sm">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Open Tickets</p>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-green-600 mt-1">↓ 12% from yesterday</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <Ticket className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">SLA Compliance</p>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">94%</p>
                    <p className="text-xs text-green-600 mt-1">↑ 2% from yesterday</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <Target className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Breached Tickets</p>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-red-600">3</p>
                    <p className="text-xs text-red-600 mt-1">↑ 1 from yesterday</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Avg Resolution</p>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">2.3h</p>
                    <p className="text-xs text-green-600 mt-1">↓ 0.5h from yesterday</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Satisfaction</p>
                    <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">4.8</p>
                    <p className="text-xs text-green-600 mt-1">↑ 0.2 from yesterday</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
              {/* SLA Breach Warnings */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">SLA Warnings</h2>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {slaWarnings.length} urgent
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {slaWarnings.map((ticket) => (
                      <div key={ticket.id} className="p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2">{ticket.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0 ${getSLAStatusColor(ticket.slaStatus)}`}>
                            {ticket.slaStatus === 'breached' ? 'Breached' : 'Warning'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">{ticket.client}</span>
                          <span className={`font-medium flex-shrink-0 ${ticket.slaStatus === 'breached' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {ticket.timeLeft}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                          <span className="truncate">{ticket.assignee}</span>
                          <span className={`px-2 py-1 rounded-full flex-shrink-0 ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {slaWarnings.length === 0 && (
                    <div className="text-center py-4 sm:py-6">
                      <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-gray-500">No SLA warnings</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Ticket Queue */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Active Ticket Queue</h2>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2 text-xs sm:text-sm">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View All</span>
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left px-2 sm:px-3 py-2 text-xs font-medium text-gray-500 uppercase">Ticket</th>
                          <th className="text-left px-2 sm:px-3 py-2 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Client</th>
                          <th className="text-left px-2 sm:px-3 py-2 text-xs font-medium text-gray-500 uppercase">Priority</th>
                          <th className="text-left px-2 sm:px-3 py-2 text-xs font-medium text-gray-500 uppercase">SLA</th>
                          <th className="text-left px-2 sm:px-3 py-2 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Assignee</th>
                          <th className="text-left px-2 sm:px-3 py-2 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {activeTickets.slice(0, 5).map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-900">{ticket.id}</p>
                                <p className="text-xs text-gray-500 truncate max-w-20 sm:max-w-32">{ticket.title}</p>
                                <p className="text-xs text-gray-500 sm:hidden">{ticket.client}</p>
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{ticket.client}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <span className={`px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                <span className={`px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${getSLAStatusColor(ticket.slaStatus)}`}>
                                  {ticket.slaStatus}
                                </span>
                                <span className="text-xs text-gray-500">{ticket.timeLeft}</span>
                              </div>
                            </td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 hidden md:table-cell">{ticket.assignee}</td>
                            <td className="px-2 sm:px-3 py-2 sm:py-3">
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                  Assign
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Load Summary */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100 mb-4 sm:mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Team Load Summary</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Teams</option>
                    <option value="technical">Technical Support</option>
                    <option value="general">General Support</option>
                  </select>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 text-xs sm:text-sm">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Detailed View</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.team}</p>
                        </div>
                      </div>
                      <span className={`px-1 sm:px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Assigned:</span>
                        <span className="font-medium">{agent.assignedTickets}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Urgent:</span>
                        <span className={`font-medium ${agent.urgentTickets > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {agent.urgentTickets}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Avg Time:</span>
                        <span className="font-medium">{agent.avgResolutionTime}</span>
                      </div>
                    </div>

                    {agent.assignedTickets > 10 && (
                      <div className="mt-2 sm:mt-3 p-1 sm:p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-700 font-medium">Overloaded</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-3 sm:p-4 h-auto">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="text-left">
                    <p className="font-medium text-xs sm:text-sm">Assign Urgent</p>
                    <p className="text-xs text-gray-500">Quick ticket assignment</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-3 sm:p-4 h-auto">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="text-left">
                    <p className="font-medium text-xs sm:text-sm">View Breaches</p>
                    <p className="text-xs text-gray-500">SLA breach report</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-3 sm:p-4 h-auto">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="text-left">
                    <p className="font-medium text-xs sm:text-sm">Export Report</p>
                    <p className="text-xs text-gray-500">Download metrics</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-3 sm:p-4 h-auto">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="text-left">
                    <p className="font-medium text-xs sm:text-sm">Team Load</p>
                    <p className="text-xs text-gray-500">Workload overview</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}