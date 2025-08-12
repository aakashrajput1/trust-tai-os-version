'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Edit, 
  DollarSign, 
  Calendar,
  User,
  Building,
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
  XCircle,
  Briefcase,
  FileText,
  Download,
  Share2,
  Eye,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

// Mock data for deal details
const mockDealDetails = {
  id: 'DL-001',
  title: 'Enterprise License Deal',
  client: 'TechStart Inc.',
  value: 45000,
  expectedCloseDate: '2024-02-15',
  stage: 'prospecting',
  owner: 'Sarah Johnson',
  probability: 25,
  lastActivity: '2024-01-25',
  description: 'Enterprise software license for TechStart Inc. including implementation services and support.',
  notes: 'Client is very interested but needs to finalize budget approval. Technical team has given positive feedback.',
  source: 'Website Lead',
  type: 'New Business',
  products: [
    { name: 'Enterprise Software License', quantity: 1, price: 35000, total: 35000 },
    { name: 'Implementation Services', quantity: 1, price: 8000, total: 8000 },
    { name: 'Annual Support', quantity: 1, price: 2000, total: 2000 }
  ],
  activities: [
    {
      id: 1,
      type: 'meeting',
      description: 'Product demo with technical team - very positive feedback',
      date: '2024-01-25',
      user: 'Sarah Johnson'
    },
    {
      id: 2,
      type: 'call',
      description: 'Discovery call with decision maker - discussed requirements',
      date: '2024-01-24',
      user: 'Sarah Johnson'
    },
    {
      id: 3,
      type: 'email',
      description: 'Sent proposal and pricing information',
      date: '2024-01-23',
      user: 'Sarah Johnson'
    }
  ],
  competitors: ['Competitor A', 'Competitor B'],
  nextSteps: 'Schedule follow-up meeting with decision maker to discuss budget approval',
  tags: ['Enterprise', 'Software License', 'High Value', 'Q1 Target']
}

const stages = [
  { key: 'prospecting', label: 'Prospecting', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-700' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-700' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-700' },
  { key: 'closedWon', label: 'Closed-Won', color: 'bg-green-100 border-green-300', textColor: 'text-green-700' },
  { key: 'closedLost', label: 'Closed-Lost', color: 'bg-red-100 border-red-300', textColor: 'text-red-700' }
]

const getStageColor = (stage: string) => {
  const stageInfo = stages.find(s => s.key === stage)
  return stageInfo ? stageInfo.color : 'bg-gray-100 border-gray-300'
}

const getStageTextColor = (stage: string) => {
  const stageInfo = stages.find(s => s.key === stage)
  return stageInfo ? stageInfo.textColor : 'text-gray-700'
}

const getStageLabel = (stage: string) => {
  const stageInfo = stages.find(s => s.key === stage)
  return stageInfo ? stageInfo.label : stage
}

const getActivityIcon = (type: string) => {
  switch(type) {
    case 'email': return <MailIcon className="w-4 h-4 text-blue-600" />
    case 'call': return <PhoneCall className="w-4 h-4 text-green-600" />
    case 'meeting': return <Calendar className="w-4 h-4 text-purple-600" />
    default: return <Activity className="w-4 h-4 text-gray-600" />
  }
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addNotification } = useNotification()
  const [deal, setDeal] = useState(mockDealDetails)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStageModal, setShowStageModal] = useState(false)

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

  const getDaysUntilClose = (dateString: string) => {
    const today = new Date()
    const closeDate = new Date(dateString)
    const daysDiff = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 0) return `Overdue by ${Math.abs(daysDiff)} days`
    if (daysDiff === 0) return 'Due today'
    if (daysDiff === 1) return 'Due tomorrow'
    return `Due in ${daysDiff} days`
  }

  const handleStageChange = (newStage: string) => {
    setDeal({ ...deal, stage: newStage })
    addNotification('Stage Updated', `Deal moved to ${getStageLabel(newStage)}`, 'success')
    setShowStageModal(false)
  }

  const handleExportDeal = (format: string) => {
    addNotification('Export', `Exporting deal as ${format.toUpperCase()}...`, 'info')
    // Here you would typically trigger the actual export
  }

  const handleShareDeal = () => {
    addNotification('Share', 'Opening share options...', 'info')
    // Here you would typically open a modal to share the deal
  }

  const handleDeleteDeal = () => {
    if (confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      addNotification('Deal Deleted', 'Deal has been deleted', 'success')
      router.push('/dashboard/sales/deals')
    }
  }

  const calculateTotalValue = () => {
    return deal.products.reduce((total, product) => total + product.total, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/sales/deals"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>
                <p className="text-gray-600 mt-2">{deal.client} • {formatCurrency(deal.value)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStageColor(deal.stage)} ${getStageTextColor(deal.stage)}`}>
                {getStageLabel(deal.stage)}
              </span>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2 inline" />
                Edit
              </button>
              <button
                onClick={() => setShowStageModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4 mr-2 inline" />
                Move Stage
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Overview */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                    <p className="text-sm text-gray-900">{deal.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{deal.client}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deal Type</label>
                    <p className="text-sm text-gray-900">{deal.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <p className="text-sm text-gray-900">{deal.source}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{deal.owner}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{formatDate(deal.expectedCloseDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Probability</label>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900">{deal.probability}%</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Close Timeline</label>
                    <p className={`text-sm font-medium ${deal.expectedCloseDate < new Date().toISOString().split('T')[0] ? 'text-red-600' : 'text-gray-900'}`}>
                      {getDaysUntilClose(deal.expectedCloseDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products & Pricing */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Products & Pricing</h2>
              <div className="space-y-4">
                {deal.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {product.quantity} × {formatCurrency(product.price)}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.total)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-lg font-semibold text-gray-900">Total Deal Value</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(calculateTotalValue())}</span>
                </div>
              </div>
            </div>

            {/* Description & Notes */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description & Notes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{deal.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{deal.notes}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Steps</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{deal.nextSteps}</p>
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
                {deal.activities.map((activity) => (
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
            {/* Deal Metrics */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deal Value</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(deal.value)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Probability</span>
                  <span className="text-sm font-medium text-gray-900">{deal.probability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Weighted Value</span>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(deal.value * (deal.probability / 100))}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days to Close</span>
                  <span className="text-sm text-gray-900">
                    {Math.ceil((new Date(deal.expectedCloseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleExportDeal('pdf')}
                  className="w-full flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExportDeal('csv')}
                  className="w-full flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={handleShareDeal}
                  className="w-full flex items-center px-3 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Deal
                </button>
              </div>
            </div>

            {/* Competitors */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitors</h3>
              <div className="space-y-2">
                {deal.competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">{competitor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {deal.tags.map((tag, index) => (
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
                onClick={handleDeleteDeal}
                className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
