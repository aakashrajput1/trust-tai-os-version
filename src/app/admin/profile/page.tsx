'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Activity,
  Database,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar: string
  department: string
  location: string
  timezone: string
  language: string
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    slack: boolean
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    loginHistory: Array<{
      date: string
      ip: string
      device: string
      location: string
    }>
  }
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: 'admin-001',
        name: 'Admin User',
        email: 'admin@trusttai.com',
        phone: '+1 (555) 123-4567',
        role: 'System Administrator',
        avatar: '/api/placeholder/150/150',
        department: 'IT & Operations',
        location: 'San Francisco, CA',
        timezone: 'America/Los_Angeles',
        language: 'English (US)',
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          sms: false,
          slack: true
        },
        security: {
          twoFactorEnabled: true,
          lastPasswordChange: '2024-01-15T10:30:00Z',
          loginHistory: [
            {
              date: '2024-01-20T14:30:00Z',
              ip: '192.168.1.100',
              device: 'MacBook Pro (Chrome)',
              location: 'San Francisco, CA'
            },
            {
              date: '2024-01-19T09:15:00Z',
              ip: '203.0.113.45',
              device: 'iPhone (Safari)',
              location: 'San Francisco, CA'
            }
          ]
        }
      }
      setProfile(mockProfile)
      setFormData(mockProfile)
      setLoading(false)
    }, 1000)
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (type: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications!,
        [type]: value
      }
    }))
  }

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    if (profile) {
      setProfile({ ...profile, ...formData } as UserProfile)
    }
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData(profile!)
    setEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to your server
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information, preferences, and security settings
          </p>
        </div>
        {editing ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-6">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.name.charAt(0)}
                </div>
              )}
            </div>
            {editing && (
              <button
                onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            {showAvatarUpload && editing && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {profile?.role}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{profile?.department}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile?.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile?.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{profile?.timezone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'security', label: 'Security', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={formData.language || ''}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    disabled={!editing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(formData.notifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {key === 'email' ? 'Email Notifications' : 
                         key === 'push' ? 'Push Notifications' :
                         key === 'sms' ? 'SMS Notifications' : 'Slack Notifications'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive notifications via {key === 'email' ? 'email' : 
                        key === 'push' ? 'browser push' :
                        key === 'sms' ? 'SMS' : 'Slack'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        disabled={!editing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map((theme) => {
                      const Icon = theme.icon
                      return (
                        <button
                          key={theme.value}
                          onClick={() => handleInputChange('theme', theme.value)}
                          disabled={!editing}
                          className={`p-4 border rounded-lg text-center ${
                            formData.theme === theme.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {profile?.security.twoFactorEnabled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Disabled
                        </span>
                      )}
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        {profile?.security.twoFactorEnabled ? 'Manage' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-500">
                        Last changed: {new Date(profile?.security.lastPasswordChange || '').toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Login History */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Login Activity</h4>
                  <div className="space-y-3">
                    {profile?.security.loginHistory.map((login, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{login.device}</p>
                            <p className="text-xs text-gray-500">{login.ip} • {login.location}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(login.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
          <p className="text-sm text-gray-600">Manage your account security and access</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profile?.security?.twoFactorEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile?.security?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                {profile?.security?.twoFactorEnabled ? 'Manage' : 'Enable'}
              </button>
            </div>
          </div>

          {/* Password Management */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-500">Last changed {profile?.security?.lastPasswordChange ? new Date(profile.security.lastPasswordChange).toLocaleDateString() : 'Never'}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Change Password
            </button>
          </div>

          {/* Session Management */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
              <p className="text-sm text-gray-500">Manage your active login sessions</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Sessions
            </button>
          </div>

          {/* API Keys */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">API Keys</h4>
              <p className="text-sm text-gray-500">Manage your API access keys</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage Keys
            </button>
          </div>
        </div>
      </div>

      {/* System Access Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Access Logs</h3>
          <p className="text-sm text-gray-600">Recent login activity and system access</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {profile?.security?.loginHistory?.map((session, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    <p className="text-xs text-gray-500">{session.ip} • {session.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{new Date(session.date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{new Date(session.date).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Access Logs
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Administrative Tools</h3>
          <p className="text-sm text-gray-600">Advanced system administration features</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">System Monitor</p>
                <p className="text-xs text-gray-500">Real-time system performance</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Database Tools</p>
                <p className="text-xs text-gray-500">Database management utilities</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Log Viewer</p>
                <p className="text-xs text-gray-500">System and application logs</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>

          <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">System Config</p>
                <p className="text-xs text-gray-500">System configuration settings</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
