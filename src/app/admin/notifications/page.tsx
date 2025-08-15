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
  Smartphone, 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  TestTube,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  Zap,
  Shield,
  Wifi,
  Battery,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Palette,
  Languages,
  Calendar,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react'

interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'push' | 'sms'
  subject: string
  content: string
  variables: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AlertRule {
  id: string
  name: string
  type: 'system' | 'user' | 'business'
  condition: string
  threshold: number
  action: 'email' | 'push' | 'sms' | 'webhook'
  recipients: string[]
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
}

interface MobileAppSetting {
  id: string
  name: string
  category: 'general' | 'notifications' | 'security' | 'appearance'
  value: any
  description: string
  isEnabled: boolean
}

interface CommunicationRule {
  id: string
  name: string
  trigger: string
  conditions: string[]
  actions: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  isActive: boolean
  schedule?: string
}

export default function MobileNotificationsPage() {
  const [activeTab, setActiveTab] = useState('push-notifications')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false)
  const [showAddAlertModal, setShowAddAlertModal] = useState(false)

  // Mock data
  const notificationTemplates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to Trust TAI OS!',
      content: 'Hi {{user_name}}, welcome to our platform. We\'re excited to have you on board!',
      variables: ['user_name', 'company_name'],
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Task Assignment Push',
      type: 'push',
      subject: 'New Task Assigned',
      content: 'You have been assigned a new task: {{task_title}}',
      variables: ['task_title', 'project_name', 'due_date'],
      isActive: true,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      name: 'SLA Warning SMS',
      type: 'sms',
      subject: 'SLA Warning',
      content: 'SLA warning: Ticket {{ticket_id}} is approaching deadline',
      variables: ['ticket_id', 'time_remaining', 'priority'],
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z'
    }
  ]

  const alertRules: AlertRule[] = [
    {
      id: '1',
      name: 'High CPU Usage',
      type: 'system',
      condition: 'cpu_usage > 80',
      threshold: 80,
      action: 'email',
      recipients: ['admin@company.com', 'devops@company.com'],
      isActive: true,
      lastTriggered: '2024-02-10T14:30:00Z',
      triggerCount: 5
    },
    {
      id: '2',
      name: 'Failed Login Attempts',
      type: 'system',
      condition: 'failed_logins > 5',
      threshold: 5,
      action: 'push',
      recipients: ['security@company.com'],
      isActive: true,
      lastTriggered: '2024-02-09T16:45:00Z',
      triggerCount: 12
    },
    {
      id: '3',
      name: 'Low Disk Space',
      type: 'system',
      condition: 'disk_usage > 90',
      threshold: 90,
      action: 'webhook',
      recipients: ['monitoring@company.com'],
      isActive: true,
      lastTriggered: '2024-02-08T09:15:00Z',
      triggerCount: 3
    }
  ]

  const mobileAppSettings: MobileAppSetting[] = [
    {
      id: '1',
      name: 'Push Notifications',
      category: 'notifications',
      value: true,
      description: 'Enable push notifications for mobile app',
      isEnabled: true
    },
    {
      id: '2',
      name: 'Biometric Authentication',
      category: 'security',
      value: true,
      description: 'Use fingerprint or face ID for login',
      isEnabled: true
    },
    {
      id: '3',
      name: 'Dark Mode',
      category: 'appearance',
      value: 'auto',
      description: 'App theme preference',
      isEnabled: true
    },
    {
      id: '4',
      name: 'Auto Sync',
      category: 'general',
      value: true,
      description: 'Automatically sync data in background',
      isEnabled: true
    },
    {
      id: '5',
      name: 'Location Services',
      category: 'general',
      value: false,
      description: 'Allow app to access location',
      isEnabled: false
    },
    {
      id: '6',
      name: 'Offline Mode',
      category: 'general',
      value: true,
      description: 'Enable offline functionality',
      isEnabled: true
    }
  ]

  const communicationRules: CommunicationRule[] = [
    {
      id: '1',
      name: 'Urgent Task Notifications',
      trigger: 'task_assigned',
      conditions: ['priority = high', 'due_date < 24h'],
      actions: ['push_notification', 'email', 'sms'],
      priority: 'high',
      isActive: true
    },
    {
      id: '2',
      name: 'SLA Breach Alerts',
      trigger: 'sla_breach',
      conditions: ['ticket_overdue', 'priority = critical'],
      actions: ['push_notification', 'email', 'webhook'],
      priority: 'critical',
      isActive: true
    },
    {
      id: '3',
      name: 'Weekly Reports',
      trigger: 'weekly_report',
      conditions: ['day_of_week = monday', 'time = 9:00'],
      actions: ['email'],
      priority: 'low',
      isActive: true,
      schedule: '0 9 * * 1'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'push': return 'bg-green-100 text-green-800'
      case 'sms': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-orange-100 text-orange-800'
      case 'security': return 'bg-red-100 text-red-800'
      case 'business': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const sendTestNotification = (templateId: string) => {
    console.log(`Sending test notification for template ${templateId}`)
    // Implementation for test notification
  }

  const exportTemplates = (format: string) => {
    console.log(`Exporting templates as ${format}`)
    // Implementation for export
  }

  const importTemplates = () => {
    console.log('Importing templates')
    // Implementation for import
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mobile & Notifications</h1>
          <p className="text-gray-600">Manage push notifications, email templates, and mobile app settings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddTemplateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
          <Button variant="outline" onClick={() => exportTemplates('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-gray-900">{notificationTemplates.filter(t => t.isActive).length}</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mobile Users</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alertRules.filter(a => a.isActive).length}</p>
                <p className="text-xs text-orange-600">3 triggered today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
                <p className="text-xs text-green-600">+0.3% from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'push-notifications', name: 'Push Notifications', icon: Bell },
            { id: 'email-templates', name: 'Email Templates', icon: Mail },
            { id: 'mobile-settings', name: 'Mobile App Settings', icon: Smartphone },
            { id: 'alert-management', name: 'Alert Management', icon: AlertTriangle },
            { id: 'communication-rules', name: 'Communication Rules', icon: MessageSquare }
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
        {/* Push Notifications Tab */}
        {activeTab === 'push-notifications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="push">Push</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notificationTemplates.filter(t => t.type === 'push').map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.type.toUpperCase()} Template</CardDescription>
                      </div>
                      <Badge className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Subject:</p>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Content:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Variables:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <Badge key={variable} className="bg-gray-100 text-gray-800 text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => sendTestNotification(template.id)}>
                        <TestTube className="w-4 h-4 mr-1" />
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

        {/* Email Templates Tab */}
        {activeTab === 'email-templates' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Email Templates</h3>
                <p className="text-gray-600">Manage email notification templates</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Template Name</th>
                        <th className="text-left py-2">Subject</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Last Updated</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notificationTemplates.filter(t => t.type === 'email').map((template) => (
                        <tr key={template.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">{template.name}</td>
                          <td className="py-2">{template.subject}</td>
                          <td className="py-2">
                            <Badge className={getTypeColor(template.type)}>
                              {template.type}
                            </Badge>
                          </td>
                          <td className="py-2">
                            <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-2">{new Date(template.updatedAt).toLocaleDateString()}</td>
                          <td className="py-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <TestTube className="w-4 h-4" />
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

        {/* Mobile App Settings Tab */}
        {activeTab === 'mobile-settings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Mobile App Settings</h3>
                <p className="text-gray-600">Configure mobile app features and preferences</p>
              </div>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Import Settings
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mobileAppSettings.map((setting) => (
                <Card key={setting.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{setting.name}</CardTitle>
                      <Switch
                        checked={setting.isEnabled}
                        onCheckedChange={() => {}}
                      />
                    </div>
                    <CardDescription>{setting.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {typeof setting.value === 'boolean' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={setting.value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {setting.value ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Value:</span>
                        <span className="text-sm">{setting.value}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Alert Management Tab */}
        {activeTab === 'alert-management' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Alert Management</h3>
                <p className="text-gray-600">Configure system alerts and thresholds</p>
              </div>
              <Button onClick={() => setShowAddAlertModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Alert Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alertRules.map((alert) => (
                <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{alert.name}</CardTitle>
                        <CardDescription>{alert.type} Alert</CardDescription>
                      </div>
                      <Badge className={getTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Condition:</p>
                      <p className="text-sm text-gray-600">{alert.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Threshold:</p>
                      <p className="text-sm text-gray-600">{alert.threshold}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Action:</p>
                      <Badge className="bg-blue-100 text-blue-800">
                        {alert.action}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trigger Count:</span>
                      <span className="font-medium">{alert.triggerCount}</span>
                    </div>
                    {alert.lastTriggered && (
                      <div className="flex justify-between text-sm">
                        <span>Last Triggered:</span>
                        <span>{new Date(alert.lastTriggered).toLocaleDateString()}</span>
                      </div>
                    )}
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

        {/* Communication Rules Tab */}
        {activeTab === 'communication-rules' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Communication Rules</h3>
                <p className="text-gray-600">Define when and how to notify users</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Rule Name</th>
                        <th className="text-left py-2">Trigger</th>
                        <th className="text-left py-2">Priority</th>
                        <th className="text-left py-2">Actions</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {communicationRules.map((rule) => (
                        <tr key={rule.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">{rule.name}</td>
                          <td className="py-2">{rule.trigger}</td>
                          <td className="py-2">
                            <Badge className={getPriorityColor(rule.priority)}>
                              {rule.priority}
                            </Badge>
                          </td>
                          <td className="py-2">
                            <div className="flex flex-wrap gap-1">
                              {rule.actions.map((action) => (
                                <Badge key={action} className="bg-blue-100 text-blue-800 text-xs">
                                  {action}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-2">
                            <Badge className={rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
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
      </div>
    </div>
  )
}


