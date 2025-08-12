'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Building, 
  Eye, 
  Edit, 
  Plus,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  Users,
  Briefcase,
  ChevronDown,
  MoreVertical,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

// Mock data for client accounts
const mockClients = [
  {
    id: 'CL-001',
    name: 'TechStart Inc.',
    industry: 'Technology',
    accountManager: 'Sarah Johnson',
    contactPerson: 'John Smith',
    email: 'john.smith@techstart.com',
    phone: '+1-555-0123',
    website: 'www.techstart.com',
    address: '123 Tech Street, San Francisco, CA',
    lastDealDate: '2024-01-15',
    lifetimeValue: 125000,
    openOpportunities: 2,
    status: 'active',
    dealCount: 8,
    lastActivity: '2024-01-25'
  },
  {
    id: 'CL-002',
    name: 'Digital Solutions Ltd',
    industry: 'Consulting',
    accountManager: 'Mike Chen',
    contactPerson: 'Emily Davis',
    email: 'emily.davis@digitalsolutions.com',
    phone: '+1-555-0124',
    website: 'www.digitalsolutions.com',
    address: '456 Digital Ave, New York, NY',
    lastDealDate: '2024-01-20',
    lifetimeValue: 89000,
    openOpportunities: 1,
    status: 'active',
    dealCount: 5,
    lastActivity: '2024-01-26'
  },
  {
    id: 'CL-003',
    name: 'Innovation Corp',
    industry: 'Manufacturing',
    accountManager: 'Lisa Rodriguez',
    contactPerson: 'Robert Wilson',
    email: 'robert.wilson@innovationcorp.com',
    phone: '+1-555-0125',
    website: 'www.innovationcorp.com',
    address: '789 Innovation Blvd, Austin, TX',
    lastDealDate: '2024-01-10',
    lifetimeValue: 210000,
    openOpportunities: 3,
    status: 'active',
    dealCount: 12,
    lastActivity: '2024-01-27'
  },
  {
    id: 'CL-004',
    name: 'Global Tech',
    industry: 'Technology',
    accountManager: 'David Kim',
    contactPerson: 'Jennifer Brown',
    email: 'jennifer.brown@globaltech.com',
    phone: '+1-555-0126',
    website: 'www.globaltech.com',
    address: '321 Global Way, Seattle, WA',
    lastDealDate: '2024-01-28',
    lifetimeValue: 175000,
    openOpportunities: 0,
    status: 'active',
    dealCount: 9,
    lastActivity: '2024-01-28'
  },
  {
    id: 'CL-005',
    name: 'Cloud Systems',
    industry: 'Technology',
    accountManager: 'Sarah Johnson',
    contactPerson: 'Michael Johnson',
    email: 'michael.johnson@cloudsystems.com',
    phone: '+1-555-0127',
    website: 'www.cloudsystems.com',
    address: '654 Cloud Drive, Denver, CO',
    lastDealDate: '2024-01-05',
    lifetimeValue: 95000,
    openOpportunities: 1,
    status: 'active',
    dealCount: 6,
    lastActivity: '2024-01-24'
  }
]

export default function ClientAccountsPage() {
  const [clients, setClients] = useState(mockClients)
  const [filteredClients, setFilteredClients] = useState(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedAccountManager, setSelectedAccountManager] = useState('all')
  const [selectedRevenueRange, setSelectedRevenueRange] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [clientsPerPage] = useState(20)
  const { addNotification } = useNotifications()

  // Filter clients based on search and filters
  useEffect(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesIndustry = selectedIndustry === 'all' || client.industry === selectedIndustry
      const matchesAccountManager = selectedAccountManager === 'all' || client.accountManager === selectedAccountManager
      const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus
      
      let matchesRevenue = true
      if (selectedRevenueRange !== 'all') {
        const [min, max] = selectedRevenueRange.split('-').map(Number)
        if (max) {
          matchesRevenue = client.lifetimeValue >= min && client.lifetimeValue <= max
        } else {
          matchesRevenue = client.lifetimeValue >= min
        }
      }
      
      return matchesSearch && matchesIndustry && matchesAccountManager && matchesRevenue && matchesStatus
    })
    
    setFilteredClients(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [clients, searchTerm, selectedIndustry, selectedAccountManager, selectedRevenueRange, selectedStatus])

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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-700 bg-green-100 border-green-300'
      case 'inactive': return 'text-red-700 bg-red-100 border-red-300'
      case 'prospect': return 'text-blue-700 bg-blue-100 border-blue-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'prospect': return 'Prospect'
      default: return status
    }
  }

  const getRevenueRangeColor = (value: number) => {
    if (value >= 200000) return 'text-purple-600'
    if (value >= 100000) return 'text-green-600'
    if (value >= 50000) return 'text-blue-600'
    return 'text-gray-600'
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedIndustry('all')
    setSelectedAccountManager('all')
    setSelectedRevenueRange('all')
    setSelectedStatus('all')
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)
  const startIndex = (currentPage - 1) * clientsPerPage
  const endIndex = startIndex + clientsPerPage
  const currentClients = filteredClients.slice(startIndex, endIndex)

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
                <h1 className="text-3xl font-bold text-gray-900">Client Accounts</h1>
                <p className="text-gray-600 mt-2">Manage your customer relationships and accounts</p>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Client
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Manager</label>
                <select
                  value={selectedAccountManager}
                  onChange={(e) => setSelectedAccountManager(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Managers</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Chen">Mike Chen</option>
                  <option value="Lisa Rodriguez">Lisa Rodriguez</option>
                  <option value="David Kim">David Kim</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Range</label>
                <select
                  value={selectedRevenueRange}
                  onChange={(e) => setSelectedRevenueRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Revenue</option>
                  <option value="0-50000">$0 - $50K</option>
                  <option value="50000-100000">$50K - $100K</option>
                  <option value="100000-200000">$100K - $200K</option>
                  <option value="200000-">$200K+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
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
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                <p className="text-xs text-gray-500">Active accounts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total LTV</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(clients.reduce((total, client) => total + client.lifetimeValue, 0))}
                </p>
                <p className="text-xs text-gray-500">Lifetime value</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((total, client) => total + client.openOpportunities, 0)}
                </p>
                <p className="text-xs text-gray-500">Active deals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Deal Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(Math.round(clients.reduce((total, client) => total + client.lifetimeValue, 0) / clients.length))}
                </p>
                <p className="text-xs text-gray-500">Per client</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
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
                    Opportunities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.contactPerson}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{client.industry}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{client.accountManager}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{formatDate(client.lastDealDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${getRevenueRangeColor(client.lifetimeValue)}`}>
                        {formatCurrency(client.lifetimeValue)}
                      </div>
                      <div className="text-xs text-gray-500">{client.dealCount} deals</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {client.openOpportunities > 0 ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{client.openOpportunities} open</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">No opportunities</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/sales/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="View Client"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/sales/clients/${client.id}/edit`}
                          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded transition-colors"
                          title="Edit Client"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedIndustry !== 'all' || selectedAccountManager !== 'all' || selectedRevenueRange !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'You have no clients at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
