'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Target, 
  DollarSign, 
  Calendar,
  User,
  Building,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

// Mock data for deals
const mockDeals = [
  {
    id: 1,
    title: 'Enterprise Software License',
    client: 'TechCorp Solutions',
    value: 125000,
    expectedCloseDate: '2024-02-15',
    owner: 'Sarah Johnson',
    stage: 'negotiation',
    probability: 75,
    lastActivity: '2024-01-20',
    description: 'Multi-year enterprise software licensing deal'
  },
  {
    id: 2,
    title: 'Cloud Migration Project',
    client: 'InnovateSoft Inc',
    value: 85000,
    expectedCloseDate: '2024-02-28',
    owner: 'Mike Chen',
    stage: 'proposal',
    probability: 60,
    lastActivity: '2024-01-19',
    description: 'Complete cloud infrastructure migration'
  },
  {
    id: 3,
    title: 'Data Analytics Platform',
    client: 'DataFlow Systems',
    value: 95000,
    expectedCloseDate: '2024-03-10',
    owner: 'Lisa Wang',
    stage: 'prospecting',
    probability: 30,
    lastActivity: '2024-01-18',
    description: 'Custom data analytics solution'
  },
  {
    id: 4,
    title: 'Security Audit Service',
    client: 'CloudTech Solutions',
    value: 45000,
    expectedCloseDate: '2024-02-05',
    owner: 'David Rodriguez',
    stage: 'closed-won',
    probability: 100,
    lastActivity: '2024-01-17',
    description: 'Annual security assessment and audit'
  },
  {
    id: 5,
    title: 'Mobile App Development',
    client: 'Digital Dynamics',
    value: 75000,
    expectedCloseDate: '2024-03-20',
    owner: 'Sarah Johnson',
    stage: 'proposal',
    probability: 65,
    lastActivity: '2024-01-16',
    description: 'Cross-platform mobile application'
  },
  {
    id: 6,
    title: 'API Integration Service',
    client: 'FutureTech Labs',
    value: 35000,
    expectedCloseDate: '2024-02-10',
    owner: 'Mike Chen',
    stage: 'closed-lost',
    probability: 0,
    lastActivity: '2024-01-15',
    description: 'Third-party API integration project'
  },
  {
    id: 7,
    title: 'Training Program',
    client: 'Smart Solutions',
    value: 28000,
    expectedCloseDate: '2024-02-25',
    owner: 'Lisa Wang',
    stage: 'negotiation',
    probability: 80,
    lastActivity: '2024-01-14',
    description: 'Employee training and certification program'
  },
  {
    id: 8,
    title: 'Consulting Services',
    client: 'NextGen Technologies',
    value: 65000,
    expectedCloseDate: '2024-03-15',
    owner: 'David Rodriguez',
    stage: 'prospecting',
    probability: 25,
    lastActivity: '2024-01-13',
    description: 'Strategic technology consulting engagement'
  }
]

const pipelineStages = [
  {
    id: 'prospecting',
    name: 'Prospecting',
    color: 'bg-blue-100 border-blue-200',
    textColor: 'text-blue-800',
    deals: mockDeals.filter(deal => deal.stage === 'prospecting')
  },
  {
    id: 'proposal',
    name: 'Proposal',
    color: 'bg-purple-100 border-purple-200',
    textColor: 'text-purple-800',
    deals: mockDeals.filter(deal => deal.stage === 'proposal')
  },
  {
    id: 'negotiation',
    name: 'Negotiation',
    color: 'bg-orange-100 border-orange-200',
    textColor: 'text-orange-800',
    deals: mockDeals.filter(deal => deal.stage === 'negotiation')
  },
  {
    id: 'closed-won',
    name: 'Closed Won',
    color: 'bg-green-100 border-green-200',
    textColor: 'text-green-800',
    deals: mockDeals.filter(deal => deal.stage === 'closed-won')
  },
  {
    id: 'closed-lost',
    name: 'Closed Lost',
    color: 'bg-red-100 border-red-200',
    textColor: 'text-red-800',
    deals: mockDeals.filter(deal => deal.stage === 'closed-lost')
  }
]

