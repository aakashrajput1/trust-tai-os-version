import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface AdminAuthResult {
  isAdmin: boolean
  adminId?: string
  adminData?: any
  error?: string
}

export async function verifyAdminAuth(): Promise<AdminAuthResult> {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if admin session exists in localStorage (this would be set by admin login)
    // For now, we'll use a simple approach - in production you'd want proper session management
    
    // Check if there's an active admin session
    const { data: adminSessions } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .limit(1)
    
    if (adminSessions && adminSessions.length > 0) {
      const session = adminSessions[0]
      
      // Get admin data
      const { data: adminData } = await supabase
        .from('admin')
        .select('id, name, email, role, status')
        .eq('id', session.admin_id)
        .eq('status', 'active')
        .single()
      
      if (adminData) {
        return {
          isAdmin: true,
          adminId: adminData.id,
          adminData
        }
      }
    }
    
    return {
      isAdmin: false,
      error: 'No valid admin session found'
    }
    
  } catch (error) {
    console.error('Admin auth error:', error)
    return {
      isAdmin: false,
      error: 'Authentication failed'
    }
  }
}

export async function requireAdminAuth(): Promise<AdminAuthResult> {
  const authResult = await verifyAdminAuth()
  
  if (!authResult.isAdmin) {
    throw new Error(authResult.error || 'Admin authentication required')
  }
  
  return authResult
}
