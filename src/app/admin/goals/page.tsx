'use client'

import { useState, useEffect } from 'react'
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  CheckCircle,
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Award,
  BarChart3,
  Star,
  Trophy
} from 'lucide-react'

interface Goal {
  id: string
  name: string
  description: string
  type: 'individual' | 'team' | 'company'
  category: string
  target: number
  current: number
  unit: string
  deadline: string
  status: 'active' | 'completed' | 'overdue' | 'paused'
  assignedTo: string[]
  reward: string
  createdAt: string
}

interface Reward {
  id: string
  name: string
  description: string
  type: 'monetary' | 'recognition' | 'benefit' | 'experience'
  value: number
  currency?: string
  eligibility: string[]
  isActive: boolean
  createdAt: string
}

interface GoalMetrics {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  overdueGoals: number
  averageCompletion: number
  totalRewards: number
}

export default function GoalsAndRewards() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [metrics, setMetrics] = useState<GoalMetrics>({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    overdueGoals: 0,
    averageCompletion: 0,
    totalRewards: 0
  })
  const [loading, setLoading] = useState(true)
  const [showCreateGoal, setShowCreateGoal] = useState(false)
  const [showCreateReward, setShowCreateReward] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockGoals: Goal[] = [
        {
          id: '1',
          name: 'Increase Customer Satisfaction',
          description: 'Improve customer satisfaction score to 95%',
          type: 'company',
          category: 'customer_experience',
          target: 95,
          current: 87,
          unit: '%',
          deadline: '2024-03-31',
          status: 'active',
          assignedTo: ['All Teams'],
          reward: 'Company-wide celebration',
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Reduce Bug Reports',
          description: 'Decrease critical bug reports by 40%',
          type: 'team',
          category: 'quality',
          target: 40,
          current: 35,
          unit: '%',
          deadline: '2024-02-28',
          status: 'active',
          assignedTo: ['Development Team', 'QA Team'],
          reward: 'Team dinner + $500 bonus',
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'Increase Code Coverage',
          description: 'Achieve 90% code coverage across all projects',
          type: 'individual',
          category: 'development',
          target: 90,
          current: 78,
          unit: '%',
          deadline: '2024-02-15',
          status: 'active',
          assignedTo: ['John Doe', 'Sarah Wilson'],
          reward: '$200 bonus + recognition',
          createdAt: '2024-01-01'
        },
        {
          id: '4',
          name: 'Complete Project Milestone',
          description: 'Deliver Phase 1 of E-commerce Platform',
          type: 'team',
          category: 'delivery',
          target: 100,
          current: 100,
          unit: '%',
          deadline: '2024-01-31',
          status: 'completed',
          assignedTo: ['Project Team A'],
          reward: 'Team outing + $1000 bonus',
          createdAt: '2024-01-01'
        },
        {
          id: '5',
          name: 'Improve Response Time',
          description: 'Reduce average response time to under 2 hours',
          type: 'individual',
          category: 'support',
          target: 2,
          current: 2.5,
          unit: 'hours',
          deadline: '2024-02-28',
          status: 'overdue',
          assignedTo: ['Support Team'],
          reward: '$150 bonus',
          createdAt: '2024-01-01'
        }
      ]

      const mockRewards: Reward[] = [
        {
          id: '1',
          name: 'Performance Bonus',
          description: 'Monetary reward for exceptional performance',
          type: 'monetary',
          value: 500,
          currency: 'USD',
          eligibility: ['All Employees'],
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Employee of the Month',
          description: 'Recognition award with certificate and trophy',
          type: 'recognition',
          value: 0,
          eligibility: ['All Employees'],
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'Extra Vacation Days',
          description: 'Additional 2 days of paid vacation',
          type: 'benefit',
          value: 2,
          eligibility: ['Senior Staff'],
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: '4',
          name: 'Conference Attendance',
          description: 'Attend industry conference with expenses covered',
          type: 'experience',
          value: 2000,
          currency: 'USD',
          eligibility: ['Developers', 'Designers'],
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          id: '5',
          name: 'Gym Membership',
          description: 'Annual gym membership reimbursement',
          type: 'benefit',
          value: 600,
          currency: 'USD',
          eligibility: ['All Employees'],
          isActive: false,
          createdAt: '2024-01-01'
        }
      ]

      const mockMetrics: GoalMetrics = {
        totalGoals: 5,
        activeGoals: 3,
        completedGoals: 1,
        overdueGoals: 1,
        averageCompletion: 78.4,
        totalRewards: 5
      }

      setGoals(mockGoals)
      setRewards(mockRewards)
      setMetrics(mockMetrics)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Target className="h-4 w-4 text-blue-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'paused': return <X className="h-4 w-4 text-yellow-600" />
      default: return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-purple-100 text-purple-800'
      case 'team': return 'bg-blue-100 text-blue-800'
      case 'company': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case 'monetary': return 'bg-emerald-100 text-emerald-800'
      case 'recognition': return 'bg-blue-100 text-blue-800'
      case 'benefit': return 'bg-orange-100 text-orange-800'
      case 'experience': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory)

  const exportGoalsReport = () => {
    // Simulate CSV export
    const csvContent = goals.map(goal => 
      `${goal.name},${goal.type},${goal.category},${goal.current}/${goal.target}${goal.unit},${goal.status},${goal.deadline}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'goals-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading goals and rewards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals & Rewards</h1>
          <p className="mt-2 text-gray-600">
            Set KPIs, track progress, and manage reward systems
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportGoalsReport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => setShowCreateReward(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Award className="h-4 w-4" />
            <span>Add Reward</span>
          </button>
          <button 
            onClick={() => setShowCreateGoal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalGoals}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.activeGoals}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.completedGoals}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.overdueGoals}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.averageCompletion}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rewards</p>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalRewards}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="customer_experience">Customer Experience</option>
            <option value="quality">Quality</option>
            <option value="development">Development</option>
            <option value="delivery">Delivery</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Goals</h2>
            <p className="text-sm text-gray-600">Track progress and manage objectives</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredGoals.map((goal) => (
                <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{goal.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(goal.type)}`}>
                          {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <span>Deadline: {goal.deadline}</span>
                        <span>•</span>
                        <span>Assigned: {goal.assignedTo.join(', ')}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{goal.current}/{goal.target} {goal.unit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getProgressPercentage(goal.current, goal.target))}`}
                            style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Reward: {goal.reward}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-700 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-700 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Reward System</h2>
            <p className="text-sm text-gray-600">Configure and manage employee rewards</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{reward.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRewardTypeColor(reward.type)}`}>
                          {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reward.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reward.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        {reward.type === 'monetary' && (
                          <span>Value: ${reward.value.toLocaleString()}</span>
                        )}
                        {reward.type === 'benefit' && (
                          <span>Value: {reward.value} days</span>
                        )}
                        {reward.type === 'experience' && (
                          <span>Value: ${reward.value.toLocaleString()}</span>
                        )}
                        <span>•</span>
                        <span>Eligible: {reward.eligibility.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-700 p-1">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-700 p-1">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <p className="text-sm text-gray-600">Track goal completion trends and team performance</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">On Track</h3>
              <p className="text-3xl font-bold text-blue-600">60%</p>
              <p className="text-sm text-gray-500">of goals are progressing well</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Completed</h3>
              <p className="text-3xl font-bold text-green-600">20%</p>
              <p className="text-sm text-gray-500">of goals have been achieved</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">At Risk</h3>
              <p className="text-3xl font-bold text-red-600">20%</p>
              <p className="text-sm text-gray-500">of goals need attention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
