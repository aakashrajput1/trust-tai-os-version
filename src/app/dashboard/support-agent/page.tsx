'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Star,
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  UserPlus,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Target,
  Timer,
  Activity,
  Download,
  Zap,
  Shield,
  Bell,
  MessageSquare,
  BookOpen,
  LogOut,
  Play,
  Pause,
  StopCircle,
  Plus,
  Search,
  Filter as FilterIcon
} from 'lucide-react'

// Mock data for Support Agent Dashboard
const mockUrgentTicket = {
  id: 'TK-2024-015',
  title: 'Critical: Payment gateway integration failing',
  client: 'TechStart Inc.',
  priority: 'critical',
  timeLeft: 45, // minutes
  assignee: 'Current User',
  created: '2024-01-25T14:30:00Z',
  slaDeadline: '2024-01-25T16:00:00Z',
  status: 'in-progress'
}

const mockQueueSummary = {
  open: 8,
  inProgress: 3,
  waiting: 2,
  resolved: 15
}

const mockPerformanceStats = {
  slaCompliance: 94.2,
  avgFirstResponse: 2.1, // hours
  ticketsResolvedThisWeek: 12,
  customerSatisfaction: 4.7
}

const mockActiveTimers = [
  { ticketId: 'TK-2024-015', title: 'Payment gateway issue', time: 0, isRunning: false },
  { ticketId: 'TK-2024-018', title: 'User authentication bug', time: 0, isRunning: false }
]

