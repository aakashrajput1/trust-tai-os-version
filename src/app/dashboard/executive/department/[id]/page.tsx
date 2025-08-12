'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ExecutiveNav from '@/components/ui/ExecutiveNav'

interface Project {
  id: string
  name: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  teamSize: number
  deadline: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  performance: number
  status: 'online' | 'offline' | 'busy'
}

interface SLACompliance {
  id: string
  metric: string
  target: number
  actual: number
  status: 'met' | 'exceeded' | 'missed'
  date: string
}

export default function DepartmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const departmentId = params.id as string

  const [department, setDepartment] = useState({
    id: departmentId,
    name: 'Engineering',
    performance: 92,
    members: 24,
    projects: 8,
    utilization: 87
  })

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Mobile App Redesign',
      status: 'active',
      progress: 75,
      teamSize: 6,
      deadline: '2024-02-15'
    },
    {
      id: '2',
      name: 'API Integration',
      status: 'active',
      progress: 45,
      teamSize: 4,
      deadline: '2024-03-01'
    },
    {
      id: '3',
      name: 'Database Optimization',
      status: 'completed',
      progress: 100,
      teamSize: 3,
      deadline: '2024-01-20'
    },
    {
      id: '4',
      name: 'Security Audit',
      status: 'on-hold',
      progress: 30,
      teamSize: 5,
      deadline: '2024-02-28'
    }
  ])

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      avatar: 'SJ',
      performance: 95,
      status: 'online'
    },
    {
      id: '2',
      name: 'Mike Davis',
      role: 'Team Lead',
      avatar: 'MD',
      performance: 92,
      status: 'busy'
    },
    {
      id: '3',
      name: 'Lisa Wilson',
      role: 'Developer',
      avatar: 'LW',
      performance: 88,
      status: 'online'
    },
    {
      id: '4',
      name: 'Tom Brown',
      role: 'QA Engineer',
      avatar: 'TB',
      performance: 90,
      status: 'offline'
    },
    {
      id: '5',
      name: 'Alex Chen',
      role: 'DevOps Engineer',
      avatar: 'AC',
      performance: 87,
      status: 'online'
    }
  ])

  const [slaCompliance] = useState<SLACompliance[]>([
    {
      id: '1',
      metric: 'Response Time',
      target: 95,
      actual: 98,
      status: 'exceeded',
      date: '2024-01-15'
    },
    {
      id: '2',
      metric: 'Resolution Time',
      target: 90,
      actual: 92,
      status: 'exceeded',
      date: '2024-01-14'
    },
    {
      id: '3',
      metric: 'Uptime',
      target: 99.9,
      actual: 99.7,
      status: 'missed',
      date: '2024-01-13'
    },
    {
      id: '4',
      metric: 'Code Quality',
      target: 95,
      actual: 96,
      status: 'exceeded',
      date: '2024-01-12'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'offline': return 'bg-gray-400'
      case 'busy': return 'bg-yellow-400'
      default: return 'bg-gray-400'
    }
  }

  const getSLAStatusIcon = (status: string) => {
    switch (status) {
      case 'met': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'exceeded': return <TrendingUp className="w-4 h-4 text-blue-500" />
      case 'missed': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
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
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center justify-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {department.name} Department
                    </h1>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Performance overview and team details
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </Button>
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Eye className="w-4 h-4" />
                    <span>View Reports</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+5.2%</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Performance</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{department.performance}%</p>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+2</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Team Members</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{department.members}</p>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+1</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Active Projects</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{department.projects}</p>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>-2.1%</span>
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Utilization</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{department.utilization}%</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Projects */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Current Projects</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{project.name}</h3>
                          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{project.teamSize} members</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{project.deadline}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
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
                  ))}
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Team Members</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{member.avatar}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusIcon(member.status)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{member.name}</p>
                          <p className="text-sm text-gray-500 truncate">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{member.performance}%</p>
                          <p className="text-xs text-gray-500">Performance</p>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SLA Compliance History */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">SLA Compliance History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Metric</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Target</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actual</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slaCompliance.map((sla) => (
                        <tr key={sla.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{sla.metric}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{sla.target}%</td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">{sla.actual}%</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getSLAStatusIcon(sla.status)}
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                sla.status === 'met' ? 'bg-green-100 text-green-800' :
                                sla.status === 'exceeded' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {sla.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{sla.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 