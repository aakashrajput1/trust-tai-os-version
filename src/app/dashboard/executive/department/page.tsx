'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Building2, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  BarChart3,
  Target,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ExecutiveNav from '@/components/ui/ExecutiveNav'

interface Department {
  id: string
  name: string
  performance: number
  members: number
  projects: number
  utilization: number
  status: 'active' | 'inactive'
  lead: string
  color: string
}

export default function DepartmentOverviewPage() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const departments: Department[] = [
    {
      id: '1',
      name: 'Engineering',
      performance: 92,
      members: 24,
      projects: 8,
      utilization: 87,
      status: 'active',
      lead: 'Sarah Johnson',
      color: 'bg-green-500'
    },
    {
      id: '2',
      name: 'Sales',
      performance: 88,
      members: 18,
      projects: 12,
      utilization: 85,
      status: 'active',
      lead: 'Mike Davis',
      color: 'bg-blue-500'
    },
    {
      id: '3',
      name: 'Marketing',
      performance: 85,
      members: 12,
      projects: 6,
      utilization: 82,
      status: 'active',
      lead: 'Lisa Wilson',
      color: 'bg-yellow-500'
    },
    {
      id: '4',
      name: 'Support',
      performance: 78,
      members: 15,
      projects: 4,
      utilization: 75,
      status: 'active',
      lead: 'Tom Brown',
      color: 'bg-red-500'
    },
    {
      id: '5',
      name: 'HR',
      performance: 90,
      members: 8,
      projects: 3,
      utilization: 88,
      status: 'active',
      lead: 'Alex Chen',
      color: 'bg-purple-500'
    },
    {
      id: '6',
      name: 'Finance',
      performance: 95,
      members: 10,
      projects: 5,
      utilization: 92,
      status: 'active',
      lead: 'Emma Rodriguez',
      color: 'bg-indigo-500'
    }
  ]

  const filteredDepartments = departments.filter(dept => {
    const matchesStatus = selectedStatus === 'all' || dept.status === selectedStatus
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dept.lead.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalMembers = departments.reduce((sum, dept) => sum + dept.members, 0)
  const avgPerformance = Math.round(departments.reduce((sum, dept) => sum + dept.performance, 0) / departments.length)
  const activeDepartments = departments.filter(dept => dept.status === 'active').length

  const handleDepartmentClick = (departmentId: string) => {
    router.push(`/dashboard/executive/department/${departmentId}`)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ExecutiveNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Department Overview
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Monitor all departments and their performance metrics
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalMembers}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Performance</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{avgPerformance}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Departments</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{activeDepartments}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Search */}
                  <div className="sm:col-span-2 lg:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search departments or leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="performance">Sort by Performance</option>
                      <option value="members">Sort by Members</option>
                      <option value="projects">Sort by Projects</option>
                      <option value="name">Sort by Name</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredDepartments.map((dept) => (
                <div 
                  key={dept.id} 
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleDepartmentClick(dept.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{dept.name}</h3>
                      <p className="text-sm text-gray-500">Led by {dept.lead}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {dept.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Performance:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{dept.performance}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              dept.performance >= 90 ? 'bg-green-500' :
                              dept.performance >= 80 ? 'bg-blue-500' :
                              dept.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${dept.performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Members:</span>
                      <span className="font-medium text-gray-900">{dept.members}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Projects:</span>
                      <span className="font-medium text-gray-900">{dept.projects}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Utilization:</span>
                      <span className="font-medium text-gray-900">{dept.utilization}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Button>
                    <Button size="sm" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button className="flex items-center justify-center space-x-2 h-12">
                    <Building2 className="w-4 h-4" />
                    <span>Add Department</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <BarChart3 className="w-4 h-4" />
                    <span>Department Analytics</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12 sm:col-span-2 lg:col-span-1">
                    <Target className="w-4 h-4" />
                    <span>Performance Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