export default function SupportAgentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [urgentTicket, setUrgentTicket] = useState(mockUrgentTicket)
  const [queueSummary, setQueueSummary] = useState(mockQueueSummary)
  const [performanceStats, setPerformanceStats] = useState(mockPerformanceStats)
  const [activeTimers, setActiveTimers] = useState(mockActiveTimers)
  const [selectedTicketForTimer, setSelectedTicketForTimer] = useState('')
  const [timerInput, setTimerInput] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { addNotification } = useNotifications()

  // Update current time every minute for SLA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Check for urgent ticket SLA warnings
  useEffect(() => {
    if (urgentTicket.timeLeft <= 15 && urgentTicket.timeLeft > 0) {
      addNotification({
        type: 'warning',
        title: 'Urgent Ticket SLA Warning',
        message: `Ticket ${urgentTicket.id} expires in ${urgentTicket.timeLeft} minutes`
      })
    } else if (urgentTicket.timeLeft <= 0) {
      addNotification({
        type: 'error',
        title: 'SLA Breached',
        message: `Ticket ${urgentTicket.id} has exceeded SLA deadline!`
      })
    }
  }, [urgentTicket.timeLeft, urgentTicket.id, addNotification])

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTimeLeftColor = (timeLeft: number) => {
    if (timeLeft <= 15) return 'text-red-600 bg-red-100'
    if (timeLeft <= 30) return 'text-orange-600 bg-orange-100'
    if (timeLeft <= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const formatTimeLeft = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-600" />
    return null
  }

  const startTimer = (ticketId: string) => {
    setActiveTimers(prev => prev.map(timer => 
      timer.ticketId === ticketId 
        ? { ...timer, isRunning: true }
        : { ...timer, isRunning: false }
    ))
    
    addNotification({
      type: 'info',
      title: 'Timer Started',
      message: `Started tracking time for ticket ${ticketId}`
    })
  }

  const stopTimer = (ticketId: string) => {
    setActiveTimers(prev => prev.map(timer => 
      timer.ticketId === ticketId 
        ? { ...timer, isRunning: false }
        : timer
    ))
    
    addNotification({
      type: 'info',
      title: 'Timer Stopped',
      message: `Stopped tracking time for ticket ${ticketId}`
    })
  }

  const logHours = () => {
    if (!selectedTicketForTimer || !timerInput) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please select a ticket and enter hours worked'
      })
      return
    }

    addNotification({
      type: 'success',
      title: 'Hours Logged',
      message: `Logged ${timerInput} hours for ticket ${selectedTicketForTimer}`
    })

    setSelectedTicketForTimer('')
    setTimerInput('')
  }

  const refreshDashboard = () => {
    addNotification({
      type: 'info',
      title: 'Dashboard Refreshed',
      message: 'Latest data has been loaded'
    })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Support Agent Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage your ticket queue, track time, and maintain SLA compliance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Active Tickets</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {queueSummary.open + queueSummary.inProgress}
              </div>
            </div>
            <button
              onClick={refreshDashboard}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Urgent Ticket Alert */}
        {urgentTicket && urgentTicket.timeLeft <= 60 && (
          <div className="mb-6 sm:mb-8 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-red-800">
                    Urgent Ticket: {urgentTicket.id}
                  </h2>
                  <p className="text-red-700 mt-1 text-sm sm:text-base">{urgentTicket.title}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 text-sm">
                    <span className="text-red-600">Client: {urgentTicket.client}</span>
                    <span className={`px-2 py-1 rounded border text-xs sm:text-sm ${getPriorityColor(urgentTicket.priority)}`}>
                      {urgentTicket.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right w-full lg:w-auto">
                <div className={`text-xl sm:text-2xl font-bold ${getTimeLeftColor(urgentTicket.timeLeft)}`}>
                  {urgentTicket.timeLeft > 0 ? formatTimeLeft(urgentTicket.timeLeft) : 'OVERDUE'}
                </div>
                <div className="text-sm text-red-600 mt-1">SLA Deadline</div>
                <Link 
                  href={`/dashboard/support-agent/tickets/${urgentTicket.id}`}
                  className="inline-flex items-center justify-center mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Open Now
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* My Queue Summary */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Queue Summary</h2>
                  <Link 
                    href="/dashboard/support-agent/tickets"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{queueSummary.open}</div>
                    <div className="text-xs sm:text-sm text-blue-600">Open</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">{queueSummary.inProgress}</div>
                    <div className="text-xs sm:text-sm text-yellow-600">In Progress</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{queueSummary.waiting}</div>
                    <div className="text-xs sm:text-sm text-purple-600">Waiting</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{queueSummary.resolved}</div>
                    <div className="text-xs sm:text-sm text-green-600">Resolved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Time Logger */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Time Logger</h2>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4">
                {/* Manual Time Entry */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                  <select
                    value={selectedTicketForTimer}
                    onChange={(e) => setSelectedTicketForTimer(e.target.value)}
                    className="flex-1 w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Ticket</option>
                    <option value="TK-2024-015">TK-2024-015 - Payment gateway issue</option>
                    <option value="TK-2024-018">TK-2024-018 - User authentication bug</option>
                  </select>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={timerInput}
                    onChange={(e) => setTimerInput(e.target.value)}
                    placeholder="Hours"
                    className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={logHours}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Log
                  </button>
                </div>

                {/* Active Timers */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Active Timers</h3>
                  {activeTimers.map((timer) => (
                    <div key={timer.ticketId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{timer.ticketId}</div>
                        <div className="text-xs text-gray-600">{timer.title}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-gray-700">
                          {Math.floor(timer.time / 60)}:{(timer.time % 60).toString().padStart(2, '0')}
                        </span>
                        {timer.isRunning ? (
                          <button
                            onClick={() => stopTimer(timer.ticketId)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => startTimer(timer.ticketId)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Performance Stats</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{performanceStats.slaCompliance}%</div>
                    <div className="text-xs sm:text-sm text-gray-600">SLA Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">{performanceStats.avgFirstResponse}h</div>
                    <div className="text-xs sm:text-sm text-gray-600">Avg First Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">{performanceStats.ticketsResolvedThisWeek}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Resolved This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{performanceStats.customerSatisfaction}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="p-4 sm:p-6 space-y-3">
                <Link 
                  href="/dashboard/support-agent/tickets"
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View My Queue
                </Link>
                
                <Link 
                  href="/dashboard/support-agent/escalations"
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Request Escalation
                </Link>
                
                <Link 
                  href="/dashboard/support-agent/knowledge-base"
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Knowledge Base
                </Link>
                
                <Link 
                  href="/dashboard/support-agent/time"
                  className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Log Hours
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">Ticket Resolved</div>
                      <div className="text-xs text-gray-600">TK-2024-010 resolved</div>
                      <div className="text-xs text-gray-500">2 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">New Ticket Assigned</div>
                      <div className="text-xs text-gray-600">TK-2024-019 assigned to you</div>
                      <div className="text-xs text-gray-500">15 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">SLA Warning</div>
                      <div className="text-xs text-gray-600">TK-2024-015 approaching deadline</div>
                      <div className="text-xs text-gray-500">1 hour ago</div>
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