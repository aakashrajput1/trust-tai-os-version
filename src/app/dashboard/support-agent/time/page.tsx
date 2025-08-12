'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Timer, 
  Clock, 
  Calendar, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  StopCircle,
  FileText,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Mock data for time entries
const mockTimeEntries = [
  {
    id: 1,
    ticketId: 'TK-2024-015',
    ticketTitle: 'Payment gateway integration failing',
    client: 'TechStart Inc.',
    date: '2024-01-25',
    hours: 1.25,
    description: 'Initial investigation and client communication',
    status: 'logged',
    startTime: '14:30',
    endTime: '15:45'
  },
  {
    id: 2,
    ticketId: 'TK-2024-018',
    ticketTitle: 'User authentication bug in mobile app',
    client: 'MobileCorp',
    date: '2024-01-25',
    hours: 0.5,
    description: 'Bug reproduction and analysis',
    status: 'logged',
    startTime: '16:00',
    endTime: '16:30'
  },
  {
    id: 3,
    ticketId: 'TK-2024-020',
    ticketTitle: 'Feature request: Dark mode toggle',
    client: 'DesignStudio',
    date: '2024-01-24',
    hours: 2.0,
    description: 'Requirements gathering and technical assessment',
    status: 'logged',
    startTime: '10:00',
    endTime: '12:00'
  }
]

const mockActiveTimers = [
  {
    id: 1,
    ticketId: 'TK-2024-022',
    ticketTitle: 'Database connection timeout errors',
    client: 'DataFlow Systems',
    startTime: '09:00',
    elapsed: 45, // minutes
    isRunning: true
  }
]

export default function TimeLogger() {
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries)
  const [activeTimers, setActiveTimers] = useState(mockActiveTimers)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // New time entry form state
  const [newEntry, setNewEntry] = useState({
    ticketId: '',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Filter time entries
  const filteredEntries = timeEntries.filter(entry => {
    const matchesDate = entry.date === selectedDate
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus
    const matchesSearch = entry.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.client.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesDate && matchesStatus && matchesSearch
  })

  // Calculate total hours for selected date
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0)

  // Handle adding new time entry
  const handleAddEntry = () => {
    if (!newEntry.ticketId || !newEntry.hours) return

    const entry = {
      id: Date.now(),
      ticketId: newEntry.ticketId,
      ticketTitle: 'Sample Ticket Title', // In real app, fetch from ticket data
      client: 'Sample Client', // In real app, fetch from ticket data
      date: newEntry.date,
      hours: parseFloat(newEntry.hours),
      description: newEntry.description,
      status: 'logged',
      startTime: '--',
      endTime: '--'
    }

    setTimeEntries([entry, ...timeEntries])
    setNewEntry({
      ticketId: '',
      description: '',
      hours: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowAddForm(false)
  }

  // Handle editing time entry
  const handleEditEntry = (id: number) => {
    const entry = timeEntries.find(e => e.id === id)
    if (entry) {
      setNewEntry({
        ticketId: entry.ticketId,
        description: entry.description,
        hours: entry.hours.toString(),
        date: entry.date
      })
      setEditingEntry(id)
      setShowAddForm(true)
    }
  }

  // Handle updating time entry
  const handleUpdateEntry = () => {
    if (!editingEntry || !newEntry.ticketId || !newEntry.hours) return

    setTimeEntries(timeEntries.map(entry => 
      entry.id === editingEntry 
        ? { ...entry, hours: parseFloat(newEntry.hours), description: newEntry.description }
        : entry
    ))

    setNewEntry({
      ticketId: '',
      description: '',
      hours: '',
      date: new Date().toISOString().split('T')[0]
    })
    setEditingEntry(null)
    setShowAddForm(false)
  }

  // Handle deleting time entry
  const handleDeleteEntry = (id: number) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      setTimeEntries(timeEntries.filter(entry => entry.id !== id))
    }
  }

  // Handle timer controls
  const handleStartTimer = (timerId: number) => {
    setActiveTimers(activeTimers.map(timer => 
      timer.id === timerId ? { ...timer, isRunning: true } : timer
    ))
  }

  const handleStopTimer = (timerId: number) => {
    setActiveTimers(activeTimers.map(timer => 
      timer.id === timerId ? { ...timer, isRunning: false } : timer
    ))
  }

  const handlePauseTimer = (timerId: number) => {
    setActiveTimers(activeTimers.map(timer => 
      timer.id === timerId ? { ...timer, isRunning: false } : timer
    ))
  }

  // Export timesheet
  const handleExport = () => {
    const csvContent = [
      ['Date', 'Ticket ID', 'Client', 'Hours', 'Description'],
      ...filteredEntries.map(entry => [
        entry.date,
        entry.ticketId,
        entry.client,
        entry.hours.toString(),
        entry.description
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timesheet-${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Time Logger</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Track and log your support hours
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Today's Hours</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {totalHours}h
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Time
            </button>
          </div>
        </div>
      </div>

      {/* Active Timers */}
      {activeTimers.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <Timer className="w-5 h-5 mr-2 text-blue-600" />
              Active Timers
            </h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {activeTimers.map((timer) => (
                <div key={timer.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">TK</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{timer.ticketId}</div>
                        <div className="text-xs text-gray-600">{timer.ticketTitle}</div>
                        <div className="text-xs text-gray-500">{timer.client}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-blue-600">
                        {Math.floor(timer.elapsed / 60)}:{(timer.elapsed % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500">Started {timer.startTime}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {timer.isRunning ? (
                        <>
                          <button
                            onClick={() => handlePauseTimer(timer.id)}
                            className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Pause"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStopTimer(timer.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Stop"
                          >
                            <StopCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStartTimer(timer.id)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="Start"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Time Entry Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {editingEntry ? 'Edit Time Entry' : 'Log New Time Entry'}
            </h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket ID
                </label>
                <input
                  type="text"
                  value={newEntry.ticketId}
                  onChange={(e) => setNewEntry({ ...newEntry, ticketId: e.target.value })}
                  placeholder="e.g., TK-2024-015"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={newEntry.hours}
                  onChange={(e) => setNewEntry({ ...newEntry, hours: e.target.value })}
                  placeholder="e.g., 1.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  placeholder="What did you work on?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingEntry(null)
                  setNewEntry({
                    ticketId: '',
                    description: '',
                    hours: '',
                    date: new Date().toISOString().split('T')[0]
                  })
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {editingEntry ? 'Update Entry' : 'Log Time'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="logged">Logged</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search tickets, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {filteredEntries.length} entries found
            </div>
            <button
              onClick={handleExport}
              className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">TK</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{entry.ticketId}</div>
                        <div className="text-xs text-gray-600 truncate max-w-xs">{entry.ticketTitle}</div>
                        <div className="text-xs text-gray-500">{entry.date}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{entry.client}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{entry.hours}h</div>
                    <div className="text-xs text-gray-500">{entry.startTime} - {entry.endTime}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{entry.description}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                      entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditEntry(entry.id)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or log some time.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Log Time
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Hours</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {timeEntries
                  .filter(entry => {
                    const entryDate = new Date(entry.date)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return entryDate >= weekAgo
                  })
                  .reduce((sum, entry) => sum + entry.hours, 0)}h
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Timers</p>
              <p className="text-2xl font-bold text-gray-900">{activeTimers.filter(t => t.isRunning).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
