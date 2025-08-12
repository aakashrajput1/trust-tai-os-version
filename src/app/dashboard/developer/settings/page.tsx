'use client'

import { useState } from 'react'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Palette,
  Save,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Clock,
  Globe,
  Monitor,
  Moon,
  Sun
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import DeveloperNav from '@/components/ui/DeveloperNav'

export default function DeveloperSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    taskAssignments: true,
    projectUpdates: true,
    weeklyReports: true,
    dailyDigest: false,
    slackNotifications: true,
    blockerNotifications: true,
    timeReminders: true
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'preferences', name: 'Preferences', icon: Clock }
  ]

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DeveloperNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Settings
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Manage your profile and preferences
                  </p>
                </div>
                <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6 overflow-x-auto">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {tab.name}
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                defaultValue="Alex Developer"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="email"
                                defaultValue="alex@company.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="tel"
                                defaultValue="+1 (555) 123-4567"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                defaultValue="San Francisco, CA"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company
                            </label>
                            <input
                              type="text"
                              defaultValue="TechCorp Inc."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Job Title
                            </label>
                            <input
                              type="text"
                              defaultValue="Senior Developer"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          {Object.entries(notifications).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Receive email notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleNotificationChange(key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  value ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    value ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Notifications</h3>
                        <div className="space-y-4">
                          {Object.entries(notifications).slice(4).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
                                </p>
                              </div>
                              <button
                                onClick={() => handleNotificationChange(key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  value ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    value ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Smartphone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">SMS Authentication</p>
                              <p className="text-sm text-gray-500">Use your phone to receive verification codes</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Current Session</p>
                              <p className="text-sm text-gray-500">San Francisco, CA • Chrome on Windows</p>
                            </div>
                            <span className="text-xs text-green-600 font-medium">Current</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Previous Session</p>
                              <p className="text-sm text-gray-500">New York, NY • Safari on iPhone</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Theme
                            </label>
                            <div className="flex space-x-3">
                              <button className="flex items-center space-x-2 p-3 border-2 border-blue-500 rounded-lg bg-blue-50">
                                <Sun className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">Light</span>
                              </button>
                              <button className="flex items-center space-x-2 p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400">
                                <Moon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-600">Dark</span>
                              </button>
                              <button className="flex items-center space-x-2 p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400">
                                <Monitor className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-600">System</span>
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Accent Color
                            </label>
                            <div className="flex space-x-3">
                              {['blue', 'green', 'purple', 'red', 'yellow'].map((color) => (
                                <button
                                  key={color}
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    color === 'blue' ? 'bg-blue-500 border-blue-600' :
                                    color === 'green' ? 'bg-green-500 border-green-600' :
                                    color === 'purple' ? 'bg-purple-500 border-purple-600' :
                                    color === 'red' ? 'bg-red-500 border-red-600' :
                                    'bg-yellow-500 border-yellow-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Compact Mode</p>
                              <p className="text-sm text-gray-500">Reduce spacing and padding for more content</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Show Animations</p>
                              <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking Preferences</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Default Time Entry Duration
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="0.25">15 minutes</option>
                              <option value="0.5">30 minutes</option>
                              <option value="1">1 hour</option>
                              <option value="2">2 hours</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Working Hours
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                                <input
                                  type="time"
                                  defaultValue="09:00"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">End Time</label>
                                <input
                                  type="time"
                                  defaultValue="17:00"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Auto-start Timer</p>
                              <p className="text-sm text-gray-500">Automatically start timer when you begin a task</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Management</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Default Task View
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                              <option value="kanban">Kanban Board</option>
                              <option value="list">List View</option>
                              <option value="calendar">Calendar View</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Auto-save Drafts</p>
                              <p className="text-sm text-gray-500">Automatically save task descriptions as you type</p>
                            </div>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

