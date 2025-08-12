'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Check,
  X,
  Users,
  Settings,
  Target,
  Clock,
  FileText,
  Activity,
  Copy,
  Save
} from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string
  userCount: number
  permissions: Permission[]
  createdAt: string
}

interface Permission {
  id: string
  name: string
  category: string
  description: string
  granted: boolean
}

export default function RolesAndPermissions() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [templateName, setTemplateName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    // Simulate loading roles data
    setTimeout(() => {
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'Admin',
          description: 'Full system access with all permissions',
          userCount: 3,
          permissions: [
            { id: '1', name: 'User Management', category: 'Users', description: 'Create, edit, delete users', granted: true },
            { id: '2', name: 'Role Management', category: 'Roles', description: 'Create, edit, delete roles', granted: true },
            { id: '3', name: 'System Settings', category: 'Settings', description: 'Modify system configuration', granted: true },
            { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View system audit logs', granted: true },
            { id: '5', name: 'Integration Management', category: 'Integrations', description: 'Manage external integrations', granted: true },
            { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'Set and manage KPIs', granted: true },
            { id: '7', name: 'Billable Hours', category: 'Billing', description: 'Configure billing rules', granted: true },
            { id: '8', name: 'System Health', category: 'Health', description: 'Monitor system performance', granted: true }
          ],
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Executive',
          description: 'High-level access with limited write permissions',
          userCount: 5,
          permissions: [
            { id: '1', name: 'User Management', category: 'Users', description: 'View user information', granted: true },
            { id: '2', name: 'Role Management', category: 'Roles', description: 'View role information', granted: true },
            { id: '3', name: 'System Settings', category: 'Settings', description: 'View system configuration', granted: true },
            { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View system audit logs', granted: true },
            { id: '5', name: 'Integration Management', category: 'Integrations', description: 'View integration status', granted: true },
            { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'View KPIs and rewards', granted: true },
            { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View billing information', granted: true },
            { id: '8', name: 'System Health', category: 'Health', description: 'View system performance', granted: true }
          ],
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'Team Lead',
          description: 'Team management with user oversight',
          userCount: 12,
          permissions: [
            { id: '1', name: 'User Management', category: 'Users', description: 'View team members', granted: true },
            { id: '2', name: 'Role Management', category: 'Roles', description: 'View role information', granted: false },
            { id: '3', name: 'System Settings', category: 'Settings', description: 'View system configuration', granted: false },
            { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View team activity logs', granted: true },
            { id: '5', name: 'Integration Management', category: 'Integrations', description: 'View integration status', granted: false },
            { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'Set team goals', granted: true },
            { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View team billing', granted: true },
            { id: '8', name: 'System Health', category: 'Health', description: 'View system performance', granted: false }
          ],
          createdAt: '2024-01-01'
        },
        {
          id: '4',
          name: 'Project Manager',
          description: 'Project oversight and team coordination',
          userCount: 8,
          permissions: [
            { id: '1', name: 'User Management', category: 'Users', description: 'View project team', granted: true },
            { id: '2', name: 'Role Management', category: 'Roles', description: 'View role information', granted: false },
            { id: '3', name: 'System Settings', category: 'Settings', description: 'View system configuration', granted: false },
            { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View project logs', granted: true },
            { id: '5', name: 'Integration Management', category: 'Integrations', description: 'View integration status', granted: false },
            { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'Set project goals', granted: true },
            { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View project billing', granted: true },
            { id: '8', name: 'System Health', category: 'Health', description: 'View system performance', granted: false }
          ],
          createdAt: '2024-01-01'
        },
        {
          id: '5',
          name: 'Developer',
          description: 'Standard user with basic access',
          userCount: 45,
          permissions: [
            { id: '1', name: 'User Management', category: 'Users', description: 'View own profile', granted: true },
            { id: '2', name: 'Role Management', category: 'Roles', description: 'View own role', granted: true },
            { id: '3', name: 'System Settings', category: 'Settings', description: 'View basic settings', granted: false },
            { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View own activity', granted: true },
            { id: '5', name: 'Integration Management', category: 'Integrations', description: 'Use integrations', granted: true },
            { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'View assigned goals', granted: true },
            { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View own billing', granted: true },
            { id: '8', name: 'System Health', category: 'Health', description: 'View basic status', granted: false }
          ],
          createdAt: '2024-01-01'
        }
      ]
      setRoles(mockRoles)
      setLoading(false)
    }, 1000)
  }, [])

  const getPermissionIcon = (category: string) => {
    switch (category) {
      case 'Users': return <Users className="h-4 w-4" />
      case 'Roles': return <Shield className="h-4 w-4" />
      case 'Settings': return <Settings className="h-4 w-4" />
      case 'Logs': return <FileText className="h-4 w-4" />
      case 'Integrations': return <Settings className="h-4 w-4" />
      case 'Goals': return <Target className="h-4 w-4" />
      case 'Billing': return <Clock className="h-4 w-4" />
      case 'Health': return <Activity className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const exportRoleMatrix = () => {
    // Simulate CSV export
    const csvContent = roles.map(role => {
      const permissionRow = role.permissions.map(p => p.granted ? 'Yes' : 'No').join(',')
      return `${role.name},${role.description},${role.userCount},${permissionRow}`
    }).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'role-permission-matrix.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Permission templates for faster role setup
  const permissionTemplates = {
    'developer': {
      name: 'Developer',
      description: 'Standard developer permissions',
      permissions: [
        { id: '1', name: 'User Management', category: 'Users', description: 'View team members', granted: false },
        { id: '2', name: 'Role Management', category: 'Roles', description: 'View role information', granted: false },
        { id: '3', name: 'System Settings', category: 'Settings', description: 'View system configuration', granted: false },
        { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View own activity logs', granted: true },
        { id: '5', name: 'Integration Management', category: 'Integrations', description: 'View integration status', granted: false },
        { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'View own goals', granted: true },
        { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View own billing', granted: true },
        { id: '8', name: 'System Health', category: 'Health', description: 'View system performance', granted: false }
      ]
    },
    'project_manager': {
      name: 'Project Manager',
      description: 'Project management permissions',
      permissions: [
        { id: '1', name: 'User Management', category: 'Users', description: 'View team members', granted: true },
        { id: '2', name: 'Role Management', category: 'Roles', description: 'View role information', granted: false },
        { id: '3', name: 'System Settings', category: 'Settings', description: 'View system configuration', granted: false },
        { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View team activity logs', granted: true },
        { id: '5', name: 'Integration Management', category: 'Integrations', description: 'View integration status', granted: true },
        { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'Set team goals', granted: true },
        { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View team billing', granted: true },
        { id: '8', name: 'System Health', category: 'Health', description: 'View system performance', granted: false }
      ]
    },
    'analyst': {
      name: 'Business Analyst',
      description: 'Data analysis and reporting permissions',
      permissions: [
        { id: '1', name: 'User Management', category: 'Users', description: 'View user information', granted: false },
        { id: '2', name: 'Role Management', category: 'Roles', description: 'View role information', granted: false },
        { id: '3', name: 'System Settings', category: 'Settings', description: 'View system configuration', granted: false },
        { id: '4', name: 'Audit Logs', category: 'Logs', description: 'View all activity logs', granted: true },
        { id: '5', name: 'Integration Management', category: 'Integrations', description: 'View integration status', granted: false },
        { id: '6', name: 'Goals & Rewards', category: 'Goals', description: 'View KPIs and rewards', granted: true },
        { id: '7', name: 'Billable Hours', category: 'Billing', description: 'View billing reports', granted: true },
        { id: '8', name: 'System Health', category: 'Health', description: 'View system performance', granted: true }
      ]
    }
  }

  const saveAsTemplate = () => {
    if (!selectedRole || !templateName.trim()) return
    
    const template = {
      name: templateName,
      description: selectedRole.description,
      permissions: selectedRole.permissions
    }
    
    // In a real app, save to database
    localStorage.setItem(`permission_template_${templateName}`, JSON.stringify(template))
    alert(`Template "${templateName}" saved successfully!`)
    setTemplateName('')
    setShowTemplateModal(false)
  }

  const applyTemplate = (templateKey: string) => {
    const template = permissionTemplates[templateKey as keyof typeof permissionTemplates]
    if (!template) return
    
    // Create a new role based on the template
    const newRole: Role = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      userCount: 0,
      permissions: template.permissions,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    setRoles(prev => [...prev, newRole])
    setSelectedTemplate('')
    alert(`Template "${template.name}" applied successfully!`)
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-2 text-gray-600">
            Manage user roles and define access permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span>Templates</span>
          </button>
          <button
            onClick={exportRoleMatrix}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Matrix</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedRole(role)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-gray-500">{role.userCount} users</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{role.name}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">{role.description}</p>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Permission Matrix</h2>
          <p className="text-sm text-gray-600">
            Overview of permissions granted to each role
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission
                </th>
                {roles.map((role) => (
                  <th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles[0]?.permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getPermissionIcon(permission.category)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                        <div className="text-xs text-gray-500">{permission.description}</div>
                      </div>
                    </div>
                  </td>
                  {roles.map((role) => {
                    const rolePermission = role.permissions.find(p => p.id === permission.id)
                    return (
                      <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                        {rolePermission?.granted ? (
                          <div className="inline-flex items-center justify-center h-6 w-6 bg-green-100 rounded-full">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center h-6 w-6 bg-red-100 rounded-full">
                            <X className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedRole(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedRole.name} Role</h3>
                  <button
                    onClick={() => setSelectedRole(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{selectedRole.userCount} users</span>
                    <span>Created {selectedRole.createdAt}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Permissions</h4>
                  {selectedRole.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center">
                          {getPermissionIcon(permission.category)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                          <div className="text-xs text-gray-500">{permission.description}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        permission.granted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {permission.granted ? 'Granted' : 'Denied'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit Role
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedRole(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permission Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTemplateModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Permission Templates</h3>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Templates */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Available Templates</h4>
                    <div className="space-y-3">
                      {Object.entries(permissionTemplates).map(([key, template]) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{template.name}</h5>
                            <button
                              onClick={() => applyTemplate(key)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Apply
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="text-xs text-gray-500">
                            {template.permissions.filter(p => p.granted).length} permissions granted
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Current Role as Template */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Save Current Role as Template</h4>
                    {selectedRole ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template Name
                          </label>
                          <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={saveAsTemplate}
                          disabled={!templateName.trim()}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save Template</span>
                        </button>
                        <div className="text-xs text-gray-500">
                          Current role: {selectedRole.name}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Select a role first to save it as a template
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
