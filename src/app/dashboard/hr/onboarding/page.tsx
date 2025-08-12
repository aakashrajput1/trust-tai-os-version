'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import {
  Users,
  UserPlus,
  UserX,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  Edit,
  Download,
  Send,
  Bell,
  Calendar,
  Building,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  Settings
} from 'lucide-react'

// Mock data for Onboarding/Offboarding Management
const mockOnboardingEmployees = [
  {
    id: 'ONB-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    department: 'Engineering',
    role: 'Frontend Developer',
    startDate: '2024-02-15',
    status: 'in-progress',
    progress: 75,
    manager: 'Sarah Chen',
    checklist: [
      { id: 1, task: 'Complete IT Access Setup', completed: true, dueDate: '2024-02-10' },
      { id: 2, task: 'Submit Required Documents', completed: true, dueDate: '2024-02-12' },
      { id: 3, task: 'Complete HR Orientation', completed: false, dueDate: '2024-02-14' },
      { id: 4, task: 'Team Introduction Meeting', completed: false, dueDate: '2024-02-16' },
      { id: 5, task: 'First Day Training', completed: false, dueDate: '2024-02-15' }
    ]
  },
  {
    id: 'ONB-002',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@company.com',
    department: 'Marketing',
    role: 'Content Specialist',
    startDate: '2024-02-20',
    status: 'pending',
    progress: 25,
    manager: 'John Smith',
    checklist: [
      { id: 1, task: 'Complete IT Access Setup', completed: false, dueDate: '2024-02-15' },
      { id: 2, task: 'Submit Required Documents', completed: true, dueDate: '2024-02-13' },
      { id: 3, task: 'Complete HR Orientation', completed: false, dueDate: '2024-02-18' },
      { id: 4, task: 'Team Introduction Meeting', completed: false, dueDate: '2024-02-20' },
      { id: 5, task: 'First Day Training', completed: false, dueDate: '2024-02-20' }
    ]
  }
]

const mockOffboardingEmployees = [
  {
    id: 'OFF-001',
    name: 'David Thompson',
    email: 'david.thompson@company.com',
    department: 'Sales',
    role: 'Account Manager',
    lastDay: '2024-02-28',
    status: 'in-progress',
    progress: 60,
    reason: 'Career Change',
    checklist: [
      { id: 1, task: 'Exit Interview Scheduled', completed: true, dueDate: '2024-02-25' },
      { id: 2, task: 'Return Company Assets', completed: false, dueDate: '2024-02-27' },
      { id: 3, task: 'Knowledge Transfer Session', completed: true, dueDate: '2024-02-24' },
      { id: 4, task: 'Access Removal Request', completed: false, dueDate: '2024-02-28' },
      { id: 5, task: 'Final Payroll Processing', completed: false, dueDate: '2024-03-01' }
    ]
  }
]

const mockDocuments = [
  {
    id: 'DOC-001',
    name: 'Employment Contract',
    type: 'contract',
    status: 'verified',
    uploadedBy: 'Alex Johnson',
    uploadDate: '2024-02-10',
    verifiedBy: 'HR Team',
    verifiedDate: '2024-02-11'
  },
  {
    id: 'DOC-002',
    name: 'ID Verification',
    type: 'identification',
    status: 'pending',
    uploadedBy: 'Maria Rodriguez',
    uploadDate: '2024-02-13',
    verifiedBy: null,
    verifiedDate: null
  },
  {
    id: 'DOC-003',
    name: 'Background Check',
    type: 'background',
    status: 'verified',
    uploadedBy: 'Alex Johnson',
    uploadDate: '2024-02-09',
    verifiedBy: 'Security Team',
    verifiedDate: '2024-02-10'
  }
]

