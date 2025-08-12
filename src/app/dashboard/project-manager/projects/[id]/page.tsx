'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  FileText, 
  BarChart3,
  Settings,
  Plus,
  Edit,
  Download,
  Upload,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Paperclip,
  MessageSquare
} from 'lucide-react'

// Mock project data - this would come from your API
const mockProject = {
  id: 1,
  name: "E-commerce Platform v2.0",
  client: "Acme Corp",
  description: "Complete redesign and development of the e-commerce platform with modern UI/UX, improved performance, and new features including AI-powered recommendations.",
  progress: 78,
  dueDate: "2024-02-15",
  startDate: "2023-10-01",
  budget: { used: 75000, total: 100000 },
  status: "on-track",
  priority: "high",
  blockers: 2,
  team: [
    { id: 1, name: "John D.", role: "Senior Developer", avatar: "JD", email: "john@company.com" },
    { id: 2, name: "Sarah M.", role: "Frontend Developer", avatar: "SM", email: "sarah@company.com" },
    { id: 3, name: "Mike R.", role: "Backend Developer", avatar: "MR", email: "mike@company.com" }
  ],
  milestones: [
    { id: 1, name: "Requirements Analysis", dueDate: "2023-10-15", completion: 100, status: "completed" },
    { id: 2, name: "UI/UX Design", dueDate: "2023-11-30", completion: 100, status: "completed" },
    { id: 3, name: "Frontend Development", dueDate: "2024-01-15", completion: 85, status: "in-progress" },
    { id: 4, name: "Backend Development", dueDate: "2024-01-30", completion: 70, status: "in-progress" },
    { id: 5, name: "Testing & QA", dueDate: "2024-02-10", completion: 30, status: "pending" },
    { id: 6, name: "Deployment", dueDate: "2024-02-15", completion: 0, status: "pending" }
  ],
  risks: [
    { 
      id: 1, 
      title: "Third-party API Integration Delay", 
      description: "The payment gateway API has delayed their v2 release", 
      probability: "medium", 
      impact: "high", 
      status: "active",
      assignee: "John D.",
      createdAt: "2024-01-10"
    },
    { 
      id: 2, 
      title: "Resource Availability", 
      description: "Sarah may need to take leave during critical development phase", 
      probability: "low", 
      impact: "medium", 
      status: "monitoring",
      assignee: "PM",
      createdAt: "2024-01-05"
    }
  ],
  files: [
    { id: 1, name: "Project Requirements.pdf", size: "2.4 MB", uploadedBy: "John D.", uploadedAt: "2023-10-01", type: "pdf" },
    { id: 2, name: "UI Mockups.fig", size: "15.8 MB", uploadedBy: "Sarah M.", uploadedAt: "2023-11-15", type: "figma" },
    { id: 3, name: "Database Schema.sql", size: "156 KB", uploadedBy: "Mike R.", uploadedAt: "2023-12-01", type: "sql" },
    { id: 4, name: "API Documentation.md", size: "45 KB", uploadedBy: "John D.", uploadedAt: "2024-01-05", type: "markdown" }
  ]
}

const tabs = [
  { id: 'overview', name: 'Overview', icon: BarChart3 },
  { id: 'milestones', name: 'Milestones', icon: Target },
  { id: 'tasks', name: 'Tasks', icon: CheckCircle },
  { id: 'risks', name: 'Risks', icon: AlertTriangle },
  { id: 'files', name: 'Files', icon: FileText }
]

export default function ProjectDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  
  const projectId = params.id

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'on-track': return 'text-green-600 bg-green-50 border-green-200'
      case 'needs-attention': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return '📄'
      case 'figma': return '🎨'
      case 'sql': return '🗃️'
      case 'markdown': return '📝'
      default: return '📄'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/dashboard/project-manager"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mockProject.name}</h1>
              <p className="text-gray-600 mt-2">{mockProject.client}</p>
              <p className="text-gray-500 mt-1 max-w-3xl">{mockProject.description}</p>
            </div>
            
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{mockProject.progress}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${mockProject.progress}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Budget Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(mockProject.budget.used / 1000).toFixed(0)}k
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                of ${(mockProject.budget.total / 1000).toFixed(0)}k total
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <p className="text-2xl font-bold text-gray-900">{mockProject.team.length}</p>
                </div>
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-sm text-gray-500 mt-1">members</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(mockProject.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {Math.ceil((new Date(mockProject.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(mockProject.status)}`}>
                          {mockProject.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Priority</span>
                        <span className="font-medium text-red-600">{mockProject.priority}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Start Date</span>
                        <span className="font-medium">{new Date(mockProject.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Blockers</span>
                        <span className="font-medium text-red-600">{mockProject.blockers}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                    <div className="space-y-3">
                      {mockProject.team.map((member) => (
                        <div key={member.id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{member.avatar}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Sarah completed frontend wireframes</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Milestone "UI/UX Design" marked as complete</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">New risk identified: API integration delay</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </button>
                </div>
                
                <div className="space-y-4">
                  {mockProject.milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                          <p className="text-sm text-gray-600">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(milestone.status)}`}>
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{milestone.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            milestone.completion === 100 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${milestone.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
                  <Link 
                    href="/dashboard/project-manager/kanban"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Kanban Board
                  </Link>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Task Management</h4>
                  <p className="text-gray-600 mb-4">
                    Tasks for this project are managed through the Kanban board. 
                    Click above to view and manage all project tasks.
                  </p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">23</div>
                      <div className="text-gray-500">To Do</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">18</div>
                      <div className="text-gray-500">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">45</div>
                      <div className="text-gray-500">Done</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Risk Management</h3>
                  <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Risk
                  </button>
                </div>
                
                <div className="space-y-4">
                  {mockProject.risks.map((risk) => (
                    <div key={risk.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{risk.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(risk.status)}`}>
                          {risk.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Probability:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getRiskColor(risk.probability)}`}>
                            {risk.probability}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Impact:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getRiskColor(risk.impact)}`}>
                            {risk.impact}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Assignee:</span>
                          <span className="ml-2 font-medium">{risk.assignee}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <span className="ml-2">{new Date(risk.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Project Files</h3>
                  <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProject.files.map((file) => (
                    <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getFileIcon(file.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                          <p className="text-sm text-gray-500">{file.size}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            by {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <button className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        <button className="inline-flex items-center px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

