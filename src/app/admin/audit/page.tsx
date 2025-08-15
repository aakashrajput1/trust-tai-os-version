'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  X,
  RefreshCw
} from 'lucide-react'
import adminService from '@/services/adminService'
import { AuditLog, AuditLogFilters, ExportOptions } from '@/types/admin'

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showViewLog, setShowViewLog] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [exporting, setExporting] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState<AuditLogFilters>({
    startDate: '',
    endDate: '',
    userId: '',
    action: '',
    resource: '',
    severity: '',
    category: undefined
  })

  useEffect(() => {
    loadAuditLogs()
  }, [])

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAuditLogs(
        { search: searchTerm, ...filters },
        1,
        50
      )
      setAuditLogs(response.logs || [])
    } catch (error) {
      console.error('Error loading audit logs:', error)
      // Load mock data for development
      const mockData = getMockAuditLogs()
      setAuditLogs(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadAuditLogs()
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      const exportOptions: ExportOptions = {
        format,
        filters: {
          search: searchTerm,
          ...filters
        }
      }
      
      const response = await adminService.exportAuditLogs(exportOptions)
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(response)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const dataStr = JSON.stringify(auditLogs, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(dataBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting audit logs:', error)
    } finally {
      setExporting(false)
    }
  }

  const openViewLog = (log: AuditLog) => {
    setSelectedLog(log)
    setShowViewLog(true)
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      userId: '',
      action: '',
      resource: '',
      severity: '',
      category: undefined
    })
    setSearchTerm('')
  }

  const getMockAuditLogs = (): AuditLog[] => [
    {
      id: '1',
      userId: 'user-1',
      userName: 'John Admin',
      userEmail: 'john@example.com',
      action: 'create',
      resource: 'users',
      resourceId: 'new-user-123',
      details: 'Created new user account for jane.doe@example.com',
      severity: 'medium',
      category: 'user_management',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: '2024-01-15T10:30:00Z',
      metadata: {
        department: 'IT',
        location: 'HQ'
      }
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Sarah Executive',
      userEmail: 'sarah@example.com',
      action: 'export',
      resource: 'audit_logs',
      resourceId: 'export-456',
      details: 'Exported audit logs for compliance review',
      severity: 'low',
      category: 'general',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: '2024-01-15T09:15:00Z',
      metadata: {
        exportFormat: 'CSV',
        recordCount: 1250
      }
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-800 bg-red-100'
      case 'high': return 'text-orange-800 bg-orange-100'
      case 'medium': return 'text-yellow-800 bg-yellow-100'
      case 'low': return 'text-green-800 bg-green-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'update': return <Activity className="h-4 w-4 text-blue-600" />
      case 'delete': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'login': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'logout': return <Clock className="h-4 w-4 text-gray-600" />
      case 'export': return <Download className="h-4 w-4 text-purple-600" />
      case 'import': return <Download className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

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
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-2 text-gray-600">
          Monitor and review system activity and user actions
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {/* Clear Filters */}
          {(filters.startDate || filters.endDate || filters.userId || filters.action || filters.resource || filters.severity || filters.category) && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {/* Refresh */}
          <button
            onClick={loadAuditLogs}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>

          {/* Export */}
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="export">Export</option>
                <option value="import">Import</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
              <select
                value={filters.resource}
                onChange={(e) => setFilters(prev => ({ ...prev, resource: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Resources</option>
                <option value="users">Users</option>
                <option value="roles">Roles</option>
                <option value="audit_logs">Audit Logs</option>
                <option value="system_health">System Health</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value ? (e.target.value as any) : undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="authentication">Authentication</option>
                <option value="authorization">Authorization</option>
                <option value="data_management">Data Management</option>
                <option value="system_operations">System Operations</option>
                <option value="user_management">User Management</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter user ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
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
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getActionIcon(log.action)}
                      <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {log.resource.replace('_', ' ')}
                    </div>
                    {log.resourceId && (
                      <div className="text-xs text-gray-500">ID: {log.resourceId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-900 max-w-xs truncate"
                      title={typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                    >
                      {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openViewLog(log)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {auditLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.values(filters).some(v => v) ? 'Try adjusting your search terms or filters.' : 'No activity has been logged yet.'}
            </p>
          </div>
        )}
      </div>

      {/* View Log Modal */}
      {showViewLog && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Audit Log Details</h2>
              <button
                onClick={() => setShowViewLog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Action</label>
                    <div className="flex items-center mt-1">
                      {getActionIcon(selectedLog.action)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {selectedLog.action}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Severity</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Category</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {selectedLog.category.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatTimestamp(selectedLog.timestamp)}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">User Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User Name</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLog.userName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User Email</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLog.userEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLog.userId}</p>
                  </div>
                </div>
              </div>

              {/* Resource Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Resource Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Resource Type</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {selectedLog.resource.replace('_', ' ')}
                    </p>
                  </div>
                  {selectedLog.resourceId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Resource ID</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedLog.resourceId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {typeof selectedLog.details === 'string' ? selectedLog.details : JSON.stringify(selectedLog.details)}
                </p>
              </div>

              {/* Technical Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Technical Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">IP Address</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">User Agent</label>
                    <p className="text-sm text-gray-900 mt-1 text-xs break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Metadata</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
