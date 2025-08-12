'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Users, 
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  UserPlus,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ExecutiveNav from '@/components/ui/ExecutiveNav'

interface Team {
  id: string
  name: string
  department: string
  members: number
  performance: number
  status: 'active' | 'inactive'
  lead: string
  projects: number
}

export default function TeamsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const teams: Team[] = [
    {
      id: '1',
      name: 'Frontend Development',
      department: 'Engineering',
      members: 8,
      performance: 92,
      status: 'active',
      lead: 'Sarah Johnson',
      projects: 5
    },
    {
      id: '2',
      name: 'Backend Development',
      department: 'Engineering',
      members: 6,
      performance: 88,
      status: 'active',
      lead: 'Mike Davis',
      projects: 4
    },
    {
      id: '3',
      name: 'Sales Team Alpha',
      department: 'Sales',
      members: 12,
      performance: 85,
      status: 'active',
      lead: 'Lisa Wilson',
      projects: 8
    },
    {
      id: '4',
      name: 'Customer Support',
      department: 'Support',
      members: 10,
      performance: 78,
      status: 'active',
      lead: 'Tom Brown',
      projects: 3
    },
    {
      id: '5',
      name: 'Marketing Team',
      department: 'Marketing',
      members: 7,
      performance: 90,
      status: 'active',
      lead: 'Alex Chen',
      projects: 6
    },
    {
      id: '6',
      name: 'HR Operations',
      department: 'HR',
      members: 5,
      performance: 95,
      status: 'active',
      lead: 'Emma Rodriguez',
      projects: 2
    }
  ]

  const filteredTeams = teams.filter(team => {
    const matchesDepartment = selectedDepartment === 'all' || team.department === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || team.status === selectedStatus
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.lead.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesStatus && matchesSearch
  })

  const totalMembers = teams.reduce((sum, team) => sum + team.members, 0)
  const avgPerformance = Math.round(teams.reduce((sum, team) => sum + team.performance, 0) / teams.length)
  const activeTeams = teams.filter(team => team.status === 'active').length

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
                    Team Overview
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Monitor team performance and manage resources
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <UserPlus className="w-4 h-4" />
                    <span>Add Team</span>
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
                    <p className="text-sm text-gray-600">Active Teams</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{activeTeams}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Search */}
                  <div className="sm:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search teams or team leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Department Filter */}
                  <div>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Support">Support</option>
                      <option value="HR">HR</option>
                    </select>
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
                </div>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredTeams.map((team) => (
                <div key={team.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.department}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        team.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Team Lead:</span>
                      <span className="font-medium text-gray-900">{team.lead}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Members:</span>
                      <span className="font-medium text-gray-900">{team.members}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Projects:</span>
                      <span className="font-medium text-gray-900">{team.projects}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Performance:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{team.performance}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              team.performance >= 90 ? 'bg-green-500' :
                              team.performance >= 80 ? 'bg-blue-500' :
                              team.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${team.performance}%` }}
                          ></div>
                        </div>
                      </div>
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
                    <UserPlus className="w-4 h-4" />
                    <span>Create New Team</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <BarChart3 className="w-4 h-4" />
                    <span>Team Analytics</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12 sm:col-span-2 lg:col-span-1">
                    <TrendingUp className="w-4 h-4" />
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