'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye,
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ProjectManagerNav from '@/components/ui/ProjectManagerNav'

interface Project {
  id: string
  name: string
  client: string
  progress: number
  dueDate: string
  budget: { used: number; total: number }
  status: 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  team: string[]
  blockers: number
  description: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform Redesign',
      client: 'TechCorp Inc.',
      progress: 75,
      dueDate: '2024-02-15',
      budget: { used: 75000, total: 100000 },
      status: 'active',
      priority: 'high',
      team: ['John Dev', 'Sarah QA', 'Mike UI', 'Alex DevOps'],
      blockers: 2,
      description: 'Complete redesign of the e-commerce platform with modern UI/UX and improved performance.'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      progress: 45,
      dueDate: '2024-03-01',
      budget: { used: 32000, total: 50000 },
      status: 'active',
      priority: 'medium',
      team: ['Lisa Dev', 'Tom QA', 'Emma UX'],
      blockers: 5,
      description: 'Native mobile app development for iOS and Android platforms.'
    },
    {
      id: '3',
      name: 'API Integration Project',
      client: 'Enterprise Ltd.',
      progress: 90,
      dueDate: '2024-01-25',
      budget: { used: 48000, total: 60000 },
      status: 'active',
      priority: 'high',
      team: ['David Dev', 'Anna QA', 'Bob DevOps'],
      blockers: 0,
      description: 'Third-party API integration for payment processing and data synchronization.'
    },
    {
      id: '4',
      name: 'Security Audit & Compliance',
      client: 'BankSecure',
      progress: 30,
      dueDate: '2024-02-28',
      budget: { used: 95000, total: 100000 },
      status: 'active',
      priority: 'high',
      team: ['Sam Security', 'Mike Dev', 'Sarah QA'],
      blockers: 8,
      description: 'Comprehensive security audit and compliance implementation for banking regulations.'
    },
    {
      id: '5',
      name: 'Data Migration System',
      client: 'DataFlow Corp',
      progress: 100,
      dueDate: '2024-01-20',
      budget: { used: 45000, total: 50000 },
      status: 'completed',
      priority: 'medium',
      team: ['Carlos Dev', 'Maria QA', 'Juan DevOps'],
      blockers: 0,
      description: 'Legacy system data migration to new cloud-based infrastructure.'
    },
    {
      id: '6',
      name: 'Marketing Website',
      client: 'GrowthCo',
      progress: 60,
      dueDate: '2024-02-10',
      budget: { used: 18000, total: 30000 },
      status: 'on-hold',
      priority: 'low',
      team: ['Alex Dev', 'Sarah Designer'],
      blockers: 3,
      description: 'Corporate marketing website with CMS and analytics integration.'
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || project.priority === selectedPriority
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on-hold': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBudgetUsageColor = (used: number, total: number) => {
    const percentage = (used / total) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
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
                    Projects
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Manage all your projects and track their progress
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{project.client}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                        {project.priority}
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
                            className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Due Date</p>
                          <p className="font-medium text-gray-900">{project.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Budget</p>
                          <p className={`font-medium ${getBudgetUsageColor(project.budget.used, project.budget.total)}`}>
                            ${(project.budget.used / 1000).toFixed(0)}k / ${(project.budget.total / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Team Size</p>
                          <p className="font-medium text-gray-900">{project.team.length} members</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <div>
                          <p className="text-gray-500">Blockers</p>
                          <p className="font-medium text-gray-900">{project.blockers}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {project.progress === 100 && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {project.status === 'on-hold' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {project.progress > 0 && project.progress < 100 && <TrendingUp className="w-4 h-4 text-blue-500" />}
                      <span className="text-sm text-gray-500">
                        {project.progress === 100 ? 'Completed' : 
                         project.status === 'on-hold' ? 'On Hold' : 
                         'In Progress'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center justify-center space-x-2"
                      onClick={() => router.push(`/dashboard/project-manager/projects/${project.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedStatus('all')
                  setSelectedPriority('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

