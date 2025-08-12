'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Calendar, 
  UserPlus, 
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Building,
  Download,
  RefreshCw,
  Gift,
  CalendarDays,
  BarChart3,
  Filter
} from 'lucide-react'

// Mock data for HR Dashboard
const mockHRMetrics = {
  totalEmployees: 156,
  employeesOnLeave: 12,
  openPositions: 8,
  averageAttendance: 94.2
}

const mockAttendanceSnapshot = {
  present: 142,
  absent: 14,
  onLeave: 12,
  late: 8
}

const mockRecruitmentSummary = {
  activePostings: 8,
  candidates: {
    applied: 45,
    shortlisted: 12,
    interviewing: 8,
    offer: 3
  }
}

const mockUpcomingEvents = [
  {
    id: 1,
    type: 'birthday',
    name: 'Sarah Johnson',
    date: '2024-01-26',
    department: 'Marketing'
  },
  {
    id: 2,
    type: 'anniversary',
    name: 'Mike Chen',
    date: '2024-01-28',
    department: 'Engineering',
    years: 3
  },
  {
    id: 3,
    type: 'birthday',
    name: 'Emily Davis',
    date: '2024-01-30',
    department: 'Sales'
  }
]

const mockLeaveRequests = [
  {
    id: 1,
    employee: 'John Smith',
    department: 'Engineering',
    leaveType: 'Sick Leave',
    startDate: '2024-01-26',
    endDate: '2024-01-28',
    status: 'pending',
    reason: 'Not feeling well'
  },
  {
    id: 2,
    employee: 'Lisa Wang',
    department: 'Marketing',
    leaveType: 'Vacation',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    status: 'pending',
    reason: 'Family vacation'
  }
]

export default function HRDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

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
      case 'Personal': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleApproveLeave = (id: number) => {
    // In real app, update leave status via API
    console.log('Approving leave:', id)
  }

  const handleRejectLeave = (id: number) => {
    // In real app, update leave status via API
    console.log('Rejecting leave:', id)
  }

  const exportAttendanceData = () => {
    // In real app, generate and download CSV
    console.log('Exporting attendance data...')
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">HR Dashboard</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Overview of human resources metrics and activities
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-sm font-medium text-gray-900">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key HR Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{mockHRMetrics.totalEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Leave Today</p>
              <p className="text-2xl font-bold text-gray-900">{mockHRMetrics.employeesOnLeave}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Positions</p>
              <p className="text-2xl font-bold text-gray-900">{mockHRMetrics.openPositions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{mockHRMetrics.averageAttendance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Snapshot */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Today's Attendance</h2>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="hr">HR</option>
                  </select>
                  <button
                    onClick={exportAttendanceData}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockAttendanceSnapshot.present}</div>
                  <div className="text-sm text-green-600">Present</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{mockAttendanceSnapshot.absent}</div>
                  <div className="text-sm text-red-600">Absent</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{mockAttendanceSnapshot.onLeave}</div>
                  <div className="text-sm text-yellow-600">On Leave</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{mockAttendanceSnapshot.late}</div>
                  <div className="text-sm text-orange-600">Late</div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Pending Leave Requests</h2>
                <Link
                  href="/dashboard/hr/attendance"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {mockLeaveRequests.map((request) => (
                  <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{request.employee}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getLeaveTypeColor(request.leaveType)}`}>
                          {request.leaveType}
                        </span>
                        <span className="text-xs text-gray-500">{request.department}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.startDate} - {request.endDate}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{request.reason}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApproveLeave(request.id)}
                        className="flex items-center px-3 py-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectLeave(request.id)}
                        className="flex items-center px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                
                {mockLeaveRequests.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                    <p className="mt-1 text-sm text-gray-500">All leave requests have been processed.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-3">
              <Link 
                href="/dashboard/hr/employees/new"
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Link>
              
              <Link 
                href="/dashboard/hr/attendance"
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Leave
              </Link>
              
              <Link 
                href="/dashboard/hr/recruitment"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Link>
              
              <Link 
                href="/dashboard/hr/reports"
                className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Link>
            </div>
          </div>

          {/* Open Recruitment Summary */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Recruitment</h2>
                <Link
                  href="/dashboard/hr/recruitment"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-600">{mockRecruitmentSummary.activePostings}</div>
                <div className="text-sm text-gray-600">Active Job Postings</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Applied</span>
                  <span className="text-sm font-medium text-gray-900">{mockRecruitmentSummary.candidates.applied}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Shortlisted</span>
                  <span className="text-sm font-medium text-gray-900">{mockRecruitmentSummary.candidates.shortlisted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interviewing</span>
                  <span className="text-sm font-medium text-gray-900">{mockRecruitmentSummary.candidates.interviewing}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Offer</span>
                  <span className="text-sm font-medium text-gray-900">{mockRecruitmentSummary.candidates.offer}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {mockUpcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      event.type === 'birthday' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {event.type === 'birthday' ? (
                        <Gift className="w-4 h-4" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{event.name}</div>
                      <div className="text-xs text-gray-600">
                        {event.type === 'birthday' ? 'Birthday' : `${event.years} Year Anniversary`}
                      </div>
                      <div className="text-xs text-gray-500">{event.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
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