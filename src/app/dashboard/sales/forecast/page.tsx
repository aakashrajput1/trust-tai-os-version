'use client'

import { useState, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  FileText,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building,
  Filter,
  Search
} from 'lucide-react'

// Mock data for revenue forecasting
const mockForecastData = {
  currentQuarter: {
    forecasted: 425000,
    actual: 284500,
    variance: 140500,
    deals: [
      { id: 1, title: 'Enterprise Software License', value: 125000, probability: 75, stage: 'negotiation' },
      { id: 2, title: 'Cloud Migration Project', value: 85000, probability: 60, stage: 'proposal' },
      { id: 3, title: 'Data Analytics Platform', value: 95000, probability: 30, stage: 'prospecting' },
      { id: 4, title: 'Mobile App Development', value: 75000, probability: 65, stage: 'proposal' },
      { id: 5, title: 'Training Program', value: 28000, probability: 80, stage: 'negotiation' },
      { id: 6, title: 'Consulting Services', value: 65000, probability: 25, stage: 'prospecting' }
    ]
  },
  monthlyForecast: [
    { month: 'Jan', forecasted: 95000, actual: 95000, variance: 0 },
    { month: 'Feb', forecasted: 165000, actual: 0, variance: 165000 },
    { month: 'Mar', forecasted: 165000, actual: 0, variance: 165000 }
  ],
  historicalData: [
    { quarter: 'Q1 2023', forecasted: 380000, actual: 365000, variance: -15000 },
    { quarter: 'Q2 2023', forecasted: 420000, actual: 398000, variance: -22000 },
    { quarter: 'Q3 2023', forecasted: 450000, actual: 432000, variance: -18000 },
    { quarter: 'Q4 2023', forecasted: 480000, actual: 465000, variance: -15000 },
    { quarter: 'Q1 2024', forecasted: 425000, actual: 284500, variance: -140500 }
  ],
  aiSuggestions: [
    {
      type: 'probability',
      message: 'Increase probability of "Data Analytics Platform" from 30% to 45% based on recent client interactions',
      impact: '+$14,250',
      priority: 'high'
    },
    {
      type: 'timeline',
      message: 'Extend "Cloud Migration Project" close date by 2 weeks to align with client budget cycle',
      impact: 'Timeline adjustment',
      priority: 'medium'
    },
    {
      type: 'pipeline',
      message: 'Focus on 3 deals in negotiation stage to improve Q1 close rate',
      impact: '+$288,000',
      priority: 'high'
    }
  ]
}

const mockSalesReps = [
  { name: 'Sarah Johnson', forecasted: 180000, actual: 125000, variance: -55000, deals: 3 },
  { name: 'Mike Chen', forecasted: 120000, actual: 98000, variance: -22000, deals: 2 },
  { name: 'Lisa Wang', forecasted: 95000, actual: 87500, variance: -7500, deals: 2 },
  { name: 'David Rodriguez', forecasted: 30000, actual: 0, variance: -30000, deals: 1 }
]

const mockRegions = [
  { name: 'North America', forecasted: 280000, actual: 200000, variance: -80000 },
  { name: 'Europe', forecasted: 95000, actual: 65000, variance: -30000 },
  { name: 'Asia Pacific', forecasted: 50000, actual: 19500, variance: -30500 }
]

const mockProductLines = [
  { name: 'Software Licenses', forecasted: 200000, actual: 125000, variance: -75000 },
  { name: 'Professional Services', forecasted: 150000, actual: 100000, variance: -50000 },
  { name: 'Cloud Solutions', forecasted: 75000, actual: 59500, variance: -15500 }
]