export default function DealsPipeline() {
  const [searchTerm, setSearchTerm] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [valueRange, setValueRange] = useState('all')
  const [closeDateRange, setCloseDateRange] = useState('all')
  const [selectedDeals, setSelectedDeals] = useState<Set<number>>(new Set())

  // Filter deals based on search and filters
  const filteredDeals = useMemo(() => {
    return mockDeals.filter(deal => {
      const matchesSearch = 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesOwner = ownerFilter === 'all' || deal.owner === ownerFilter
      
      let matchesValue = true
      if (valueRange !== 'all') {
        const [min, max] = valueRange.split('-').map(Number)
        if (max) {
          matchesValue = deal.value >= min && deal.value <= max
        } else {
          matchesValue = deal.value >= min
        }
      }
      
      let matchesCloseDate = true
      if (closeDateRange !== 'all') {
        const today = new Date()
        const closeDate = new Date(deal.expectedCloseDate)
        const daysDiff = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        switch(closeDateRange) {
          case 'this-week':
            matchesCloseDate = daysDiff >= 0 && daysDiff <= 7
            break
          case 'this-month':
            matchesCloseDate = daysDiff >= 0 && daysDiff <= 30
            break
          case 'overdue':
            matchesCloseDate = daysDiff < 0
            break
        }
      }

      return matchesSearch && matchesOwner && matchesValue && matchesCloseDate
    })
  }, [searchTerm, ownerFilter, valueRange, closeDateRange])

  // Update pipeline stages with filtered deals
  const filteredPipelineStages = useMemo(() => {
    return pipelineStages.map(stage => ({
      ...stage,
      deals: filteredDeals.filter(deal => deal.stage === stage.id)
    }))
  }, [filteredDeals])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilClose = (dateString: string) => {
    const today = new Date()
    const closeDate = new Date(dateString)
    const daysDiff = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600'
    if (probability >= 60) return 'text-yellow-600'
    if (probability >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getValueRangeOptions = () => [
    { value: 'all', label: 'All Values' },
    { value: '0-25000', label: '$0 - $25K' },
    { value: '25000-50000', label: '$25K - $50K' },
    { value: '50000-100000', label: '$50K - $100K' },
    { value: '100000-', label: '$100K+' }
  ]

  const getCloseDateRangeOptions = () => [
    { value: 'all', label: 'All Dates' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const getOwnerOptions = () => [
    { value: 'all', label: 'All Owners' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Mike Chen', label: 'Mike Chen' },
    { value: 'Lisa Wang', label: 'Lisa Wang' },
    { value: 'David Rodriguez', label: 'David Rodriguez' }
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Deals Pipeline</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Track and manage your sales deals through the pipeline
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Pipeline
            </button>
            <Link
              href="/dashboard/sales/deals/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Deal
            </Link>
          </div>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {filteredPipelineStages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-lg border p-4 text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stage.color} ${stage.textColor} mb-2`}>
              {stage.name}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stage.deals.length}</div>
            <div className="text-sm text-gray-500">
              {formatCurrency(stage.deals.reduce((sum, deal) => sum + deal.value, 0))}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Owner Filter */}
            <div>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {getOwnerOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Value Range Filter */}
            <div>
              <select
                value={valueRange}
                onChange={(e) => setValueRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {getValueRangeOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Close Date Filter */}
            <div>
              <select
                value={closeDateRange}
                onChange={(e) => setCloseDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {getCloseDateRangeOptions().map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {filteredPipelineStages.map((stage) => (
          <div key={stage.id} className="space-y-4">
            {/* Stage Header */}
            <div className={`p-4 rounded-lg border ${stage.color}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${stage.textColor}`}>{stage.name}</h3>
                <span className={`text-sm font-medium ${stage.textColor}`}>
                  {stage.deals.length} deals
                </span>
              </div>
              <div className={`text-sm ${stage.textColor} opacity-75 mt-1`}>
                {formatCurrency(stage.deals.reduce((sum, deal) => sum + deal.value, 0))}
              </div>
            </div>

            {/* Deal Cards */}
            <div className="space-y-3">
              {stage.deals.map((deal) => {
                const daysUntilClose = getDaysUntilClose(deal.expectedCloseDate)
                const isOverdue = daysUntilClose < 0
                
                return (
                  <div key={deal.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    {/* Deal Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{deal.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Building className="w-3 h-3 mr-1" />
                          {deal.client}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/dashboard/sales/deals/${deal.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Eye className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/dashboard/sales/deals/${deal.id}/edit`}
                          className="text-green-600 hover:text-green-800 p-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Deal Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Value</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(deal.value)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Probability</span>
                        <span className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
                          {deal.probability}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Owner</span>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-1">
                            <User className="w-2 h-2 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-700">{deal.owner}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Close Date</span>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                          <span className={`text-xs font-medium ${
                            isOverdue ? 'text-red-600' : daysUntilClose <= 7 ? 'text-orange-600' : 'text-gray-700'
                          }`}>
                            {formatDate(deal.expectedCloseDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deal Footer */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {isOverdue ? (
                            <span className="text-red-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {Math.abs(daysUntilClose)} days overdue
                            </span>
                          ) : daysUntilClose <= 7 ? (
                            <span className="text-orange-600 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {daysUntilClose} days left
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              {daysUntilClose} days left
                            </span>
                          )}
                        </span>
                        
                        {deal.stage === 'closed-won' && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        {deal.stage === 'closed-lost' && (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Empty State */}
              {stage.deals.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No deals in {stage.name}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Analytics */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Analytics</h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredDeals.reduce((sum, deal) => sum + deal.value, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Pipeline Value</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredDeals.filter(deal => deal.stage === 'closed-won').length}
              </div>
              <div className="text-sm text-gray-500">Deals Won</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredDeals.filter(deal => deal.stage === 'closed-won').reduce((sum, deal) => sum + deal.value, 0) / 
                 filteredDeals.reduce((sum, deal) => sum + deal.value, 0) * 100 || 0}%
              </div>
              <div className="text-sm text-gray-500">Win Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredDeals.filter(deal => deal.stage === 'negotiation' || deal.stage === 'proposal').length}
              </div>
              <div className="text-sm text-gray-500">Active Deals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
