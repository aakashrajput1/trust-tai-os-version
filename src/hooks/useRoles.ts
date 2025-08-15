import { useState, useEffect } from 'react'

export interface Role {
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

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/roles')
      const data = await response.json()

      if (data.success) {
        setRoles(data.roles)
      } else {
        setError(data.error || 'Failed to fetch roles')
      }
    } catch (err) {
      setError('Failed to fetch roles')
      console.error('Error fetching roles:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRole = async (roleData: Partial<Role>) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh roles list
        await fetchRoles()
        return { success: true, role: data.role }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.error('Error creating role:', err)
      return { success: false, error: 'Failed to create role' }
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  return {
    roles,
    loading,
    error,
    fetchRoles,
    createRole,
  }
}
