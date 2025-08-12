'use client'

import { useState } from 'react'
import { 
  HelpCircle,
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  Plus,
  Filter,
  Search,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Send,
  FileText,
  Tag
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DeveloperNav from '@/components/ui/DeveloperNav'

interface Blocker {
  id: string
  title: string
  description: string
  project: string
  task?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  assignee: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  comments: number
}

export default function DeveloperHelpPage() {
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewBlockerForm, setShowNewBlockerForm] = useState(false)
  const [expandedBlocker, setExpandedBlocker] = useState<string | null>(null)

  const blockers: Blocker[] = [
    {
      id: '1',
      title: 'Payment Gateway Integration Issue',
      description: 'Stripe payment gateway is returning 500 errors in production environment. Need assistance with debugging and fixing the integration.',
      project: 'E-commerce Platform',
      task: 'Fix Payment Gateway Bug',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Alex Developer',
      assignedTo: 'Sarah PM',
      createdAt: '2024-02-10T09:00:00Z',
      updatedAt: '2024-02-10T14:30:00Z',
      tags: ['payment', 'stripe', 'production'],
      comments: 3
    },
    {
      id: '2',
      title: 'Database Connection Timeout',
      description: 'Experiencing frequent database connection timeouts during peak hours. Need help optimizing connection pool settings.',
      project: 'API Integration',
      task: 'Database Schema Optimization',
      priority: 'medium',
      status: 'open',
      assignee: 'Alex Developer',
      createdAt: '2024-02-09T15:00:00Z',
      updatedAt: '2024-02-09T15:00:00Z',
      tags: ['database', 'performance', 'connection'],
      comments: 1
    },
    {
      id: '3',
      title: 'Authentication Token Expiry',
      description: 'JWT tokens are expiring too quickly. Need guidance on proper token management and refresh token implementation.',
      project: 'E-commerce Platform',
      task: 'Implement User Authentication API',
      priority: 'medium',
      status: 'resolved',
      assignee: 'Alex Developer',
      assignedTo: 'John Tech Lead',
      createdAt: '2024-02-08T11:00:00Z',
      updatedAt: '2024-02-09T10:00:00Z',
      tags: ['auth', 'jwt', 'security'],
      comments: 5
    },
    {
      id: '4',
      title: 'Mobile App Build Failure',
      description: 'iOS build is failing due to missing dependencies. Need help resolving CocoaPods configuration issues.',
      project: 'Mobile App',
      task: 'Mobile App UI Polish',
      priority: 'low',
      status: 'closed',
      assignee: 'Alex Developer',
      assignedTo: 'Mike DevOps',
      createdAt: '2024-02-07T16:00:00Z',
      updatedAt: '2024-02-08T09:00:00Z',
      tags: ['mobile', 'ios', 'build'],
      comments: 2
    },
    {
      id: '5',
      title: 'API Rate Limiting Configuration',
      description: 'Need assistance setting up proper rate limiting for the new API endpoints to prevent abuse.',
      project: 'API Integration',
      priority: 'high',
      status: 'open',
      assignee: 'Alex Developer',
      createdAt: '2024-02-10T13:00:00Z',
      updatedAt: '2024-02-10T13:00:00Z',
      tags: ['api', 'rate-limiting', 'security'],
      comments: 0
    }
  ]

  const filteredBlockers = blockers.filter(blocker => {
    const matchesProject = selectedProject === 'all' || blocker.project === selectedProject
    const matchesPriority = selectedPriority === 'all' || blocker.priority === selectedPriority
    const matchesStatus = selectedStatus === 'all' || blocker.status === selectedStatus
    const matchesSearch = blocker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blocker.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blocker.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesProject && matchesPriority && matchesStatus && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DeveloperNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Request Help
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Submit blockers and get assistance from your team
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </Button>
                  <Button 
                    onClick={() => setShowNewBlockerForm(true)}
                    className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Blocker</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Blockers</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{blockers.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Open</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600">
                      {blockers.filter(b => b.status === 'open').length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {blockers.filter(b => b.status === 'in-progress').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                      {blockers.filter(b => b.status === 'resolved' || b.status === 'closed').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                  {/* Search */}
                  <div className="sm:col-span-2 lg:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search blockers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Project Filter */}
                  <div>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Projects</option>
                      <option value="E-commerce Platform">E-commerce Platform</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="API Integration">API Integration</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockers List */}
            <div className="space-y-4">
              {filteredBlockers.map((blocker) => (
                <div key={blocker.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{blocker.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(blocker.priority)}`}>
                            {blocker.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(blocker.status)}`}>
                            {blocker.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{blocker.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>You</span>
                          </div>
                          {blocker.assignedTo && (
                            <div className="flex items-center space-x-1">
                              <span>→</span>
                              <span>{blocker.assignedTo}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(blocker.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{blocker.comments} comments</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{blocker.project}</span>
                          {blocker.task && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{blocker.task}</span>
                            </>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {blocker.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setExpandedBlocker(expandedBlocker === blocker.id ? null : blocker.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          {expandedBlocker === blocker.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedBlocker === blocker.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                            <div className="space-y-2">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">Sarah PM</span>
                                  <span className="text-xs text-gray-500">2 hours ago</span>
                                </div>
                                <p className="text-sm text-gray-600">I'll help you debug this. Can you share the error logs?</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">You</span>
                                  <span className="text-xs text-gray-500">1 hour ago</span>
                                </div>
                                <p className="text-sm text-gray-600">Thanks! I've attached the logs to this blocker.</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button size="sm" className="flex items-center space-x-2">
                              <Send className="w-4 h-4" />
                              <span>Send</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredBlockers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blockers found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedProject('all')
                  setSelectedPriority('all')
                  setSelectedStatus('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Blocker Modal */}
      {showNewBlockerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Submit New Blocker</h2>
                <button
                  onClick={() => setShowNewBlockerForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Brief description of the blocker"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  placeholder="Detailed description of the issue, what you've tried, and what you need help with..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Project</option>
                    <option value="E-commerce Platform">E-commerce Platform</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="API Integration">API Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task (Optional)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Task</option>
                  <option value="task1">Fix Payment Gateway Bug</option>
                  <option value="task2">Implement User Authentication API</option>
                  <option value="task3">Database Schema Optimization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewBlockerForm(false)}
                >
                  Cancel
                </Button>
                <Button className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Blocker</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

