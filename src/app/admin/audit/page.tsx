'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Shield,
  Database,
  Globe,
  Settings,
  Calendar,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceType: string
  details: string
  ipAddress: string
  userAgent: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failure' | 'pending'
  metadata: Record<string, any>
}

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('24h')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    loadAuditLogs()
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAuditLogs()
      }, 60000) // Update every minute
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, actionFilter, resourceTypeFilter, severityFilter, statusFilter, dateRange, auditLogs])

  const loadAuditLogs = () => {
    // Simulate loading audit logs
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        userId: 'user-001',
        userName: 'admin@trusttai.com',
        action: 'user_login',
        resource: 'Authentication System',
        resourceType: 'auth',
        details: 'User successfully logged in from IP 192.168.1.100',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'low',
        status: 'success',
        metadata: {
          location: 'San Francisco, CA',
          device: 'MacBook Pro',
          browser: 'Chrome'
        }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        userId: 'user-002',
        userName: 'john.doe@company.com',
        action: 'user_created',
        resource: 'User Management',
        resourceType: 'user',
        details: 'New user account created with role: developer',
        ipAddress: '203.0.113.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        status: 'success',
        metadata: {
          role: 'developer',
          department: 'Engineering',
          permissions: ['read', 'write']
        }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        userId: 'user-003',
        userName: 'sarah.wilson@company.com',
        action: 'permission_modified',
        resource: 'Role Management',
        resourceType: 'role',
        details: 'User permissions modified: added admin access',
        ipAddress: '198.51.100.123',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        severity: 'high',
        status: 'success',
        metadata: {
          oldPermissions: ['read'],
          newPermissions: ['read', 'write', 'admin'],
          reason: 'Promotion to team lead'
        }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        userId: 'user-004',
        userName: 'mike.johnson@company.com',
        action: 'data_export',
        resource: 'User Data',
        resourceType: 'data',
        details: 'Bulk export of user data initiated',
        ipAddress: '172.16.0.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'medium',
        status: 'success',
        metadata: {
          exportType: 'user_list',
          recordCount: 1250,
          format: 'CSV'
        }
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: 'user-005',
        userName: 'emily.brown@company.com',
        action: 'failed_login',
        resource: 'Authentication System',
        resourceType: 'auth',
        details: 'Failed login attempt with incorrect password',
        ipAddress: '203.0.113.67',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        status: 'failure',
        metadata: {
          failedAttempts: 3,
          lockoutTriggered: false,
          location: 'Unknown'
        }
      }
    ]
    setAuditLogs(mockLogs)
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...auditLogs]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    // Resource type filter
    if (resourceTypeFilter !== 'all') {
      filtered = filtered.filter(log => log.resourceType === resourceTypeFilter)
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter)
    }

    // Date range filter
    const now = new Date()
    if (dateRange === '1h') {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) > new Date(now.getTime() - 60 * 60 * 1000)
      )
    } else if (dateRange === '24h') {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
      )
    } else if (dateRange === '7d') {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      )
    } else if (dateRange === '30d') {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      )
    }

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const exportAuditLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Severity', 'Status'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.userName,
        log.action,
        log.resource,
        log.details,
        log.ipAddress,
        log.severity,
        log.status
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'failure': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_login': return <User className="h-4 w-4 text-blue-600" />
      case 'user_created': return <User className="h-4 w-4 text-green-600" />
      case 'permission_modified': return <Shield className="h-4 w-4 text-orange-600" />
      case 'data_export': return <Download className="h-4 w-4 text-purple-600" />
      case 'failed_login': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'auth': return <Shield className="h-4 w-4 text-blue-600" />
      case 'user': return <User className="h-4 w-4 text-green-600" />
      case 'role': return <Shield className="h-4 w-4 text-purple-600" />
      case 'data': return <Database className="h-4 w-4 text-orange-600" />
      default: return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive audit trail of all system activities and user actions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-600">
              Auto-refresh
            </label>
          </div>
          <button
            onClick={loadAuditLogs}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportAuditLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Actions</option>
                  <option value="user_login">User Login</option>
                  <option value="user_created">User Created</option>
                  <option value="permission_modified">Permission Modified</option>
                  <option value="data_export">Data Export</option>
                  <option value="failed_login">Failed Login</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                <select
                  value={resourceTypeFilter}
                  onChange={(e) => setResourceTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="auth">Authentication</option>
                  <option value="user">User Management</option>
                  <option value="role">Role Management</option>
                  <option value="data">Data Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failure">Failure</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setActionFilter('all')
                    setResourceTypeFilter('all')
                    setSeverityFilter('all')
                    setStatusFilter('all')
                    setDateRange('24h')
                    setSearchTerm('')
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Audit Logs ({filteredLogs.length})
            </h2>
            <p className="text-sm text-gray-500">
              Showing {currentLogs.length} of {filteredLogs.length} logs
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.map((log) => (
                <>
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {getActionIcon(log.action)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-gray-500">{log.details}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.userName}</div>
                      <div className="text-xs text-gray-500">{log.ipAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(log.resourceType)}
                        <span className="text-sm text-gray-900">{log.resource}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleLogExpansion(log.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 ml-auto"
                      >
                        {expandedLogs.has(log.id) ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedLogs.has(log.id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                              <p className="text-sm text-gray-600">{log.details}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
                              <div className="text-sm text-gray-600">
                                {Object.entries(log.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="font-medium">{key}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">User Agent</h4>
                              <p className="text-xs text-gray-600 break-all">{log.userAgent}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">IP Address</h4>
                              <p className="text-sm text-gray-600">{log.ipAddress}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Timestamp</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(log.timestamp).toISOString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLogs.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Page {currentPage} of {Math.ceil(filteredLogs.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredLogs.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredLogs.length / itemsPerPage)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
