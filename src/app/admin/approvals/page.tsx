'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  position?: string
  isApproved: boolean
  isRejected: boolean
  created_at: string
  updated_at: string
}

interface ApprovalCounts {
  pending: number
  approved: number
  rejected: number
  total: number
}

export default function AdminApprovals() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [counts, setCounts] = useState<ApprovalCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingUsers()
  }, [currentPage, searchTerm])

  const fetchPendingUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm
      })

      const response = await fetch(`/api/admin/users/approve?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.data.users)
        setCounts(data.data.counts)
        setTotalPages(data.data.pagination.totalPages)
      } else {
        setError(data.error || 'Failed to fetch pending users')
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
      setError('Failed to fetch pending users')
    } finally {
      setLoading(false)
    }
  }

  const handleApprovalAction = async (userId: string, action: 'approve' | 'reject') => {
    setProcessingAction(userId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/users/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          action,
          adminNotes: action === 'reject' ? adminNotes : undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`User ${action}d successfully`)
        setShowApprovalModal(false)
        setSelectedUser(null)
        setAdminNotes('')
        fetchPendingUsers() // Refresh the list
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

  const openApprovalModal = (user: User) => {
    setSelectedUser(user)
    setShowApprovalModal(true)
    setAdminNotes('')
  }

  const getStatusBadgeColor = (user: User) => {
    if (user.isApproved) return 'bg-green-100 text-green-800'
    if (user.isRejected) return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (user: User) => {
    if (user.isApproved) return 'Approved'
    if (user.isRejected) return 'Rejected'
    return 'Pending'
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Approvals</h1>
        <p className="text-gray-600">Review and approve or reject new user registrations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{counts.approved}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{counts.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending users to approve</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <Badge className={getStatusBadgeColor(user)}>
                          {getStatusText(user)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{user.email}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Role: {user.role}</span>
                        {user.department && <span>Dept: {user.department}</span>}
                        {user.position && <span>Position: {user.position}</span>}
                        <span>Registered: {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openApprovalModal(user)}
                        disabled={processingAction === user.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingAction === user.id ? 'Processing...' : 'Review'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Review User</h3>
            <div className="mb-4">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              {selectedUser.department && <p><strong>Department:</strong> {selectedUser.department}</p>}
              {selectedUser.position && <p><strong>Position:</strong> {selectedUser.position}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Add notes for rejection..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setShowApprovalModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApprovalAction(selectedUser.id, 'reject')}
                disabled={processingAction === selectedUser.id}
                className="bg-red-600 hover:bg-red-700"
              >
                {processingAction === selectedUser.id ? 'Processing...' : 'Reject'}
              </Button>
              <Button
                onClick={() => handleApprovalAction(selectedUser.id, 'approve')}
                disabled={processingAction === selectedUser.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {processingAction === selectedUser.id ? 'Processing...' : 'Approve'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

