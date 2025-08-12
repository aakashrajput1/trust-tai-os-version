'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Timer,
  BarChart3,
  TrendingUp
} from 'lucide-react'

// Mock time tracking data
const mockTimeEntries = [
  {
    id: 1,
    date: '2024-01-24',
    project: 'E-commerce Platform v2.0',
    task: 'Refactor user registration API',
    hours: 3.5,
    description: 'Implemented validation layer and error handling',
    status: 'approved',
    billable: true,
    submittedAt: '2024-01-24T17:30:00Z'
  },
  {
    id: 2,
    date: '2024-01-24',
    project: 'Mobile App Integration',
    task: 'Fix responsive layout bug',
    hours: 1.5,
    description: 'Fixed navigation menu issue on iOS devices',
    status: 'approved',
    billable: true,
    submittedAt: '2024-01-24T15:00:00Z'
  },
  {
    id: 3,
    date: '2024-01-23',
    project: 'E-commerce Platform v2.0',
    task: 'Code review',
    hours: 2,
    description: 'Reviewed authentication module pull requests',
    status: 'pending',
    billable: false,
    submittedAt: '2024-01-23T16:00:00Z'
  },
  {
    id: 4,
    date: '2024-01-23',
    project: 'Documentation',
    task: 'Update API documentation',
    hours: 2.5,
    description: 'Documented new authentication endpoints',
    status: 'approved',
    billable: false,
    submittedAt: '2024-01-23T18:00:00Z'
  },
  {
    id: 5,
    date: '2024-01-22',
    project: 'E-commerce Platform v2.0',
    task: 'Database optimization',
    hours: 4,
    description: 'Optimized user profile queries and added indexes',
    status: 'approved',
    billable: true,
    submittedAt: '2024-01-22T17:45:00Z'
  },
  {
    id: 6,
    date: '2024-01-22',
    project: 'Team Meeting',
    task: 'Sprint planning',
    hours: 1,
    description: 'Attended sprint planning meeting',
    status: 'approved',
    billable: false,
    submittedAt: '2024-01-22T11:00:00Z'
  },
  {
    id: 7,
    date: '2024-01-19',
    project: 'Security Enhancement',
    task: 'API rate limiting',
    hours: 6,
    description: 'Implemented rate limiting with Redis',
    status: 'approved',
    billable: true,
    submittedAt: '2024-01-19T18:30:00Z'
  }
]

