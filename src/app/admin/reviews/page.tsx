'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  Mail,
  Building,
  Briefcase,
  AlertCircle,
  Check,
  X
} from 'lucide-react'

interface UserReview {
  id: string
  user_id: string
  name: string
  email: string
  role: string
  department?: string
  position?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

interface ReviewCounts {
  pending: number
  approved: number
  rejected: number
  total: number
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<ReviewCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'developer', label: 'Developer' },
    { value: 'project-manager', label: 'Project Manager' },
    { value: 'sales', label: 'Sales' },
    { value: 'support-agent', label: 'Support Agent' },
    { value: 'support-lead', label: 'Support Lead' },
    { value: 'hr', label: 'HR' },
    { value: 'executive', label: 'Executive' }
  ]

  const statuses = [
    { value: 'all', label: 'All Status', icon: Users },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'approved', label: 'Approved', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', icon: XCircle }
  ]

  useEffect(() => {
    fetchReviews()
  }, [currentPage, selectedStatus, selectedRole, searchTerm])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        status: selectedStatus,
        role: selectedRole,
        search: searchTerm
      })

      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.data.reviews)
        setCounts(data.data.counts)
        setTotalPages(data.data.pagination.totalPages)
      } else {
        setError(data.error || 'Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    setProcessingAction(reviewId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId,
          action,
          adminNotes: action === 'reject' ? adminNotes : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`User ${action}d successfully`)
        setShowReviewModal(false)
        setSelectedReview(null)
        setAdminNotes('')
        fetchReviews() // Refresh the list
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error || `Failed to ${action} user`)
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      setError(`Failed to ${action} user`)
    } finally {
      setProcessingAction(null)
    }
  }

  const openReviewModal = (review: UserReview) => {
    setSelectedReview(review)
    setShowReviewModal(true)
    setAdminNotes('')
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'developer': return 'bg-blue-100 text-blue-800'
      case 'project-manager': return 'bg-green-100 text-green-800'
      case 'sales': return 'bg-purple-100 text-purple-800'
      case 'support-agent': return 'bg-orange-100 text-orange-800'
      case 'support-lead': return 'bg-indigo-100 text-indigo-800'
      case 'hr': return 'bg-pink-100 text-pink-800'
      case 'executive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Reviews</h1>
          <p className="text-gray-600 mt-2">Review and approve pending user signups</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{success}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map((status) => {
          const Icon = status.icon
          const count = counts[status.value as keyof ReviewCounts] || counts.total
          const isActive = selectedStatus === status.value
          
          return (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`p-4 rounded-lg border transition-colors ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-8 w-8 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-600">{status.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{review.name}</div>
                        <div className="text-sm text-gray-500">{review.email}</div>
                        {review.department && (
                          <div className="text-xs text-gray-400 flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {review.department}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(review.role)}`}>
                      {review.role.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                    {review.position && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {review.position}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(review.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openReviewModal(review)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleReviewAction(review.id, 'approve')}
                            disabled={processingAction === review.id}
                            className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                            title="Approve user"
                          >
                            {processingAction === review.id ? (
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openReviewModal(review)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Reject user"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Review User</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-sm text-gray-900">{selectedReview.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{selectedReview.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedReview.role)}`}>
                    {selectedReview.role.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>

                {selectedReview.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-sm text-gray-900">{selectedReview.department}</p>
                  </div>
                )}

                {selectedReview.position && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <p className="text-sm text-gray-900">{selectedReview.position}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Applied On</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedReview.created_at)}</p>
                </div>

                {selectedReview.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Notes (for rejection)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Optional notes for rejection..."
                    />
                  </div>
                )}

                {selectedReview.status === 'rejected' && selectedReview.admin_notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Notes</label>
                    <p className="text-sm text-gray-900">{selectedReview.admin_notes}</p>
                  </div>
                )}
              </div>

              {selectedReview.status === 'pending' && (
                <div className="flex items-center space-x-3 mt-6">
                  <button
                    onClick={() => handleReviewAction(selectedReview.id, 'approve')}
                    disabled={processingAction === selectedReview.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {processingAction === selectedReview.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReviewAction(selectedReview.id, 'reject')}
                    disabled={processingAction === selectedReview.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {processingAction === selectedReview.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