export default function RevenueForecasting() {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter')
  const [selectedRep, setSelectedRep] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [viewMode, setViewMode] = useState('forecast')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getVarianceColor = (variance: number) => {
    if (variance >= 0) return 'text-green-600'
    return 'text-red-600'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance >= 0) return <TrendingUp className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const calculateAccuracy = () => {
    const totalForecasted = mockForecastData.historicalData.reduce((sum, item) => sum + item.forecasted, 0)
    const totalActual = mockForecastData.historicalData.reduce((sum, item) => sum + item.actual, 0)
    const accuracy = ((totalActual / totalForecasted) * 100)
    return Math.round(accuracy)
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting forecast as ${format.toUpperCase()}`)
    // In real app, this would trigger the actual export
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Revenue Forecasting</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              AI-powered revenue predictions and forecasting insights
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExport('excel')}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('forecast')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'forecast'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Forecast View
            </button>
            <button
              onClick={() => setViewMode('analysis')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'analysis'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analysis View
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Period Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="quarter">Current Quarter</option>
                <option value="month">Monthly</option>
                <option value="year">Annual</option>
              </select>
            </div>

            {/* Sales Rep Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sales Rep</label>
              <select
                value={selectedRep}
                onChange={(e) => setSelectedRep(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Reps</option>
                {mockSalesReps.map(rep => (
                  <option key={rep.name} value={rep.name}>{rep.name}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Regions</option>
                {mockRegions.map(region => (
                  <option key={region.name} value={region.name}>{region.name}</option>
                ))}
              </select>
            </div>

            {/* Product Line Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Line</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Products</option>
                {mockProductLines.map(product => (
                  <option key={product.name} value={product.name}>{product.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Current Quarter Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Forecast vs Actual */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Quarter</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Forecasted</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(mockForecastData.currentQuarter.forecasted)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Actual</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(mockForecastData.currentQuarter.actual)}
              </span>
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Variance</span>
                <div className={`flex items-center font-semibold ${getVarianceColor(mockForecastData.currentQuarter.variance)}`}>
                  {getVarianceIcon(mockForecastData.currentQuarter.variance)}
                  <span className="ml-1">
                    {formatCurrency(Math.abs(mockForecastData.currentQuarter.variance))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Accuracy */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Historical Accuracy</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {calculateAccuracy()}%
            </div>
            <div className="text-sm text-gray-600">Forecast Accuracy</div>
            <div className="text-xs text-gray-500 mt-1">Last 5 quarters</div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Target</span>
              <span className="font-medium text-gray-900">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(calculateAccuracy(), 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {mockForecastData.aiSuggestions.slice(0, 2).map((suggestion, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}>
                <div className="flex items-start space-x-2">
                  {getPriorityIcon(suggestion.priority)}
                  <div className="flex-1">
                    <p className="text-xs font-medium">{suggestion.message}</p>
                    <p className="text-xs opacity-75 mt-1">Impact: {suggestion.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Forecast Chart */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Forecast vs Actual</h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {mockForecastData.monthlyForecast.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{item.month}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Forecasted</div>
                      <div className="text-xs text-gray-500">{formatCurrency(item.forecasted)}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Actual</div>
                    <div className="text-xs text-gray-500">
                      {item.actual > 0 ? formatCurrency(item.actual) : 'Pending'}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Variance</div>
                    <div className={`text-xs ${getVarianceColor(item.variance)}`}>
                      {formatCurrency(Math.abs(item.variance))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Rep Performance */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sales Rep Performance</h2>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {mockSalesReps.map((rep, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                      <div className="text-xs text-gray-500">{rep.deals} deals</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(rep.forecasted)}</div>
                    <div className="text-xs text-gray-500">Forecasted</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(rep.actual)}</div>
                    <div className="text-xs text-gray-500">Actual</div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getVarianceColor(rep.variance)}`}>
                      {formatCurrency(Math.abs(rep.variance))}
                    </div>
                    <div className="text-xs text-gray-500">Variance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">AI-Powered Suggestions</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Based on historical data & pipeline analysis</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockForecastData.aiSuggestions.map((suggestion, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(suggestion.priority)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(suggestion.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)} Optimization
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{suggestion.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Impact</span>
                      <span className="text-sm font-semibold text-green-600">{suggestion.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Data */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historical Forecast Accuracy</h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quarter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forecasted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockForecastData.historicalData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.quarter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.forecasted)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.actual)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center text-sm font-medium ${getVarianceColor(item.variance)}`}>
                        {getVarianceIcon(item.variance)}
                        <span className="ml-1">{formatCurrency(Math.abs(item.variance))}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round((item.actual / item.forecasted) * 100)}%
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
