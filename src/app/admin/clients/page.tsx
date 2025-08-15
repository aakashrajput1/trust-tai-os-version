'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  Phone, 
  Mail, 
  Globe,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Heart,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react'
import ClientCreationModal from '@/components/ui/ClientCreationModal'

interface Client {
  id: string
  name: string
  industry: string
  status: 'active' | 'inactive' | 'prospect'
  contactPerson: string
  email: string
  phone: string
  website: string
  address: string
  contractValue: number
  contractStartDate: string
  contractEndDate: string
  billingRate: number
  satisfactionScore: number
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical'
  lastContact: string
  totalRevenue: number
  projectsCount: number
  teamSize: number
}

interface Contract {
  id: string
  clientId: string
  contractNumber: string
  type: 'hourly' | 'fixed' | 'retainer'
  value: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'pending_renewal'
  terms: string
  autoRenew: boolean
}

interface CommunicationLog {
  id: string
  clientId: string
  type: 'email' | 'call' | 'meeting' | 'support'
  subject: string
  summary: string
  timestamp: string
  outcome: string
  nextAction?: string
  assignedTo: string
}

interface ClientData {
  name: string
  email: string
  phone: string
  company: string
  website: string
  industry: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  billingRate: number
  contractType: string
  startDate: string
  endDate: string
  isActive: boolean
  notes: string
}

