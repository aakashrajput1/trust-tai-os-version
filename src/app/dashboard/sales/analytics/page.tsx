'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Award,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Mock data for analytics
const mockAnalytics = {
  overview: {
    totalRevenue: 1250000,
    revenueGrowth: 12.5,
    dealsCount: 156,
    dealsGrowth: 8.2,
    conversionRate: 23.4,
    conversionGrowth: 2.1,
    averageDealSize: 8012,
    dealSizeGrowth: -3.2
  },
  pipeline: {
    prospecting: { count: 45, value: 360000, percentage: 28.8 },
    proposal: { count: 32, value: 280000, percentage: 22.4 },
    negotiation: { count: 28, value: 320000, percentage: 25.6 },
    closedWon: { count: 51, value: 290000, percentage: 23.2 }
  },
  topPerformers: [
    { name: 'Sarah Johnson', revenue: 180000, deals: 12, conversion: 28.5 },
    { name: 'Mike Chen', revenue: 165000, deals: 15, conversion: 25.2 },
    { name: 'Emily Davis', revenue: 142000, deals: 11, conversion: 31.8 },
    { name: 'Alex Rodriguez', revenue: 128000, deals: 14, conversion: 22.1 }
  ],
  monthlyTrends: [
    { month: 'Jan', revenue: 98000, deals: 12, target: 100000 },
    { month: 'Feb', revenue: 112000, deals: 14, target: 100000 },
    { month: 'Mar', revenue: 89000, deals: 11, target: 100000 },
    { month: 'Apr', revenue: 134000, deals: 17, target: 100000 },
    { month: 'May', revenue: 156000, deals: 19, target: 100000 },
    { month: 'Jun', revenue: 178000, deals: 22, target: 100000 }
  ],
  leadSources: [
    { source: 'Website', count: 156, conversion: 18.5, revenue: 234000 },
    { source: 'Referrals', count: 89, conversion: 32.1, revenue: 189000 },
    { source: 'Cold Outreach', count: 234, conversion: 8.2, revenue: 156000 },
    { source: 'Events', count: 67, conversion: 25.4, revenue: 178000 },
    { source: 'Social Media', count: 123, conversion: 12.3, revenue: 134000 }
  ],
  recentActivities: [
    { type: 'deal_won', description: 'Enterprise License Deal closed by Sarah Johnson', value: 45000, time: '2 hours ago' },
    { type: 'deal_lost', description: 'Support Contract lost to competitor', value: 15000, time: '4 hours ago' },
    { type: 'new_lead', description: 'New lead from TechStart Inc. website', value: 0, time: '6 hours ago' },
    { type: 'deal_won', description: 'Implementation Services closed by Mike Chen', value: 28000, time: '1 day ago' }
  ]
}

const getActivityIcon = (type: string) => {
  switch(type) {
    case 'deal_won': return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'deal_lost': return <XCircle className="w-4 h-4 text-red-600" />
    case 'new_lead': return <Users className="w-4 h-4 text-blue-600" />
    default: return <Activity className="w-4 h-4 text-gray-600" />
  }
}

const getActivityColor = (type: string) => {
  switch(type) {
    case 'deal_won': return 'text-green-600'
    case 'deal_lost': return 'text-red-600'
    case 'new_lead': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

export default function SalesAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
              <p className="text-gray-600 mt-2">Track your sales performance and identify opportunities for growth</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last year</option>
              </select>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockAnalytics.overview.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center text-sm font-medium ${getGrowthColor(mockAnalytics.overview.revenueGrowth)}`}>
                {getGrowthIcon(mockAnalytics.overview.revenueGrowth)}
                {formatPercentage(mockAnalytics.overview.revenueGrowth)}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(mockAnalytics.overview.dealsCount)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center text-sm font-medium ${getGrowthColor(mockAnalytics.overview.dealsGrowth)}`}>
                {getGrowthIcon(mockAnalytics.overview.dealsGrowth)}
                {formatPercentage(mockAnalytics.overview.dealsGrowth)}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{mockAnalytics.overview.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center text-sm font-medium ${getGrowthColor(mockAnalytics.overview.conversionGrowth)}`}>
                {getGrowthIcon(mockAnalytics.overview.conversionGrowth)}
                {formatPercentage(mockAnalytics.overview.conversionGrowth)}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockAnalytics.overview.averageDealSize)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`flex items-center text-sm font-medium ${getGrowthColor(mockAnalytics.overview.dealSizeGrowth)}`}>
                {getGrowthIcon(mockAnalytics.overview.dealSizeGrowth)}
                {formatPercentage(mockAnalytics.overview.dealSizeGrowth)}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pipeline Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <PieChart className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <LineChart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(mockAnalytics.pipeline).map(([stage, data]) => (
                  <div key={stage} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {stage.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-xs text-gray-500">{data.count} deals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(data.value)}</p>
                      <p className="text-xs text-gray-500">{data.percentage}% of pipeline</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h2>
            <div className="space-y-4">
              {mockAnalytics.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">{performer.deals} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(performer.revenue)}</p>
                    <p className="text-xs text-gray-500">{performer.conversion}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Lead Sources */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources Performance</h2>
            <div className="space-y-4">
              {mockAnalytics.leadSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{source.source}</p>
                    <p className="text-xs text-gray-500">{source.count} leads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(source.revenue)}</p>
                    <p className="text-xs text-gray-500">{source.conversion}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {mockAnalytics.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.value > 0 && (
                        <span className="text-xs font-medium text-gray-900">{formatCurrency(activity.value)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue Trends</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedMetric === 'revenue' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('deals')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedMetric === 'deals' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Deals
                </button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {mockAnalytics.monthlyTrends.map((month, index) => {
                const maxValue = Math.max(...mockAnalytics.monthlyTrends.map(m => m.revenue))
                const height = (month.revenue / maxValue) * 100
                const targetHeight = (month.target / maxValue) * 100
                
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="relative w-full">
                      {/* Target line */}
                      <div 
                        className="absolute w-full border-t-2 border-dashed border-gray-300"
                        style={{ bottom: `${targetHeight}%` }}
                      ></div>
                      
                      {/* Actual bar */}
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{month.month}</p>
                    <p className="text-xs text-gray-900 font-medium">{formatCurrency(month.revenue)}</p>
                  </div>
                )
              })}
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Actual Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-t-2 border-dashed border-gray-300"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
