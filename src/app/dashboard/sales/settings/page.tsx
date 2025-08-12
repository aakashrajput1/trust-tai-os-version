'use client'

import { useState } from 'react'
import { User, Bell, Shield, Clock, Edit, Camera, Mail, Phone, MapPin, Calendar, Users, Target, DollarSign, TrendingUp } from 'lucide-react'

export default function SalesSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    role: 'Senior Sales Representative',
    department: 'Sales',
    location: 'New York, NY',
    joinDate: '2022-03-15',
    salesTerritory: 'Northeast Region',
    quota: 2500000,
    commissionRate: 0.15
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'work', name: 'Work Preferences', icon: Clock },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Manage your profile and sales system preferences
        </p>
      </div>

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
                      ? 'bg-green-100 text-green-700 border border-green-200'
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

      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Territory</label>
                <div className="flex items-center space-x-2 text-sm text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{profile.salesTerritory}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Quota</label>
                <div className="flex items-center space-x-2 text-sm text-gray-900">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span>{formatCurrency(profile.quota)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate</label>
                <div className="flex items-center space-x-2 text-sm text-gray-900">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>{(profile.commissionRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-gray-600">Notification settings will be configured here.</p>
          </div>
        </div>
      )}

      {activeTab === 'work' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Work Preferences</h2>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-gray-600">Work preference settings will be configured here.</p>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Security Settings</h2>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-gray-600">Security settings will be configured here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
