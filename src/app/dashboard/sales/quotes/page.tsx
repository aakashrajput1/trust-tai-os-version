'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  User,
  Building,
  FileText,
  Copy,
  Share2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Mock data for quotes
const mockQuotes = [
  {
    id: 'QT-001',
    title: 'Enterprise Software License',
    client: 'TechStart Inc.',
    contact: 'John Smith',
    value: 45000,
    status: 'draft',
    validUntil: '2024-02-15',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-25',
    lastModified: '2024-01-25',
    approvalStatus: 'pending',
    products: [
      { name: 'Enterprise Software License', quantity: 1, price: 35000, total: 35000 },
      { name: 'Implementation Services', quantity: 1, price: 8000, total: 8000 },
      { name: 'Annual Support', quantity: 1, price: 2000, total: 2000 }
    ],
    notes: 'Client is very interested but needs to finalize budget approval.',
    terms: 'Net 30, 50% upfront, 50% upon completion'
  },
  {
    id: 'QT-002',
    title: 'Support Contract Renewal',
    client: 'DataFlow Systems',
    contact: 'Emily Davis',
    value: 15000,
    status: 'sent',
    validUntil: '2024-02-10',
    createdBy: 'Mike Chen',
    createdAt: '2024-01-24',
    lastModified: '2024-01-24',
    approvalStatus: 'approved',
    products: [
      { name: 'Annual Support Contract', quantity: 1, price: 12000, total: 12000 },
      { name: 'Premium Support Add-on', quantity: 1, price: 3000, total: 3000 }
    ],
    notes: 'Client requested premium support upgrade.',
    terms: 'Net 30, 100% upfront'
  },
  {
    id: 'QT-003',
    title: 'Consulting Services Package',
    client: 'InnovateCorp',
    contact: 'Alex Rodriguez',
    value: 25000,
    status: 'accepted',
    validUntil: '2024-02-20',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-23',
    lastModified: '2024-01-25',
    approvalStatus: 'approved',
    products: [
      { name: 'Strategic Consulting', quantity: 40, price: 500, total: 20000 },
      { name: 'Implementation Support', quantity: 1, price: 5000, total: 5000 }
    ],
    notes: 'Client accepted with minor modifications to timeline.',
    terms: 'Net 30, 30% upfront, 40% at milestone, 30% upon completion'
  },
  {
    id: 'QT-004',
    title: 'Training Program',
    client: 'GlobalTech Solutions',
    contact: 'Lisa Wang',
    value: 8000,
    status: 'expired',
    validUntil: '2024-01-15',
    createdBy: 'Emily Davis',
    createdAt: '2024-01-10',
    lastModified: '2024-01-10',
    approvalStatus: 'approved',
    products: [
      { name: 'Training Program', quantity: 1, price: 6000, total: 6000 },
      { name: 'Training Materials', quantity: 1, price: 2000, total: 2000 }
    ],
    notes: 'Quote expired before client could respond.',
    terms: 'Net 30, 100% upfront'
  },
  {
    id: 'QT-005',
    title: 'Custom Development',
    client: 'StartupXYZ',
    contact: 'David Kim',
    value: 35000,
    status: 'draft',
    validUntil: '2024-03-01',
    createdBy: 'Mike Chen',
    createdAt: '2024-01-26',
    lastModified: '2024-01-26',
    approvalStatus: 'pending',
    products: [
      { name: 'Custom Development', quantity: 1, price: 25000, total: 25000 },
      { name: 'Testing & QA', quantity: 1, price: 8000, total: 8000 },
      { name: 'Documentation', quantity: 1, price: 2000, total: 2000 }
    ],
    notes: 'Complex custom development project for startup.',
    terms: 'Net 30, 40% upfront, 30% at milestone, 30% upon completion'
  }
]

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-yellow-100 text-yellow-800'
}

const approvalColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState(mockQuotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)

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

  const getDaysUntilExpiry = (dateString: string) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 0) return `Expired ${Math.abs(daysDiff)} days ago`
    if (daysDiff === 0) return 'Expires today'
    if (daysDiff === 1) return 'Expires tomorrow'
    if (daysDiff <= 7) return `Expires in ${daysDiff} days (urgent)`
    return `Expires in ${daysDiff} days`
  }

  const getExpiryColor = (dateString: string) => {
    const today = new Date()
    const expiryDate = new Date(dateString)
    const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 0) return 'text-red-600'
    if (daysDiff <= 7) return 'text-orange-600'
    if (daysDiff <= 14) return 'text-yellow-600'
    return 'text-green-600'
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.contact.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    const matchesApproval = approvalFilter === 'all' || quote.approvalStatus === approvalFilter
    
    return matchesSearch && matchesStatus && matchesApproval
  })

  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a]
    let bValue = b[sortBy as keyof typeof b]
    
    if (sortBy === 'createdAt' || sortBy === 'lastModified' || sortBy === 'validUntil') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleDuplicateQuote = (quote: any) => {
    const newQuote = {
      ...quote,
      id: `QT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'draft',
      approvalStatus: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    setQuotes([newQuote, ...quotes])
  }

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      setQuotes(quotes.filter(q => q.id !== quoteId))
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'draft': return <FileText className="w-4 h-4" />
      case 'sent': return <Send className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'expired': return <Clock className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getApprovalIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quotes & Proposals</h1>
              <p className="text-gray-600 mt-2">Create, manage, and track your sales quotes and proposals</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quote
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Approval Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Found {filteredQuotes.length} quotes</span>
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('id')}>
                    <div className="flex items-center space-x-1">
                      <span>Quote ID</span>
                      {sortBy === 'id' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('title')}>
                    <div className="flex items-center space-x-1">
                      <span>Title</span>
                      {sortBy === 'title' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('client')}>
                    <div className="flex items-center space-x-1">
                      <span>Client</span>
                      {sortBy === 'client' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('value')}>
                    <div className="flex items-center space-x-1">
                      <span>Value</span>
                      {sortBy === 'value' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('validUntil')}>
                    <div className="flex items-center space-x-1">
                      <span>Valid Until</span>
                      {sortBy === 'validUntil' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{quote.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.title}</div>
                        <div className="text-sm text-gray-500">Created by {quote.createdBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.client}</div>
                        <div className="text-sm text-gray-500">{quote.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrency(quote.value)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status as keyof typeof statusColors]}`}>
                        {getStatusIcon(quote.status)}
                        <span className="ml-1 capitalize">{quote.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${approvalColors[quote.approvalStatus as keyof typeof approvalColors]}`}>
                        {getApprovalIcon(quote.approvalStatus)}
                        <span className="ml-1 capitalize">{quote.approvalStatus}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getExpiryColor(quote.validUntil)}`}>
                        {getDaysUntilExpiry(quote.validUntil)}
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(quote.validUntil)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateQuote(quote)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                          title="Duplicate Quote"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedQuote(quote)}
                          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                          title="Edit Quote"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete Quote"
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
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(quotes.reduce((total, q) => total + q.value, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.filter(q => q.approvalStatus === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.filter(q => {
                    const daysUntilExpiry = Math.ceil((new Date(q.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
