'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Target,
  Award,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  MoreHorizontal,
  CheckSquare,
  Clock,
  AlertTriangle,
  BarChart3,
  UserPlus,
  FileText,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ProjectManagerNav from '@/components/ui/ProjectManagerNav'

interface Project {
  id: string
  name: string
  client: string
  progress: number
  dueDate: string
  budgetUsage: number
  blockers: number
  status: 'on-track' | 'needs-attention' | 'critical'
  team: string[]
}

interface Resource {
  id: string
  name: string
  role: string
  availability: {
    mon: number
    tue: number
    wed: number
    thu: number
    fri: number
    sat: number
    sun: number
  }
}

interface TaskSummary {
  status: string
  count: number
  color: string
}

export default function ProjectManagerDashboard() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')

  const projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      client: 'TechCorp Inc.',
      progress: 75,
      dueDate: '2024-02-15',
      budgetUsage: 68,
      blockers: 2,
      status: 'on-track',
      team: ['John Dev', 'Sarah QA', 'Mike UI']
    },
    {
      id: '2',
      name: 'Mobile App Redesign',
      client: 'StartupXYZ',
      progress: 45,
      dueDate: '2024-03-01',
      budgetUsage: 82,
      blockers: 5,
      status: 'needs-attention',
      team: ['Alex Dev', 'Lisa UX', 'Tom QA']
    },
    {
      id: '3',
      name: 'API Integration',
      client: 'Enterprise Ltd.',
      progress: 90,
      dueDate: '2024-01-25',
      budgetUsage: 45,
      blockers: 0,
      status: 'on-track',
      team: ['David Dev', 'Emma QA']
    },
    {
      id: '4',
      name: 'Security Audit',
      client: 'BankSecure',
      progress: 30,
      dueDate: '2024-02-28',
      budgetUsage: 95,
      blockers: 8,
      status: 'critical',
      team: ['Sam Security', 'Anna Dev', 'Bob QA']
    }
  ]

  const resources: Resource[] = [
    {
      id: '1',
      name: 'John Developer',
      role: 'Senior Dev',
      availability: { mon: 100, tue: 80, wed: 100, thu: 60, fri: 100, sat: 0, sun: 0 }
    },
    {
      id: '2',
      name: 'Sarah QA',
      role: 'QA Engineer',
      availability: { mon: 100, tue: 100, wed: 80, thu: 100, fri: 90, sat: 0, sun: 0 }
    },
    {
      id: '3',
      name: 'Mike Designer',
      role: 'UI/UX',
      availability: { mon: 70, tue: 100, wed: 100, thu: 80, fri: 100, sat: 0, sun: 0 }
    },
    {
      id: '4',
      name: 'Alex DevOps',
      role: 'DevOps',
      availability: { mon: 100, tue: 60, wed: 100, thu: 100, fri: 80, sat: 0, sun: 0 }
    }
  ]

  const taskSummary: TaskSummary[] = [
    { status: 'To Do', count: 24, color: 'bg-gray-500' },
    { status: 'In Progress', count: 18, color: 'bg-blue-500' },
    { status: 'Review', count: 8, color: 'bg-yellow-500' },
    { status: 'Testing', count: 12, color: 'bg-purple-500' },
    { status: 'Done', count: 45, color: 'bg-green-500' }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    const matchesClient = selectedClient === 'all' || project.client === selectedClient
    return matchesStatus && matchesClient
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 border-green-200'
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <ProjectManagerNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Project Manager Dashboard
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Welcome back, Sarah. Here's your project overview.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Search */}
                  <div className="sm:col-span-2 lg:col-span-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="on-track">On Track</option>
                      <option value="needs-attention">Needs Attention</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Client Filter */}
                  <div>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Clients</option>
                      <option value="TechCorp Inc.">TechCorp Inc.</option>
                      <option value="StartupXYZ">StartupXYZ</option>
                      <option value="Enterprise Ltd.">Enterprise Ltd.</option>
                      <option value="BankSecure">BankSecure</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Cards */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Active Projects</h2>
                <Button variant="outline" size="sm">View All Projects</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/project-manager/projects/${project.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{project.name}</h3>
                        <p className="text-sm text-gray-500">{project.client}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progress:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{project.progress}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                project.progress >= 80 ? 'bg-green-500' :
                                project.progress >= 60 ? 'bg-blue-500' :
                                project.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Due Date:</span>
                        <span className="font-medium text-gray-900">{project.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Budget Usage:</span>
                        <span className="font-medium text-gray-900">{project.budgetUsage}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Blockers:</span>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-gray-900">{project.blockers}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{project.team.length} team members</span>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center justify-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Resource Availability Grid */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Resource Availability</h2>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-medium text-gray-900">Resource</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Mon</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Tue</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Wed</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Thu</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Fri</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Sat</th>
                        <th className="text-center py-2 px-1 font-medium text-gray-900">Sun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource) => (
                        <tr key={resource.id} className="border-b border-gray-100">
                          <td className="py-2 px-2">
                            <div>
                              <p className="font-medium text-gray-900">{resource.name}</p>
                              <p className="text-xs text-gray-500">{resource.role}</p>
                            </div>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.mon)}`}>
                              {getAvailabilityIcon(resource.availability.mon)}
                            </span>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.tue)}`}>
                              {getAvailabilityIcon(resource.availability.tue)}
                            </span>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.wed)}`}>
                              {getAvailabilityIcon(resource.availability.wed)}
                            </span>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.thu)}`}>
                              {getAvailabilityIcon(resource.availability.thu)}
                            </span>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.fri)}`}>
                              {getAvailabilityIcon(resource.availability.fri)}
                            </span>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.sat)}`}>
                              {getAvailabilityIcon(resource.availability.sat)}
                            </span>
                          </td>
                          <td className="text-center py-2 px-1">
                            <span className={`font-medium ${getAvailabilityColor(resource.availability.sun)}`}>
                              {getAvailabilityIcon(resource.availability.sun)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Task Board Summary */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Task Board Summary</h2>
                  <Button variant="outline" size="sm">View Full Board</Button>
                </div>
                <div className="space-y-4">
                  {taskSummary.map((task) => (
                    <div key={task.status} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/project-manager/kanban')}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${task.color}`}></div>
                        <span className="font-medium text-gray-900">{task.status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">{task.count}</span>
                        <span className="text-sm text-gray-500">tasks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button className="flex items-center justify-center space-x-2 h-12">
                    <UserPlus className="w-4 h-4" />
                    <span>Assign Tasks</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <Calendar className="w-4 h-4" />
                    <span>Plan Next Week</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12 sm:col-span-2 lg:col-span-1">
                    <Download className="w-4 h-4" />
                    <span>Export Timeline</span>
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