export default function OnboardingOffboardingManagement() {
  const [onboardingEmployees, setOnboardingEmployees] = useState(mockOnboardingEmployees)
  const [offboardingEmployees, setOffboardingEmployees] = useState(mockOffboardingEmployees)
  const [documents, setDocuments] = useState(mockDocuments)
  const [activeTab, setActiveTab] = useState('onboarding')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const { addNotification } = useNotifications()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'in-progress':
        return 'text-blue-600 bg-blue-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'overdue':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleChecklistToggle = (employeeId: string, taskId: number, isOnboarding: boolean) => {
    const employees = isOnboarding ? onboardingEmployees : offboardingEmployees
    const setEmployees = isOnboarding ? setOnboardingEmployees : setOffboardingEmployees
    
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const updatedChecklist = emp.checklist.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
        const progress = (updatedChecklist.filter(t => t.completed).length / updatedChecklist.length) * 100
        return { ...emp, checklist: updatedChecklist, progress: Math.round(progress) }
      }
      return emp
    })
    
    setEmployees(updatedEmployees)
    addNotification('Checklist Updated', 'Task status has been updated', 'success')
  }

  const handleDocumentVerification = (documentId: string, status: string) => {
    const updatedDocuments = documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, status, verifiedBy: 'HR Team', verifiedDate: new Date().toISOString().split('T')[0] }
        : doc
    )
    setDocuments(updatedDocuments)
    addNotification('Document Verified', 'Document status has been updated', 'success')
  }

  const handleNotifyIT = (employeeId: string, type: 'onboarding' | 'offboarding') => {
    addNotification('IT Notification Sent', `IT team notified about ${type} for employee ${employeeId}`, 'success')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDepartment('')
    setSelectedStatus('')
  }

  const departments = [...new Set([...onboardingEmployees, ...offboardingEmployees].map(emp => emp.department))]

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
              <h1 className="text-3xl font-bold text-gray-900">Onboarding/Offboarding Management</h1>
              <p className="text-gray-600 mt-2">
                Manage employee onboarding and offboarding processes
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <UserPlus className="w-4 h-4 mr-2 inline" />
                New Onboarding
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
              onClick={() => setActiveTab('onboarding')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'onboarding'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2 inline" />
              Onboarding
            </button>
            <button
              onClick={() => setActiveTab('offboarding')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'offboarding'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserX className="w-4 h-4 mr-2 inline" />
              Offboarding
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Document Management
            </button>
          </nav>
        </div>

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Onboarding Employees */}
            <div className="space-y-6">
              {onboardingEmployees.map((employee) => (
                <div key={employee.id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{employee.role}</span>
                            <span>•</span>
                            <span>{employee.department}</span>
                            <span>•</span>
                            <span>Start: {formatDate(employee.startDate)}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>Manager: {employee.manager}</span>
                            <span>•</span>
                            <span>{employee.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{employee.progress}% Complete</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${employee.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        <span className="ml-1 capitalize">{employee.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Onboarding Checklist</h4>
                    <div className="space-y-2">
                      {employee.checklist.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleChecklistToggle(employee.id, task.id, true)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                task.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-3 h-3" />}
                            </button>
                            <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.task}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              Due: {formatDate(task.dueDate)}
                            </span>
                            <button
                              onClick={() => handleNotifyIT(employee.id, 'onboarding')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Notify IT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offboarding Tab */}
        {activeTab === 'offboarding' && (
          <div>
            <div className="space-y-6">
              {offboardingEmployees.map((employee) => (
                <div key={employee.id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <UserX className="w-6 h-6 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{employee.role}</span>
                            <span>•</span>
                            <span>{employee.department}</span>
                            <span>•</span>
                            <span>Last Day: {formatDate(employee.lastDay)}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>Reason: {employee.reason}</span>
                            <span>•</span>
                            <span>{employee.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{employee.progress}% Complete</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${employee.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        <span className="ml-1 capitalize">{employee.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Offboarding Checklist</h4>
                    <div className="space-y-2">
                      {employee.checklist.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleChecklistToggle(employee.id, task.id, false)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                task.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-3 h-3" />}
                            </button>
                            <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.task}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              Due: {formatDate(task.dueDate)}
                            </span>
                            <button
                              onClick={() => handleNotifyIT(employee.id, 'offboarding')}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Notify IT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Management Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Document Management</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Upload className="w-4 h-4 mr-2 inline" />
                    Upload Document
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((document) => (
                      <tr key={document.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          <div className="text-sm text-gray-500">ID: {document.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {document.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {document.uploadedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(document.uploadDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Download className="w-4 h-4" />
                            </button>
                            {document.status === 'pending' && (
                              <button
                                onClick={() => handleDocumentVerification(document.id, 'verified')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Verify
                              </button>
                            )}
                          </div>
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