export default function ClientManagementPage() {
  const [activeTab, setActiveTab] = useState('clients')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const handleCreateClient = async (clientData: ClientData) => {
    try {
      console.log('Creating new client:', clientData)
      // Here you would typically make an API call to create the client
      // For now, we'll just log the data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // You can add the new client to your state here
      // setClients(prev => [...prev, newClient])
      
      alert('Client created successfully!')
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Failed to create client. Please try again.')
    }
  }

  // Mock data
  const clients: Client[] = [
    {
      id: '1',
      name: 'TechCorp Inc.',
      industry: 'Technology',
      status: 'active',
      contactPerson: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      website: 'www.techcorp.com',
      address: '123 Tech Street, San Francisco, CA 94105',
      contractValue: 150000,
      contractStartDate: '2024-01-01',
      contractEndDate: '2024-12-31',
      billingRate: 125,
      satisfactionScore: 4.8,
      healthStatus: 'excellent',
      lastContact: '2024-02-08T10:30:00Z',
      totalRevenue: 450000,
      projectsCount: 8,
      teamSize: 15
    },
    {
      id: '2',
      name: 'Global Solutions Ltd.',
      industry: 'Consulting',
      status: 'active',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.johnson@globalsolutions.com',
      phone: '+1 (555) 987-6543',
      website: 'www.globalsolutions.com',
      address: '456 Business Ave, New York, NY 10001',
      contractValue: 200000,
      contractStartDate: '2024-02-01',
      contractEndDate: '2025-01-31',
      billingRate: 150,
      satisfactionScore: 4.2,
      healthStatus: 'good',
      lastContact: '2024-02-05T14:15:00Z',
      totalRevenue: 320000,
      projectsCount: 5,
      teamSize: 12
    },
    {
      id: '3',
      name: 'StartupXYZ',
      industry: 'Startup',
      status: 'active',
      contactPerson: 'Mike Chen',
      email: 'mike.chen@startupxyz.com',
      phone: '+1 (555) 456-7890',
      website: 'www.startupxyz.com',
      address: '789 Innovation Blvd, Austin, TX 73301',
      contractValue: 75000,
      contractStartDate: '2024-01-15',
      contractEndDate: '2024-07-15',
      billingRate: 95,
      satisfactionScore: 4.9,
      healthStatus: 'excellent',
      lastContact: '2024-02-10T09:00:00Z',
      totalRevenue: 120000,
      projectsCount: 3,
      teamSize: 8
    },
    {
      id: '4',
      name: 'Enterprise Corp',
      industry: 'Enterprise',
      status: 'prospect',
      contactPerson: 'Lisa Davis',
      email: 'lisa.davis@enterprisecorp.com',
      phone: '+1 (555) 321-0987',
      website: 'www.enterprisecorp.com',
      address: '321 Corporate Plaza, Chicago, IL 60601',
      contractValue: 0,
      contractStartDate: '',
      contractEndDate: '',
      billingRate: 0,
      satisfactionScore: 0,
      healthStatus: 'warning',
      lastContact: '2024-02-07T16:45:00Z',
      totalRevenue: 0,
      projectsCount: 0,
      teamSize: 0
    }
  ]

  const contracts: Contract[] = [
    {
      id: '1',
      clientId: '1',
      contractNumber: 'CON-2024-001',
      type: 'hourly',
      value: 150000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      terms: 'Hourly billing at $125/hour with monthly invoicing',
      autoRenew: true
    },
    {
      id: '2',
      clientId: '2',
      contractNumber: 'CON-2024-002',
      type: 'fixed',
      value: 200000,
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      status: 'active',
      terms: 'Fixed price project with milestone payments',
      autoRenew: false
    },
    {
      id: '3',
      clientId: '3',
      contractNumber: 'CON-2024-003',
      type: 'retainer',
      value: 75000,
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      status: 'active',
      terms: 'Monthly retainer of $12,500 for ongoing support',
      autoRenew: true
    }
  ]

  const communicationLogs: CommunicationLog[] = [
    {
      id: '1',
      clientId: '1',
      type: 'meeting',
      subject: 'Q1 Review Meeting',
      summary: 'Discussed project progress and upcoming milestones',
      timestamp: '2024-02-08T10:30:00Z',
      outcome: 'Positive feedback, approved next phase',
      nextAction: 'Schedule follow-up in 2 weeks',
      assignedTo: 'John Admin'
    },
    {
      id: '2',
      clientId: '2',
      type: 'call',
      subject: 'Contract Renewal Discussion',
      summary: 'Discussed contract renewal terms and pricing',
      timestamp: '2024-02-05T14:15:00Z',
      outcome: 'Agreed to 15% increase for next year',
      nextAction: 'Prepare renewal contract',
      assignedTo: 'Sarah Manager'
    },
    {
      id: '3',
      clientId: '3',
      type: 'email',
      subject: 'Feature Request - Mobile App',
      summary: 'Client requested new mobile app features',
      timestamp: '2024-02-10T09:00:00Z',
      outcome: 'Requirements documented, estimate provided',
      nextAction: 'Send detailed proposal',
      assignedTo: 'Mike Developer'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'prospect': return 'bg-blue-100 text-blue-800'
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <Heart className="w-4 h-4 text-green-600" />
      case 'good': return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

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
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus
    const matchesIndustry = selectedIndustry === 'all' || client.industry === selectedIndustry
    return matchesSearch && matchesStatus && matchesIndustry
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage client relationships, contracts, and billing</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddClientModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(clients.reduce((sum, client) => sum + client.totalRevenue, 0))}
                </p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(clients.reduce((sum, client) => sum + client.satisfactionScore, 0) / clients.filter(c => c.satisfactionScore > 0).length).toFixed(1)}
                </p>
                <p className="text-xs text-green-600">+0.3 from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.healthStatus === 'critical' || c.healthStatus === 'warning').length}
                </p>
                <p className="text-xs text-red-600">Requires attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'clients', name: 'Client Profiles', icon: Building },
            { id: 'contracts', name: 'Contract Management', icon: FileText },
            { id: 'billing', name: 'Billing Rates', icon: DollarSign },
            { id: 'health', name: 'Client Health', icon: Heart },
            { id: 'communications', name: 'Communication Log', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Client Profiles Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </Select>
                <Select value={selectedIndustry} onChange={(e) => setSelectedIndustry(e.target.value)}>
                  <option value="all">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Startup">Startup</option>
                  <option value="Enterprise">Enterprise</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <CardDescription>{client.industry}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getHealthIcon(client.healthStatus)}
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{client.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span>{client.website}</span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Contract Value:</span>
                        <span className="font-medium">{formatCurrency(client.contractValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Revenue:</span>
                        <span className="font-medium">{formatCurrency(client.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Projects:</span>
                        <span className="font-medium">{client.projectsCount}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contract Management Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Contract Management</h3>
                <p className="text-gray-600">Manage client contracts and renewals</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Contract
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Contract #</th>
                        <th className="text-left py-2">Client</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Value</th>
                        <th className="text-left py-2">Start Date</th>
                        <th className="text-left py-2">End Date</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => {
                        const client = clients.find(c => c.id === contract.clientId)
                        return (
                          <tr key={contract.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 font-medium">{contract.contractNumber}</td>
                            <td className="py-2">{client?.name}</td>
                            <td className="py-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                {contract.type}
                              </Badge>
                            </td>
                            <td className="py-2">{formatCurrency(contract.value)}</td>
                            <td className="py-2">{formatDate(contract.startDate)}</td>
                            <td className="py-2">{formatDate(contract.endDate)}</td>
                            <td className="py-2">
                              <Badge className={getStatusColor(contract.status)}>
                                {contract.status}
                              </Badge>
                            </td>
                            <td className="py-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Rates Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Billing Rates</h3>
                <p className="text-gray-600">Manage client-specific billing rates and discounts</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Rate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.filter(c => c.billingRate > 0).map((client) => (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hourly Rate:</span>
                      <span className="text-lg font-bold">{formatCurrency(client.billingRate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Contract Value:</span>
                      <span className="font-medium">{formatCurrency(client.contractValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Revenue:</span>
                      <span className="font-medium">{formatCurrency(client.totalRevenue)}</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Rate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Client Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Client Health Monitoring</h3>
                <p className="text-gray-600">Track client satisfaction and identify at-risk relationships</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                        <CardDescription>{client.industry}</CardDescription>
                      </div>
                      {getHealthIcon(client.healthStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Health Status:</span>
                      <Badge className={getStatusColor(client.healthStatus)}>
                        {client.healthStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Satisfaction Score:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{client.satisfactionScore}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Contact:</span>
                      <span className="text-sm">{formatDate(client.lastContact)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Projects:</span>
                      <span className="font-medium">{client.projectsCount}</span>
                    </div>
                    
                    {client.healthStatus === 'critical' || client.healthStatus === 'warning' ? (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-medium">Action Required</p>
                        <p className="text-xs text-red-600 mt-1">Schedule follow-up meeting</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">Healthy Relationship</p>
                        <p className="text-xs text-green-600 mt-1">Continue regular check-ins</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Communication Log Tab */}
        {activeTab === 'communications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Communication Log</h3>
                <p className="text-gray-600">Track all client interactions and communications</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="space-y-4">
                  {communicationLogs.map((log) => {
                    const client = clients.find(c => c.id === log.clientId)
                    return (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                {log.type}
                              </Badge>
                              <span className="font-medium">{client?.name}</span>
                              <span className="text-sm text-gray-500">
                                {formatDate(log.timestamp)}
                              </span>
                            </div>
                            <h4 className="font-medium mb-1">{log.subject}</h4>
                            <p className="text-sm text-gray-600 mb-2">{log.summary}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span><strong>Outcome:</strong> {log.outcome}</span>
                              <span><strong>Assigned to:</strong> {log.assignedTo}</span>
                            </div>
                            {log.nextAction && (
                              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                  <strong>Next Action:</strong> {log.nextAction}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Client Creation Modal */}
      <ClientCreationModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  )
}
