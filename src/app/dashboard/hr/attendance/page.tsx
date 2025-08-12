'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Filter, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react'

// Mock data for attendance and leave
const mockLeaveRequests = [
  {
    id: 1,
    employee: 'John Smith',
    employeeId: 'EMP001',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2024-01-26',
    endDate: '2024-01-28',
    days: 3,
    status: 'pending',
    reason: 'Not feeling well, doctor appointment',
    submittedAt: '2024-01-25T10:30:00Z',
    manager: 'Sarah Johnson'
  },
  {
    id: 2,
    employee: 'Lisa Wang',
    employeeId: 'EMP004',
    department: 'Marketing',
    leaveType: 'Vacation',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    days: 5,
    status: 'approved',
    reason: 'Family vacation',
    submittedAt: '2024-01-20T14:15:00Z',
    manager: 'Emily Davis'
  },
  {
    id: 3,
    employee: 'David Rodriguez',
    employeeId: 'EMP006',
    department: 'Sales',
    leaveType: 'Personal Leave',
    startDate: '2024-01-30',
    endDate: '2024-01-30',
    days: 1,
    status: 'rejected',
    reason: 'Personal appointment',
    submittedAt: '2024-01-25T16:45:00Z',
    manager: 'Alex Thompson'
  }
]

const mockAttendanceData = {
  present: 142,
  absent: 14,
  onLeave: 12,
  late: 8,
  total: 156
}

const mockMonthlyData = [
  { date: '2024-01-01', present: 150, absent: 6, onLeave: 0, late: 2 },
  { date: '2024-01-02', present: 148, absent: 8, onLeave: 0, late: 3 },
  { date: '2024-01-03', present: 152, absent: 4, onLeave: 0, late: 1 },
  { date: '2024-01-04', present: 145, absent: 11, onLeave: 0, late: 4 },
  { date: '2024-01-05', present: 149, absent: 7, onLeave: 0, late: 2 },
  { date: '2024-01-08', present: 151, absent: 5, onLeave: 0, late: 3 },
  { date: '2024-01-09', present: 147, absent: 9, onLeave: 0, late: 2 },
  { date: '2024-01-10', present: 153, absent: 3, onLeave: 0, late: 1 },
  { date: '2024-01-11', present: 146, absent: 10, onLeave: 0, late: 3 },
  { date: '2024-01-12', present: 150, absent: 6, onLeave: 0, late: 2 },
  { date: '2024-01-15', present: 148, absent: 8, onLeave: 0, late: 4 },
  { date: '2024-01-16', present: 152, absent: 4, onLeave: 0, late: 1 },
  { date: '2024-01-17', present: 145, absent: 11, onLeave: 0, late: 3 },
  { date: '2024-01-18', present: 149, absent: 7, onLeave: 0, late: 2 },
  { date: '2024-01-19', present: 151, absent: 5, onLeave: 0, late: 1 },
  { date: '2024-01-22', present: 147, absent: 9, onLeave: 0, late: 4 },
  { date: '2024-01-23', present: 153, absent: 3, onLeave: 0, late: 2 },
  { date: '2024-01-24', present: 146, absent: 10, onLeave: 0, late: 3 },
  { date: '2024-01-25', present: 150, absent: 6, onLeave: 0, late: 1 },
  { date: '2024-01-26', present: 142, absent: 14, onLeave: 12, late: 8 }
]

const leaveTypes = ['All Types', 'Sick Leave', 'Vacation', 'Personal Leave', 'Maternity Leave', 'Paternity Leave']
const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
const statuses = ['All Statuses', 'pending', 'approved', 'rejected']

export default function LeaveAttendance() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedLeaveType, setSelectedLeaveType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests)
  const [filteredRequests, setFilteredRequests] = useState(mockLeaveRequests)

  // Filter leave requests
  useEffect(() => {
    let filtered = leaveRequests.filter(request => {
      const matchesDepartment = selectedDepartment === 'All Departments' || request.department === selectedDepartment
      const matchesLeaveType = selectedLeaveType === 'All Types' || request.leaveType === selectedLeaveType
      const matchesStatus = selectedStatus === 'All Statuses' || request.status === selectedStatus
      
      return matchesDepartment && matchesLeaveType && matchesStatus
    })
    
    setFilteredRequests(filtered)
  }, [leaveRequests, selectedDepartment, selectedLeaveType, selectedStatus])

  // Handle leave approval/rejection
  const handleLeaveAction = (requestId: number, action: 'approve' | 'reject') => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
        : request
    ))
  }

  // Export attendance data
  const handleExport = () => {
    const csvContent = [
      ['Date', 'Present', 'Absent', 'On Leave', 'Late', 'Total'],
      ...mockMonthlyData.map(day => [
        day.date,
        day.present.toString(),
        day.absent.toString(),
        day.onLeave.toString(),
        day.late.toString(),
        (day.present + day.absent + day.onLeave).toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1).toString().padStart(2, '0')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedDepartment('All Departments')
    setSelectedLeaveType('All Types')
    setSelectedStatus('All Statuses')
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch(type) {
      case 'Sick Leave': return 'bg-red-100 text-red-800 border-red-200'
      case 'Vacation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Personal Leave': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Maternity Leave': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Paternity Leave': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave & Attendance</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage employee attendance and leave requests
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Today's Attendance</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {mockAttendanceData.present}/{mockAttendanceData.total}
              </div>
            </div>
            <button className="flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Leave Request
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">{mockAttendanceData.present}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-900">{mockAttendanceData.absent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">{mockAttendanceData.onLeave}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Late Today</p>
              <p className="text-2xl font-bold text-gray-900">{mockAttendanceData.late}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Attendance Calendar */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Monthly Attendance</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-900">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={goToNextMonth}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              {mockMonthlyData.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">{day.present}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">{day.absent}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">{day.onLeave}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">{day.late}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Monthly Data
              </button>
            </div>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="px-4 sm:px-6 pb-4 border-b border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  value={selectedLeaveType}
                  onChange={(e) => setSelectedLeaveType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {leaveTypes.map(type => (
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
              
              {(selectedDepartment !== 'All Departments' || selectedLeaveType !== 'All Types' || selectedStatus !== 'All Statuses') && (
                <div className="mt-3">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{request.employee}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getLeaveTypeColor(request.leaveType)}`}>
                          {request.leaveType}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Dates:</span> {request.startDate} - {request.endDate} ({request.days} days)
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Department:</span> {request.department} • 
                        <span className="font-medium"> Manager:</span> {request.manager} • 
                        <span className="font-medium"> Submitted:</span> {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLeaveAction(request.id, 'approve')}
                        className="flex items-center px-3 py-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveAction(request.id, 'reject')}
                        className="flex items-center px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-8">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
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
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Statistics</h2>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRequests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved Requests</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredRequests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredRequests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected Requests</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredRequests.reduce((total, r) => total + r.days, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Days Requested</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
