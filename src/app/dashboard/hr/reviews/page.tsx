'use client'

import { useState, useEffect } from 'react'
import { 
  Target, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Download, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  Award,
  TrendingUp,
  User,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3
} from 'lucide-react'

// Mock data for performance reviews
const mockReviews = [
  {
    id: 1,
    employee: 'John Smith',
    employeeId: 'EMP001',
    department: 'Engineering',
    position: 'Software Engineer',
    reviewType: 'Annual Review',
    dueDate: '2024-02-15',
    status: 'pending',
    lastReview: '2023-02-15',
    manager: 'Sarah Johnson',
    rating: null,
    completedAt: null
  },
  {
    id: 2,
    employee: 'Sarah Johnson',
    employeeId: 'EMP002',
    department: 'Engineering',
    position: 'Engineering Manager',
    reviewType: 'Annual Review',
    dueDate: '2024-03-01',
    status: 'in-progress',
    lastReview: '2023-03-01',
    manager: 'Mike Chen',
    rating: null,
    completedAt: null
  },
  {
    id: 3,
    employee: 'Lisa Wang',
    employeeId: 'EMP004',
    department: 'Marketing',
    position: 'Marketing Manager',
    reviewType: 'Annual Review',
    dueDate: '2024-02-28',
    status: 'completed',
    lastReview: '2023-02-28',
    manager: 'Emily Davis',
    rating: 4.2,
    completedAt: '2024-01-20'
  },
  {
    id: 4,
    employee: 'David Rodriguez',
    employeeId: 'EMP006',
    department: 'Sales',
    position: 'Sales Representative',
    reviewType: 'Quarterly Review',
    dueDate: '2024-01-31',
    status: 'overdue',
    lastReview: '2023-10-31',
    manager: 'Alex Thompson',
    rating: null,
    completedAt: null
  }
]

const mockReviewTemplates = [
  {
    id: 1,
    name: 'Annual Performance Review',
    description: 'Comprehensive annual review template',
    ratingScale: '1-5 Scale',
    categories: ['Technical Skills', 'Leadership', 'Communication', 'Results'],
    lastUpdated: '2024-01-01'
  },
  {
    id: 2,
    name: 'Quarterly Check-in',
    description: 'Quick quarterly performance check',
    ratingScale: '1-5 Scale',
    categories: ['Goals', 'Performance', 'Development'],
    lastUpdated: '2024-01-01'
  },
  {
    id: 3,
    name: 'Probation Review',
    description: 'End of probation period review',
    ratingScale: 'Pass/Fail',
    categories: ['Performance', 'Fit', 'Recommendation'],
    lastUpdated: '2024-01-01'
  }
]

const mockPastReviews = [
  {
    id: 1,
    employee: 'John Smith',
    reviewDate: '2023-02-15',
    rating: 4.1,
    manager: 'Sarah Johnson',
    type: 'Annual Review',
    summary: 'Strong technical performance, good team collaboration'
  },
  {
    id: 2,
    employee: 'John Smith',
    reviewDate: '2022-02-15',
    rating: 3.8,
    manager: 'Sarah Johnson',
    type: 'Annual Review',
    summary: 'Good progress, areas for improvement identified'
  }
]

const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
const reviewTypes = ['All Types', 'Annual Review', 'Quarterly Review', 'Probation Review', 'Promotion Review']
const statuses = ['All Statuses', 'pending', 'in-progress', 'completed', 'overdue']

export default function PerformanceReviews() {
  const [reviews, setReviews] = useState(mockReviews)
  const [filteredReviews, setFilteredReviews] = useState(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedReviewType, setSelectedReviewType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewsPerPage] = useState(10)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Filter reviews
  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = review.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === 'All Departments' || review.department === selectedDepartment
      const matchesReviewType = selectedReviewType === 'All Types' || review.reviewType === selectedReviewType
      const matchesStatus = selectedStatus === 'All Statuses' || review.status === selectedStatus
      
      return matchesSearch && matchesDepartment && matchesReviewType && matchesStatus
    })
    
    setFilteredReviews(filtered)
    setCurrentPage(1)
  }, [reviews, searchTerm, selectedDepartment, selectedReviewType, selectedStatus])

  // Handle review status change
  const handleStatusChange = (reviewId: number, newStatus: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: newStatus } : review
    ))
  }

  // Export review data
  const handleExport = () => {
    const csvContent = [
      ['Employee ID', 'Employee Name', 'Department', 'Position', 'Review Type', 'Due Date', 'Status', 'Rating'],
      ...filteredReviews.map(review => [
        review.employeeId,
        review.employee,
        review.department,
        review.position,
        review.reviewType,
        review.dueDate,
        review.status,
        review.rating || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-reviews-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDepartment('All Departments')
    setSelectedReviewType('All Types')
    setSelectedStatus('All Statuses')
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get review type color
  const getReviewTypeColor = (type: string) => {
    switch(type) {
      case 'Annual Review': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Quarterly Review': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Probation Review': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Promotion Review': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview)
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  // Open review modal
  const openReviewModal = (review: any) => {
    setSelectedReview(review)
    setShowReviewModal(true)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Performance Reviews</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage employee performance reviews and evaluations
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Reviews Due</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {reviews.filter(r => r.status === 'pending' || r.status === 'overdue').length}
              </div>
            </div>
            <button className="flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Review
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter(r => r.status === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by employee name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {filteredReviews.length} of {reviews.length} reviews
                  </div>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>

                    <select
                      value={selectedReviewType}
                      onChange={(e) => setSelectedReviewType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      {reviewTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Filter Actions */}
                {(searchTerm || selectedDepartment !== 'All Departments' || selectedReviewType !== 'All Types' || selectedStatus !== 'All Statuses') && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Review List</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-medium text-purple-600">EM</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{review.employee}</div>
                            <div className="text-xs text-gray-500">{review.employeeId}</div>
                            <div className="text-xs text-gray-400">{review.department}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{review.position}</div>
                        <div className="text-xs text-gray-600">{review.reviewType}</div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(review.dueDate).toLocaleDateString()}
                        </div>
                        {review.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{review.rating}/5</span>
                          </div>
                        )}
                      </td>
                      
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </td>
                      
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openReviewModal(review)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(review.id, 'in-progress')}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Start Review"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {currentReviews.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filter criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstReview + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastReview, filteredReviews.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredReviews.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Review Templates */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Review Templates</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {mockReviewTemplates.map((template) => (
                  <div key={template.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">{template.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{template.description}</div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Scale:</span> {template.ratingScale} • 
                      <span className="font-medium"> Updated:</span> {new Date(template.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Review History */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Past Reviews</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {mockPastReviews.map((review) => (
                  <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">{review.employee}</div>
                    <div className="text-xs text-gray-600 mb-2">{review.type}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
