'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ExecutiveNav from '@/components/ui/ExecutiveNav'

interface Report {
  id: string
  name: string
  type: string
  department: string
  lastUpdated: string
  status: 'active' | 'archived' | 'draft'
  downloads: number
}

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Revenue Report',
      type: 'Financial',
      department: 'Finance',
      lastUpdated: '2024-01-15',
      status: 'active',
      downloads: 45
    },
    {
      id: '2',
      name: 'Team Performance Analytics',
      type: 'Performance',
      department: 'HR',
      lastUpdated: '2024-01-14',
      status: 'active',
      downloads: 32
    },
    {
      id: '3',
      name: 'Project Status Overview',
      type: 'Project',
      department: 'Engineering',
      lastUpdated: '2024-01-13',
      status: 'active',
      downloads: 28
    },
    {
      id: '4',
      name: 'Customer Satisfaction Survey',
      type: 'Survey',
      department: 'Support',
      lastUpdated: '2024-01-12',
      status: 'archived',
      downloads: 15
    },
    {
      id: '5',
      name: 'Sales Pipeline Report',
      type: 'Sales',
      department: 'Sales',
      lastUpdated: '2024-01-11',
      status: 'active',
      downloads: 38
    },
    {
      id: '6',
      name: 'Resource Utilization Analysis',
      type: 'Resource',
      department: 'Operations',
      lastUpdated: '2024-01-10',
      status: 'draft',
      downloads: 0
    }
  ]

  const filteredReports = reports.filter(report => {
    const matchesFilter = selectedFilter === 'all' || report.status === selectedFilter
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
                    Reports & Analytics
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Access comprehensive company reports and analytics
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <Download className="w-4 h-4" />
                    <span>Export All</span>
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
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Department Filter */}
                  <div>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Departments</option>
                      <option value="finance">Finance</option>
                      <option value="hr">HR</option>
                      <option value="engineering">Engineering</option>
                      <option value="sales">Sales</option>
                      <option value="support">Support</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select 
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === 'active' ? 'bg-green-100 text-green-800' :
                        report.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-medium text-gray-900">{report.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="font-medium text-gray-900">{report.lastUpdated}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Downloads:</span>
                      <span className="font-medium text-gray-900">{report.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                    <Button size="sm" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
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
                    <FileText className="w-4 h-4" />
                    <span>Create New Report</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Report</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12 sm:col-span-2 lg:col-span-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics Dashboard</span>
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