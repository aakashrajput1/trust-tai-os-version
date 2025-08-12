'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import SupportLeadNav from '@/components/ui/SupportLeadNav'
import { 
  ArrowLeft, 
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  UserPlus,
  MoreHorizontal,
  Filter,
  Search,
  BarChart3,
  Target,
  Activity,
  Zap,
  Calendar,
  Eye,
  ArrowRight,
  Timer,
  Award,
  AlertCircle
} from 'lucide-react'

// Mock team load data
const mockTeamMembers = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    team: 'Integration Team',
    role: 'Senior Support Engineer',
    status: 'online',
    assignedTickets: 8,
    openUrgentTickets: 3,
    avgResolutionTime: 3.2, // hours
    workload: 85, // percentage
    weeklyHours: 38,
    slaCompliance: 92.5,
    customerRating: 4.7,
    ticketsThisWeek: 12,
    lastActivity: '2024-01-25T15:45:00Z',
    skills: ['API Integration', 'Payment Systems', 'OAuth'],
    languages: ['English', 'Mandarin'],
    shiftStart: '09:00',
    shiftEnd: '17:00',
    timezone: 'PST'
  },
  {
    id: 'mike-rodriguez',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    team: 'Security Team',
    role: 'Security Support Specialist',
    status: 'busy',
    assignedTickets: 12,
    openUrgentTickets: 5,
    avgResolutionTime: 4.8,
    workload: 98, // overloaded
    weeklyHours: 42,
    slaCompliance: 87.3,
    customerRating: 4.5,
    ticketsThisWeek: 18,
    lastActivity: '2024-01-25T15:50:00Z',
    skills: ['Security Auditing', 'Authentication', 'Encryption'],
    languages: ['English', 'Spanish'],
    shiftStart: '08:00',
    shiftEnd: '16:00',
    timezone: 'PST'
  },
  {
    id: 'anna-kim',
    name: 'Anna Kim',
    email: 'anna.kim@company.com',
    team: 'Infrastructure Team',
    role: 'Infrastructure Support Engineer',
    status: 'online',
    assignedTickets: 6,
    openUrgentTickets: 1,
    avgResolutionTime: 2.8,
    workload: 60,
    weeklyHours: 35,
    slaCompliance: 96.2,
    customerRating: 4.9,
    ticketsThisWeek: 9,
    lastActivity: '2024-01-25T15:30:00Z',
    skills: ['Cloud Infrastructure', 'Monitoring', 'Performance'],
    languages: ['English', 'Korean'],
    shiftStart: '10:00',
    shiftEnd: '18:00',
    timezone: 'PST'
  },
  {
    id: 'david-wilson',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    team: 'Database Team',
    role: 'Database Support Specialist',
    status: 'online',
    assignedTickets: 9,
    openUrgentTickets: 4,
    avgResolutionTime: 5.1,
    workload: 90,
    weeklyHours: 40,
    slaCompliance: 89.7,
    customerRating: 4.3,
    ticketsThisWeek: 14,
    lastActivity: '2024-01-25T15:25:00Z',
    skills: ['Database Optimization', 'Query Tuning', 'Backup Recovery'],
    languages: ['English'],
    shiftStart: '09:00',
    shiftEnd: '17:00',
    timezone: 'EST'
  },
  {
    id: 'emma-davis',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    team: 'API Team',
    role: 'API Support Engineer',
    status: 'away',
    assignedTickets: 5,
    openUrgentTickets: 2,
    avgResolutionTime: 3.5,
    workload: 55,
    weeklyHours: 32,
    slaCompliance: 94.1,
    customerRating: 4.6,
    ticketsThisWeek: 8,
    lastActivity: '2024-01-25T14:15:00Z',
    skills: ['REST APIs', 'GraphQL', 'Rate Limiting'],
    languages: ['English'],
    shiftStart: '11:00',
    shiftEnd: '19:00',
    timezone: 'PST'
  },
  {
    id: 'james-liu',
    name: 'James Liu',
    email: 'james.liu@company.com',
    team: 'Infrastructure Team',
    role: 'Senior Infrastructure Engineer',
    status: 'online',
    assignedTickets: 7,
    openUrgentTickets: 1,
    avgResolutionTime: 4.2,
    workload: 70,
    weeklyHours: 38,
    slaCompliance: 93.8,
    customerRating: 4.8,
    ticketsThisWeek: 11,
    lastActivity: '2024-01-25T15:40:00Z',
    skills: ['DevOps', 'CI/CD', 'Container Management'],
    languages: ['English', 'Mandarin'],
    shiftStart: '07:00',
    shiftEnd: '15:00',
    timezone: 'PST'
  },
  {
    id: 'lisa-wang',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    team: 'Mobile Team',
    role: 'Mobile Support Specialist',
    status: 'offline',
    assignedTickets: 4,
    openUrgentTickets: 0,
    avgResolutionTime: 3.9,
    workload: 45,
    weeklyHours: 28,
    slaCompliance: 95.5,
    customerRating: 4.7,
    ticketsThisWeek: 6,
    lastActivity: '2024-01-25T13:00:00Z',
    skills: ['iOS Development', 'Android Support', 'React Native'],
    languages: ['English', 'Mandarin'],
    shiftStart: '09:00',
    shiftEnd: '17:00',
    timezone: 'EST'
  }
]

