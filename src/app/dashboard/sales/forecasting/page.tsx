'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Package,
  BarChart3,
  LineChart,
  PieChart,
  FileSpreadsheet,
  FileText,
  Brain,
  Target,
  AlertTriangle
} from 'lucide-react'

// Mock data for revenue forecasting
const mockForecastData = {
  monthly: [
    { month: 'Jan 2024', actual: 125000, forecast: 120000, variance: 5000 },
    { month: 'Feb 2024', actual: 0, forecast: 135000, variance: -135000 },
    { month: 'Mar 2024', actual: 0, forecast: 150000, variance: -150000 },
    { month: 'Apr 2024', actual: 0, forecast: 140000, variance: -140000 },
    { month: 'May 2024', actual: 0, forecast: 160000, variance: -160000 },
    { month: 'Jun 2024', actual: 0, forecast: 175000, variance: -175000 }
  ],
  quarterly: [
    { quarter: 'Q1 2024', actual: 125000, forecast: 405000, variance: -280000 },
    { quarter: 'Q2 2024', actual: 0, forecast: 475000, variance: -475000 },
    { quarter: 'Q3 2024', actual: 0, forecast: 520000, variance: -520000 },
    { quarter: 'Q4 2024', actual: 0, forecast: 580000, variance: -580000 }
  ]
}

const mockAISuggestions = [
  {
    type: 'trend',
    message: 'Based on Q4 2023 performance, consider increasing Q1 2024 forecast by 15%',
    confidence: 85,
    impact: 'high'
  },
  {
    type: 'seasonality',
    message: 'Historical data shows 20% revenue increase in Q2 due to seasonal demand',
    confidence: 78,
    impact: 'medium'
  },
  {
    type: 'pipeline',
    message: 'Current pipeline suggests 30% higher conversion rate than historical average',
    confidence: 92,
    impact: 'high'
  }
]

const mockPipelineData = {
  prospecting: 250000,
  proposal: 180000,
  negotiation: 320000,
  total: 750000
}

export default function RevenueForecastingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedSalesRep, setSelectedSalesRep] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedProductLine, setSelectedProductLine] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [chartType, setChartType] = useState('bar')
  const { addNotification } = useNotifications()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (variance < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return null
  }

  const getAIImpactColor = (impact: string) => {
    switch(impact) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300'
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      case 'low': return 'text-green-600 bg-green-100 border-green-300'
      default: return 'text-gray-600 bg-gray-100 border-gray-300'
    }
  }

  const clearFilters = () => {
    setSelectedSalesRep('all')
    setSelectedRegion('all')
    setSelectedProductLine('all')
  }

  const handleExport = (format: string) => {
    addNotification('Export', `Exporting forecast data as ${format.toUpperCase()}...`, 'info')
    // Here you would typically trigger the actual export
  }

  const calculateTotalForecast = () => {
    const data = selectedPeriod === 'monthly' ? mockForecastData.monthly : mockForecastData.quarterly
    return data.reduce((total, item) => total + item.forecast, 0)
  }

  const calculateTotalActual = () => {
    const data = selectedPeriod === 'monthly' ? mockForecastData.monthly : mockForecastData.quarterly
    return data.reduce((total, item) => total + item.actual, 0)
  }

  const calculateTotalVariance = () => {
    return calculateTotalForecast() - calculateTotalActual()
  }

  const getAccuracyPercentage = () => {
    const totalForecast = calculateTotalForecast()
    const totalActual = calculateTotalActual()
    if (totalForecast === 0) return 0
    return Math.round(((totalActual / totalForecast) * 100))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/sales"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Revenue Forecasting</h1>
                <p className="text-gray-600 mt-2">AI-powered revenue predictions and analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2 inline" />
                Filters
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2 inline" />
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2 inline" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Rep</label>
                <select
                  value={selectedSalesRep}
                  onChange={(e) => setSelectedSalesRep(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sales Reps</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Chen">Mike Chen</option>
                  <option value="Lisa Rodriguez">Lisa Rodriguez</option>
                  <option value="David Kim">David Kim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Latin America">Latin America</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Line</label>
                <select
                  value={selectedProductLine}
                  onChange={(e) => setSelectedProductLine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Products</option>
                  <option value="Enterprise Software">Enterprise Software</option>
                  <option value="SaaS Solutions">SaaS Solutions</option>
                  <option value="Consulting Services">Consulting Services</option>
                  <option value="Support & Training">Support & Training</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Forecast</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotalForecast())}</p>
                <p className="text-xs text-gray-500">{selectedPeriod === 'monthly' ? 'Next 6 months' : 'Next 4 quarters'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actual Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(calculateTotalActual())}</p>
                <p className="text-xs text-gray-500">Year to date</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Variance</p>
                <p className={`text-2xl font-bold ${getVarianceColor(calculateTotalVariance())}`}>
                  {formatCurrency(calculateTotalVariance())}
                </p>
                <p className="text-xs text-gray-500">Forecast vs Actual</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{getAccuracyPercentage()}%</p>
                <p className="text-xs text-gray-500">Forecast accuracy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Forecast vs Actual Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Forecast vs Actual Revenue</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <LineChart className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {(selectedPeriod === 'monthly' ? mockForecastData.monthly : mockForecastData.quarterly).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium text-gray-900">
                      {selectedPeriod === 'monthly' ? item.month : item.quarter}
                    </div>
                    <div className="text-sm text-gray-600">
                      Actual: {formatCurrency(item.actual)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Forecast: {formatCurrency(item.forecast)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getVarianceIcon(item.variance)}
                    <span className={`text-sm font-medium ${getVarianceColor(item.variance)}`}>
                      {item.variance > 0 ? '+' : ''}{formatCurrency(item.variance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
            </div>
            
            <div className="space-y-4">
              {mockAISuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-purple-400">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getAIImpactColor(suggestion.impact)}`}>
                      {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                    </span>
                    <span className="text-xs text-gray-500">{suggestion.confidence}% confidence</span>
                  </div>
                  <p className="text-sm text-gray-700">{suggestion.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Value by Stage</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Prospecting</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(mockPipelineData.prospecting)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Proposal</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{formatCurrency(mockPipelineData.proposal)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Negotiation</span>
                </div>
                <span className="text-lg font-bold text-orange-600">{formatCurrency(mockPipelineData.negotiation)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-t pt-4">
                <span className="text-sm font-medium text-gray-900">Total Pipeline</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency(mockPipelineData.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Forecast Accuracy Trends</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Q4 2023</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">92%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Q3 2023</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">87%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Q2 2023</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">78%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Q1 2023</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">85%</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Review Q2 Forecast</h3>
                <p className="text-sm text-yellow-700">Consider adjusting Q2 forecast based on pipeline strength</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Focus on Prospecting</h3>
                <p className="text-sm text-blue-700">Increase prospecting activities to fill pipeline</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Optimize Conversion</h3>
                <p className="text-sm text-green-700">Work on improving proposal to negotiation conversion</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-purple-800">AI Model Training</h3>
                <p className="text-sm text-purple-700">Update AI model with recent performance data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
