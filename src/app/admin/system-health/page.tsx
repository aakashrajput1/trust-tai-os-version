'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  HardDrive, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Users
} from 'lucide-react'
import adminService from '@/services/adminService'
import { SystemHealth, SystemMetrics, ComponentHealth, SystemAlert } from '@/types/admin'

export default function SystemHealthPage() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadSystemHealth()
  }, [])

  const loadSystemHealth = async () => {
    try {
      setLoading(true)
      const response = await adminService.getSystemHealth()
      setSystemHealth(response)
    } catch (error) {
      console.error('Error loading system health:', error)
      // Load mock data for development
      setSystemHealth(getMockSystemHealth())
    } finally {
      setLoading(false)
    }
  }

  const refreshHealth = async () => {
    try {
      setRefreshing(true)
      await loadSystemHealth()
    } finally {
      setRefreshing(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      const response = await adminService.exportSystemHealthReport()
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(response)
        const a = document.createElement('a')
        a.href = url
        a.download = `system-health-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const dataStr = JSON.stringify(systemHealth, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(dataBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `system-health-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting system health:', error)
    } finally {
      setExporting(false)
    }
  }

  const getMockSystemHealth = (): SystemHealth => ({
    overall: 'healthy',
    lastUpdated: new Date().toISOString(),
    metrics: {
      cpuUsage: 35,
      memoryUsage: 62,
      diskUsage: 48,
      networkLatency: 120,
      activeConnections: 152,
      requestRate: 2300,
      errorRate: 0.8,
      responseTime: 245
    },
    components: [
      {
        name: 'Database',
        status: 'healthy',
        responseTime: 45,
        uptime: 99.99,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'API Gateway',
        status: 'healthy',
        responseTime: 120,
        uptime: 99.95,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'File Storage',
        status: 'healthy',
        responseTime: 85,
        uptime: 99.97,
        lastCheck: new Date().toISOString(),
      },
      {
        name: 'Email Service',
        status: 'warning',
        responseTime: 350,
        uptime: 99.8,
        lastCheck: new Date().toISOString(),
        errorMessage: 'Slight delay in email delivery'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'warning',
        title: 'Degraded email performance',
        message: 'Email service response time increased',
        component: 'Email Service',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isResolved: false
      }
    ]
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'offline': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'offline': return <Clock className="h-5 w-5 text-gray-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-green-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading system health...</p>
        </div>
      </div>
    )
  }

  if (!systemHealth) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load system health</h3>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="mt-2 text-gray-600">
          Monitor system performance, component status, and overall health
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Last updated:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(systemHealth.lastUpdated).toLocaleString()}
            </span>
          </div>
          <button
            onClick={refreshHealth}
            disabled={refreshing}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {exporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Overall System Status</h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemHealth.overall)}`}>
            {getStatusIcon(systemHealth.overall)}
            <span className="ml-2 capitalize">{systemHealth.overall}</span>
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{systemHealth.metrics.responseTime}ms</div>
            <div className="text-sm text-gray-600">API Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{systemHealth.metrics.errorRate}%</div>
            <div className="text-sm text-gray-600">Error Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{systemHealth.metrics.activeConnections}</div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">CPU Usage</div>
              <div className="text-lg font-semibold text-gray-900">{systemHealth.metrics.cpuUsage}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Memory Usage</div>
              <div className="text-lg font-semibold text-gray-900">{systemHealth.metrics.memoryUsage}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Disk Usage</div>
              <div className="text-lg font-semibold text-gray-900">{systemHealth.metrics.diskUsage}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Network Latency</div>
              <div className="text-lg font-semibold text-gray-900">{systemHealth.metrics.networkLatency}ms</div>
            </div>
          </div>
        </div>

        {/* Integration Metrics */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-green-600" />
            Integration Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Request Rate</span>
              <span className="text-lg font-semibold text-gray-900">{systemHealth.metrics.requestRate}/min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="text-lg font-semibold text-gray-900">{systemHealth.metrics.activeConnections}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min(100, Math.max(0, (systemHealth.metrics.activeConnections / Math.max(1, systemHealth.metrics.requestRate)) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Health */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Component Health</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {systemHealth.components.map((component) => (
            <div key={component.name} className="px-6 py-4">
              <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(component.status)}
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">{component.name}</h4>
                {('errorMessage' in component) && (component as any).errorMessage && (
                  <p className="text-sm text-gray-500">{(component as any).errorMessage}</p>
                )}
              </div>
            </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{component.responseTime}ms</div>
                    <div className="text-xs text-gray-500">Response Time</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{component.uptime}%</div>
                    <div className="text-xs text-gray-500">Uptime</div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                    {component.status.charAt(0).toUpperCase() + component.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      {systemHealth.alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {systemHealth.alerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{alert.title || 'System Alert'}</h4>
                      <p className="text-sm text-gray-500">{alert.message}</p>
                      <p className="text-sm text-gray-500">
                        Component: {alert.component} • {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    alert.type === 'critical' ? 'text-red-800 bg-red-100' :
                    alert.type === 'error' ? 'text-orange-800 bg-orange-100' :
                    alert.type === 'warning' ? 'text-yellow-800 bg-yellow-100' :
                    'text-blue-800 bg-blue-100'
                  }`}>
                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Alerts Message */}
      {systemHealth.alerts.length === 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Systems Operational</h3>
          <p className="text-gray-500">No active alerts at this time.</p>
        </div>
      )}
    </div>
  )
}
