'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Filter, 
  Plus, 
  Briefcase, 
  Users, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock,
  UserPlus,
  FileText,
  ChevronRight
} from 'lucide-react'

// Mock data for recruitment
const mockJobPostings = [
  {
    id: 'JP-001',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    status: 'open',
    postedDate: '2024-01-15',
    applications: 24,
    shortlisted: 8,
    interviewing: 3
  },
  {
    id: 'JP-002',
    title: 'Sales Representative',
    department: 'Sales',
    type: 'Full-time',
    location: 'New York',
    status: 'open',
    postedDate: '2024-01-20',
    applications: 18,
    shortlisted: 6,
    interviewing: 2
  },
  {
    id: 'JP-003',
    title: 'Marketing Manager',
    department: 'Marketing',
    type: 'Full-time',
    location: 'San Francisco',
    status: 'closed',
    postedDate: '2024-01-10',
    applications: 32,
    shortlisted: 12,
    interviewing: 5
  }
]

const mockCandidates = [
  {
    id: 'CAN-001',
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    position: 'Senior Frontend Developer',
    stage: 'applied',
    appliedDate: '2024-01-18',
    resumeUrl: '#',
    notes: 'Strong React experience, good portfolio'
  },
  {
    id: 'CAN-002',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    position: 'Senior Frontend Developer',
    stage: 'shortlisted',
    appliedDate: '2024-01-19',
    resumeUrl: '#',
    notes: 'Excellent communication skills, 5+ years experience'
  },
  {
    id: 'CAN-003',
    name: 'David Lee',
    email: 'david.lee@email.com',
    position: 'Senior Frontend Developer',
    stage: 'interviewing',
    appliedDate: '2024-01-16',
    resumeUrl: '#',
    notes: 'Technical interview scheduled for Jan 30'
  },
  {
    id: 'CAN-004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    position: 'Sales Representative',
    stage: 'offer',
    appliedDate: '2024-01-22',
    resumeUrl: '#',
    notes: 'Offer letter sent, waiting for response'
  }
]

