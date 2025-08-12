'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  TrendingUp, 
  Trophy, 
  Star, 
  Target,
  Calendar,
  User,
  MessageSquare,
  Plus,
  Filter,
  Search,
  ArrowRight,
  Zap,
  HelpCircle,
  FileText,
  CheckSquare
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DeveloperNav from '@/components/ui/DeveloperNav'

interface Task {
  id: string
  title: string
  project: string
  priority: 'high' | 'medium' | 'low'
  estimatedHours: number
  completed: boolean
  dueDate: string
}

interface TimeEntry {
  id: string
  description: string
  hours: number
  project: string
  task?: string
  date: string
}

export default function DeveloperDashboard() {
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerDescription, setTimerDescription] = useState('')
  const [selectedTask, setSelectedTask] = useState('')

  const todayTasks: Task[] = [
    {
      id: '1',
      title: 'Implement User Authentication API',
      project: 'E-commerce Platform',
      priority: 'high',
      estimatedHours: 6,
      completed: false,
      dueDate: '2024-02-10'
    },
    {
      id: '2',
      title: 'Fix Payment Gateway Bug',
      project: 'E-commerce Platform',
      priority: 'high',
      estimatedHours: 4,
      completed: true,
      dueDate: '2024-02-10'
    },
    {
      id: '3',
      title: 'Write Unit Tests for User Module',
      project: 'Mobile App',
      priority: 'medium',
      estimatedHours: 3,
      completed: false,
      dueDate: '2024-02-12'
    },
    {
      id: '4',
      title: 'Code Review: Payment Integration',
      project: 'E-commerce Platform',
      priority: 'medium',
      estimatedHours: 2,
      completed: false,
      dueDate: '2024-02-11'
    },
    {
      id: '5',
      title: 'Update API Documentation',
      project: 'API Integration',
      priority: 'low',
      estimatedHours: 1,
      completed: false,
      dueDate: '2024-02-15'
    }
  ]

  const recentTimeEntries: TimeEntry[] = [
    {
      id: '1',
      description: 'Fixed payment gateway bug',
      hours: 2.5,
      project: 'E-commerce Platform',
      task: 'Fix Payment Gateway Bug',
      date: '2024-02-10'
    },
    {
      id: '2',
      description: 'Implemented user authentication',
      hours: 4.0,
      project: 'E-commerce Platform',
      task: 'Implement User Authentication API',
      date: '2024-02-09'
    },
    {
      id: '3',
      description: 'Code review and testing',
      hours: 1.5,
      project: 'Mobile App',
      task: 'Write Unit Tests for User Module',
      date: '2024-02-09'
    }
  ]

  const filteredTasks = todayTasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.project === selectedProject
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesPriority && matchesSearch
  })

  const completedTasks = todayTasks.filter(task => task.completed).length
  const totalTasks = todayTasks.length
  const weeklyHours = 32.5
  const weeklyTarget = 40
  const progressPercentage = (weeklyHours / weeklyTarget) * 100
  const streak = 7
  const leaderboardPosition = 3

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
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
                    Developer Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Today's focus and progress tracking
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <HelpCircle className="w-4 h-4" />
                    <span>Request Help</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <FileText className="w-4 h-4" />
                    <span>View All Tasks</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Tasks</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weekly Hours</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{weeklyHours}h</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Streak</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{streak} days</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Leaderboard</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">#{leaderboardPosition}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Today's Focus */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Today's Focus</h2>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Projects</option>
                        <option value="E-commerce Platform">E-commerce Platform</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="API Integration">API Integration</option>
                      </select>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <button
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{task.project}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500">{task.estimatedHours}h</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredTasks.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No tasks found for today</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Time Logger */}
              <div>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Time Logger</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What did you work on?</label>
                      <input
                        type="text"
                        value={timerDescription}
                        onChange={(e) => setTimerDescription(e.target.value)}
                        placeholder="e.g., Fixed payment gateway bug"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="2.5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Select Project</option>
                          <option value="E-commerce Platform">E-commerce Platform</option>
                          <option value="Mobile App">Mobile App</option>
                          <option value="API Integration">API Integration</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task (Optional)</label>
                      <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Task</option>
                        {todayTasks.map(task => (
                          <option key={task.id} value={task.id}>{task.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1 flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Start Timer</span>
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Log Time
                      </Button>
                    </div>

                    {/* Recent Entries */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Entries</h3>
                      <div className="space-y-2">
                        {recentTimeEntries.slice(0, 3).map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{entry.description}</p>
                              <p className="text-xs text-gray-500">{entry.project}</p>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{entry.hours}h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Progress and Gamification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Weekly Progress */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Weekly Progress</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Hours Logged</span>
                      <span className="font-medium">{weeklyHours}/{weeklyTarget}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">28.5h</p>
                      <p className="text-xs text-green-600">Billable</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">4.0h</p>
                      <p className="text-xs text-blue-600">Non-billable</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gamification */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Achievements</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">7-Day Streak!</p>
                      <p className="text-sm text-gray-600">You've logged time for 7 consecutive days</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Top 3 Developer</p>
                      <p className="text-sm text-gray-600">You're ranked #3 this week</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Task Master</p>
                      <p className="text-sm text-gray-600">Completed 15 tasks this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-4 h-auto">
                  <CheckSquare className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">View All Tasks</p>
                    <p className="text-xs text-gray-500">Full Kanban board</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-4 h-auto">
                  <Clock className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Time Tracking</p>
                    <p className="text-xs text-gray-500">Log hours & timesheet</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-4 h-auto">
                  <HelpCircle className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Request Help</p>
                    <p className="text-xs text-gray-500">Submit blockers</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center justify-center space-x-2 p-4 h-auto">
                  <Zap className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Quick Log</p>
                    <p className="text-xs text-gray-500">Fast time entry</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}