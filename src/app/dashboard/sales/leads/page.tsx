'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Target, 
  User, 
  Building, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

// Mock data for leads
const mockLeads = [
  {
    id: 1,
    name: 'John Smith',
    company: 'TechCorp Solutions',
    status: 'new',
    source: 'Website',
    owner: 'Sarah Johnson',
    createdDate: '2024-01-15',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    potentialValue: 50000,
    lastContact: '2024-01-20'
  },
  {
    id: 2,
    name: 'Emily Davis',
    company: 'InnovateSoft Inc',
    status: 'contacted',
    source: 'LinkedIn',
    owner: 'Mike Chen',
    createdDate: '2024-01-14',
    email: 'emily.davis@innovatesoft.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    potentialValue: 75000,
    lastContact: '2024-01-19'
  },
  {
    id: 3,
    name: 'Michael Brown',
    company: 'DataFlow Systems',
    status: 'qualified',
    source: 'Referral',
    owner: 'Lisa Wang',
    createdDate: '2024-01-13',
    email: 'michael.brown@dataflow.com',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    potentialValue: 120000,
    lastContact: '2024-01-18'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    company: 'CloudTech Solutions',
    status: 'unqualified',
    source: 'Trade Show',
    owner: 'David Rodriguez',
    createdDate: '2024-01-12',
    email: 'sarah.wilson@cloudtech.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    potentialValue: 35000,
    lastContact: '2024-01-17'
  },
  {
    id: 5,
    name: 'Robert Johnson',
    company: 'Digital Dynamics',
    status: 'new',
    source: 'Website',
    owner: 'Sarah Johnson',
    createdDate: '2024-01-11',
    email: 'robert.johnson@digitaldynamics.com',
    phone: '+1 (555) 567-8901',
    location: 'Boston, MA',
    potentialValue: 90000,
    lastContact: '2024-01-16'
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    company: 'FutureTech Labs',
    status: 'contacted',
    source: 'Cold Call',
    owner: 'Mike Chen',
    createdDate: '2024-01-10',
    email: 'lisa.anderson@futuretech.com',
    phone: '+1 (555) 678-9012',
    location: 'Chicago, IL',
    potentialValue: 65000,
    lastContact: '2024-01-15'
  },
  {
    id: 7,
    name: 'David Thompson',
    company: 'Smart Solutions',
    status: 'qualified',
    source: 'Website',
    owner: 'Lisa Wang',
    createdDate: '2024-01-09',
    email: 'david.thompson@smartsolutions.com',
    phone: '+1 (555) 789-0123',
    location: 'Denver, CO',
    potentialValue: 85000,
    lastContact: '2024-01-14'
  },
  {
    id: 8,
    name: 'Jennifer Lee',
    company: 'NextGen Technologies',
    status: 'new',
    source: 'Referral',
    owner: 'David Rodriguez',
    createdDate: '2024-01-08',
    email: 'jennifer.lee@nextgen.com',
    phone: '+1 (555) 890-1234',
    location: 'Miami, FL',
    potentialValue: 110000,
    lastContact: '2024-01-13'
  }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'unqualified', label: 'Unqualified' }
]

const sourceOptions = [
  { value: 'all', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Trade Show', label: 'Trade Show' },
  { value: 'Cold Call', label: 'Cold Call' }
]

const ownerOptions = [
  { value: 'all', label: 'All Owners' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Chen', label: 'Mike Chen' },
  { value: 'Lisa Wang', label: 'Lisa Wang' },
  { value: 'David Rodriguez', label: 'David Rodriguez' }
]

export default function LeadsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set())

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    return mockLeads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter
      const matchesOwner = ownerFilter === 'all' || lead.owner === ownerFilter

      return matchesSearch && matchesStatus && matchesSource && matchesOwner
    })
  }, [searchTerm, statusFilter, sourceFilter, ownerFilter])

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLeads = filteredLeads.slice(startIndex, endIndex)

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedLeads.size === currentLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(currentLeads.map(lead => lead.id)))
    }
  }

  const handleSelectLead = (leadId: number) => {
    const newSelected = new Set(selectedLeads)
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId)
    } else {
      newSelected.add(leadId)
    }
    setSelectedLeads(newSelected)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedLeads.size === 0) return
    
    switch(action) {
      case 'convert':
        console.log('Converting leads:', Array.from(selectedLeads))
        break
      case 'assign':
        console.log('Assigning leads:', Array.from(selectedLeads))
        break
      case 'markLost':
        console.log('Marking leads as lost:', Array.from(selectedLeads))
        break
      case 'export':
        console.log('Exporting leads:', Array.from(selectedLeads))
        break
    }
    
    setSelectedLeads(new Set())
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      contacted: { color: 'bg-yellow-100 text-yellow-800', icon: Phone },
      qualified: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      unqualified: { color: 'bg-red-100 text-red-800', icon: XCircle }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage and track your sales leads
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <Link
              href="/dashboard/sales/leads/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Lead
            </Link>
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
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {ownerOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                {selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('convert')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Convert to Deal
              </button>
              <button
                onClick={() => handleBulkAction('assign')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign to Rep
              </button>
              <button
                onClick={() => handleBulkAction('markLost')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Mark as Lost
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                Export Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedLeads.size === currentLeads.length && currentLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Potential Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{lead.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{lead.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {new Date(lead.createdDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(lead.potentialValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/dashboard/sales/leads/${lead.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/sales/leads/${lead.id}/edit`}
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => console.log('Convert lead:', lead.id)}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Convert to Deal"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => console.log('Delete lead:', lead.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Lead"
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

        {/* Pagination */}
        <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} results
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
    </div>
  )
}
