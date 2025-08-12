'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  Calendar,
  User,
  Tag,
  Flag,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ProjectManagerNav from '@/components/ui/ProjectManagerNav'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'testing' | 'done'
  priority: 'high' | 'medium' | 'low'
  assignee: string
  project: string
  dueDate: string
  tags: string[]
  comments: number
  timeEstimate: string
  isOverdue: boolean
}

export default function KanbanPage() {
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedAssignee, setSelectedAssignee] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Design User Authentication Flow',
      description: 'Create wireframes and mockups for the new authentication system',
      status: 'todo',
      priority: 'high',
      assignee: 'Sarah Designer',
      project: 'E-commerce Platform',
      dueDate: '2024-02-10',
      tags: ['design', 'auth', 'ui'],
      comments: 3,
      timeEstimate: '8h',
      isOverdue: false
    },
    {
      id: '2',
      title: 'Implement Payment Gateway',
      description: 'Integrate Stripe payment gateway with error handling',
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Developer',
      project: 'E-commerce Platform',
      dueDate: '2024-02-15',
      tags: ['backend', 'payment', 'api'],
      comments: 8,
      timeEstimate: '16h',
      isOverdue: false
    },
    {
      id: '3',
      title: 'Write Unit Tests',
      description: 'Create comprehensive unit tests for the user module',
      status: 'review',
      priority: 'medium',
      assignee: 'Mike QA',
      project: 'Mobile App',
      dueDate: '2024-02-08',
      tags: ['testing', 'unit-tests'],
      comments: 2,
      timeEstimate: '6h',
      isOverdue: true
    },
    {
      id: '4',
      title: 'Database Schema Design',
      description: 'Design and implement the new database schema',
      status: 'testing',
      priority: 'high',
      assignee: 'Alex DevOps',
      project: 'API Integration',
      dueDate: '2024-02-12',
      tags: ['database', 'schema'],
      comments: 5,
      timeEstimate: '12h',
      isOverdue: false
    },
    {
      id: '5',
      title: 'Security Audit Report',
      description: 'Complete security audit and generate compliance report',
      status: 'done',
      priority: 'high',
      assignee: 'Sam Security',
      project: 'Security Audit',
      dueDate: '2024-02-05',
      tags: ['security', 'audit', 'compliance'],
      comments: 12,
      timeEstimate: '20h',
      isOverdue: false
    },
    {
      id: '6',
      title: 'Mobile App UI Polish',
      description: 'Final UI polish and animation improvements',
      status: 'todo',
      priority: 'medium',
      assignee: 'Lisa UX',
      project: 'Mobile App',
      dueDate: '2024-02-20',
      tags: ['ui', 'mobile', 'animation'],
      comments: 1,
      timeEstimate: '10h',
      isOverdue: false
    },
    {
      id: '7',
      title: 'API Documentation',
      description: 'Write comprehensive API documentation',
      status: 'in-progress',
      priority: 'low',
      assignee: 'David Developer',
      project: 'API Integration',
      dueDate: '2024-02-18',
      tags: ['documentation', 'api'],
      comments: 4,
      timeEstimate: '8h',
      isOverdue: false
    },
    {
      id: '8',
      title: 'Performance Optimization',
      description: 'Optimize database queries and improve load times',
      status: 'review',
      priority: 'medium',
      assignee: 'Bob DevOps',
      project: 'E-commerce Platform',
      dueDate: '2024-02-14',
      tags: ['performance', 'optimization'],
      comments: 6,
      timeEstimate: '14h',
      isOverdue: false
    }
  ]

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-500', count: tasks.filter(t => t.status === 'todo').length },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500', count: tasks.filter(t => t.status === 'in-progress').length },
    { id: 'review', title: 'Review', color: 'bg-yellow-500', count: tasks.filter(t => t.status === 'review').length },
    { id: 'testing', title: 'Testing', color: 'bg-purple-500', count: tasks.filter(t => t.status === 'testing').length },
    { id: 'done', title: 'Done', color: 'bg-green-500', count: tasks.filter(t => t.status === 'done').length }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.project === selectedProject
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    const matchesAssignee = selectedAssignee === 'all' || task.assignee === selectedAssignee
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesProject && matchesPriority && matchesAssignee && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ProjectManagerNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Task Board
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Manage and track all project tasks
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span>New Task</span>
                  </Button>
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
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Project Filter */}
                  <div>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Projects</option>
                      <option value="E-commerce Platform">E-commerce Platform</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="API Integration">API Integration</option>
                      <option value="Security Audit">Security Audit</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  {/* Assignee Filter */}
                  <div>
                    <select
                      value={selectedAssignee}
                      onChange={(e) => setSelectedAssignee(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Assignees</option>
                      <option value="John Developer">John Developer</option>
                      <option value="Sarah Designer">Sarah Designer</option>
                      <option value="Mike QA">Mike QA</option>
                      <option value="Alex DevOps">Alex DevOps</option>
                      <option value="Sam Security">Sam Security</option>
                      <option value="Lisa UX">Lisa UX</option>
                      <option value="David Developer">David Developer</option>
                      <option value="Bob DevOps">Bob DevOps</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
              {columns.map((column) => {
                const columnTasks = filteredTasks.filter(task => task.status === column.id)
                return (
                  <div key={column.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    {/* Column Header */}
                    <div className="p-3 sm:p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{column.title}</h3>
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>

                    {/* Column Tasks */}
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
                      {columnTasks.map((task) => (
                        <div key={task.id} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <h4 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight flex-1 mr-2">{task.title}</h4>
                            <button className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                              <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2">{task.description}</p>

                          <div className="space-y-2">
                            {/* Priority and Project */}
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-xs text-gray-500 truncate ml-2">{task.project}</span>
                            </div>

                            {/* Assignee and Due Date */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1 min-w-0 flex-1">
                                <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-600 truncate">{task.assignee}</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${task.isOverdue ? 'text-red-600' : 'text-gray-500'} flex-shrink-0 ml-2`}>
                                <Calendar className="w-3 h-3" />
                                <span className="hidden sm:inline">{task.dueDate}</span>
                                <span className="sm:hidden">{task.dueDate.split('-')[2]}</span>
                                {task.isOverdue && <AlertCircle className="w-3 h-3" />}
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {task.tags.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{task.tags.length - 2}
                                </span>
                              )}
                            </div>

                            {/* Task Meta */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{task.comments}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="hidden sm:inline">{task.timeEstimate}</span>
                                  <span className="sm:hidden">{task.timeEstimate.replace('h', '')}</span>
                                </div>
                              </div>
                              {task.status === 'done' && (
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Task Button */}
                      <button className="w-full p-2 sm:p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" />
                        <span className="text-xs">Add Task</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedProject('all')
                  setSelectedPriority('all')
                  setSelectedAssignee('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

