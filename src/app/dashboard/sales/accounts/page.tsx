'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Building, 
  User, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Target,
  BarChart3
} from 'lucide-react'

// Mock data for client accounts
const mockAccounts = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Technology',
    accountManager: 'Sarah Johnson',
    lastDealDate: '2024-01-15',
    lifetimeValue: 450000,
    openOpportunities: 2,
    totalDeals: 8,
    status: 'active',
    location: 'San Francisco, CA',
    website: 'www.techcorp.com',
    employees: 250,
    annualRevenue: '25M',
    contactInfo: {
      primary: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, San Francisco, CA 94105'
    },
    recentDeals: [
      { id: 1, title: 'Enterprise Software License', value: 125000, status: 'closed-won', date: '2024-01-15' },
      { id: 2, title: 'Cloud Migration Project', value: 85000, status: 'in-progress', date: '2024-01-10' }
    ]
  },
  {
    id: 2,
    name: 'InnovateSoft Inc',
    industry: 'Software Development',
    accountManager: 'Mike Chen',
    lastDealDate: '2024-01-14',
    lifetimeValue: 320000,
    openOpportunities: 1,
    totalDeals: 5,
    status: 'active',
    location: 'New York, NY',
    website: 'www.innovatesoft.com',
    employees: 120,
    annualRevenue: '15M',
    contactInfo: {
      primary: 'Emily Davis',
      email: 'emily.davis@innovatesoft.com',
      phone: '+1 (555) 234-5678',
      address: '456 Innovation Ave, New York, NY 10001'
    },
    recentDeals: [
      { id: 3, title: 'Custom Development', value: 75000, status: 'closed-won', date: '2024-01-14' }
    ]
  },
  {
    id: 3,
    name: 'DataFlow Systems',
    industry: 'Data Analytics',
    accountManager: 'Lisa Wang',
    lastDealDate: '2024-01-13',
    lifetimeValue: 280000,
    openOpportunities: 3,
    totalDeals: 6,
    status: 'active',
    location: 'Austin, TX',
    website: 'www.dataflow.com',
    employees: 85,
    annualRevenue: '12M',
    contactInfo: {
      primary: 'Michael Brown',
      email: 'michael.brown@dataflow.com',
      phone: '+1 (555) 345-6789',
      address: '789 Data Drive, Austin, TX 73301'
    },
    recentDeals: [
      { id: 4, title: 'Analytics Platform', value: 95000, status: 'proposal', date: '2024-01-13' }
    ]
  },
  {
    id: 4,
    name: 'CloudTech Solutions',
    industry: 'Cloud Services',
    accountManager: 'David Rodriguez',
    lastDealDate: '2024-01-12',
    lifetimeValue: 180000,
    openOpportunities: 0,
    totalDeals: 4,
    status: 'inactive',
    location: 'Seattle, WA',
    website: 'www.cloudtech.com',
    employees: 65,
    annualRevenue: '8M',
    contactInfo: {
      primary: 'Sarah Wilson',
      email: 'sarah.wilson@cloudtech.com',
      phone: '+1 (555) 456-7890',
      address: '321 Cloud Way, Seattle, WA 98101'
    },
    recentDeals: [
      { id: 5, title: 'Security Audit', value: 45000, status: 'closed-won', date: '2024-01-12' }
    ]
  },
  {
    id: 5,
    name: 'Digital Dynamics',
    industry: 'Digital Marketing',
    accountManager: 'Sarah Johnson',
    lastDealDate: '2024-01-11',
    lifetimeValue: 220000,
    openOpportunities: 1,
    totalDeals: 7,
    status: 'active',
    location: 'Boston, MA',
    website: 'www.digitaldynamics.com',
    employees: 95,
    annualRevenue: '18M',
    contactInfo: {
      primary: 'Robert Johnson',
      email: 'robert.johnson@digitaldynamics.com',
      phone: '+1 (555) 567-8901',
      address: '654 Digital Blvd, Boston, MA 02101'
    },
    recentDeals: [
      { id: 6, title: 'Mobile App Development', value: 75000, status: 'negotiation', date: '2024-01-11' }
    ]
  },
  {
    id: 6,
    name: 'FutureTech Labs',
    industry: 'Research & Development',
    accountManager: 'Mike Chen',
    lastDealDate: '2024-01-10',
    lifetimeValue: 150000,
    openOpportunities: 2,
    totalDeals: 3,
    status: 'active',
    location: 'Chicago, IL',
    website: 'www.futuretech.com',
    employees: 45,
    annualRevenue: '6M',
    contactInfo: {
      primary: 'Lisa Anderson',
      email: 'lisa.anderson@futuretech.com',
      phone: '+1 (555) 678-9012',
      address: '987 Future Road, Chicago, IL 60601'
    },
    recentDeals: [
      { id: 7, title: 'API Integration', value: 35000, status: 'closed-lost', date: '2024-01-10' }
    ]
  }
]

