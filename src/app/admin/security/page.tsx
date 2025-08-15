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
  Shield, 
  Eye, 
  Lock, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Globe,
  Database,
  Settings,
  RefreshCw,
  Calendar,
  BarChart3,
  ShieldCheck,
  UserCheck,
  FileCheck,
  Plus,
  Save
} from 'lucide-react'

interface AccessLog {
  id: string
  userId: string
  userName: string
  action: string
  ipAddress: string
  userAgent: string
  timestamp: string
  status: 'success' | 'failed' | 'blocked'
  location?: string
}

interface SecurityAudit {
  id: string
  type: 'login_attempt' | 'data_access' | 'permission_change' | 'system_change'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: string
  resolved: boolean
  assignedTo?: string
}

interface GDPRRequest {
  id: string
  type: 'access' | 'deletion' | 'correction' | 'portability'
  userId: string
  userName: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  submittedAt: string
  completedAt?: string
  notes?: string
}

interface ComplianceReport {
  id: string
  type: 'gdpr' | 'sox' | 'pci' | 'hipaa'
  period: string
  status: 'compliant' | 'non_compliant' | 'pending_review'
  score: number
  lastUpdated: string
  nextReview: string
}

export default function SecurityCompliancePage() {
  const [activeTab, setActiveTab] = useState('access-logs')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [gdprEnabled, setGdprEnabled] = useState(true)
  const [dataRetentionDays, setDataRetentionDays] = useState(90)
  const [twoFactorRequired, setTwoFactorRequired] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)

  // Mock data
  const accessLogs: AccessLog[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      action: 'login',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2024-02-10T10:30:00Z',
      status: 'success',
      location: 'New York, US'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'failed_login',
      ipAddress: '203.45.67.89',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: '2024-02-10T09:15:00Z',
      status: 'failed',
      location: 'London, UK'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      action: 'data_export',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2024-02-10T08:45:00Z',
      status: 'success',
      location: 'New York, US'
    }
  ]

  const securityAudits: SecurityAudit[] = [
    {
      id: '1',
      type: 'login_attempt',
      severity: 'medium',
      description: 'Multiple failed login attempts from suspicious IP',
      timestamp: '2024-02-10T09:15:00Z',
      resolved: false,
      assignedTo: 'Security Team'
    },
    {
      id: '2',
      type: 'permission_change',
      severity: 'high',
      description: 'Admin role permissions modified',
      timestamp: '2024-02-09T14:30:00Z',
      resolved: true,
      assignedTo: 'Admin'
    },
    {
      id: '3',
      type: 'data_access',
      severity: 'low',
      description: 'Bulk data export requested',
      timestamp: '2024-02-08T11:20:00Z',
      resolved: true,
      assignedTo: 'Data Team'
    }
  ]

  const gdprRequests: GDPRRequest[] = [
    {
      id: '1',
      type: 'access',
      userId: 'user1',
      userName: 'John Doe',
      status: 'completed',
      submittedAt: '2024-02-05T10:00:00Z',
      completedAt: '2024-02-07T15:30:00Z',
      notes: 'Data exported and sent to user'
    },
    {
      id: '2',
      type: 'deletion',
      userId: 'user2',
      userName: 'Jane Smith',
      status: 'in_progress',
      submittedAt: '2024-02-08T14:20:00Z',
      notes: 'Pending final approval'
    },
    {
      id: '3',
      type: 'correction',
      userId: 'user3',
      userName: 'Mike Johnson',
      status: 'pending',
      submittedAt: '2024-02-10T09:00:00Z'
    }
  ]

  const complianceReports: ComplianceReport[] = [
    {
      id: '1',
      type: 'gdpr',
      period: 'Q1 2024',
      status: 'compliant',
      score: 95,
      lastUpdated: '2024-02-01T00:00:00Z',
      nextReview: '2024-05-01T00:00:00Z'
    },
    {
      id: '2',
      type: 'sox',
      period: 'Q1 2024',
      status: 'compliant',
      score: 92,
      lastUpdated: '2024-02-01T00:00:00Z',
      nextReview: '2024-05-01T00:00:00Z'
    },
    {
      id: '3',
      type: 'pci',
      period: 'Q1 2024',
      status: 'pending_review',
      score: 88,
      lastUpdated: '2024-01-15T00:00:00Z',
      nextReview: '2024-04-15T00:00:00Z'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'blocked': return 'bg-orange-100 text-orange-800'
      case 'compliant': return 'bg-green-100 text-green-800'
      case 'non_compliant': return 'bg-red-100 text-red-800'
      case 'pending_review': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportLogs = (format: string) => {
    console.log(`Exporting logs as ${format}`)
    // Implementation for export functionality
  }

  const runSecurityScan = () => {
    console.log('Running security scan...')
    // Implementation for security scan
  }

  const generateComplianceReport = (type: string) => {
    console.log(`Generating ${type} compliance report...`)
    // Implementation for report generation
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security & Compliance</h1>
          <p className="text-gray-600">Manage security settings, monitor access, and ensure compliance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runSecurityScan}>
            <ShieldCheck className="w-4 h-4 mr-2" />
            Run Security Scan
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Access Logs</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-green-600">+12% from last week</p>
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
                <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-red-600">3 require attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">95%</p>
                <p className="text-xs text-green-600">All standards met</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">GDPR Requests</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-yellow-600">5 pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'access-logs', name: 'Access Logs', icon: Eye },
            { id: 'security-audits', name: 'Security Audits', icon: Shield },
            { id: 'gdpr-management', name: 'GDPR Management', icon: UserCheck },
            { id: 'compliance-reports', name: 'Compliance Reports', icon: FileCheck },
            { id: 'security-settings', name: 'Security Settings', icon: Settings }
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
        {/* Access Logs Tab */}
        {activeTab === 'access-logs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="blocked">Blocked</option>
                </Select>
                <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </Select>
              </div>
              <Button onClick={() => exportLogs('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Access Logs</CardTitle>
                <CardDescription>Recent user access and authentication events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">User</th>
                        <th className="text-left py-2">Action</th>
                        <th className="text-left py-2">IP Address</th>
                        <th className="text-left py-2">Location</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{log.userName}</td>
                          <td className="py-2">{log.action}</td>
                          <td className="py-2">{log.ipAddress}</td>
                          <td className="py-2">{log.location}</td>
                          <td className="py-2">
                            <Badge className={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                          </td>
                          <td className="py-2">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Audits Tab */}
        {activeTab === 'security-audits' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Audits</CardTitle>
                <CardDescription>Security events and alerts requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAudits.map((audit) => (
                    <div key={audit.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(audit.severity)}>
                              {audit.severity}
                            </Badge>
                            <span className="text-sm text-gray-500">{audit.type}</span>
                          </div>
                          <p className="mt-2 font-medium">{audit.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(audit.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {audit.resolved ? (
                            <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">Open</Badge>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* GDPR Management Tab */}
        {activeTab === 'gdpr-management' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">GDPR Data Subject Requests</h3>
                <p className="text-gray-600">Manage data subject rights requests</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>

            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">User</th>
                        <th className="text-left py-2">Request Type</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Submitted</th>
                        <th className="text-left py-2">Completed</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gdprRequests.map((request) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{request.userName}</td>
                          <td className="py-2">{request.type}</td>
                          <td className="py-2">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </td>
                          <td className="py-2">{new Date(request.submittedAt).toLocaleDateString()}</td>
                          <td className="py-2">
                            {request.completedAt ? new Date(request.completedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-2">
                            <Button size="sm" variant="outline">
                              Process
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compliance Reports Tab */}
        {activeTab === 'compliance-reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Compliance Reports</h3>
                <p className="text-gray-600">View and generate compliance reports</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => generateComplianceReport('gdpr')}>
                  Generate GDPR Report
                </Button>
                <Button onClick={() => generateComplianceReport('sox')}>
                  Generate SOX Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {complianceReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      {report.type.toUpperCase()} Report
                    </CardTitle>
                    <CardDescription>{report.period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Score:</span>
                        <span className="text-lg font-bold">{report.score}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Last Updated:</span>
                        <span className="text-sm">{new Date(report.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Next Review:</span>
                        <span className="text-sm">{new Date(report.nextReview).toLocaleDateString()}</span>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === 'security-settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Privacy Settings</CardTitle>
                <CardDescription>Configure data retention and privacy policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gdpr-enabled">GDPR Compliance</Label>
                    <p className="text-sm text-gray-600">Enable GDPR compliance features</p>
                  </div>
                  <Switch
                    id="gdpr-enabled"
                    checked={gdprEnabled}
                    onCheckedChange={setGdprEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    value={dataRetentionDays}
                    onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
                    min="1"
                    max="365"
                  />
                  <p className="text-sm text-gray-600">How long to keep user data before automatic deletion</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
                <CardDescription>Configure authentication and session policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Force 2FA for all users</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactorRequired}
                    onCheckedChange={setTwoFactorRequired}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                  <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
              <Button variant="outline">
                Reset to Defaults
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


