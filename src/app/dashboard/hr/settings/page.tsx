'use client'

import { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Clock,
  Palette,
  Save,
  Edit,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings as SettingsIcon,
  Building,
  Users,
  Target,
  BarChart3,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

export default function HRSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    role: 'HR Manager',
    department: 'Human Resources',
    location: 'San Francisco, CA',
    joinDate: '2021-06-10',
    avatar: '/api/placeholder/150/150',
    employeeId: 'EMP002',
    manager: 'Mike Chen',
    directReports: 8
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    slaWarnings: true,
    newEmployees: true,
    leaveRequests: true,
    performanceReviews: true,
    recruitmentUpdates: true,
    weeklyReports: false,
    monthlyReports: true
  })

  // Work preferences
  const [workPrefs, setWorkPrefs] = useState({
    timezone: 'America/Los_Angeles',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    autoLogout: 30,
    defaultReviewTemplate: 'Annual Performance Review',
    autoRefresh: 30,
    dashboardLayout: 'standard',
    showSensitiveData: true,
    bulkActions: true
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    ipRestrictions: false,
    allowedIPs: ['192.168.1.0/24', '10.0.0.0/8']
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In real app, save to API
    console.log('Profile saved:', profile)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handleWorkPrefChange = (key: string, value: any) => {
    setWorkPrefs(prev => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: string, value: any) => {
    setSecurity(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'work', name: 'Work Preferences', icon: Clock },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'hr-settings', name: 'HR Settings', icon: Users }
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage your profile and HR system preferences
            </p>
          </div>

          {activeTab === 'profile' && isEditing && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar Section */}
              <div className="lg:w-1/3">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full overflow-hidden mx-auto">
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-gray-600">{profile.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{profile.department}</p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="lg:w-2/3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID
                    </label>
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{profile.employeeId}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager
                    </label>
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{profile.manager}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Direct Reports
                    </label>
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{profile.directReports} employees</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Join Date
                    </label>
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(profile.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Email notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Push notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">SMS notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">HR Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.newEmployees}
                      onChange={(e) => handleNotificationChange('newEmployees', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">New employee onboarding</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.leaveRequests}
                      onChange={(e) => handleNotificationChange('leaveRequests', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Leave request approvals</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.performanceReviews}
                      onChange={(e) => handleNotificationChange('performanceReviews', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Performance review due dates</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.recruitmentUpdates}
                      onChange={(e) => handleNotificationChange('recruitmentUpdates', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Recruitment pipeline updates</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Weekly HR reports</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications.monthlyReports}
                      onChange={(e) => handleNotificationChange('monthlyReports', e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">Monthly HR analytics</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Work Preferences Tab */}
      {activeTab === 'work' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Work Preferences</h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={workPrefs.timezone}
                  onChange={(e) => handleWorkPrefChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Review Template
                </label>
                <select
                  value={workPrefs.defaultReviewTemplate}
                  onChange={(e) => handleWorkPrefChange('defaultReviewTemplate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="Annual Performance Review">Annual Performance Review</option>
                  <option value="Quarterly Check-in">Quarterly Check-in</option>
                  <option value="Probation Review">Probation Review</option>
                  <option value="Promotion Review">Promotion Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours Start
                </label>
                <input
                  type="time"
                  value={workPrefs.workingHours.start}
                  onChange={(e) => handleWorkPrefChange('workingHours', { ...workPrefs.workingHours, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours End
                </label>
                <input
                  type="time"
                  value={workPrefs.workingHours.end}
                  onChange={(e) => handleWorkPrefChange('workingHours', { ...workPrefs.workingHours, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Logout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={workPrefs.autoLogout}
                  onChange={(e) => handleWorkPrefChange('autoLogout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Refresh (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={workPrefs.autoRefresh}
                  onChange={(e) => handleWorkPrefChange('autoRefresh', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dashboard Layout
                </label>
                <select
                  value={workPrefs.dashboardLayout}
                  onChange={(e) => handleWorkPrefChange('dashboardLayout', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={workPrefs.showSensitiveData}
                    onChange={(e) => handleWorkPrefChange('showSensitiveData', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Show sensitive employee data</span>
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={workPrefs.bulkActions}
                    onChange={(e) => handleWorkPrefChange('bulkActions', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">Enable bulk actions for employee management</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Security Settings</h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Password</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Current password"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Change Password
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Add an extra layer of security to your account</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {security.twoFactorEnabled ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                    security.twoFactorEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}>
                    {security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Session Management</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Expiry (days)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={security.passwordExpiry}
                      onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Current Session</p>
                      <p className="text-xs text-gray-500">This device • Active now</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                  </div>

                  <button className="w-full px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm">
                    Sign Out All Other Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Settings Tab */}
      {activeTab === 'hr-settings' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">HR System Settings</h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-3">
                  <button className="flex items-center w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Export Employee Data</div>
                      <div className="text-sm text-gray-500">Download all employee records as CSV</div>
                    </div>
                  </button>

                  <button className="flex items-center w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Import Employee Data</div>
                      <div className="text-sm text-gray-500">Upload employee data from CSV file</div>
                    </div>
                  </button>

                  <button className="flex items-center w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Generate HR Reports</div>
                      <div className="text-sm text-gray-500">Create comprehensive HR analytics reports</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">System Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Leave Policy Management</p>
                      <p className="text-xs text-gray-500">Configure company leave policies and rules</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      Configure
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Performance Review Templates</p>
                      <p className="text-xs text-gray-500">Manage review forms and rating scales</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      Manage
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recruitment Workflow</p>
                      <p className="text-xs text-gray-500">Configure hiring process stages and automation</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Data Cleanup</h3>
                <div className="space-y-3">
                  <button className="flex items-center w-full px-4 py-3 text-left border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                    <Trash2 className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Archive Old Records</div>
                      <div className="text-sm text-red-500">Move old employee records to archive</div>
                    </div>
                  </button>

                  <button className="flex items-center w-full px-4 py-3 text-left border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-orange-600">
                    <Target className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Clean Duplicate Records</div>
                      <div className="text-sm text-orange-500">Identify and merge duplicate employee entries</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