const industryOptions = [
  { value: 'all', label: 'All Industries' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Software Development', label: 'Software Development' },
  { value: 'Data Analytics', label: 'Data Analytics' },
  { value: 'Cloud Services', label: 'Cloud Services' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Research & Development', label: 'Research & Development' }
]

const accountManagerOptions = [
  { value: 'all', label: 'All Managers' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Chen', label: 'Mike Chen' },
  { value: 'Lisa Wang', label: 'Lisa Wang' },
  { value: 'David Rodriguez', label: 'David Rodriguez' }
]

const revenueRangeOptions = [
  { value: 'all', label: 'All Revenue' },
  { value: '0-5M', label: '$0 - $5M' },
  { value: '5M-10M', label: '$5M - $10M' },
  { value: '10M-25M', label: '$10M - $25M' },
  { value: '25M+', label: '$25M+' }
]

export default function ClientAccounts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [managerFilter, setManagerFilter] = useState('all')
  const [revenueFilter, setRevenueFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [selectedAccounts, setSelectedAccounts] = useState<Set<number>>(new Set())

  // Filter and search accounts
  const filteredAccounts = useMemo(() => {
    return mockAccounts.filter(account => {
      const matchesSearch = 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.contactInfo.primary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesIndustry = industryFilter === 'all' || account.industry === industryFilter
      const matchesManager = managerFilter === 'all' || account.accountManager === managerFilter
      
      let matchesRevenue = true
      if (revenueFilter !== 'all') {
        const [min, max] = revenueFilter.split('-').map(Number)
        const accountRevenue = parseFloat(account.annualRevenue.replace('M', ''))
        if (max) {
          matchesRevenue = accountRevenue >= min && accountRevenue <= max
        } else {
          matchesRevenue = accountRevenue >= min
        }
      }

      return matchesSearch && matchesIndustry && matchesManager && matchesRevenue
    })
  }, [searchTerm, industryFilter, managerFilter, revenueFilter])

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex)

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedAccounts.size === currentAccounts.length) {
      setSelectedAccounts(new Set())
    } else {
      setSelectedAccounts(new Set(currentAccounts.map(account => account.id)))
    }
  }

  const handleSelectAccount = (accountId: number) => {
    const newSelected = new Set(selectedAccounts)
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId)
    } else {
      newSelected.add(accountId)
    }
    setSelectedAccounts(newSelected)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedAccounts.size === 0) return
    
    switch(action) {
      case 'export':
        console.log('Exporting accounts:', Array.from(selectedAccounts))
        break
      case 'assign':
        console.log('Assigning accounts:', Array.from(selectedAccounts))
        break
      case 'deactivate':
        console.log('Deactivating accounts:', Array.from(selectedAccounts))
        break
    }
    
    setSelectedAccounts(new Set())
  }

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      prospect: { color: 'bg-blue-100 text-blue-800', icon: Target }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getOpportunityStatusColor = (status: string) => {
    switch(status) {
      case 'closed-won': return 'text-green-600'
      case 'closed-lost': return 'text-red-600'
      case 'in-progress': return 'text-blue-600'
      case 'proposal': return 'text-purple-600'
      case 'negotiation': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Accounts</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage customer relationships and account information
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <Link
              href="/dashboard/sales/accounts/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Account
            </Link>
          </div>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{mockAccounts.length}</p>
              <p className="text-xs text-gray-500">Active customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total LTV</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockAccounts.reduce((sum, account) => sum + account.lifetimeValue, 0))}
              </p>
              <p className="text-xs text-gray-500">Lifetime value</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockAccounts.reduce((sum, account) => sum + account.openOpportunities, 0)}
              </p>
              <p className="text-xs text-gray-500">Active deals</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(mockAccounts.reduce((sum, account) => sum + account.lifetimeValue, 0) / 
                 mockAccounts.reduce((sum, account) => sum + account.totalDeals, 0))}
              </p>
              <p className="text-xs text-gray-500">Per deal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {industryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Account Manager Filter */}
            <div>
              <select
                value={managerFilter}
                onChange={(e) => setManagerFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {accountManagerOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Revenue Range Filter */}
            <div>
              <select
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {revenueRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedAccounts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedAccounts.size} account{selectedAccounts.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('assign')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reassign Manager
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.size === currentAccounts.length && currentAccounts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lifetime Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Opportunities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.has(account.id)}
                      onChange={() => handleSelectAccount(account.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.contactInfo.primary}</div>
                        <div className="text-xs text-gray-400">{account.website}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.industry}</div>
                    <div className="text-xs text-gray-500">{account.employees} employees</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{account.accountManager}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {formatDate(account.lastDealDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(account.lifetimeValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.openOpportunities}</div>
                    <div className="text-xs text-gray-500">{account.totalDeals} total deals</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(account.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/dashboard/sales/accounts/${account.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/sales/accounts/${account.id}/edit`}
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAccounts.length)} of {filteredAccounts.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Opportunities */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Opportunities</h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {mockAccounts.slice(0, 3).map((account) => (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.industry}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(account.lifetimeValue)}
                    </div>
                    <div className="text-xs text-gray-500">Lifetime Value</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {account.recentDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{deal.title}</span>
                        <span className={`text-xs font-medium ${getOpportunityStatusColor(deal.status)}`}>
                          {deal.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(deal.value)}</div>
                        <div className="text-xs text-gray-500">{formatDate(deal.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
