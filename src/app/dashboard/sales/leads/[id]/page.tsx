'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Edit, 
  UserCheck, 
  Briefcase, 
  UserX,
  Calendar,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Target,
  TrendingUp,
  Activity,
  MessageSquare,
  PhoneCall,
  Mail as MailIcon,
  Plus,
  Trash2,
  MoreVertical,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Mock data for lead details
const mockLeadDetails = {
  id: 'LD-001',
  name: 'John Smith',
  company: 'TechStart Inc.',
  status: 'qualified',
  source: 'Website',
  owner: 'Sarah Johnson',
  createdDate: '2024-01-25',
  email: 'john.smith@techstart.com',
  phone: '+1-555-0123',
  potentialValue: 25000,
  industry: 'Technology',
  jobTitle: 'CTO',
  website: 'www.techstart.com',
  address: '123 Tech Street, San Francisco, CA 94105',
  description: 'TechStart Inc. is a growing technology company looking to scale their infrastructure. They are interested in our enterprise solutions.',
  notes: 'Very interested in our cloud migration services. Has budget approved for Q1 2024.',
  lastContact: '2024-01-25',
  nextFollowUp: '2024-01-30',
  tags: ['Enterprise', 'Cloud Migration', 'High Priority'],
  activities: [
    {
      id: 1,
      type: 'email',
      description: 'Sent follow-up email with product information',
      date: '2024-01-25',
      user: 'Sarah Johnson'
    },
    {
      id: 2,
      type: 'call',
      description: 'Initial discovery call - discussed needs and timeline',
      date: '2024-01-24',
      user: 'Sarah Johnson'
    },
    {
      id: 3,
      type: 'meeting',
      description: 'Product demo scheduled for next week',
      date: '2024-01-23',
      user: 'Sarah Johnson'
    }
  ]
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'new': return 'text-blue-700 bg-blue-100 border-blue-300'
    case 'contacted': return 'text-yellow-700 bg-yellow-100 border-yellow-300'
    case 'qualified': return 'text-green-700 bg-green-100 border-green-300'
    case 'unqualified': return 'text-red-700 bg-red-100 border-red-300'
    default: return 'text-gray-700 bg-gray-100 border-gray-300'
  }
}

const getStatusLabel = (status: string) => {
  switch(status) {
    case 'new': return 'New'
    case 'contacted': return 'Contacted'
    case 'qualified': return 'Qualified'
    case 'unqualified': return 'Unqualified'
    default: return status
  }
}

const getActivityIcon = (type: string) => {
  switch(type) {
    case 'email': return <MailIcon className="w-4 h-4 text-blue-600" />
    case 'call': return <PhoneCall className="w-4 h-4 text-green-600" />
    case 'meeting': return <Calendar className="w-4 h-4 text-purple-600" />
    default: return <Activity className="w-4 h-4 text-gray-600" />
  }
}

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [lead, setLead] = useState(mockLeadDetails)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleStatusChange = (newStatus: string) => {
    setLead({ ...lead, status: newStatus })
    addNotification('Status Updated', `Lead status changed to ${getStatusLabel(newStatus)}`, 'success')
  }

  const handleConvertToDeal = () => {
    addNotification('Convert Lead', 'Redirecting to deal creation...', 'info')
    // Here you would typically navigate to deal creation with lead data
    setShowConvertModal(false)
  }

  const handleAssignLead = () => {
    addNotification('Assign Lead', 'Opening assignment modal...', 'info')
    // Here you would typically open a modal to select sales rep
  }

  const handleMarkAsLost = () => {
    setLead({ ...lead, status: 'unqualified' })
    addNotification('Lead Status', 'Lead marked as unqualified', 'warning')
  }

  const handleDeleteLead = () => {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      addNotification('Lead Deleted', 'Lead has been deleted', 'success')
      router.push('/dashboard/sales/leads')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/sales/leads"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
                <p className="text-gray-600 mt-2">{lead.company} • {lead.jobTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(lead.status)}`}>
                {getStatusLabel(lead.status)}
              </span>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2 inline" />
                Edit
              </button>
              <button
                onClick={() => setShowConvertModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Briefcase className="w-4 h-4 mr-2 inline" />
                Convert to Deal
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-sm text-gray-900">{lead.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{lead.company}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <p className="text-sm text-gray-900">{lead.jobTitle}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <p className="text-sm text-gray-900">{lead.industry}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {lead.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {lead.phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                        {lead.website}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-900">{lead.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Notes */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description & Notes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{lead.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{lead.notes}</p>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Activity History</h2>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-1 inline" />
                  Add Activity
                </button>
              </div>
              <div className="space-y-4">
                {lead.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleAssignLead}
                  className="w-full flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Lead
                </button>
                <button
                  onClick={() => handleStatusChange('contacted')}
                  className="w-full flex items-center px-3 py-2 text-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Mark as Contacted
                </button>
                <button
                  onClick={() => handleStatusChange('qualified')}
                  className="w-full flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Qualified
                </button>
                <button
                  onClick={handleMarkAsLost}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Lost
                </button>
              </div>
            </div>

            {/* Lead Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Potential Value</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(lead.potentialValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Source</span>
                  <span className="text-sm font-medium text-gray-900">{lead.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Owner</span>
                  <span className="text-sm font-medium text-gray-900">{lead.owner}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-900">{formatDate(lead.createdDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Contact</span>
                  <span className="text-sm text-gray-900">{formatDate(lead.lastContact)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Follow-up</span>
                  <span className="text-sm text-gray-900">{formatDate(lead.nextFollowUp)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border p-6 border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
              <button
                onClick={handleDeleteLead}
                className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
