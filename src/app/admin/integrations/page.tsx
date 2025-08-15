'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, 
  Plus, 
  Search, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  TestTube,
  Trash2,
  Edit,
  Eye
} from 'lucide-react'
import { Integration, IntegrationStatus, IntegrationType } from '@/types/admin'

export default function IntegrationsManagement() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddIntegration, setShowAddIntegration] = useState(false)
  const [showEditIntegration, setShowEditIntegration] = useState(false)
  const [showViewIntegration, setShowViewIntegration] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      // Load mock data for development
      setIntegrations(getMockIntegrations())
    } catch (error) {
      console.error('Error loading integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      if (format === 'csv') {
        const dataStr = integrations.map(integration => ({
          Name: integration.name,
          Type: integration.type,
          Status: integration.status,
          Provider: integration.provider,
          'Last Sync': integration.lastSync,
          'Error Count': integration.errorCount,
          'Is Active': integration.isActive ? 'Yes' : 'No'
        })).map(row => Object.values(row).join(',')).join('\n')
        
        const blob = new Blob([dataStr], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `integrations-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const dataStr = JSON.stringify(integrations, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `integrations-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting integrations:', error)
    } finally {
      setExporting(false)
    }
  }

  const getMockIntegrations = (): Integration[] => [
    {
      id: '1',
      name: 'Stripe Payment Gateway',
      type: 'api_key',
      provider: 'Stripe',
      status: 'active',
      config: {
        apiKey: 'sk_test_...',
        baseUrl: 'https://api.stripe.com',
        customHeaders: {
          'Stripe-Version': '2023-10-26'
        }
      },
      lastSync: '2024-01-15T10:30:00Z',
      syncInterval: 60,
      errorCount: 2,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      metadata: {
        category: 'Payments',
        supportedCurrencies: ['USD', 'EUR', 'GBP']
      }
    },
    {
      id: '2',
      name: 'SendGrid Email Service',
      type: 'api_key',
      provider: 'SendGrid',
      status: 'active',
      config: {
        apiKey: 'SG...',
        baseUrl: 'https://api.sendgrid.com',
        customHeaders: {
          'Content-Type': 'application/json'
        }
      },
      lastSync: '2024-01-15T09:15:00Z',
      syncInterval: 30,
      errorCount: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      metadata: {
        category: 'Communication',
        defaultFromEmail: 'noreply@example.com'
      }
    },
    {
      id: '3',
      name: 'Slack Notifications',
      type: 'webhook',
      provider: 'Slack',
      status: 'error',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...',
        customHeaders: {
          'Content-Type': 'application/json'
        }
      },
      lastSync: '2024-01-15T08:45:00Z',
      syncInterval: 15,
      errorCount: 15,
      lastError: 'Webhook URL expired',
      isActive: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T08:45:00Z',
      metadata: {
        category: 'Communication',
        defaultChannel: '#alerts'
      }
    }
  ]

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      case 'syncing': return 'text-yellow-600 bg-yellow-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'inactive': return <X className="h-5 w-5 text-gray-600" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'syncing': return <TestTube className="h-5 w-5 text-yellow-600" />
      case 'disconnected': return <X className="h-5 w-5 text-gray-600" />
      default: return <TestTube className="h-5 w-5 text-gray-600" />
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
          <p className="mt-4 text-gray-600">Loading integrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Integration Management</h1>
        <p className="mt-2 text-gray-600">
          Manage third-party integrations, APIs, and external service connections
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
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {/* Refresh */}
          <button
            onClick={loadIntegrations}
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

          {/* Add Integration */}
          <button
            onClick={() => setShowAddIntegration(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)}
                <span className="ml-1 capitalize">{integration.status}</span>
              </span>
            </div>

            {/* Provider */}
            <p className="text-sm text-gray-600 mb-4">Provider: {integration.provider}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{integration.errorCount}</div>
                <div className="text-xs text-gray-500">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{integration.syncInterval}m</div>
                <div className="text-xs text-gray-500">Sync Interval</div>
              </div>
            </div>

            {/* Last Sync */}
            <div className="text-xs text-gray-500 mb-4">
              Last sync: {formatTimestamp(integration.lastSync)}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedIntegration(integration)
                    setShowViewIntegration(true)
                  }}
                  className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setSelectedIntegration(integration)
                    setShowEditIntegration(true)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit Integration"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${integration.name}?`)) {
                      setIntegrations(prev => prev.filter(i => i.id !== integration.id))
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete Integration"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {integrations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first integration.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddIntegration(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </button>
          )}
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Integration</h2>
              <button
                onClick={() => setShowAddIntegration(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter integration name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Integration Type *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select type</option>
                    <option value="oauth">OAuth</option>
                    <option value="api_key">API Key</option>
                    <option value="webhook">Webhook</option>
                    <option value="sso">SSO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter provider name"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddIntegration(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Integration Modal */}
      {showViewIntegration && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Integration Details: {selectedIntegration.name}</h2>
              <button
                onClick={() => setShowViewIntegration(false)}
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
                    <label className="block text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm text-gray-900">{selectedIntegration.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedIntegration.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Provider</label>
                    <p className="text-sm text-gray-900">{selectedIntegration.provider}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIntegration.status)}`}>
                      {getStatusIcon(selectedIntegration.status)}
                      <span className="ml-1 capitalize">{selectedIntegration.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{selectedIntegration.errorCount}</div>
                    <div className="text-sm text-gray-600">Error Count</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{selectedIntegration.syncInterval}m</div>
                    <div className="text-sm text-gray-600">Sync Interval</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTimestamp(selectedIntegration.lastSync)}
                    </div>
                    <div className="text-sm text-gray-600">Last Sync</div>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Configuration</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                    {JSON.stringify(selectedIntegration.config, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Metadata */}
              {selectedIntegration.metadata && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Metadata</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                      {JSON.stringify(selectedIntegration.metadata, null, 2)}
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
