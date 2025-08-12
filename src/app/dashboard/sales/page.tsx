'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Plus,
  FileText,
  BarChart3,
  RefreshCw,
  Calendar,
  User,
  Building,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react'

// Mock data for Sales Dashboard
const mockSalesMetrics = {
  totalLeads: 156,
  dealsWon: 23,
  dealsLost: 8,
  totalRevenue: 284500,
  forecastedRevenue: 425000,
  winRate: 74.2
}

const mockPipelineOverview = {
  prospecting: 45,
  proposal: 28,
  negotiation: 19,
  closedWon: 23,
  closedLost: 8
}

const mockTopPerformers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40',
    revenue: 125000,
    deals: 8,
    winRate: 87.5,
    trend: 'up'
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: '/api/placeholder/40/40',
    revenue: 98000,
    deals: 6,
    winRate: 75.0,
    trend: 'up'
  },
  {
    id: 3,
    name: 'Lisa Wang',
    avatar: '/api/placeholder/40/40',
    revenue: 87500,
    deals: 5,
    winRate: 80.0,
    trend: 'down'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    avatar: '/api/placeholder/40/40',
    revenue: 74500,
    deals: 4,
    winRate: 66.7,
    trend: 'up'
  }
]

const mockRecentActivities = [
  {
    id: 1,
    type: 'deal_won',
    title: 'Deal Closed: TechCorp Enterprise',
    description: 'Sarah Johnson closed $45,000 deal',
    amount: 45000,
    timestamp: '2 hours ago',
    rep: 'Sarah Johnson'
  },
  {
    id: 2,
    type: 'lead_created',
    title: 'New Lead: InnovateSoft',
    description: 'Mike Chen created new lead',
    timestamp: '4 hours ago',
    rep: 'Mike Chen'
  },
  {
    id: 3,
    type: 'proposal_sent',
    title: 'Proposal Sent: DataFlow Inc',
    description: 'Lisa Wang sent proposal for $32,000',
    amount: 32000,
    timestamp: '6 hours ago',
    rep: 'Lisa Wang'
  },
  {
    id: 4,
    type: 'meeting_scheduled',
    title: 'Meeting Scheduled: CloudTech',
    description: 'David Rodriguez scheduled demo',
    timestamp: '8 hours ago',
    rep: 'David Rodriguez'
  }
]

export default function SalesDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'deal_won': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'lead_created': return <Users className="w-5 h-5 text-blue-600" />
      case 'proposal_sent': return <FileText className="w-5 h-5 text-purple-600" />
      case 'meeting_scheduled': return <Calendar className="w-5 h-5 text-orange-600" />
      default: return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'deal_won': return 'bg-green-50 border-green-200'
      case 'lead_created': return 'bg-blue-50 border-blue-200'
      case 'proposal_sent': return 'bg-purple-50 border-purple-200'
      case 'meeting_scheduled': return 'bg-orange-50 border-orange-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Overview of sales performance and pipeline
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-sm font-medium text-gray-900">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Sales Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{mockSalesMetrics.totalLeads}</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">{mockSalesMetrics.winRate}%</p>
              <p className="text-xs text-gray-500">{mockSalesMetrics.dealsWon} won, {mockSalesMetrics.dealsLost} lost</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue Closed</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockSalesMetrics.totalRevenue)}</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Forecasted</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockSalesMetrics.forecastedRevenue)}</p>
              <p className="text-xs text-gray-500">Current quarter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deals Pipeline Overview */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Deals Pipeline Overview</h2>
                <Link
                  href="/dashboard/sales/deals"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View Pipeline →
                </Link>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockPipelineOverview.prospecting}</div>
                  <div className="text-sm text-blue-600">Prospecting</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{mockPipelineOverview.proposal}</div>
                  <div className="text-sm text-purple-600">Proposal</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{mockPipelineOverview.negotiation}</div>
                  <div className="text-sm text-orange-600">Negotiation</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockPipelineOverview.closedWon}</div>
                  <div className="text-sm text-green-600">Closed Won</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{mockPipelineOverview.closedLost}</div>
                  <div className="text-sm text-red-600">Closed Lost</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Reps */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Top Performing Reps</h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {mockTopPerformers.map((rep, index) => (
                  <div key={rep.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          <img
                            src={rep.avatar}
                            alt={rep.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                          <div className="text-xs text-gray-500">{rep.deals} deals • {rep.winRate}% win rate</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(rep.revenue)}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        {rep.trend === 'up' ? (
                          <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                        )}
                        {rep.trend === 'up' ? 'Up' : 'Down'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-3">
              <Link 
                href="/dashboard/sales/leads/new"
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Link>
              
              <Link 
                href="/dashboard/sales/deals/new"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Target className="w-4 h-4 mr-2" />
                Add New Deal
              </Link>
              
              <Link 
                href="/dashboard/sales/quotes/new"
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Quote
              </Link>
              
              <Link 
                href="/dashboard/sales/reports"
                className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {mockRecentActivities.map((activity) => (
                  <div key={activity.id} className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{activity.description}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500">{activity.rep}</div>
                          <div className="text-xs text-gray-500">{activity.timestamp}</div>
                        </div>
                        {activity.amount && (
                          <div className="text-xs font-medium text-green-600 mt-1">
                            {formatCurrency(activity.amount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/dashboard/sales/activities"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All Activities →
                </Link>
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Summary</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Target</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(300000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Revenue</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(mockSalesMetrics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(300000 - mockSalesMetrics.totalRevenue)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(mockSalesMetrics.totalRevenue / 300000) * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    {Math.round((mockSalesMetrics.totalRevenue / 300000) * 100)}% of monthly target
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 