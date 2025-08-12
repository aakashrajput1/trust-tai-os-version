'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import {
  Users,
  FileText,
  Calendar,
  Star,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Mock data for Performance Review Center
const mockEmployees = [
  {
    id: 'EMP-001',
    name: 'Sarah Johnson',
    department: 'Engineering',
    role: 'Senior Developer',
    lastReview: '2024-01-15',
    nextReview: '2024-04-15',
    status: 'due-soon',
    rating: 4.2,
    manager: 'Mike Chen'
  },
  {
    id: 'EMP-002',
    name: 'David Rodriguez',
    department: 'Sales',
    role: 'Account Manager',
    lastReview: '2023-12-20',
    nextReview: '2024-03-20',
    status: 'overdue',
    rating: 3.8,
    manager: 'Lisa Wang'
  },
  {
    id: 'EMP-003',
    name: 'Emily Chen',
    department: 'Marketing',
    role: 'Marketing Specialist',
    lastReview: '2024-01-10',
    nextReview: '2024-04-10',
    status: 'due-soon',
    rating: 4.5,
    manager: 'John Smith'
  },
  {
    id: 'EMP-004',
    name: 'Alex Thompson',
    department: 'Support',
    role: 'Support Lead',
    lastReview: '2024-01-05',
    nextReview: '2024-04-05',
    status: 'completed',
    rating: 4.0,
    manager: 'Sarah Johnson'
  }
]

const mockReviewTemplates = [
  {
    id: 'TEMP-001',
    name: 'Standard Annual Review',
    description: 'Comprehensive annual performance review template',
    categories: ['Technical Skills', 'Communication', 'Leadership', 'Results'],
    ratingScale: '1-5',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'TEMP-002',
    name: 'Probation Review',
    description: '90-day probation period review template',
    categories: ['Learning Ability', 'Team Fit', 'Performance', 'Growth Potential'],
    ratingScale: '1-5',
    lastUpdated: '2024-01-01'
  },
  {
    id: 'TEMP-003',
    name: 'Leadership Review',
    description: 'Review template for management positions',
    categories: ['Strategic Thinking', 'Team Management', 'Decision Making', 'Vision'],
    ratingScale: '1-5',
    lastUpdated: '2024-01-01'
  }
]

const mockReviewHistory = [
  {
    id: 'REV-001',
    employeeId: 'EMP-001',
    employeeName: 'Sarah Johnson',
    reviewDate: '2024-01-15',
    reviewer: 'Mike Chen',
    rating: 4.2,
    status: 'completed',
    template: 'Standard Annual Review'
  },
  {
    id: 'REV-002',
    employeeId: 'EMP-002',
    employeeName: 'David Rodriguez',
    reviewDate: '2023-12-20',
    reviewer: 'Lisa Wang',
    rating: 3.8,
    status: 'completed',
    template: 'Standard Annual Review'
  },
  {
    id: 'REV-003',
    employeeId: 'EMP-003',
    employeeName: 'Emily Chen',
    reviewDate: '2024-01-10',
    reviewer: 'John Smith',
    rating: 4.5,
    status: 'completed',
    template: 'Standard Annual Review'
  }
]

export default function PerformanceReviewCenter() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('employees')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [employeesPerPage] = useState(10)
  const { addNotification } = useNotifications()

  useEffect(() => {
    filterEmployees()
  }, [searchTerm, selectedDepartment, selectedStatus, employees])

  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === selectedDepartment)
    }

    if (selectedStatus) {
      filtered = filtered.filter(emp => emp.status === selectedStatus)
    }

    setFilteredEmployees(filtered)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-red-600 bg-red-100'
      case 'due-soon':
        return 'text-yellow-600 bg-yellow-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />
      case 'due-soon':
        return <Clock className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDepartment('')
    setSelectedStatus('')
    setSelectedTemplate('')
  }

  const handleStartReview = (employeeId: string) => {
    addNotification({
      type: 'info',
      title: 'Review Started',
      message: `Starting performance review for employee ${employeeId}`
    })
  }

  const handleViewHistory = (employeeId: string) => {
    addNotification({
      type: 'info',
      title: 'View History',
      message: `Viewing review history for employee ${employeeId}`
    })
  }

  const handleExportReports = () => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: 'Generating performance review reports...'
    })
    // In real implementation, this would generate and download CSV/PDF
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const departments = Array.from(new Set(employees.map(emp => emp.department)))
  const statuses = Array.from(new Set(employees.map(emp => emp.status)))

  const indexOfLastEmployee = currentPage * employeesPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/hr"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to HR Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Performance Review Center</h1>
              <p className="text-gray-600 mt-2">
                Manage employee performance reviews and track review cycles
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportReports}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export Reports
              </button>
              <Link
                href="/dashboard/hr/settings"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Employees Due for Review
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Review Templates
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Review History
            </button>
          </nav>
        </div>

        {/* Employees Due for Review Tab */}
        {activeTab === 'employees' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status === 'overdue' ? 'Overdue' : 
                           status === 'due-soon' ? 'Due Soon' : 
                           status === 'completed' ? 'Completed' : status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.role}</div>
                            <div className="text-xs text-gray-400">ID: {employee.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department}</div>
                          <div className="text-sm text-gray-500">Manager: {employee.manager}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(employee.lastReview)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(employee.nextReview)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {getStatusIcon(employee.status)}
                            <span className="ml-1">
                              {employee.status === 'overdue' ? 'Overdue' : 
                               employee.status === 'due-soon' ? 'Due Soon' : 
                               employee.status === 'completed' ? 'Completed' : employee.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">{employee.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStartReview(employee.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Start Review
                            </button>
                            <button
                              onClick={() => handleViewHistory(employee.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              View History
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
                  Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm border rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Review Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Review Templates</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockReviewTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Categories:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {template.categories.map((category) => (
                            <span key={category} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Rating Scale:</span>
                        <span className="ml-2 text-gray-600">{template.ratingScale}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <span className="ml-2 text-gray-600">{formatDate(template.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Review History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Review History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reviewer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockReviewHistory.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{review.employeeName}</div>
                          <div className="text-sm text-gray-500">ID: {review.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(review.reviewDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.reviewer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">{review.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.template}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
