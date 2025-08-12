'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  UserX, 
  Download, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Users,
  Building,
  Calendar,
  Award,
  MoreHorizontal
} from 'lucide-react'

// Mock data for employees
const mockEmployees = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    employeeId: 'EMP001',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'active',
    dateOfJoining: '2022-03-15',
    lastAppraisal: '2023-12-01',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    manager: 'Sarah Johnson'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    employeeId: 'EMP002',
    role: 'Engineering Manager',
    department: 'Engineering',
    status: 'active',
    dateOfJoining: '2021-06-10',
    lastAppraisal: '2023-11-15',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    manager: 'Mike Chen'
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    employeeId: 'EMP003',
    role: 'VP Engineering',
    department: 'Engineering',
    status: 'active',
    dateOfJoining: '2020-01-20',
    lastAppraisal: '2023-10-01',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    manager: 'CEO'
  },
  {
    id: 4,
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    employeeId: 'EMP004',
    role: 'Marketing Manager',
    department: 'Marketing',
    status: 'active',
    dateOfJoining: '2022-08-05',
    lastAppraisal: '2023-12-10',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    manager: 'Emily Davis'
  },
  {
    id: 5,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    employeeId: 'EMP005',
    role: 'VP Marketing',
    department: 'Marketing',
    status: 'active',
    dateOfJoining: '2021-02-15',
    lastAppraisal: '2023-11-20',
    phone: '+1 (555) 567-8901',
    location: 'New York, NY',
    manager: 'CEO'
  },
  {
    id: 6,
    name: 'David Rodriguez',
    email: 'david.rodriguez@company.com',
    employeeId: 'EMP006',
    role: 'Sales Representative',
    department: 'Sales',
    status: 'inactive',
    dateOfJoining: '2022-11-01',
    lastAppraisal: '2023-09-15',
    phone: '+1 (555) 678-9012',
    location: 'Chicago, IL',
    manager: 'Alex Thompson'
  }
]

const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
const roles = ['All Roles', 'Software Engineer', 'Engineering Manager', 'VP Engineering', 'Marketing Manager', 'VP Marketing', 'Sales Representative']
const statuses = ['All Statuses', 'active', 'inactive']

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [selectedStatus, setSelectedStatus] = useState('All Statuses')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [employeesPerPage] = useState(20)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Filter and search employees
  useEffect(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment = selectedDepartment === 'All Departments' || employee.department === selectedDepartment
      const matchesRole = selectedRole === 'All Roles' || employee.role === selectedRole
      const matchesStatus = selectedStatus === 'All Statuses' || employee.status === selectedStatus
      
      return matchesSearch && matchesDepartment && matchesRole && matchesStatus
    })

    // Sort employees
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]
      
      if (sortBy === 'dateOfJoining' || sortBy === 'lastAppraisal') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredEmployees(filtered)
    setCurrentPage(1)
  }, [employees, searchTerm, selectedDepartment, selectedRole, selectedStatus, sortBy, sortOrder])

  // Handle employee status change
  const handleStatusChange = (employeeId: number, newStatus: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, status: newStatus } : emp
    ))
  }

  // Export employee data
  const handleExport = () => {
    const csvContent = [
      ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Date of Joining', 'Last Appraisal'],
      ...filteredEmployees.map(emp => [
        emp.employeeId,
        emp.name,
        emp.email,
        emp.role,
        emp.department,
        emp.status,
        emp.dateOfJoining,
        emp.lastAppraisal
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDepartment('All Departments')
    setSelectedRole('All Roles')
    setSelectedStatus('All Statuses')
  }

  // Pagination
  const indexOfLastEmployee = currentPage * employeesPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Directory</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage and view all employee records
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Employees</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {filteredEmployees.length}
              </div>
            </div>
            <Link
              href="/dashboard/hr/employees/new"
              className="flex items-center px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or employee ID..."
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
                {filteredEmployees.length} of {employees.length} employees
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
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
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
            {(searchTerm || selectedDepartment !== 'All Departments' || selectedRole !== 'All Roles' || selectedStatus !== 'All Statuses') && (
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

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Employee List</h2>
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
                  Role & Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">EM</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">{employee.email}</div>
                        <div className="text-xs text-gray-400 font-mono">{employee.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{employee.role}</div>
                    <div className="text-xs text-gray-500">{employee.department}</div>
                    <div className="text-xs text-gray-400">{employee.manager}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      Joined: {new Date(employee.dateOfJoining).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last Review: {new Date(employee.lastAppraisal).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/hr/employees/${employee.id}`}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/hr/employees/${employee.id}/edit`}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Profile"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleStatusChange(employee.id, employee.status === 'active' ? 'inactive' : 'active')}
                        className={`p-2 rounded-lg transition-colors ${
                          employee.status === 'active'
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={employee.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
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
        <div className="bg-white rounded-xl shadow-sm border mt-6">
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
                  Showing <span className="font-medium">{indexOfFirstEmployee + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastEmployee, filteredEmployees.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredEmployees.length}</span> results
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
  )
}