export default function RecruitmentPage() {
  const [jobPostings, setJobPostings] = useState(mockJobPostings)
  const [candidates, setCandidates] = useState(mockCandidates)
  const [filteredJobPostings, setFilteredJobPostings] = useState(mockJobPostings)
  const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('jobs')
  const { addNotification } = useNotifications()

  // Filter job postings
  useEffect(() => {
    let filtered = jobPostings.filter(job => {
      const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus
      const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
      return matchesStatus && matchesDepartment
    })
    setFilteredJobPostings(filtered)
  }, [jobPostings, selectedStatus, selectedDepartment])

  // Filter candidates
  useEffect(() => {
    let filtered = candidates.filter(candidate => {
      const matchesStage = selectedStage === 'all' || candidate.stage === selectedStage
      const matchesDepartment = selectedDepartment === 'all' || candidate.position.includes(selectedDepartment)
      return matchesStage && matchesDepartment
    })
    setFilteredCandidates(filtered)
  }, [candidates, selectedStage, selectedDepartment])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'text-green-700 bg-green-100 border-green-300'
      case 'closed': return 'text-red-700 bg-red-100 border-red-300'
      case 'upcoming': return 'text-blue-700 bg-blue-100 border-blue-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'applied': return 'text-blue-700 bg-blue-100 border-blue-300'
      case 'shortlisted': return 'text-yellow-700 bg-yellow-100 border-yellow-300'
      case 'interviewing': return 'text-purple-700 bg-purple-100 border-purple-300'
      case 'offer': return 'text-green-700 bg-green-100 border-green-300'
      case 'hired': return 'text-emerald-700 bg-emerald-100 border-emerald-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const moveCandidateStage = (candidateId: string, newStage: string) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId ? { ...candidate, stage: newStage } : candidate
    ))
    
    const candidate = candidates.find(c => c.id === candidateId)
    if (candidate) {
      addNotification({
        type: 'success',
        title: 'Candidate Updated',
        message: `${candidate.name} moved to ${newStage} stage.`
      })
    }
  }

  const deleteJobPosting = (jobId: string, jobTitle: string) => {
    if (confirm(`Are you sure you want to delete the job posting: ${jobTitle}?`)) {
      setJobPostings(prev => prev.filter(job => job.id !== jobId))
      addNotification({
      type: 'success',
      title: 'Job Posting Deleted',
      message: `${jobTitle} has been removed.`
    })
    }
  }

  const clearFilters = () => {
    setSelectedStatus('all')
    setSelectedDepartment('all')
    setSelectedStage('all')
  }

  const scheduleInterview = (candidateId: string, candidateName: string) => {
    addNotification({
      type: 'info',
      title: 'Interview Scheduling',
      message: `Opening calendar to schedule interview for ${candidateName}...`
    })
    // In a real app, this would open a calendar/scheduling modal
  }

  const getStageOrder = (stage: string) => {
    const order = ['applied', 'shortlisted', 'interviewing', 'offer', 'hired']
    return order.indexOf(stage)
  }

  const sortedCandidates = [...filteredCandidates].sort((a, b) => 
    getStageOrder(a.stage) - getStageOrder(b.stage)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/hr"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recruitment Tracker</h1>
                <p className="text-gray-600 mt-2">Manage job postings and candidate pipeline</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2 inline" />
                Filters
              </button>
              <Link
                href="/dashboard/hr/recruitment/jobs/add"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Job Posting
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Support">Support</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Stages</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2 inline" />
                Job Postings ({filteredJobPostings.length})
              </button>
              <button
                onClick={() => setActiveTab('candidates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'candidates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 mr-2 inline" />
                Candidates ({filteredCandidates.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Job Postings Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Job Postings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobPostings.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">ID: {job.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.type}</div>
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(job.status)}`}>
                          {job.status.replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(job.postedDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Applied: {job.applications}</div>
                          <div>Shortlisted: {job.shortlisted}</div>
                          <div>Interviewing: {job.interviewing}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/dashboard/hr/recruitment/jobs/${job.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/hr/recruitment/jobs/${job.id}/edit`}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deleteJobPosting(job.id, job.title)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            {/* Candidate Pipeline Stages */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {['applied', 'shortlisted', 'interviewing', 'offer', 'hired'].map((stage) => {
                const stageCandidates = sortedCandidates.filter(c => c.stage === stage)
                return (
                  <div key={stage} className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900 capitalize">{stage}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {stageCandidates.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {stageCandidates.map((candidate) => (
                        <div key={candidate.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-xs text-gray-500 truncate">{candidate.position}</div>
                          
                          <div className="mt-2 flex items-center space-x-1">
                            <button
                              onClick={() => scheduleInterview(candidate.id, candidate.name)}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded text-xs"
                              title="Schedule Interview"
                            >
                              <Calendar className="w-3 h-3" />
                            </button>
                            <Link
                              href={`/dashboard/hr/recruitment/candidates/${candidate.id}`}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded text-xs"
                              title="View Profile"
                            >
                              <Eye className="w-3 h-3" />
                            </Link>
                          </div>
                          
                          {stage !== 'hired' && (
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  const stages = ['applied', 'shortlisted', 'interviewing', 'offer', 'hired']
                                  const currentIndex = stages.indexOf(stage)
                                  const nextStage = stages[currentIndex + 1]
                                  if (nextStage) {
                                    moveCandidateStage(candidate.id, nextStage)
                                  }
                                }}
                                className="w-full text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                              >
                                Move to next stage <ChevronRight className="w-3 h-3 inline" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* All Candidates Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Candidates</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStageColor(candidate.stage)}`}>
                            {candidate.stage.replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(candidate.appliedDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={candidate.resumeUrl}
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="View Resume"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => scheduleInterview(candidate.id, candidate.name)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                              title="Schedule Interview"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/dashboard/hr/recruitment/candidates/${candidate.id}`}
                              className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded transition-colors"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
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

        {/* Empty States */}
        {activeTab === 'jobs' && filteredJobPostings.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No job postings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStatus !== 'all' || selectedDepartment !== 'all'
                ? 'Try adjusting your filters.'
                : 'No job postings at the moment.'
              }
            </p>
          </div>
        )}

        {activeTab === 'candidates' && filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedStage !== 'all' || selectedDepartment !== 'all'
                ? 'Try adjusting your filters.'
                : 'No candidates in the pipeline yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
