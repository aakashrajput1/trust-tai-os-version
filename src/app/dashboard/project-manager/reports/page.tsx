'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Clock,
  Target,
  FileText,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ProjectManagerNav from '@/components/ui/ProjectManagerNav'

interface Report {
  id: string
  name: string
  type: 'project' | 'team' | 'performance' | 'resource'
  description: string
  lastGenerated: string
  status: 'ready' | 'generating' | 'error'
  size: string
  format: 'PDF' | 'Excel' | 'CSV'
  project?: string
  team?: string
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const reports: Report[] = [
    {
      id: '1',
      name: 'Project Progress Report',
      type: 'project',
      description: 'Comprehensive overview of all project progress, milestones, and deliverables',
      lastGenerated: '2024-02-01',
      status: 'ready',
      size: '2.4 MB',
      format: 'PDF',
      project: 'E-commerce Platform'
    },
    {
      id: '2',
      name: 'Team Performance Analytics',
      type: 'team',
      description: 'Detailed analysis of team member performance, productivity, and workload distribution',
      lastGenerated: '2024-01-29',
      status: 'ready',
      size: '1.8 MB',
      format: 'Excel',
      team: 'Development Team'
    },
    {
      id: '3',
      name: 'Resource Utilization Report',
      type: 'resource',
      description: 'Resource allocation and utilization metrics across all projects',
      lastGenerated: '2024-01-28',
      status: 'ready',
      size: '3.1 MB',
      format: 'PDF'
    },
    {
      id: '4',
      name: 'Sprint Velocity Report',
      type: 'performance',
      description: 'Sprint velocity, burndown charts, and team capacity analysis',
      lastGenerated: '2024-01-27',
      status: 'ready',
      size: '1.2 MB',
      format: 'Excel',
      project: 'Mobile App'
    },
    {
      id: '5',
      name: 'Budget vs Actual Report',
      type: 'project',
      description: 'Budget tracking and variance analysis for all active projects',
      lastGenerated: '2024-01-26',
      status: 'ready',
      size: '2.7 MB',
      format: 'PDF'
    },
    {
      id: '6',
      name: 'Task Completion Metrics',
      type: 'performance',
      description: 'Task completion rates, cycle times, and quality metrics',
      lastGenerated: '2024-01-25',
      status: 'generating',
      size: '0.9 MB',
      format: 'CSV'
    },
    {
      id: '7',
      name: 'Team Capacity Planning',
      type: 'resource',
      description: 'Future capacity planning and resource allocation forecasts',
      lastGenerated: '2024-01-24',
      status: 'ready',
      size: '1.5 MB',
      format: 'Excel'
    },
    {
      id: '8',
      name: 'Risk Assessment Report',
      type: 'project',
      description: 'Project risk analysis and mitigation strategies',
      lastGenerated: '2024-01-23',
      status: 'error',
      size: '1.8 MB',
      format: 'PDF',
      project: 'API Integration'
    }
  ]

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesProject = selectedProject === 'all' || report.project === selectedProject
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesProject && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Target className="w-4 h-4" />
      case 'team': return <Users className="w-4 h-4" />
      case 'performance': return <TrendingUp className="w-4 h-4" />
      case 'resource': return <BarChart3 className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'bg-red-100 text-red-800'
      case 'Excel': return 'bg-green-100 text-green-800'
      case 'CSV': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
                    Reports & Analytics
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Generate and manage project reports and analytics
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <BarChart3 className="w-4 h-4" />
                    <span>New Report</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{reports.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ready Reports</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {reports.filter(r => r.status === 'ready').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Generating</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {reports.filter(r => r.status === 'generating').length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Errors</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {reports.filter(r => r.status === 'error').length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
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
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type Filter */}
                  <div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="project">Project Reports</option>
                      <option value="team">Team Reports</option>
                      <option value="performance">Performance Reports</option>
                      <option value="resource">Resource Reports</option>
                    </select>
                  </div>

                  {/* Project Filter */}
                  <div>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">All Projects</option>
                      <option value="E-commerce Platform">E-commerce Platform</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="API Integration">API Integration</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{report.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{report.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="p-1 bg-gray-100 rounded">
                        {getTypeIcon(report.type)}
                      </div>
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{report.type}</span>
                    </div>

                    {report.project && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Project:</span>
                        <span className="font-medium text-gray-900">{report.project}</span>
                      </div>
                    )}

                    {report.team && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">Team:</span>
                        <span className="font-medium text-gray-900">{report.team}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Last Generated</p>
                          <p className="font-medium text-gray-900">{report.lastGenerated}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Size</p>
                          <p className="font-medium text-gray-900">{report.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFormatColor(report.format)}`}>
                        {report.format}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center justify-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </Button>
                      <Button size="sm" className="flex items-center justify-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <Button onClick={() => {
                  setSearchQuery('')
                  setSelectedType('all')
                  setSelectedProject('all')
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