const mockProjects = [
  'E-commerce Platform v2.0',
  'Mobile App Integration', 
  'Security Enhancement',
  'Documentation',
  'Team Meeting',
  'Performance Optimization'
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function TimeTrackingPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries)
  const [selectedProject, setSelectedProject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<number | null>(null)
  const [quickLogDate, setQuickLogDate] = useState(new Date().toISOString().split('T')[0])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: '',
    description: '',
    billable: true
  })
  const { addNotification } = useNotifications()

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getWeekEnd = (weekStart: Date) => {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return weekEnd
  }

  const formatWeekRange = (weekStart: Date) => {
    const weekEnd = getWeekEnd(weekStart)
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const getWeekDates = (weekStart: Date) => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredEntries.filter(entry => entry.date === dateStr)
  }

  const getTotalHoursForDate = (date: Date) => {
    return getEntriesForDate(date).reduce((sum, entry) => sum + entry.hours, 0)
  }

  const addTimeEntry = () => {
    if (!newEntry.project || !newEntry.task || !newEntry.hours || !newEntry.description) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields'
      })
      return
    }

    const entry = {
      id: Date.now(),
      ...newEntry,
      hours: parseFloat(newEntry.hours),
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    }

    setTimeEntries(prev => [entry, ...prev])
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      project: '',
      task: '',
      hours: '',
      description: '',
      billable: true
    })
    setIsAddingEntry(false)

    addNotification({
      type: 'success',
      title: 'Time Entry Added',
      message: `${entry.hours} hours logged for ${entry.project}`
    })
  }

  const deleteEntry = (id: number) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id))
    addNotification({
      type: 'success',
      title: 'Entry Deleted',
      message: 'Time entry has been removed'
    })
  }

  const exportTimesheet = (format: 'csv' | 'pdf') => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: `Exporting timesheet as ${format.toUpperCase()}...`
    })
  }

  const filteredEntries = timeEntries.filter(entry => {
    const matchesProject = selectedProject === 'all' || entry.project === selectedProject
    const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus
    return matchesProject && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // Calculate weekly stats
  const weekStart = getWeekStart(new Date(currentWeek))
  const weekEnd = getWeekEnd(weekStart)
  const weekEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date)
    return entryDate >= weekStart && entryDate <= weekEnd
  })
  
  const weeklyStats = {
    totalHours: weekEntries.reduce((sum, entry) => sum + entry.hours, 0),
    billableHours: weekEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0),
    nonBillableHours: weekEntries.filter(entry => !entry.billable).reduce((sum, entry) => sum + entry.hours, 0),
    pendingHours: weekEntries.filter(entry => entry.status === 'pending').reduce((sum, entry) => sum + entry.hours, 0),
    approvedHours: weekEntries.filter(entry => entry.status === 'approved').reduce((sum, entry) => sum + entry.hours, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/dashboard/developer"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
              <p className="text-gray-600 mt-2">Track your time and manage timesheets</p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsAddingEntry(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </button>
              <button 
                onClick={() => exportTimesheet('csv')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button 
                onClick={() => exportTimesheet('pdf')}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{weeklyStats.totalHours}</h3>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{weeklyStats.billableHours}</h3>
                <p className="text-sm text-gray-600">Billable</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{weeklyStats.nonBillableHours}</h3>
                <p className="text-sm text-gray-600">Non-billable</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{weeklyStats.pendingHours}</h3>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{weeklyStats.approvedHours}</h3>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 flex items-center justify-between">
            <button 
              onClick={() => navigateWeek('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Week of {formatWeekRange(getWeekStart(currentWeek))}
              </h2>
              <p className="text-sm text-gray-500">
                {weeklyStats.totalHours} hours logged
              </p>
            </div>
            
            <button 
              onClick={() => navigateWeek('next')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Calendar</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4">
              {getWeekDates(getWeekStart(currentWeek)).map((date, index) => {
                const dayEntries = getEntriesForDate(date)
                const totalHours = getTotalHoursForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                
                return (
                  <div key={index} className={`border rounded-lg p-3 ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-gray-600">{weekDays[index]}</div>
                      <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {dayEntries.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="text-xs bg-gray-100 rounded p-1">
                          <div className="font-medium truncate">{entry.project}</div>
                          <div className="text-gray-600">{entry.hours}h</div>
                        </div>
                      ))}
                      {dayEntries.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayEntries.length - 3} more
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${totalHours >= 8 ? 'text-green-600' : 'text-gray-600'}`}>
                        {totalHours}h total
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Log for Today */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Log for Today</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={newEntry.project}
                onChange={(e) => setNewEntry(prev => ({ ...prev, project: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Project</option>
                {mockProjects.map((project) => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              
              <input
                type="text"
                value={newEntry.task}
                onChange={(e) => setNewEntry(prev => ({ ...prev, task: e.target.value }))}
                placeholder="Task name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="number"
                value={newEntry.hours}
                onChange={(e) => setNewEntry(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Hours"
                min="0.25"
                step="0.25"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <button
                onClick={addTimeEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log Time
              </button>
            </div>
            
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                id="billable"
                checked={newEntry.billable}
                onChange={(e) => setNewEntry(prev => ({ ...prev, billable: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="billable" className="ml-2 text-sm text-gray-600">
                Billable hours
              </label>
            </div>
          </div>
        </div>

        {/* Filters and Time Entries */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
              <div className="flex space-x-3">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Projects</option>
                  {mockProjects.map((project) => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.project}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{entry.task}</div>
                      <div className="text-xs text-gray-500">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.hours}h</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        entry.billable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.billable ? 'Billable' : 'Non-billable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {entry.status === 'pending' && (
                          <>
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteEntry(entry.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

