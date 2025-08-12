'use client'

import { useState, useEffect } from 'react'
import './dashboard.css'
import { 
  Activity, 
  Users, 
  Clock, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  UserPlus, 
  Settings, 
  Target, 
  Plus,
  Download,
  FileText,
  BarChart3
} from 'lucide-react'

interface SystemMetrics {
  activeUsers: number
  apiResponseTime: number
  dbHealth: 'healthy' | 'warning' | 'critical'
  queueBacklog: number
}

interface PendingAction {
  id: string
  type: 'user_approval' | 'role_change' | 'integration_expiry'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 0,
    apiResponseTime: 0,
    dbHealth: 'healthy',
    queueBacklog: 0
  })
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMetrics({
        activeUsers: 1247,
        apiResponseTime: 145,
        dbHealth: 'healthy',
        queueBacklog: 23
      })
      
      setPendingActions([
        {
          id: '1',
          type: 'user_approval',
          title: 'New User Approval Request',
          description: 'John Doe (john@example.com) is requesting access',
          priority: 'medium',
          createdAt: '2 hours ago'
        },
        {
          id: '2',
          type: 'role_change',
          title: 'Role Change Request',
          description: 'Sarah Wilson wants to change from Developer to Team Lead',
          priority: 'high',
          createdAt: '1 hour ago'
        },
        {
          id: '3',
          type: 'integration_expiry',
          title: 'Integration Expiring Soon',
          description: 'Slack integration will expire in 3 days',
          priority: 'low',
          createdAt: '4 hours ago'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Export functions
  const exportSystemReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics,
      systemHealth: {
        dbHealth: metrics.dbHealth,
        apiResponseTime: metrics.apiResponseTime,
        queueBacklog: metrics.queueBacklog
      }
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-health-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportUserReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalUsers: metrics.activeUsers,
      activeUsers: metrics.activeUsers,
      userMetrics: {
        activeUsers: metrics.activeUsers,
        totalUsers: metrics.activeUsers
      }
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `user-activity-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAuditLog = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      auditLogs: [
        { action: 'User login', user: 'admin@trusttai.com', time: '2 minutes ago', type: 'info' },
        { action: 'Role updated', user: 'sarah.wilson@company.com', time: '15 minutes ago', type: 'warning' },
        { action: 'Integration connected', user: 'system', time: '1 hour ago', type: 'success' },
        { action: 'New user registered', user: 'john.doe@company.com', time: '2 hours ago', type: 'info' },
        { action: 'System backup completed', user: 'system', time: '3 hours ago', type: 'success' }
      ]
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportIntegrationReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      integrations: [
        { name: 'Slack', status: 'active', lastSync: '2 minutes ago', apiCalls: 1247, errorCount: 0 },
        { name: 'GitHub', status: 'active', lastSync: '5 minutes ago', apiCalls: 892, errorCount: 2 },
        { name: 'Jira', status: 'active', lastSync: '1 minute ago', apiCalls: 1567, errorCount: 0 },
        { name: 'Stripe', status: 'error', lastSync: '1 hour ago', apiCalls: 234, errorCount: 15 }
      ]
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `integration-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 dashboard-container">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4 sm:pb-6 mobile-nav">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mobile-text">Admin Control Center</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 mobile-text-secondary">
          Monitor system health, manage users, and oversee platform operations
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 metric-card mobile-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mobile-text-secondary">Active Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate mobile-text">{metrics.activeUsers.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
            <span className="text-green-600 truncate">+12% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 metric-card mobile-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mobile-text-secondary">API Response Time</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate mobile-text">{metrics.apiResponseTime}ms</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
            <span className="text-green-600 truncate">Within SLA</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 metric-card mobile-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mobile-text-secondary">Database Health</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize truncate mobile-text">{metrics.dbHealth}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium ${getHealthColor(metrics.dbHealth)}`}>
              {metrics.dbHealth === 'healthy' ? 'Optimal' : metrics.dbHealth === 'warning' ? 'Attention Required' : 'Critical'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 metric-card mobile-card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate mobile-text-secondary">Queue Backlog</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate mobile-text">{metrics.queueBacklog}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 mr-1 flex-shrink-0" />
            <span className="text-orange-600 truncate">Processing</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Pending Actions */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 mobile-card">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mobile-text">Pending Actions</h2>
            <p className="text-xs sm:text-sm text-gray-600 mobile-text-secondary">Items requiring your attention</p>
          </div>
          <div className="p-4 sm:p-6 action-card">
            {pendingActions.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">No pending actions</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{action.title}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium ${getPriorityColor(action.priority)} w-fit`}>
                          {action.priority}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{action.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{action.createdAt}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex-shrink-0">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mobile-card">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mobile-text">Quick Actions</h2>
            <p className="text-xs sm:text-sm text-gray-600 mobile-text-secondary">Common administrative tasks</p>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Add User</p>
                  <p className="text-xs text-gray-500 truncate">Create new user account</p>
                </div>
              </div>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>

            <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Add Integration</p>
                  <p className="text-xs text-gray-500 truncate">Connect new service</p>
                </div>
              </div>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>

            <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Create Goal</p>
                  <p className="text-xs text-gray-500 truncate">Set new KPI target</p>
                </div>
              </div>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>

            <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors flex-shrink-0">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">System Report</p>
                  <p className="text-xs text-gray-500 truncate">Generate health report</p>
                </div>
              </div>
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* Export & Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Export & Reports</h2>
            <p className="text-xs sm:text-sm text-gray-600">Generate and download system reports</p>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => exportSystemReport()}
              className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">System Health Report</p>
                  <p className="text-xs text-gray-500 truncate">Export system metrics</p>
                </div>
              </div>
              <Download className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>

            <button 
              onClick={() => exportUserReport()}
              className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">User Activity Report</p>
                  <p className="text-xs text-gray-500 truncate">Export user statistics</p>
                </div>
              </div>
              <Download className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>

            <button 
              onClick={() => exportAuditLog()}
              className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Audit Log Report</p>
                  <p className="text-xs text-gray-500 truncate">Export system audit trail</p>
                </div>
              </div>
              <Download className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>

            <button 
              onClick={() => exportIntegrationReport()}
              className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors flex-shrink-0">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Integration Report</p>
                  <p className="text-xs text-gray-500 truncate">Export integration status</p>
                </div>
              </div>
              <Download className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-xs sm:text-sm text-gray-600">Latest system events and user actions</p>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {[
              { action: 'User login', user: 'admin@trusttai.com', time: '2 minutes ago', type: 'info' },
              { action: 'Role updated', user: 'sarah.wilson@company.com', time: '15 minutes ago', type: 'warning' },
              { action: 'Integration connected', user: 'system', time: '1 hour ago', type: 'success' },
              { action: 'New user registered', user: 'john.doe@company.com', time: '2 hours ago', type: 'info' },
              { action: 'System backup completed', user: 'system', time: '3 hours ago', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-4 py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' : 
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-900 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.user}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
