'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  CheckCircle,
  X,
  AlertTriangle,
  RefreshCw,
  Link,
  Unlink,
  Activity,
  Shield,
  Database,
  MessageSquare,
  Calendar,
  CreditCard
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync: string
  nextSync: string
  apiCalls: number
  errorCount: number
  isConnected: boolean
  description: string
  icon: string
}

interface IntegrationMetrics {
  totalIntegrations: number
  activeIntegrations: number
  errorIntegrations: number
  totalApiCalls: number
  syncSuccessRate: number
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [metrics, setMetrics] = useState<IntegrationMetrics>({
    totalIntegrations: 0,
    activeIntegrations: 0,
    errorIntegrations: 0,
    totalApiCalls: 0,
    syncSuccessRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateIntegration, setShowCreateIntegration] = useState(false)
  const [showSandboxModal, setShowSandboxModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [sandboxMode, setSandboxMode] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockIntegrations: Integration[] = [
        {
          id: '1',
          name: 'Slack',
          type: 'communication',
          status: 'active',
          lastSync: '2 minutes ago',
          nextSync: 'in 3 minutes',
          apiCalls: 1247,
          errorCount: 0,
          isConnected: true,
          description: 'Team communication and notifications',
          icon: 'slack'
        },
        {
          id: '2',
          name: 'GitHub',
          type: 'development',
          status: 'active',
          lastSync: '5 minutes ago',
          nextSync: 'in 10 minutes',
          apiCalls: 892,
          errorCount: 2,
          isConnected: true,
          description: 'Code repository and version control',
          icon: 'github'
        },
        {
          id: '3',
          name: 'Jira',
          type: 'project_management',
          status: 'active',
          lastSync: '1 minute ago',
          nextSync: 'in 4 minutes',
          apiCalls: 1567,
          errorCount: 0,
          isConnected: true,
          description: 'Project tracking and issue management',
          icon: 'jira'
        },
        {
          id: '4',
          name: 'Stripe',
          type: 'payment',
          status: 'error',
          lastSync: '1 hour ago',
          nextSync: 'retry in 30 minutes',
          apiCalls: 234,
          errorCount: 15,
          isConnected: false,
          description: 'Payment processing and billing',
          icon: 'stripe'
        },
        {
          id: '5',
          name: 'Google Calendar',
          type: 'calendar',
          status: 'inactive',
          lastSync: '3 days ago',
          nextSync: 'not scheduled',
          apiCalls: 89,
          errorCount: 0,
          isConnected: false,
          description: 'Calendar integration and scheduling',
          icon: 'calendar'
        },
        {
          id: '6',
          name: 'HubSpot',
          type: 'crm',
          status: 'pending',
          lastSync: 'never',
          nextSync: 'pending setup',
          apiCalls: 0,
          errorCount: 0,
          isConnected: false,
          description: 'Customer relationship management',
          icon: 'hubspot'
        }
      ]

      const mockMetrics: IntegrationMetrics = {
        totalIntegrations: 6,
        activeIntegrations: 3,
        errorIntegrations: 1,
        totalApiCalls: 4029,
        syncSuccessRate: 95.2
      }

      setIntegrations(mockIntegrations)
      setMetrics(mockMetrics)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'inactive': return <X className="h-4 w-4 text-gray-600" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'pending': return <RefreshCw className="h-4 w-4 text-yellow-600" />
      default: return <X className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'communication': return <MessageSquare className="h-5 w-5" />
      case 'development': return <Database className="h-5 w-5" />
      case 'project_management': return <Activity className="h-5 w-5" />
      case 'payment': return <CreditCard className="h-5 w-5" />
      case 'calendar': return <Calendar className="h-5 w-5" />
      case 'crm': return <Shield className="h-5 w-5" />
      default: return <Settings className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'communication': return 'bg-blue-100 text-blue-800'
      case 'development': return 'bg-purple-100 text-purple-800'
      case 'project_management': return 'bg-green-100 text-green-800'
      case 'payment': return 'bg-emerald-100 text-emerald-800'
      case 'calendar': return 'bg-orange-100 text-orange-800'
      case 'crm': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleConnection = async (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, isConnected: !integration.isConnected }
        : integration
    ))
  }

  const refreshIntegration = async (integrationId: string) => {
    // Simulate refresh
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, lastSync: 'just now', nextSync: 'in 5 minutes' }
        : integration
    ))
  }

  const exportIntegrationsReport = () => {
    // Simulate CSV export
    const csvContent = integrations.map(integration => 
      `${integration.name},${integration.type},${integration.status},${integration.lastSync},${integration.apiCalls},${integration.errorCount}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'integrations-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading integrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-2 text-gray-600">
            Manage external service connections and API integrations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportIntegrationsReport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => setShowCreateIntegration(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Integration</span>
          </button>
        </div>
      </div>

      {/* Integration Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Integrations</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalIntegrations}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.activeIntegrations}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.errorIntegrations}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">API Calls</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalApiCalls.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.syncSuccessRate}%</p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Connected Services ({integrations.length})
          </h2>
          <p className="text-sm text-gray-600">
            Monitor and manage your external integrations
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {integrations.map((integration) => (
            <div key={integration.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(integration.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(integration.type)}`}>
                        {integration.type.replace('_', ' ').charAt(0).toUpperCase() + integration.type.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Last sync: {integration.lastSync}</span>
                      <span>•</span>
                      <span>Next sync: {integration.nextSync}</span>
                      <span>•</span>
                      <span>API calls: {integration.apiCalls.toLocaleString()}</span>
                      {integration.errorCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">Errors: {integration.errorCount}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => refreshIntegration(integration.id)}
                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Refresh integration"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => toggleConnection(integration.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      integration.isConnected
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                    title={integration.isConnected ? 'Disconnect' : 'Connect'}
                  >
                    {integration.isConnected ? <Unlink className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                  </button>
                  
                  <button className="text-gray-600 hover:text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button className="text-gray-600 hover:text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Health */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Integration Health</h2>
          <p className="text-sm text-gray-600">Real-time status and performance monitoring</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                {integrations.slice(0, 3).map((integration) => (
                  <div key={integration.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    {getStatusIcon(integration.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                      <p className="text-xs text-gray-500">Last sync: {integration.lastSync}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Refresh All Integrations</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Download Logs</span>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Integration Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
