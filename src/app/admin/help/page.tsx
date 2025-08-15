'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Lightbulb, 
  Activity,
  Plus,
  Play,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  Globe,
  Server,
  Zap
} from 'lucide-react'

interface Documentation {
  id: string
  title: string
  category: string
  description: string
  views: number
  rating: number
}

interface VideoTutorial {
  id: string
  title: string
  duration: number
  category: string
  views: number
  instructor: string
}

interface SupportTicket {
  id: string
  subject: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
}

interface FeatureRequest {
  id: string
  title: string
  status: 'pending' | 'approved' | 'in-development'
  votes: number
  priority: 'low' | 'medium' | 'high'
}

interface SystemStatus {
  service: string
  status: 'operational' | 'degraded' | 'outage'
  uptime: number
}

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('documentation')
  const [searchQuery, setSearchQuery] = useState('')

  // Minimal mock data
  const documentation: Documentation[] = [
    {
      id: '1',
      title: 'Admin Panel Guide',
      category: 'Admin Guide',
      description: 'Complete setup and usage guide',
      views: 1200,
      rating: 4.8
    },
    {
      id: '2',
      title: 'User Management',
      category: 'Admin Guide',
      description: 'Manage users and permissions',
      views: 850,
      rating: 4.6
    }
  ]

  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Admin Panel Overview',
      duration: 15,
      category: 'Getting Started',
      views: 2300,
      instructor: 'Sarah Johnson'
    },
    {
      id: '2',
      title: 'User Management Tutorial',
      duration: 22,
      category: 'User Management',
      views: 1800,
      instructor: 'Mike Chen'
    }
  ]

  const supportTickets: SupportTicket[] = [
    {
      id: '1',
      subject: 'Cannot access user management',
      priority: 'high',
      status: 'in-progress',
      createdAt: '2024-02-10T14:30:00Z'
    },
    {
      id: '2',
      subject: 'Report generation failing',
      priority: 'medium',
      status: 'open',
      createdAt: '2024-02-10T12:15:00Z'
    }
  ]

  const featureRequests: FeatureRequest[] = [
    {
      id: '1',
      title: 'Bulk User Import',
      status: 'approved',
      votes: 45,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Dark Mode Theme',
      status: 'pending',
      votes: 67,
      priority: 'low'
    }
  ]

  const systemStatus: SystemStatus[] = [
    {
      service: 'Web Application',
      status: 'operational',
      uptime: 99.9
    },
    {
      service: 'API Services',
      status: 'operational',
      uptime: 99.8
    },
    {
      service: 'Email Services',
      status: 'degraded',
      uptime: 98.5
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-yellow-100 text-yellow-800'
      case 'outage': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Documentation, tutorials, and support resources</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Lightbulb className="w-4 h-4 mr-2" />
            Request Feature
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Documentation</p>
                <p className="text-2xl font-bold text-gray-900">{documentation.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Video Tutorials</p>
                <p className="text-2xl font-bold text-gray-900">{videoTutorials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{supportTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">99.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'documentation', name: 'Documentation', icon: BookOpen },
            { id: 'tutorials', name: 'Video Tutorials', icon: Video },
            { id: 'support', name: 'Contact Support', icon: MessageCircle },
            { id: 'features', name: 'Feature Requests', icon: Lightbulb },
            { id: 'status', name: 'System Status', icon: Activity }
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
        {/* Documentation Tab */}
        {activeTab === 'documentation' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentation.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {doc.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Views:</span>
                      <span className="font-medium">{doc.views}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{doc.rating}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Video Tutorials Tab */}
        {activeTab === 'tutorials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="relative">
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-600" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-black bg-opacity-75 text-white">
                        {formatDuration(tutorial.duration)}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.category}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Instructor:</span>
                      <span className="font-medium">{tutorial.instructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Views:</span>
                      <span className="font-medium">{tutorial.views}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="w-4 h-4 mr-1" />
                        Watch
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Like
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Get help from our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">support@company.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Create Support Ticket
                  </Button>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                  <CardDescription>When our team is available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Emergency Only</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Support Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Support Tickets</CardTitle>
                <CardDescription>Your recent support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-gray-600">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feature Requests Tab */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Feature Requests</h3>
                <p className="text-gray-600">Vote for new features and track their progress</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureRequests.map((feature) => (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <Badge className={getPriorityColor(feature.priority)}>
                        {feature.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Votes:</span>
                      <span className="font-medium">{feature.votes}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Vote ({feature.votes})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* System Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Real-time status of all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemStatus.map((service) => (
                    <div key={service.service} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {service.status === 'operational' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : service.status === 'degraded' ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{service.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{service.uptime}% uptime</p>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
