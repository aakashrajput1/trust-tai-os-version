'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Users, 
  Shield,
  MoreHorizontal,
  Eye,
  Copy,
  Save,
  X
} from 'lucide-react'
import { useRoles } from '@/hooks/useRoles'

interface Role {
  id: string
  name: string
  display_name: string
  description?: string
  icon_name?: string
  color_scheme?: string
  permissions?: any
  is_active: boolean
  is_system_role: boolean
  sort_order: number
  created_at: string
  updated_at: string
  userCount?: number
}

interface RoleFormData {
  name: string
  display_name: string
  description: string
  icon_name: string
  color_scheme: string
  permissions: string[]
  is_active: boolean
  sort_order: number
}

const iconOptions = [
  { value: 'Users', label: 'Users' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Code', label: 'Code' },
  { value: 'Headphones', label: 'Headphones' },
  { value: 'HelpCircle', label: 'Help Circle' },
  { value: 'UserCheck', label: 'User Check' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Crown', label: 'Crown' },
  { value: 'Settings', label: 'Settings' },
  { value: 'BarChart3', label: 'Bar Chart' },
  { value: 'Calendar', label: 'Calendar' },
  { value: 'FileText', label: 'File Text' },
  { value: 'MessageSquare', label: 'Message Square' },
  { value: 'Clock', label: 'Clock' },
  { value: 'Award', label: 'Award' }
]

const colorSchemes = [
  { value: 'from-blue-500 to-blue-600', label: 'Blue' },
  { value: 'from-green-500 to-green-600', label: 'Green' },
  { value: 'from-purple-500 to-purple-600', label: 'Purple' },
  { value: 'from-red-500 to-red-600', label: 'Red' },
  { value: 'from-yellow-500 to-yellow-600', label: 'Yellow' },
  { value: 'from-indigo-500 to-indigo-600', label: 'Indigo' },
  { value: 'from-pink-500 to-pink-600', label: 'Pink' },
  { value: 'from-gray-500 to-gray-600', label: 'Gray' },
  { value: 'from-orange-500 to-orange-600', label: 'Orange' },
  { value: 'from-teal-500 to-teal-600', label: 'Teal' }
]

const permissionOptions = [
  { value: 'dashboard:read', label: 'View Dashboard' },
  { value: 'users:read', label: 'View Users' },
  { value: 'users:write', label: 'Manage Users' },
  { value: 'roles:read', label: 'View Roles' },
  { value: 'roles:write', label: 'Manage Roles' },
  { value: 'projects:read', label: 'View Projects' },
  { value: 'projects:write', label: 'Manage Projects' },
  { value: 'reports:read', label: 'View Reports' },
  { value: 'reports:write', label: 'Generate Reports' },
  { value: 'settings:read', label: 'View Settings' },
  { value: 'settings:write', label: 'Manage Settings' },
  { value: 'billing:read', label: 'View Billing' },
  { value: 'billing:write', label: 'Manage Billing' }
]

export default function AdminRolesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddRole, setShowAddRole] = useState(false)
  const [showEditRole, setShowEditRole] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [exporting, setExporting] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const { roles, loading, error, fetchRoles, createRole } = useRoles()

  // Form state
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    display_name: '',
    description: '',
    icon_name: 'Users',
    color_scheme: 'from-blue-500 to-blue-600',
    permissions: [] as string[],
    is_active: true,
    sort_order: 0
  })

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      icon_name: role.icon_name || 'Users',
      color_scheme: role.color_scheme || 'from-blue-500 to-blue-600',
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
      is_active: role.is_active,
      sort_order: role.sort_order
    })
    setShowEditRole(true)
  }

  const handleAddRole = () => {
    setFormData({
      name: '',
      display_name: '',
      description: '',
      icon_name: 'Users',
      color_scheme: 'from-blue-500 to-blue-600',
      permissions: [] as string[],
      is_active: true,
      sort_order: 0
    })
    setShowAddRole(true)
  }

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await fetch(`/api/roles/${roleId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchRoles() // Refresh the roles list
          alert('Role deleted successfully!')
        } else {
          alert('Failed to delete role')
        }
      } catch (error) {
        console.error('Error deleting role:', error)
        alert('Error deleting role')
      }
    }
  }

  const handleCreateRole = async () => {
    if (!formData.name || !formData.display_name) {
      alert('Please fill in all required fields')
      return
    }

    setCreating(true)
    try {
      const response = await createRole(formData)
      if (response) {
        setShowAddRole(false)
        await fetchRoles() // Refresh the roles list
        alert('Role created successfully!')
      }
    } catch (error) {
      console.error('Error creating role:', error)
      alert('Error creating role')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedRole || !formData.name || !formData.display_name) {
      alert('Please fill in all required fields')
      return
    }

    setUpdating(true)
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowEditRole(false)
        setSelectedRole(null)
        await fetchRoles() // Refresh the roles list
        alert('Role updated successfully!')
      } else {
        alert('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Error updating role')
    } finally {
      setUpdating(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)
    try {
      // TODO: Implement export functionality
      console.log('Exporting roles in', format, 'format')
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setExporting(false)
    }
  }

  const getStatusColor = (role: Role) => {
    if (role.is_system_role) return 'text-blue-600 bg-blue-100'
    return 'text-green-600 bg-green-100'
  }

  const getStatusText = (role: Role) => {
    if (role.is_system_role) return 'System Role'
    return 'Custom Role'
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...(Array.isArray(prev.permissions) ? prev.permissions : []), permission]
        : (Array.isArray(prev.permissions) ? prev.permissions : []).filter(p => p !== permission)
    }))
  }

  const getPermissionsArray = () => {
    return Array.isArray(formData.permissions) ? formData.permissions : []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Roles</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRoles}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="mt-2 text-gray-600">
          Manage user roles and their associated permissions
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {/* Export */}
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>

          {/* Add Role */}
          <button
            onClick={handleAddRole}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </button>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${role.color_scheme || 'from-gray-500 to-gray-600'} flex items-center justify-center mr-3`}>
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {role.display_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {role.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {role.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role)}`}>
                      {getStatusText(role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {role.userCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(role.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit role"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="View permissions"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {!role.is_system_role && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new role.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleAddRole}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Role</h3>
                <button
                  onClick={() => setShowAddRole(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., developer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="e.g., Developer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter role description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Icon and Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Scheme
                    </label>
                    <select
                      value={formData.color_scheme}
                      onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {colorSchemes.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {permissionOptions.map(permission => (
                      <label key={permission.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.value)}
                          onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status and Sort Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowAddRole(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  disabled={creating || !formData.name || !formData.display_name}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRole && selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Role: {selectedRole.display_name}</h3>
                <button
                  onClick={() => setShowEditRole(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., developer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="e.g., Developer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter role description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Icon and Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Scheme
                    </label>
                    <select
                      value={formData.color_scheme}
                      onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {colorSchemes.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {permissionOptions.map(permission => (
                      <label key={permission.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.value)}
                          onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status and Sort Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowEditRole(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  disabled={updating || !formData.name || !formData.display_name}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
