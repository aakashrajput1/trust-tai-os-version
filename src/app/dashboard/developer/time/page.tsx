'use client'

import { useState } from 'react'
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DeveloperNav from '@/components/ui/DeveloperNav'

interface TimeEntry {
  id: string
  date: string
  description: string
  hours: number
  project: string
  task?: string
  billable: boolean
  status: 'pending' | 'approved' | 'rejected'
}

export default function DeveloperTimePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedProject, setSelectedProject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerDescription, setTimerDescription] = useState('')
  const [selectedTask, setSelectedTask] = useState('')

  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      date: '2024-02-10',
      description: 'Fixed payment gateway bug',
      hours: 2.5,
      project: 'E-commerce Platform',
      task: 'Fix Payment Gateway Bug',
      billable: true,
      status: 'approved'
    },
    {
      id: '2',
      date: '2024-02-10',
      description: 'Code review for team member',
      hours: 1.0,
      project: 'E-commerce Platform',
      billable: false,
      status: 'approved'
    },
    {
      id: '3',
      date: '2024-02-09',
      description: 'Implemented user authentication',
      hours: 4.0,
      project: 'E-commerce Platform',
      task: 'Implement User Authentication API',
      billable: true,
      status: 'approved'
    },
    {
      id: '4',
      date: '2024-02-09',
      description: 'Team meeting and planning',
      hours: 1.5,
      project: 'General',
      billable: false,
      status: 'approved'
    },
    {
      id: '5',
      date: '2024-02-08',
      description: 'Database optimization',
      hours: 3.5,
      project: 'API Integration',
      task: 'Database Schema Optimization',
      billable: true,
      status: 'pending'
    },
    {
      id: '6',
      date: '2024-02-08',
      description: 'Documentation updates',
      hours: 2.0,
      project: 'API Integration',
      task: 'Update API Documentation',
      billable: true,
      status: 'approved'
    }
  ]

  const filteredEntries = timeEntries.filter(entry => {
    const matchesProject = selectedProject === 'all' || entry.project === selectedProject
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesSearch
  })

  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const weekDates = getWeekDates(selectedDate)
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0)
  const billableHours = filteredEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0)
  const nonBillableHours = totalHours - billableHours

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredEntries.filter(entry => entry.date === dateStr)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
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
                    Time Tracking
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Log hours and manage your timesheet
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span>Quick Log</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalHours}h</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Billable</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{billableHours}h</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Non-billable</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-600">{nonBillableHours}h</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Weekly Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Weekly Calendar</h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate)
                          newDate.setDate(newDate.getDate() - 7)
                          setSelectedDate(newDate)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate)
                          newDate.setDate(newDate.getDate() + 7)
                          setSelectedDate(newDate)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 sm:gap-4">
                    {weekDates.map((date, index) => {
                      const dayEntries = getEntriesForDate(date)
                      const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.hours, 0)
                      
                      return (
                        <div key={index} className={`p-2 sm:p-3 rounded-lg border ${
                          isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="text-center mb-2">
                            <p className={`text-xs font-medium ${
                              isToday(date) ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {formatDate(date)}
                            </p>
                            <p className={`text-lg font-bold ${
                              isToday(date) ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {date.getDate()}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            {dayEntries.slice(0, 2).map((entry) => (
                              <div key={entry.id} className="text-xs p-1 bg-white rounded border">
                                <p className="font-medium truncate">{entry.description}</p>
                                <p className="text-gray-500">{entry.hours}h</p>
                              </div>
                            ))}
                            {dayEntries.length > 2 && (
                              <div className="text-xs text-center text-gray-500">
                                +{dayEntries.length - 2} more
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 text-center">
                            <p className="text-xs font-medium text-gray-600">Total: {dayTotal}h</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Log */}
              <div>
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Log</h2>
                  
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
                          <option value="General">General</option>
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
                        <option value="task1">Fix Payment Gateway Bug</option>
                        <option value="task2">Implement User Authentication API</option>
                        <option value="task3">Database Schema Optimization</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Billable</span>
                      </label>
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
                        {timeEntries.slice(0, 3).map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{entry.description}</p>
                              <p className="text-xs text-gray-500">{entry.project}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{entry.hours}h</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                                {entry.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Entries List */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Time Entries</h2>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Projects</option>
                    <option value="E-commerce Platform">E-commerce Platform</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="API Integration">API Integration</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Project</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Hours</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Billable</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                            {entry.task && (
                              <p className="text-xs text-gray-500">{entry.task}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{entry.project}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{entry.hours}h</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            entry.billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.billable ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEntries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No time entries found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

