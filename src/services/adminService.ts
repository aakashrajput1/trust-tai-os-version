import {
  User,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  BillableRule,
  CreateBillableRuleRequest,
  UpdateBillableRuleRequest,
  Integration,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  Goal,
  CreateGoalRequest,
  UpdateGoalRequest,
  Reward,
  CreateRewardRequest,
  AuditLog,
  AuditLogResponse,
  AuditLogFilters,
  SystemHealth,
  DashboardMetrics,
  PendingAction,
  ApiResponse,
  BulkOperationResult,
  ExportOptions
} from '@/types/admin'

// ============================================================================
// BASE API CONFIGURATION
// ============================================================================

const API_BASE = '/api/admin'

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

const getAuthHeaders = () => {
  // Get admin data from localStorage
  const adminData = localStorage.getItem('adminData')
  if (!adminData) {
    throw new Error('Admin not authenticated')
  }
  
  const admin = JSON.parse(adminData)
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${admin.token || 'admin-session'}`,
  }
}

// ============================================================================
// DASHBOARD APIs
// ============================================================================

export const adminService = {
  // Dashboard
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<DashboardMetrics>(response)
    return result.data!
  },

  async getPendingActions(): Promise<PendingAction[]> {
    const response = await fetch(`${API_BASE}/dashboard/pending-actions`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<PendingAction[]>(response)
    return result.data!
  },

  // ============================================================================
  // USER MANAGEMENT APIs
  // ============================================================================

  async getUsers(filters: UserFilters = {}, page: number = 1, limit: number = 20): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.role && { role: filters.role }),
      ...(filters.status && { status: filters.status }),
      ...(filters.department && { department: filters.department }),
      ...(filters.mfaEnabled !== undefined && { mfaEnabled: filters.mfaEnabled.toString() }),
      ...(filters.dateRange && { 
        dateStart: filters.dateRange.start,
        dateEnd: filters.dateRange.end 
      })
    })
    
    const response = await fetch(`${API_BASE}/users?${params}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<UserListResponse>(response)
    return result.data!
  },

  async getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<User>(response)
    return result.data!
  },

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    const result = await handleResponse<User>(response)
    return result.data!
  },

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    })
    const result = await handleResponse<User>(response)
    return result.data!
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    await handleResponse<void>(response)
  },

  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    })
    const result = await handleResponse<User>(response)
    return result.data!
  },

  async updateUserStatus(id: string, status: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    })
    const result = await handleResponse<User>(response)
    return result.data!
  },

  async toggleUserMFA(id: string): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}/mfa`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<User>(response)
    return result.data!
  },

  async bulkImportUsers(file: File): Promise<BulkOperationResult> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE}/users/bulk-import`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeaders().Authorization,
      },
      body: formData,
    })
    const result = await handleResponse<BulkOperationResult>(response)
    return result.data!
  },

  async exportUsers(options: ExportOptions): Promise<Blob> {
    const response = await fetch(`${API_BASE}/users/export`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options),
    })
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }
    
    return response.blob()
  },

  // ============================================================================
  // ROLE & PERMISSION APIs
  // ============================================================================

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE}/roles`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Role[]>(response)
    return result.data!
  },

  async getRoleById(id: string): Promise<Role> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Role>(response)
    return result.data!
  },

  async createRole(roleData: CreateRoleRequest): Promise<Role> {
    const response = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    })
    const result = await handleResponse<Role>(response)
    return result.data!
  },

  async updateRole(id: string, roleData: UpdateRoleRequest): Promise<Role> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    })
    const result = await handleResponse<Role>(response)
    return result.data!
  },

  async deleteRole(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/roles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    await handleResponse<void>(response)
  },

  async exportRoles(): Promise<Blob> {
    const response = await fetch(`${API_BASE}/roles/export`, {
      headers: getAuthHeaders(),
    })
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }
    
    return response.blob()
  },

  // ============================================================================
  // BILLABLE HOURS APIs
  // ============================================================================

  async getBillableRules(): Promise<BillableRule[]> {
    const response = await fetch(`${API_BASE}/billable-settings`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<BillableRule[]>(response)
    return result.data!
  },

  async getBillableRuleById(id: string): Promise<BillableRule> {
    const response = await fetch(`${API_BASE}/billable-settings/${id}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<BillableRule>(response)
    return result.data!
  },

  async createBillableRule(ruleData: CreateBillableRuleRequest): Promise<BillableRule> {
    const response = await fetch(`${API_BASE}/billable-settings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ruleData),
    })
    const result = await handleResponse<BillableRule>(response)
    return result.data!
  },

  async updateBillableRule(id: string, ruleData: UpdateBillableRuleRequest): Promise<BillableRule> {
    const response = await fetch(`${API_BASE}/billable-settings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(ruleData),
    })
    const result = await handleResponse<BillableRule>(response)
    return result.data!
  },

  async deleteBillableRule(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/billable-settings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    await handleResponse<void>(response)
  },

  // ============================================================================
  // INTEGRATION APIs
  // ============================================================================

  async getIntegrations(): Promise<Integration[]> {
    const response = await fetch(`${API_BASE}/integrations`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Integration[]>(response)
    return result.data!
  },

  async getIntegrationById(id: string): Promise<Integration> {
    const response = await fetch(`${API_BASE}/integrations/${id}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Integration>(response)
    return result.data!
  },

  async createIntegration(integrationData: CreateIntegrationRequest): Promise<Integration> {
    const response = await fetch(`${API_BASE}/integrations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(integrationData),
    })
    const result = await handleResponse<Integration>(response)
    return result.data!
  },

  async updateIntegration(id: string, integrationData: UpdateIntegrationRequest): Promise<Integration> {
    const response = await fetch(`${API_BASE}/integrations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(integrationData),
    })
    const result = await handleResponse<Integration>(response)
    return result.data!
  },

  async deleteIntegration(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/integrations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    await handleResponse<void>(response)
  },

  async testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/integrations/${id}/test`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<{ success: boolean; message: string }>(response)
    return result.data!
  },

  async syncIntegration(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/integrations/${id}/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<{ success: boolean; message: string }>(response)
    return result.data!
  },

  // ============================================================================
  // GOALS & REWARDS APIs
  // ============================================================================

  async getGoals(): Promise<Goal[]> {
    const response = await fetch(`${API_BASE}/goals`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Goal[]>(response)
    return result.data!
  },

  async getGoalById(id: string): Promise<Goal> {
    const response = await fetch(`${API_BASE}/goals/${id}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Goal>(response)
    return result.data!
  },

  async createGoal(goalData: CreateGoalRequest): Promise<Goal> {
    const response = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData),
    })
    const result = await handleResponse<Goal>(response)
    return result.data!
  },

  async updateGoal(id: string, goalData: UpdateGoalRequest): Promise<Goal> {
    const response = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData),
    })
    const result = await handleResponse<Goal>(response)
    return result.data!
  },

  async deleteGoal(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/goals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    await handleResponse<void>(response)
  },

  async getRewards(): Promise<Reward[]> {
    const response = await fetch(`${API_BASE}/rewards`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<Reward[]>(response)
    return result.data!
  },

  async createReward(rewardData: CreateRewardRequest): Promise<Reward> {
    const response = await fetch(`${API_BASE}/rewards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(rewardData),
    })
    const result = await handleResponse<Reward>(response)
    return result.data!
  },

  // ============================================================================
  // AUDIT LOG APIs
  // ============================================================================

  async getAuditLogs(filters: AuditLogFilters = {}, page: number = 1, limit: number = 50): Promise<AuditLogResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })
    
    const response = await fetch(`${API_BASE}/audit-logs?${params}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<AuditLogResponse>(response)
    return result.data!
  },

  async exportAuditLogs(options: ExportOptions): Promise<Blob> {
    const response = await fetch(`${API_BASE}/audit-logs/export`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options),
    })
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }
    
    return response.blob()
  },

  // ============================================================================
  // SYSTEM HEALTH APIs
  // ============================================================================

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${API_BASE}/system-health`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<SystemHealth>(response)
    return result.data!
  },

  async getErrorLogs(page: number = 1, limit: number = 100): Promise<{ logs: any[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    const response = await fetch(`${API_BASE}/error-logs?${params}`, {
      headers: getAuthHeaders(),
    })
    const result = await handleResponse<{ logs: any[]; pagination: any }>(response)
    return result.data!
  },

  async exportSystemHealthReport(): Promise<Blob> {
    const response = await fetch(`${API_BASE}/system-health/export`, {
      headers: getAuthHeaders(),
    })
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }
    
    return response.blob()
  },

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  async downloadFile(url: string, filename: string): Promise<void> {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  },

  // ============================================================================
  // REAL-TIME EVENTS (WebSocket/SSE)
  // ============================================================================

  subscribeToEvents(callback: (event: any) => void): () => void {
    // Implementation for real-time events
    // This would typically use WebSocket or Server-Sent Events
    const eventSource = new EventSource(`${API_BASE}/events`)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        callback(data)
      } catch (error) {
        console.error('Error parsing event data:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
    }
    
    // Return unsubscribe function
    return () => {
      eventSource.close()
    }
  }
}

export default adminService
