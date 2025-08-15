'use client'

import { useState, useEffect } from 'react'
import { 
  Target, 
  Plus, 
  Search, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  Trophy,
  Edit,
  Eye,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { Goal, GoalType, GoalStatus, Reward } from '@/types/admin'

export default function GoalsAndRewards() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      // Load mock data for development
      setGoals(getMockGoals())
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      if (format === 'csv') {
        const dataStr = goals.map(goal => ({
          Name: goal.name,
          Type: goal.type,
          Status: goal.status,
          Target: goal.target,
          Current: goal.current,
          Unit: goal.unit,
          'Start Date': goal.startDate,
          'End Date': goal.endDate,
          'Reward Type': goal.reward.type,
          'Reward Value': goal.reward.value
        })).map(row => Object.values(row).join(',')).join('\n')
        
        const blob = new Blob([dataStr], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `goals-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const dataStr = JSON.stringify(goals, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `goals-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting goals:', error)
    } finally {
      setExporting(false)
    }
  }

  const getMockGoals = (): Goal[] => [
    {
      id: '1',
      name: 'Increase Customer Satisfaction',
      description: 'Improve overall customer satisfaction score',
      type: 'company',
      target: 95,
      current: 87,
      unit: '%',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'in_progress',
      assignedTo: ['user1', 'user2'],
      kpi: 'NPS Score',
      reward: {
        id: '1',
        name: 'Performance Bonus',
        type: 'bonus',
        value: 5000,
        description: 'Annual performance bonus for achieving goal',
        isAutomatic: false,
        triggerCondition: 'Goal completion',
        maxRewards: 100,
        currentRewards: 0,
        isActive: true
      },
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Reduce Support Response Time',
      description: 'Decrease average response time for support tickets',
      type: 'team',
      target: 2,
      current: 3.5,
      unit: 'hours',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'in_progress',
      assignedTo: ['user3', 'user4', 'user5'],
      kpi: 'Average Response Time',
      reward: {
        id: '2',
        name: 'Team Outing',
        type: 'recognition',
        value: 1000,
        description: 'Team celebration dinner and activity',
        isAutomatic: false,
        triggerCondition: 'Goal completion',
        maxRewards: 5,
        currentRewards: 0,
        isActive: true
      },
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ]

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'not_started': return 'text-gray-600 bg-gray-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress': return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'not_started': return <Calendar className="h-5 w-5 text-gray-600" />
      case 'overdue': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Calendar className="h-5 w-5 text-gray-600" />
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Goals & Rewards Management</h1>
        <p className="mt-2 text-gray-600">
          Set, track, and manage organizational goals with reward systems
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {/* Refresh */}
          <button
            onClick={loadGoals}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>

          {/* Export */}
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>

          {/* Add Goal */}
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{goal.type}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                {getStatusIcon(goal.status)}
                <span className="ml-1 capitalize">{goal.status.replace('_', ' ')}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{goal.current} / {goal.target} {goal.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getProgressPercentage(goal.current, goal.target).toFixed(1)}% complete
              </div>
            </div>

            {/* Dates */}
            <div className="text-xs text-gray-500 mb-4">
              <div>Start: {formatDate(goal.startDate)}</div>
              <div>End: {formatDate(goal.endDate)}</div>
            </div>

            {/* Reward */}
            <div className="bg-yellow-50 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-yellow-600 mr-2" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800">{goal.reward.name}</div>
                  <div className="text-yellow-600">{goal.reward.description}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedGoal(goal)
                    // setShowViewGoal(true) // This state is not defined in the original file
                  }}
                  className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setSelectedGoal(goal)
                    // setShowEditGoal(true) // This state is not defined in the original file
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Edit Goal"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first goal.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddGoal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </button>
          )}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Goal</h2>
              <button
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter goal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select type</option>
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                    <option value="department">Department</option>
                    <option value="company">Company</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter goal description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter target"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., %, hours, $"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KPI
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., NPS Score"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
