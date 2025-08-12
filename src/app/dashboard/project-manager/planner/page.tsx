'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Target,
  Users,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ProjectManagerNav from '@/components/ui/ProjectManagerNav'

interface Task {
  id: string
  title: string
  description: string
  project: string
  priority: 'high' | 'medium' | 'low'
  estimatedHours: number
  assignee?: string
  day?: string
  status: 'unassigned' | 'assigned' | 'conflict'
}

interface TeamMember {
  id: string
  name: string
  role: string
  maxHoursPerDay: number
  availability: {
    mon: number
    tue: number
    wed: number
    thu: number
    fri: number
  }
}

export default function TeamPlannerPage() {
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Design User Authentication Flow',
      description: 'Create wireframes and mockups for the new authentication system',
      project: 'E-commerce Platform',
      priority: 'high',
      estimatedHours: 8,
      status: 'unassigned'
    },
    {
      id: '2',
      title: 'Implement Payment Gateway',
      description: 'Integrate Stripe payment gateway with error handling',
      project: 'E-commerce Platform',
      priority: 'high',
      estimatedHours: 16,
      status: 'unassigned'
    },
    {
      id: '3',
      title: 'Write Unit Tests',
      description: 'Create comprehensive unit tests for the user module',
      project: 'Mobile App',
      priority: 'medium',
      estimatedHours: 6,
      status: 'unassigned'
    },
    {
      id: '4',
      title: 'Database Schema Design',
      description: 'Design and implement the new database schema',
      project: 'API Integration',
      priority: 'high',
      estimatedHours: 12,
      status: 'unassigned'
    },
    {
      id: '5',
      title: 'Mobile App UI Polish',
      description: 'Final UI polish and animation improvements',
      project: 'Mobile App',
      priority: 'medium',
      estimatedHours: 10,
      status: 'unassigned'
    },
    {
      id: '6',
      title: 'API Documentation',
      description: 'Write comprehensive API documentation',
      project: 'API Integration',
      priority: 'low',
      estimatedHours: 8,
      status: 'unassigned'
    },
    {
      id: '7',
      title: 'Performance Optimization',
      description: 'Optimize database queries and improve load times',
      project: 'E-commerce Platform',
      priority: 'medium',
      estimatedHours: 14,
      status: 'unassigned'
    }
  ]

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Developer',
      role: 'Senior Developer',
      maxHoursPerDay: 8,
      availability: { mon: 8, tue: 6, wed: 8, thu: 4, fri: 8 }
    },
    {
      id: '2',
      name: 'Sarah Designer',
      role: 'UI/UX Designer',
      maxHoursPerDay: 8,
      availability: { mon: 8, tue: 8, wed: 6, thu: 8, fri: 7 }
    },
    {
      id: '3',
      name: 'Mike QA Engineer',
      role: 'QA Engineer',
      maxHoursPerDay: 8,
      availability: { mon: 6, tue: 8, wed: 8, thu: 6, fri: 8 }
    },
    {
      id: '4',
      name: 'Alex DevOps',
      role: 'DevOps Engineer',
      maxHoursPerDay: 8,
      availability: { mon: 8, tue: 4, wed: 8, thu: 8, fri: 6 }
    }
  ]

  const weekDays = [
    { key: 'mon', label: 'Monday', date: '2024-02-05' },
    { key: 'tue', label: 'Tuesday', date: '2024-02-06' },
    { key: 'wed', label: 'Wednesday', date: '2024-02-07' },
    { key: 'thu', label: 'Thursday', date: '2024-02-08' },
    { key: 'fri', label: 'Friday', date: '2024-02-09' }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.project === selectedProject
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesPriority && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-green-100 text-green-800'
      case 'conflict': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getWeekRange = () => {
    const start = new Date(currentWeek)
    start.setDate(currentWeek.getDate() - currentWeek.getDay() + 1)
    const end = new Date(start)
    end.setDate(start.getDate() + 4)
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const getTasksForDay = (dayKey: string) => {
    return tasks.filter(task => task.day === dayKey)
  }

  const getTasksForMember = (memberId: string, dayKey: string) => {
    return tasks.filter(task => task.assignee === memberId && task.day === dayKey)
  }

  const getTotalHoursForMember = (memberId: string, dayKey: string) => {
    return getTasksForMember(memberId, dayKey).reduce((sum, task) => sum + task.estimatedHours, 0)
  }

  const hasConflict = (memberId: string, dayKey: string) => {
    const totalHours = getTotalHoursForMember(memberId, dayKey)
    const member = teamMembers.find(m => m.id === memberId)
    return member && totalHours > member.availability[dayKey as keyof typeof member.availability]
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
                    Team Planner
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Plan and assign tasks for the upcoming week
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Check Conflicts</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    <span>Save & Publish</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Week Navigation */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateWeek('prev')}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {getWeekRange()}
                    </h2>
                    <p className="text-sm text-gray-500">Weekly Planning View</p>
                  </div>
                  
                  <button
                    onClick={() => navigateWeek('next')}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                </div>
              </div>
            </div>

            {/* Planning Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Unassigned Tasks */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Unassigned Tasks</h2>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    {filteredTasks.filter(t => t.status === 'unassigned').length}
                  </span>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTasks.filter(task => task.status === 'unassigned').map((task) => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{task.project}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedHours}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTasks.filter(task => task.status === 'unassigned').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm">All tasks assigned!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Weekly Schedule</h2>
                  <Button variant="outline" size="sm">View Conflicts</Button>
                </div>
                
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{member.name}</h3>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Max: {member.maxHoursPerDay}h/day
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {weekDays.map((day) => {
                          const totalHours = getTotalHoursForMember(member.id, day.key)
                          const hasConflictDay = hasConflict(member.id, day.key)
                          const dayTasks = getTasksForMember(member.id, day.key)
                          
                          return (
                            <div key={day.key} className={`text-center p-2 rounded-lg border ${
                              hasConflictDay ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <p className="text-xs text-gray-500 mb-1">{day.label.slice(0, 3)}</p>
                              <p className={`text-sm font-medium ${
                                hasConflictDay ? 'text-red-600' : 'text-gray-900'
                              }`}>
                                {totalHours}h
                              </p>
                              {dayTasks.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">{dayTasks.length} tasks</p>
                              )}
                              {hasConflictDay && (
                                <AlertTriangle className="w-3 h-3 text-red-500 mx-auto mt-1" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Daily Task Breakdown</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                  {weekDays.map((day) => (
                    <div key={day.key} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 text-sm">{day.label}</h3>
                        <span className="text-xs text-gray-500">{day.date}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {teamMembers.map((member) => {
                          const memberTasks = getTasksForMember(member.id, day.key)
                          const totalHours = getTotalHoursForMember(member.id, day.key)
                          const hasConflictDay = hasConflict(member.id, day.key)
                          
                          return (
                            <div key={member.id} className={`p-2 rounded-lg border ${
                              hasConflictDay ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-900">{member.name}</span>
                                <span className={`text-xs font-medium ${
                                  hasConflictDay ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {totalHours}h
                                </span>
                              </div>
                              
                              {memberTasks.length > 0 && (
                                <div className="space-y-1">
                                  {memberTasks.map((task) => (
                                    <div key={task.id} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                                      {task.title}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {hasConflictDay && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <AlertTriangle className="w-3 h-3 text-red-500" />
                                  <span className="text-xs text-red-600">Overbooked</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

