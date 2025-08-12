'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  Wifi,
  HardDrive,
  MemoryStick,
  Cpu
} from 'lucide-react'

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
}

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Add a small delay to simulate real loading
        await new Promise(resolve => setTimeout(resolve, 500))
        loadSystemMetrics()
        loadSystemAlerts()
      } catch (error) {
        console.error('Error loading system health data:', error)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }
    
    loadData()
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Don't show loading state for auto-refresh
        loadSystemMetrics()
        loadSystemAlerts()
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadSystemMetrics = () => {
    console.log('Loading system metrics...')
    // Simulate loading system metrics
    const mockMetrics: SystemMetric[] = [
      {
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'healthy',
        trend: 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Memory Usage',
        value: 78,
        unit: '%',
        status: 'warning',
        trend: 'up',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Disk Usage',
        value: 62,
        unit: '%',
        status: 'healthy',
        trend: 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Network Latency',
        value: 12,
        unit: 'ms',
        status: 'healthy',
        trend: 'down',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Database Connections',
        value: 156,
        unit: '',
        status: 'healthy',
        trend: 'stable',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'API Response Time',
        value: 89,
        unit: 'ms',
        status: 'warning',
        trend: 'up',
        lastUpdated: new Date().toISOString()
      }
    ]
    setMetrics(mockMetrics)
  }

  const loadSystemAlerts = () => {
    console.log('Loading system alerts...')
    // Simulate loading system alerts
    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'warning',
        message: 'Memory usage is approaching 80% threshold',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        acknowledged: false
      },
      {
        id: '2',
        type: 'info',
        message: 'Scheduled maintenance completed successfully',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        acknowledged: true
      },
      {
        id: '3',
        type: 'critical',
        message: 'Database connection pool at 90% capacity',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        acknowledged: false
      }
    ]
    setAlerts(mockAlerts)
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'stable': return <TrendingUp className="h-4 w-4 text-gray-400" />
      default: return <TrendingUp className="h-4 w-4 text-gray-400" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'info': return 'border-blue-200 bg-blue-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'critical': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="mt-2 text-gray-600">
            Monitor system performance, resources, and alerts in real-time
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
            onClick={async () => {
              setLoading(true)
              try {
                await new Promise(resolve => setTimeout(resolve, 300))
                loadSystemMetrics()
                loadSystemAlerts()
                setLastUpdate(new Date())
              } finally {
                setLoading(false)
              }
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-sm text-gray-500 text-center">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-green-600">Healthy</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {alerts.filter(a => !a.acknowledged).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-blue-600">99.9%</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-purple-600">Good</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Metrics</h2>
          <p className="text-sm text-gray-600">Real-time performance indicators</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}{metric.unit}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className="text-xs text-gray-500">
                      {new Date(metric.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
          <p className="text-sm text-gray-600">Active system notifications and warnings</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Acknowledge
                    </button>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.acknowledged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.acknowledged ? 'Acknowledged' : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Infrastructure Status</h2>
          <p className="text-sm text-gray-600">Core system components and services</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Server className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Web Server</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">CDN</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Wifi className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">API Gateway</p>
                <p className="text-xs text-green-600">Operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