const mockUnassignedTickets = [
  {
    id: 'TK-2024-045',
    title: 'Payment processing timeout',
    client: 'FinTech Solutions',
    priority: 'high',
    requiredSkills: ['Payment Systems', 'API Integration'],
    estimatedTime: 4
  },
  {
    id: 'TK-2024-046',
    title: 'Mobile app crash on startup',
    client: 'Mobile Tech Co',
    priority: 'critical',
    requiredSkills: ['iOS Development', 'Mobile Support'],
    estimatedTime: 6
  },
  {
    id: 'TK-2024-047',
    title: 'Database query optimization needed',
    client: 'Data Corp',
    priority: 'medium',
    requiredSkills: ['Database Optimization', 'Query Tuning'],
    estimatedTime: 3
  }
]

export default function TeamLoadPage() {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTeam, setFilterTeam] = useState('all')
  const [filterWorkload, setFilterWorkload] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('workload')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const { addNotification } = useNotifications()

  // Filter and sort team members
  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.team.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTeam = filterTeam === 'all' || member.team === filterTeam
      const matchesWorkload = filterWorkload === 'all' || 
                             (filterWorkload === 'overloaded' && member.workload >= 95) ||
                             (filterWorkload === 'high' && member.workload >= 80 && member.workload < 95) ||
                             (filterWorkload === 'normal' && member.workload >= 60 && member.workload < 80) ||
                             (filterWorkload === 'low' && member.workload < 60)
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus
      
      return matchesSearch && matchesTeam && matchesWorkload && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
      }
      
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr)
    })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'away': return 'bg-orange-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getWorkloadColor = (workload: number) => {
    if (workload >= 95) return 'text-red-700 bg-red-100'
    if (workload >= 80) return 'text-orange-700 bg-orange-100'
    if (workload >= 60) return 'text-yellow-700 bg-yellow-100'
    return 'text-green-700 bg-green-100'
  }

  const getWorkloadLabel = (workload: number) => {
    if (workload >= 95) return 'Overloaded'
    if (workload >= 80) return 'High Load'
    if (workload >= 60) return 'Normal Load'
    return 'Light Load'
  }

  const refreshData = () => {
    addNotification({
      type: 'info',
      title: 'Data Refreshed',
      message: 'Latest team load data has been loaded'
    })
  }

  const reassignTicket = (fromMemberId: string, toMemberId: string, ticketCount: number = 1) => {
    const fromMember = teamMembers.find(m => m.id === fromMemberId)
    const toMember = teamMembers.find(m => m.id === toMemberId)
    
    if (fromMember && toMember) {
      addNotification({
        type: 'success',
        title: 'Tickets Reassigned',
        message: `${ticketCount} ticket(s) moved from ${fromMember.name} to ${toMember.name}`
      })
    }
  }

  const assignNewTicket = (memberId: string, ticketId: string) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (member) {
      addNotification({
        type: 'success',
        title: 'Ticket Assigned',
        message: `${ticketId} assigned to ${member.name}`
      })
    }
  }

  const formatLastActivity = (timestamp: string) => {
    const now = new Date()
    const activity = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - activity.getTime()) / 60000)
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const uniqueTeams = Array.from(new Set(teamMembers.map(m => m.team)))

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Team Load View</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Monitor agent performance and manage workload distribution
              </p>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={refreshData}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Agent</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{teamMembers.length}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Total Agents</p>
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
                  {teamMembers.filter(m => m.status === 'online').length}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Online Now</p>
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
                  {teamMembers.filter(m => m.workload >= 95).length}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Overloaded</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 lg:p-6 border col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                <Target className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="ml-2 sm:ml-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  {Math.round(teamMembers.reduce((sum, m) => sum + m.workload, 0) / teamMembers.length)}%
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Avg Load</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Teams</option>
                {uniqueTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>

              <select
                value={filterWorkload}
                onChange={(e) => setFilterWorkload(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Workloads</option>
                <option value="overloaded">Overloaded (95%+)</option>
                <option value="high">High Load (80-94%)</option>
                <option value="normal">Normal Load (60-79%)</option>
                <option value="low">Light Load (&lt;60%)</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="workload">Sort by Workload</option>
                <option value="assignedTickets">Assigned Tickets</option>
                <option value="avgResolutionTime">Resolution Time</option>
                <option value="slaCompliance">SLA Compliance</option>
                <option value="customerRating">Customer Rating</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'desc' ? '↓' : '↑'} {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Team Members List */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Team Members ({filteredMembers.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{member.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkloadColor(member.workload)}`}>
                              {getWorkloadLabel(member.workload)}
                            </span>
                            {member.workload >= 95 && (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            <div>{member.role} • {member.team}</div>
                            <div>{member.email}</div>
                            <div>Shift: {member.shiftStart} - {member.shiftEnd} {member.timezone}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-gray-500">Assigned Tickets</div>
                              <div className="font-medium text-gray-900">{member.assignedTickets}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Urgent Tickets</div>
                              <div className="font-medium text-red-600">{member.openUrgentTickets}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Avg Resolution</div>
                              <div className="font-medium text-gray-900">{member.avgResolutionTime}h</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">SLA Compliance</div>
                              <div className="font-medium text-green-600">{member.slaCompliance}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div>Rating: ⭐ {member.customerRating}</div>
                              <div>Last active: {formatLastActivity(member.lastActivity)}</div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Link 
                                href={`/dashboard/support-lead/team-load/${member.id}`}
                                className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button 
                                onClick={() => setSelectedMember(member.id)}
                                className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Workload Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Workload</span>
                              <span>{member.workload}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  member.workload >= 95 ? 'bg-red-500' :
                                  member.workload >= 80 ? 'bg-orange-500' :
                                  member.workload >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(member.workload, 100)}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Skills */}
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-1">Skills</div>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                  {skill}
                                </span>
                              ))}
                              {member.skills.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                  +{member.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Agent
                </button>
                
                <button 
                  onClick={() => setShowReassignModal(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Bulk Reassign
                </button>
                
                <Link 
                  href="/dashboard/support-lead/reports"
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Link>
              </div>
            </div>

            {/* Unassigned Tickets */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Unassigned Tickets ({mockUnassignedTickets.length})
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {mockUnassignedTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-mono text-sm font-medium text-blue-600">{ticket.id}</div>
                          <div className="font-medium text-gray-900 text-sm">{ticket.title}</div>
                          <div className="text-xs text-gray-600">{ticket.client}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          ticket.priority === 'critical' ? 'text-red-700 bg-red-100 border-red-300' :
                          ticket.priority === 'high' ? 'text-orange-700 bg-orange-100 border-orange-300' :
                          'text-yellow-700 bg-yellow-100 border-yellow-300'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        Skills: {ticket.requiredSkills.join(', ')}
                      </div>
                      
                      <select
                        onChange={(e) => e.target.value && assignNewTicket(e.target.value, ticket.id)}
                        className="w-full text-sm px-2 py-1 border border-gray-300 rounded"
                        defaultValue=""
                      >
                        <option value="">Assign to...</option>
                        {teamMembers
                          .filter(member => 
                            member.workload < 90 && 
                            ticket.requiredSkills.some(skill => member.skills.includes(skill))
                          )
                          .map(member => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.workload}% load)
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Performance Summary */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Team Average SLA</span>
                    <span className="font-medium text-green-600">
                      {Math.round(teamMembers.reduce((sum, m) => sum + m.slaCompliance, 0) / teamMembers.length)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Active Tickets</span>
                    <span className="font-medium text-gray-900">
                      {teamMembers.reduce((sum, m) => sum + m.assignedTickets, 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Urgent Tickets</span>
                    <span className="font-medium text-red-600">
                      {teamMembers.reduce((sum, m) => sum + m.openUrgentTickets, 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Customer Rating</span>
                    <span className="font-medium text-yellow-600">
                      ⭐ {(teamMembers.reduce((sum, m) => sum + m.customerRating, 0) / teamMembers.length).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}
