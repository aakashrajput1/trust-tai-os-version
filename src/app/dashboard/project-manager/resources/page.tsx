'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  TrendingUp,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare
} from 'lucide-react'
import { useRoles } from '@/hooks/useRoles'

interface Resource {
  id: string
  name: string
  role: string
  email: string
  phone: string
  location: string
  skills: string[]
  availability: {
    mon: number
    tue: number
    wed: number
    thu: number
    fri: number
    sat: number
    sun: number
  }
  currentProject: string
  utilization: number
  status: 'available' | 'busy' | 'offline'
}

export default function ResourcesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [searchQuery, setSearchQuery] = useState('')
  const { roles, loading: rolesLoading } = useRoles()

  // Get role names for filter
  const roleOptions = ['all', ...roles.map(role => role.display_name)]

  const resources: Resource[] = [
    {
      id: '1',
      name: 'John Developer',
      role: 'Developer',
      email: 'john@company.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      availability: { mon: 100, tue: 80, wed: 100, thu: 60, fri: 100, sat: 0, sun: 0 },
      currentProject: 'E-commerce Platform',
      utilization: 87,
      status: 'busy'
    },
    {
      id: '2',
      name: 'Sarah Designer',
      role: 'UI/UX Designer',
      email: 'sarah@company.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping'],
      availability: { mon: 100, tue: 100, wed: 80, thu: 100, fri: 90, sat: 0, sun: 0 },
      currentProject: 'Mobile App',
      utilization: 92,
      status: 'available'
    },
    {
      id: '3',
      name: 'Mike QA Engineer',
      role: 'QA Engineer',
      email: 'mike@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing'],
      availability: { mon: 70, tue: 100, wed: 100, thu: 80, fri: 100, sat: 0, sun: 0 },
      currentProject: 'API Integration',
      utilization: 78,
      status: 'available'
    },
    {
      id: '4',
      name: 'Alex DevOps',
      role: 'DevOps Engineer',
      email: 'alex@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      availability: { mon: 100, tue: 60, wed: 100, thu: 100, fri: 80, sat: 0, sun: 0 },
      currentProject: 'Security Audit',
      utilization: 95,
      status: 'busy'
    },
    {
      id: '5',
      name: 'Lisa UX Researcher',
      role: 'UX Researcher',
      email: 'lisa@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      skills: ['User Research', 'Usability Testing', 'Analytics', 'Prototyping'],
      availability: { mon: 90, tue: 100, wed: 100, thu: 70, fri: 100, sat: 0, sun: 0 },
      currentProject: 'E-commerce Platform',
      utilization: 85,
      status: 'available'
    },
    {
      id: '6',
      name: 'Tom Backend Developer',
      role: 'Backend Developer',
      email: 'tom@company.com',
      phone: '+1 (555) 678-9012',
      location: 'Chicago, IL',
      skills: ['Python', 'Django', 'PostgreSQL', 'Redis'],
      availability: { mon: 100, tue: 100, wed: 80, thu: 100, fri: 90, sat: 0, sun: 0 },
      currentProject: 'Mobile App',
      utilization: 88,
      status: 'available'
    }
  ]

  const filteredResources = resources.filter(resource => {
    const matchesDepartment = selectedDepartment === 'all' || resource.role.includes(selectedDepartment)
    const matchesRole = selectedRole === 'all' || resource.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || resource.status === selectedStatus
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDepartment && matchesRole && matchesStatus && matchesSearch
  })

  const getAvailabilityIcon = (availability: number) => {
    if (availability === 100) return '✓'
    if (availability >= 80) return `${availability}%`
    if (availability >= 50) return `${availability}%`
    return '✗'
  }

  const getAvailabilityColor = (availability: number) => {
    if (availability === 100) return 'text-green-600'
    if (availability >= 80) return 'text-blue-600'
    if (availability >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 80) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* ProjectManagerNav */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Resource Availability
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Monitor team availability and resource utilization
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Export Button */}
                  <button className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                  {/* Search */}
                  <div className="sm:col-span-2 lg:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Department Filter */}
                  <div>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      <option value="Developer">Development</option>
                      <option value="Designer">Design</option>
                      <option value="QA">QA</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      {roleOptions.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="mt-4 flex justify-center">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('weekly')}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'weekly' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Weekly View
                    </button>
                    <button
                      onClick={() => setViewMode('monthly')}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'monthly' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Monthly View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{resource.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{resource.role}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{resource.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{resource.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Skills */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {resource.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{resource.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Current Project & Utilization */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current Project</p>
                        <p className="text-sm font-medium text-gray-900">{resource.currentProject}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Utilization</p>
                        <p className={`text-sm font-medium ${getUtilizationColor(resource.utilization)}`}>
                          {resource.utilization}%
                        </p>
                      </div>
                    </div>

                    {/* Weekly Availability */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Weekly Availability</p>
                      <div className="grid grid-cols-7 gap-1">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Mon</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.mon)}`}>
                            {getAvailabilityIcon(resource.availability.mon)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Tue</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.tue)}`}>
                            {getAvailabilityIcon(resource.availability.tue)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Wed</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.wed)}`}>
                            {getAvailabilityIcon(resource.availability.wed)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Thu</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.thu)}`}>
                            {getAvailabilityIcon(resource.availability.thu)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Fri</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.fri)}`}>
                            {getAvailabilityIcon(resource.availability.fri)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Sat</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.sat)}`}>
                            {getAvailabilityIcon(resource.availability.sat)}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Sun</p>
                          <span className={`text-sm font-medium ${getAvailabilityColor(resource.availability.sun)}`}>
                            {getAvailabilityIcon(resource.availability.sun)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{resource.phone}</span>
                    </div>
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Users className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <button onClick={() => {
                  setSearchQuery('')
                  setSelectedDepartment('all')
                  setSelectedRole('all')
                  setSelectedStatus('all')
                }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

