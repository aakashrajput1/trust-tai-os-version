'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Brain, 
  Settings, 
  Zap, 
  Workflow, 
  Code, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Database,
  Palette,
  Layers,
  ArrowRight,
  ArrowLeft,
  Cpu,
  HardDrive,
  Network,
  Gauge,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Key,
  Lock,
  Unlock
} from 'lucide-react'

interface AISummarySetting {
  id: string
  name: string
  type: 'text' | 'data' | 'report' | 'email'
  model: string
  maxTokens: number
  temperature: number
  isActive: boolean
  usageCount: number
  accuracy: number
  lastUpdated: string
}

interface MLParameter {
  id: string
  name: string
  category: 'model' | 'training' | 'inference' | 'optimization'
  value: number | string | boolean
  unit?: string
  description: string
  isActive: boolean
  recommendedValue?: number | string
  minValue?: number
  maxValue?: number
}

interface AutomationRule {
  id: string
  name: string
  trigger: string
  conditions: string[]
  actions: string[]
  isActive: boolean
  executionCount: number
  lastExecuted?: string
  successRate: number
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface CustomWorkflow {
  id: string
  name: string
  description: string
  steps: string[]
  isActive: boolean
  executionCount: number
  avgExecutionTime: number
  lastExecuted?: string
  successRate: number
  createdBy: string
}

interface APIAccess {
  id: string
  name: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  rateLimit: number
  currentUsage: number
  isActive: boolean
  lastAccessed?: string
  responseTime: number
}

export default function AIConfigurationPage() {
  const [activeTab, setActiveTab] = useState('ai-summary')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddRuleModal, setShowAddRuleModal] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [autoLearning, setAutoLearning] = useState(true)
  const [modelVersion, setModelVersion] = useState('gpt-4')

  // Mock data
  const aiSummarySettings: AISummarySetting[] = [
    {
      id: '1',
      name: 'Email Summarization',
      type: 'email',
      model: 'gpt-4',
      maxTokens: 500,
      temperature: 0.7,
      isActive: true,
      usageCount: 1247,
      accuracy: 94.5,
      lastUpdated: '2024-02-10T10:30:00Z'
    },
    {
      id: '2',
      name: 'Report Generation',
      type: 'report',
      model: 'gpt-4-turbo',
      maxTokens: 1000,
      temperature: 0.3,
      isActive: true,
      usageCount: 856,
      accuracy: 97.2,
      lastUpdated: '2024-02-09T14:15:00Z'
    },
    {
      id: '3',
      name: 'Data Analysis',
      type: 'data',
      model: 'claude-3',
      maxTokens: 800,
      temperature: 0.1,
      isActive: true,
      usageCount: 623,
      accuracy: 96.8,
      lastUpdated: '2024-02-08T09:45:00Z'
    }
  ]

  const mlParameters: MLParameter[] = [
    {
      id: '1',
      name: 'Learning Rate',
      category: 'training',
      value: 0.001,
      unit: '',
      description: 'Step size for gradient descent',
      isActive: true,
      recommendedValue: 0.001,
      minValue: 0.0001,
      maxValue: 0.01
    },
    {
      id: '2',
      name: 'Batch Size',
      category: 'training',
      value: 32,
      unit: '',
      description: 'Number of samples per training batch',
      isActive: true,
      recommendedValue: 32,
      minValue: 8,
      maxValue: 128
    },
    {
      id: '3',
      name: 'Epochs',
      category: 'training',
      value: 100,
      unit: '',
      description: 'Number of training epochs',
      isActive: true,
      recommendedValue: 100,
      minValue: 10,
      maxValue: 500
    },
    {
      id: '4',
      name: 'Model Confidence Threshold',
      category: 'inference',
      value: 0.8,
      unit: '',
      description: 'Minimum confidence for predictions',
      isActive: true,
      recommendedValue: 0.8,
      minValue: 0.5,
      maxValue: 0.95
    },
    {
      id: '5',
      name: 'Cache Size',
      category: 'optimization',
      value: 1024,
      unit: 'MB',
      description: 'Model cache size in memory',
      isActive: true,
      recommendedValue: 1024,
      minValue: 256,
      maxValue: 4096
    }
  ]

