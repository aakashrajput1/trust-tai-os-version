'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Edit, 
  Building, 
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Calendar,
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
  XCircle,
  Briefcase,
  FileText,
  Download,
  Share2,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Target,
  Award,
  AlertCircle
} from 'lucide-react'

// Mock data for client details
const mockClientDetails = {
  id: 'CL-001',
  name: 'TechStart Inc.',
  industry: 'Technology',
  size: 'Enterprise (1000+ employees)',
  status: 'active',
  rating: 4.5,
  totalRevenue: 125000,
  dealsCount: 8,
  lastActivity: '2024-01-25',
  website: 'https://techstart.com',
  phone: '+1 (555) 123-4567',
  email: 'contact@techstart.com',
  address: '123 Innovation Drive, Tech City, TC 12345',
  description: 'Leading technology company specializing in AI and machine learning solutions for enterprise clients.',
  notes: 'Very satisfied with our services. Looking to expand partnership in Q2 2024. Decision makers are tech-savvy and appreciate innovative solutions.',
  contacts: [
    {
      id: 1,
      name: 'John Smith',
      title: 'CTO',
      email: 'john.smith@techstart.com',
      phone: '+1 (555) 123-4568',
      isPrimary: true,
      lastContact: '2024-01-25'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      title: 'VP of Engineering',
      email: 'sarah.johnson@techstart.com',
      phone: '+1 (555) 123-4569',
      isPrimary: false,
      lastContact: '2024-01-20'
    },
    {
      id: 3,
      name: 'Mike Davis',
      title: 'Procurement Manager',
      email: 'mike.davis@techstart.com',
      phone: '+1 (555) 123-4570',
      isPrimary: false,
      lastContact: '2024-01-18'
    }
  ],
  deals: [
    {
      id: 'DL-001',
      title: 'Enterprise License Deal',
      value: 45000,
      stage: 'prospecting',
      expectedClose: '2024-02-15',
      probability: 25
    },
    {
      id: 'DL-002',
      title: 'Support Contract Renewal',
      value: 15000,
      stage: 'closedWon',
      expectedClose: '2024-01-30',
      probability: 100
    },
    {
      id: 'DL-003',
      title: 'Implementation Services',
      value: 25000,
      stage: 'closedWon',
      expectedClose: '2024-01-15',
      probability: 100
    }
  ],
  activities: [
    {
      id: 1,
      type: 'meeting',
      description: 'Quarterly business review - discussed expansion opportunities',
      date: '2024-01-25',
      user: 'Sarah Johnson',
      contact: 'John Smith'
    },
    {
      id: 2,
      type: 'call',
      description: 'Follow-up on new proposal - client very interested',
      date: '2024-01-24',
      user: 'Sarah Johnson',
      contact: 'John Smith'
    },
    {
      id: 3,
      type: 'email',
      description: 'Sent quarterly report and renewal proposal',
      date: '2024-01-23',
      user: 'Sarah Johnson',
      contact: 'John Smith'
    }
  ],
  opportunities: [
    'AI module expansion - $75,000 potential',
    'Multi-year contract renewal - $200,000 potential',
    'Consulting services - $50,000 potential'
  ],
  risks: [
    'Budget constraints in Q2',
    'New procurement process implementation',
    'Competitive pressure from larger vendors'
  ],
  tags: ['Enterprise', 'Technology', 'High Value', 'Strategic Partner', 'AI/ML Focus']
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'active': return 'bg-green-100 border-green-300 text-green-700'
    case 'inactive': return 'bg-gray-100 border-gray-300 text-gray-700'
    case 'prospect': return 'bg-blue-100 border-blue-300 text-blue-700'
    case 'churned': return 'bg-red-100 border-red-300 text-red-700'
    default: return 'bg-gray-100 border-gray-300 text-gray-700'
  }
}

const getStageColor = (stage: string) => {
  switch(stage) {
    case 'prospecting': return 'bg-blue-100 text-blue-800'
    case 'proposal': return 'bg-yellow-100 text-yellow-800'
    case 'negotiation': return 'bg-orange-100 text-orange-800'
    case 'closedWon': return 'bg-green-100 text-green-800'
    case 'closedLost': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
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

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [client, setClient] = useState(mockClientDetails)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddContactModal, setShowAddContactModal] = useState(false)

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

  const calculateTotalDealValue = () => {
    return client.deals.reduce((total, deal) => total + deal.value, 0)
  }

  const calculateWeightedPipeline = () => {
    return client.deals
      .filter(deal => deal.stage !== 'closedWon' && deal.stage !== 'closedLost')
      .reduce((total, deal) => total + (deal.value * (deal.probability / 100)), 0)
  }

  const handleExportClient = (format: string) => {
    addNotification({
      type: 'info',
      title: 'Export',
      message: `Exporting client data as ${format.toUpperCase()}...`
    })
    // Here you would typically trigger the actual export
  }

  const handleShareClient = () => {
    addNotification({
      type: 'info',
      title: 'Share',
      message: 'Opening share options...'
    })
    // Here you would typically open a modal to share the client
  }

  const handleDeleteClient = () => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      addNotification({
        type: 'success',
        title: 'Client Deleted',
        message: 'Client has been deleted'
      })
      router.push('/dashboard/sales/clients')
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    
    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/sales/clients"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(client.status)}`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {renderStars(client.rating)}
                    <span className="text-sm text-gray-600 ml-1">({client.rating})</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{client.industry}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2 inline" />
                Edit
              </button>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Contact
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Overview */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <p className="text-sm text-gray-900">{client.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <p className="text-sm text-gray-900">{client.industry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                    <p className="text-sm text-gray-900">{client.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      {client.website}
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`tel:${client.phone}`} className="text-sm text-gray-900 hover:text-blue-600">{client.phone}</a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`mailto:${client.email}`} className="text-sm text-gray-900 hover:text-blue-600">{client.email}</a>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-900">{client.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{client.description}</p>
              </div>
            </div>

            {/* Key Contacts */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Key Contacts</h2>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4 mr-1 inline" />
                  Add Contact
                </button>
              </div>
              <div className="space-y-4">
                {client.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                          {contact.isPrimary && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{contact.title}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <a href={`mailto:${contact.email}`} className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </a>
                          <a href={`tel:${contact.phone}`} className="text-xs text-green-600 hover:text-green-800 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Last contact</p>
                      <p className="text-xs text-gray-900">{formatDate(contact.lastContact)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deals & Opportunities */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deals & Opportunities</h2>
              <div className="space-y-4">
                {client.deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(deal.stage)}`}>
                          {deal.stage.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{deal.probability}% probability</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(deal.value)}</p>
                      <p className="text-xs text-gray-500">Due: {formatDate(deal.expectedClose)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h2>
              <div className="space-y-4">
                {client.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{activity.contact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Metrics */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(client.totalRevenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deals Count</span>
                  <span className="text-sm font-medium text-gray-900">{client.dealsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Pipeline</span>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(calculateWeightedPipeline())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm text-gray-900">{formatDate(client.lastActivity)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleExportClient('pdf')}
                  className="w-full flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExportClient('csv')}
                  className="w-full flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={handleShareClient}
                  className="w-full flex items-center px-3 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Client
                </button>
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opportunities</h3>
              <div className="space-y-3">
                {client.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-900">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risks</h3>
              <div className="space-y-3">
                {client.risks.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span className="text-sm text-gray-900">{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag, index) => (
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
                onClick={handleDeleteClient}
                className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
