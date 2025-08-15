'use client'

import { useState, useEffect } from 'react'
import projectsTasksService from '@/services/projectsTasksService'
import type { 
  ProjectTemplate, 
  TaskCategory, 
  PriorityLevel, 
  CustomField, 
  Workflow,
  WorkflowState,
  WorkflowTransition,
  PaginationParams 
} from '@/services/projectsTasksService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  FolderOpen, 
  FileText, 
  Tag, 
  Flag, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Target,
  BarChart3,
  Database,
  Palette,
  Layers,
  Zap,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Square
} from 'lucide-react'

// Using imported interfaces from projectsTasksService

export default function ProjectsTasksPage() {
  const [activeTab, setActiveTab] = useState('templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  
  // Data states
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [priorities, setPriorities] = useState<PriorityLevel[]>([])
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Load data based on active tab
  useEffect(() => {
    loadData()
  }, [activeTab, searchQuery, selectedCategory, selectedStatus, pagination.page])

  const loadData = async () => {
    setLoading(true)
    try {
      const params: PaginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      }

      switch (activeTab) {
        case 'templates':
          const templatesData = await projectsTasksService.getProjectTemplates(params)
          setTemplates(templatesData.data)
          setPagination(prev => ({ ...prev, ...templatesData.pagination }))
          break
        case 'categories':
          const categoriesData = await projectsTasksService.getTaskCategories(params)
          setCategories(categoriesData.data)
          setPagination(prev => ({ ...prev, ...categoriesData.pagination }))
          break
        case 'priorities':
          const prioritiesData = await projectsTasksService.getPriorityLevels(params)
          setPriorities(prioritiesData.data)
          setPagination(prev => ({ ...prev, ...prioritiesData.pagination }))
          break
        case 'fields':
          const fieldsData = await projectsTasksService.getCustomFields(params)
          setCustomFields(fieldsData.data)
          setPagination(prev => ({ ...prev, ...fieldsData.pagination }))
          break
        case 'workflows':
          const workflowsData = await projectsTasksService.getWorkflows(params)
          setWorkflows(workflowsData.data)
          setPagination(prev => ({ ...prev, ...workflowsData.pagination }))
          break
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fallback to mock data if API fails
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    // Fallback mock data
    const mockTemplates: ProjectTemplate[] = [
      {
        id: '1',
        name: 'Web Development Project',
        description: 'Standard template for web development projects',
        category: 'Development',
        estimated_duration: 12,
        default_team_structure: { pm: 1, developers: 3, designer: 1, qa: 1 },
        custom_fields_schema: [],
        created_by: 'user1',
        is_active: true,
        usage_count: 24,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    ]
    setTemplates(mockTemplates)
  }

  // Mock data for fallback
  const mockTaskCategories: TaskCategory[] = [
    {
      id: '1',
      name: 'Development',
      description: 'Software development tasks',
      color: '#3B82F6',
      icon: 'code',
      default_priority: 'high',
      billable: true,
      requires_approval: false,
      auto_assign_rules: {},
      time_tracking_rules: {},
      created_by: 'user1',
      is_active: true,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ]

  // Mock data for fallback
  const mockPriorityLevels: PriorityLevel[] = [
    {
      id: '1',
      name: 'Critical',
      description: 'Immediate attention required',
      level: 1,
      color: '#EF4444',
      icon: 'alert-triangle',
      badge_style: 'destructive',
      sla_hours: 2,
      auto_escalation: {},
      notification_rules: {},
      workflow_rules: {},
      created_by: 'user1',
      is_active: true,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ]

  // Mock data for fallback
  const mockCustomFields: CustomField[] = [
    {
      id: '1',
      name: 'Client Reference',
      description: 'Client reference number',
      field_key: 'client_ref',
      entity_type: 'project',
      field_type: 'text',
      validation_rules: { required: true },
      display_settings: { show_in_list: true, show_in_details: true },
      conditional_logic: {},
      help_text: 'Enter the client reference number',
      category: 'general',
      created_by: 'user1',
      is_active: true,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    }
  ]

  const workflowStates: WorkflowState[] = [
    {
      id: '1',
      workflow_id: 'workflow-1',
      name: 'To Do',
      description: 'Tasks that need to be started',
      type: 'initial',
      color: '#6B7280',
      icon: 'circle',
      order_index: 1,
      permissions: {},
      automation_rules: {},
      validation_rules: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      workflow_id: 'workflow-1',
      name: 'In Progress',
      description: 'Tasks currently being worked on',
      type: 'active',
      color: '#3B82F6',
      icon: 'play',
      order_index: 2,
      permissions: {},
      automation_rules: {},
      validation_rules: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      workflow_id: 'workflow-1',
      name: 'Review',
      description: 'Tasks ready for review',
      type: 'review',
      color: '#F59E0B',
      icon: 'eye',
      order_index: 3,
      permissions: {},
      automation_rules: {},
      validation_rules: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      workflow_id: 'workflow-1',
      name: 'Testing',
      description: 'Tasks in testing phase',
      type: 'testing',
      color: '#8B5CF6',
      icon: 'test-tube',
      order_index: 4,
      permissions: {},
      automation_rules: {},
      validation_rules: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      workflow_id: 'workflow-1',
      name: 'Done',
      description: 'Completed tasks',
      type: 'final',
      color: '#10B981',
      icon: 'check',
      order_index: 5,
      permissions: {},
      automation_rules: {},
      validation_rules: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const workflowTransitions: WorkflowTransition[] = [
    {
      id: '1',
      workflow_id: 'workflow-1',
      name: 'Start Work',
      from_state: '1',
      to_state: '2',
      conditions: ['assigned_to != null'],
      actions: ['set_start_date', 'notify_assignee'],
      ui_settings: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      workflow_id: 'workflow-1',
      name: 'Submit for Review',
      from_state: '2',
      to_state: '3',
      conditions: ['time_spent > 0'],
      actions: ['set_review_date', 'notify_reviewer'],
      ui_settings: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      workflow_id: 'workflow-1',
      name: 'Approve for Testing',
      from_state: '3',
      to_state: '4',
      conditions: ['review_approved = true'],
      actions: ['set_testing_date', 'notify_tester'],
      ui_settings: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      workflow_id: 'workflow-1',
      name: 'Complete',
      from_state: '4',
      to_state: '5',
      conditions: ['testing_passed = true'],
      actions: ['set_completion_date', 'notify_stakeholders'],
      ui_settings: {},
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const getCategoryColor = (color: string) => {
    return `bg-[${color}] text-white`
  }

  const getPriorityColor = (color: string) => {
    return `bg-[${color}] text-white`
  }

  const duplicateTemplate = (templateId: string) => {
    console.log(`Duplicating template ${templateId}`)
    // Implementation for template duplication
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
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects & Tasks</h1>
          <p className="text-gray-600">Manage project templates, task categories, and workflows</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.filter(t => t.is_active).length}</p>
                <p className="text-xs text-green-600">+3 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Task Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.filter(c => c.is_active).length}</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Workflow States</p>
                <p className="text-2xl font-bold text-gray-900">{workflowStates.filter(w => w.is_active).length}</p>
                <p className="text-xs text-green-600">5 active states</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Fields</p>
                <p className="text-2xl font-bold text-gray-900">{customFields.filter(f => f.is_active).length}</p>
                <p className="text-xs text-green-600">+1 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', name: 'Project Templates', icon: FolderOpen },
            { id: 'categories', name: 'Task Categories', icon: Tag },
            { id: 'priorities', name: 'Priority Levels', icon: Flag },
            { id: 'custom-fields', name: 'Custom Fields', icon: Database },
            { id: 'workflows', name: 'Workflow Management', icon: Layers }
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

      <div className="mt-6">
        {/* Project Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="Development">Development</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Design">Design</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : templates.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No project templates found
                </div>
              ) : (
                templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.category}</CardDescription>
                      </div>
                      <Badge className={template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{template.estimated_duration} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Usage Count:</span>
                      <span className="font-medium">{template.usage_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Created:</span>
                      <span className="font-medium">{new Date(template.created_at).toLocaleDateString()}</span>
                    </div>
                    {template.phases && template.phases.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Phases:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.phases.map((phase) => (
                            <Badge key={phase.id} className="bg-blue-100 text-blue-800 text-xs">
                              {phase.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          </div>
        )}

        {/* Task Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Task Categories</h3>
                <p className="text-gray-600">Organize tasks into categories for better management</p>
              </div>
              <Button onClick={() => setShowAddCategoryModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No task categories found
                </div>
              ) : (
                categories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View Tasks
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            </div>
          </div>
        )}

        {/* Priority Levels Tab */}
        {activeTab === 'priorities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Priority Levels</h3>
                <p className="text-gray-600">Define priority levels and their SLAs</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Priority
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Priority</th>
                        <th className="text-left py-2">Level</th>
                        <th className="text-left py-2">SLA (Hours)</th>
                        <th className="text-left py-2">Description</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priorities.map((priority) => (
                        <tr key={priority.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: priority.color }}
                              ></div>
                              <span className="font-medium">{priority.name}</span>
                            </div>
                          </td>
                          <td className="py-2">{priority.level}</td>
                          <td className="py-2">{priority.sla_hours}h</td>
                          <td className="py-2">{priority.description}</td>
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

        {/* Custom Fields Tab */}
        {activeTab === 'custom-fields' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Custom Fields</h3>
                <p className="text-gray-600">Add custom fields to projects and tasks</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Field
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customFields.map((field) => (
                <Card key={field.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{field.name}</CardTitle>
                        <CardDescription>{(field as any).field_type?.toUpperCase()} Field</CardDescription>
                      </div>
                      <Badge className={(field as any).is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {(field as any).is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Entity:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {(field as any).entity_type}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Field Key:</span>
                      <span className="font-medium">{(field as any).field_key}</span>
                    </div>
                    {(field as any).display_settings?.default_value && (
                      <div className="flex justify-between text-sm">
                        <span>Default Value:</span>
                        <span className="font-medium">{String((field as any).display_settings.default_value)}</span>
                      </div>
                    )}
                    {(field as any).display_settings?.options && Array.isArray((field as any).display_settings.options) && (
                      <div>
                        <p className="text-sm font-medium mb-1">Options:</p>
                        <div className="flex flex-wrap gap-1">
                          {(field as any).display_settings.options.map((option: any) => (
                            <Badge key={String(option)} className="bg-gray-100 text-gray-800 text-xs">
                              {String(option)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View Usage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Management Tab */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Workflow Management</h3>
                <p className="text-gray-600">Define task states and transitions</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>

            {/* Workflow States */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow States</CardTitle>
                <CardDescription>Define the different states a task can be in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflowStates.map((state) => (
                    <div key={state.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: state.color }}
                          ></div>
                          <span className="font-medium">{state.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {state.type === 'initial' && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Start</Badge>
                          )}
                          {state.type === 'final' && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">End</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Order: {(state as any).order_index}</span>
                        <span>{/* no task count in interface; placeholder */}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workflow Transitions */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Transitions</CardTitle>
                <CardDescription>Define how tasks move between states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowTransitions.map((transition) => (
                    <div key={transition.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{transition.from_state}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{transition.to_state}</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{transition.name}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {transition.conditions.map((condition) => (
                          <Badge key={String(condition)} className="bg-yellow-100 text-yellow-800 text-xs">
                            {String(condition)}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {transition.actions.map((action) => (
                          <Badge key={String(action)} className="bg-green-100 text-green-800 text-xs">
                            {String(action)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
    </div>
  )
}