  const automationRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Auto Task Assignment',
      trigger: 'new_task_created',
      conditions: ['priority = high', 'category = development'],
      actions: ['assign_to_available_developer', 'send_notification'],
      isActive: true,
      executionCount: 156,
      lastExecuted: '2024-02-10T15:30:00Z',
      successRate: 98.5,
      priority: 'high'
    },
    {
      id: '2',
      name: 'SLA Warning Alert',
      trigger: 'task_approaching_deadline',
      conditions: ['time_remaining < 2h', 'status != completed'],
      actions: ['send_urgent_notification', 'escalate_to_manager'],
      isActive: true,
      executionCount: 89,
      lastExecuted: '2024-02-10T14:15:00Z',
      successRate: 100.0,
      priority: 'critical'
    },
    {
      id: '3',
      name: 'Weekly Report Generation',
      trigger: 'weekly_schedule',
      conditions: ['day_of_week = monday', 'time = 9:00'],
      actions: ['generate_weekly_report', 'send_email_to_stakeholders'],
      isActive: true,
      executionCount: 12,
      lastExecuted: '2024-02-05T09:00:00Z',
      successRate: 95.8,
      priority: 'medium'
    }
  ]

  const customWorkflows: CustomWorkflow[] = [
    {
      id: '1',
      name: 'Bug Triage Process',
      description: 'Automated bug triage and assignment workflow',
      steps: ['Analyze bug report', 'Assign priority', 'Route to appropriate team', 'Send confirmation'],
      isActive: true,
      executionCount: 234,
      avgExecutionTime: 2.5,
      lastExecuted: '2024-02-10T16:45:00Z',
      successRate: 96.2,
      createdBy: 'John Admin'
    },
    {
      id: '2',
      name: 'Client Onboarding',
      description: 'Automated client onboarding process',
      steps: ['Create client profile', 'Assign account manager', 'Send welcome email', 'Schedule kickoff meeting'],
      isActive: true,
      executionCount: 45,
      avgExecutionTime: 5.2,
      lastExecuted: '2024-02-09T11:20:00Z',
      successRate: 100.0,
      createdBy: 'Sarah Manager'
    },
    {
      id: '3',
      name: 'Invoice Processing',
      description: 'Automated invoice generation and processing',
      steps: ['Calculate billable hours', 'Generate invoice', 'Send to client', 'Update accounting system'],
      isActive: true,
      executionCount: 67,
      avgExecutionTime: 3.8,
      lastExecuted: '2024-02-10T10:00:00Z',
      successRate: 94.8,
      createdBy: 'Mike Finance'
    }
  ]

  const apiAccess: APIAccess[] = [
    {
      id: '1',
      name: 'User Management API',
      endpoint: '/api/users',
      method: 'GET',
      rateLimit: 1000,
      currentUsage: 234,
      isActive: true,
      lastAccessed: '2024-02-10T17:30:00Z',
      responseTime: 125
    },
    {
      id: '2',
      name: 'Project Data API',
      endpoint: '/api/projects',
      method: 'POST',
      rateLimit: 500,
      currentUsage: 89,
      isActive: true,
      lastAccessed: '2024-02-10T16:45:00Z',
      responseTime: 89
    },
    {
      id: '3',
      name: 'Analytics API',
      endpoint: '/api/analytics',
      method: 'GET',
      rateLimit: 200,
      currentUsage: 156,
      isActive: true,
      lastAccessed: '2024-02-10T15:20:00Z',
      responseTime: 234
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'model': return 'bg-blue-100 text-blue-800'
      case 'training': return 'bg-green-100 text-green-800'
      case 'inference': return 'bg-purple-100 text-purple-800'
      case 'optimization': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const runWorkflow = (workflowId: string) => {
    console.log(`Running workflow ${workflowId}`)
    // Implementation for workflow execution
  }

  const testAutomationRule = (ruleId: string) => {
    console.log(`Testing automation rule ${ruleId}`)
    // Implementation for rule testing
  }

  const exportConfiguration = (format: string) => {
    console.log(`Exporting AI configuration as ${format}`)
    // Implementation for export
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Configuration</h1>
          <p className="text-gray-600">Configure AI models, automation rules, and ML parameters</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddRuleModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
          <Button variant="outline" onClick={() => exportConfiguration('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Models Active</p>
                <p className="text-2xl font-bold text-gray-900">{aiSummarySettings.filter(s => s.isActive).length}</p>
                <p className="text-xs text-green-600">+1 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Automation Rules</p>
                <p className="text-2xl font-bold text-gray-900">{automationRules.filter(r => r.isActive).length}</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Workflow className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{customWorkflows.filter(w => w.isActive).length}</p>
                <p className="text-xs text-green-600">+1 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Gauge className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">145ms</p>
                <p className="text-xs text-green-600">-12ms from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'ai-summary', name: 'AI Summary Settings', icon: Brain },
            { id: 'ml-parameters', name: 'ML Parameters', icon: Settings },
            { id: 'automation-rules', name: 'Automation Rules', icon: Zap },
            { id: 'custom-workflows', name: 'Custom Workflows', icon: Workflow },
            { id: 'api-access', name: 'API Access', icon: Code }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* AI Summary Settings Tab */}
        {activeTab === 'ai-summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Input
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="report">Report</option>
                  <option value="data">Data</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiSummarySettings.map((setting) => (
                <Card key={setting.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{setting.name}</CardTitle>
                        <CardDescription>{setting.type.toUpperCase()} Summary</CardDescription>
                      </div>
                      <Badge className={setting.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {setting.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Model:</span>
                      <span className="font-medium">{setting.model}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Max Tokens:</span>
                      <span className="font-medium">{setting.maxTokens}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Temperature:</span>
                      <span className="font-medium">{setting.temperature}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Usage Count:</span>
                      <span className="font-medium">{setting.usageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className={`font-medium ${getSuccessRateColor(setting.accuracy)}`}>
                        {setting.accuracy}%
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ML Parameters Tab */}
        {activeTab === 'ml-parameters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Machine Learning Parameters</h3>
                <p className="text-gray-600">Configure ML model parameters and training settings</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Parameter
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Parameter</th>
                        <th className="text-left py-2">Category</th>
                        <th className="text-left py-2">Value</th>
                        <th className="text-left py-2">Recommended</th>
                        <th className="text-left py-2">Range</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mlParameters.map((param) => (
                        <tr key={param.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">
                            <div>
                              <div className="font-medium">{param.name}</div>
                              <div className="text-sm text-gray-600">{param.description}</div>
                            </div>
                          </td>
                          <td className="py-2">
                            <Badge className={getCategoryColor(param.category)}>
                              {param.category}
                            </Badge>
                          </td>
                          <td className="py-2">
                            <span className="font-medium">{param.value}{param.unit}</span>
                          </td>
                          <td className="py-2">
                            <span className="text-sm text-gray-600">{param.recommendedValue}{param.unit}</span>
                          </td>
                          <td className="py-2">
                            <span className="text-sm text-gray-600">
                              {param.minValue} - {param.maxValue}{param.unit}
                            </span>
                          </td>
                          <td className="py-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Automation Rules Tab */}
        {activeTab === 'automation-rules' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Automation Rules</h3>
                <p className="text-gray-600">Configure automated workflows and triggers</p>
              </div>
              <Button onClick={() => setShowAddRuleModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {automationRules.map((rule) => (
                <Card key={rule.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <CardDescription>Trigger: {rule.trigger}</CardDescription>
                      </div>
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {rule.conditions.map((condition) => (
                          <Badge key={condition} className="bg-yellow-100 text-yellow-800 text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions.map((action) => (
                          <Badge key={action} className="bg-green-100 text-green-800 text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Executions:</span>
                      <span className="font-medium">{rule.executionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate:</span>
                      <span className={`font-medium ${getSuccessRateColor(rule.successRate)}`}>
                        {rule.successRate}%
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => testAutomationRule(rule.id)}>
                        <Play className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Custom Workflows Tab */}
        {activeTab === 'custom-workflows' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Custom Workflows</h3>
                <p className="text-gray-600">Manage custom business process automation</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customWorkflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                      </div>
                      <Badge className={workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Steps:</p>
                      <div className="space-y-1">
                        {workflow.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Executions:</span>
                      <span className="font-medium">{workflow.executionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Time:</span>
                      <span className="font-medium">{workflow.avgExecutionTime}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Success Rate:</span>
                      <span className={`font-medium ${getSuccessRateColor(workflow.successRate)}`}>
                        {workflow.successRate}%
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => runWorkflow(workflow.id)}>
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* API Access Tab */}
        {activeTab === 'api-access' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">API Access Management</h3>
                <p className="text-gray-600">Monitor and manage API endpoints and rate limits</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Endpoint
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">API Name</th>
                        <th className="text-left py-2">Endpoint</th>
                        <th className="text-left py-2">Method</th>
                        <th className="text-left py-2">Rate Limit</th>
                        <th className="text-left py-2">Current Usage</th>
                        <th className="text-left py-2">Response Time</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiAccess.map((api) => (
                        <tr key={api.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">{api.name}</td>
                          <td className="py-2 text-sm">{api.endpoint}</td>
                          <td className="py-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {api.method}
                            </Badge>
                          </td>
                          <td className="py-2">{api.rateLimit}/min</td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <span>{api.currentUsage}</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(api.currentUsage / api.rateLimit) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2">{api.responseTime}ms</td>
                          <td className="py-2">
                            <Badge className={api.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {api.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


