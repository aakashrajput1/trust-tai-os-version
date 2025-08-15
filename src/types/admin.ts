// Admin Module TypeScript Types

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  department?: string
  position?: string
  mfa_enabled: boolean
  lastActive: string
  createdAt: string
  updatedAt: string
  avatar?: string
  phone?: string
  location?: string
  managerId?: string
  permissions: Permission[]
  metadata?: Record<string, any>
}

export type UserRole = 
  | 'admin'
  | 'executive'
  | 'project-manager'
  | 'developer'
  | 'support-lead'
  | 'support-agent'
  | 'hr'
  | 'sales'

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export interface Permission {
  id: string
  name: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  scope: 'global' | 'team' | 'personal'
}

export interface CreateUserRequest {
  name: string
  email: string
  role: UserRole
  department?: string
  position?: string
  managerId?: string
  permissions?: string[]
  sendInvitation?: boolean
}

export interface UpdateUserRequest {
  name?: string
  role?: UserRole
  department?: string
  position?: string
  status?: UserStatus
  managerId?: string
  permissions?: string[]
  phone?: string
  location?: string
}

export interface UserFilters {
  search?: string
  role?: UserRole | 'all'
  status?: UserStatus | 'all'
  department?: string
  dateRange?: {
    start: string
    end: string
  }
  mfaEnabled?: boolean
}

export interface UserPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UserListResponse {
  users: User[]
  pagination: UserPagination
  filters: UserFilters
}

// ============================================================================
// ROLE & PERMISSION TYPES
// ============================================================================

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
  userCount: number
  metadata?: Record<string, any>
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissions: string[]
  metadata?: Record<string, any>
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: string[]
  metadata?: Record<string, any>
}

export interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: Permission[]
  category: 'basic' | 'advanced' | 'custom'
}

// ============================================================================
// BILLABLE HOURS TYPES
// ============================================================================

export interface BillableRule {
  id: string
  name: string
  description: string
  role: UserRole
  projectType?: string
  isBillable: boolean
  rate: number
  currency: string
  overtimeRate?: number
  holidayRate?: number
  weekendRate?: number
  effectiveDate: string
  expiryDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBillableRuleRequest {
  name: string
  description: string
  role: UserRole
  projectType?: string
  isBillable: boolean
  rate: number
  currency: string
  overtimeRate?: number
  holidayRate?: number
  weekendRate?: number
  effectiveDate: string
  expiryDate?: string
}

export interface UpdateBillableRuleRequest {
  name?: string
  description?: string
  isBillable?: boolean
  rate?: number
  overtimeRate?: number
  holidayRate?: number
  weekendRate?: number
  isActive?: boolean
  expiryDate?: string
}

export interface BillingRate {
  id: string
  role: UserRole
  baseRate: number
  overtimeRate: number
  holidayRate: number
  weekendRate: number
  currency: string
  effectiveDate: string
  isActive: boolean
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface Integration {
  id: string
  name: string
  type: IntegrationType
  provider: string
  status: IntegrationStatus
  config: IntegrationConfig
  lastSync: string
  syncInterval: number // minutes
  errorCount: number
  lastError?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export type IntegrationType = 
  | 'oauth'
  | 'api_key'
  | 'webhook'
  | 'sso'
  | 'webhook'

export type IntegrationStatus = 
  | 'active'
  | 'inactive'
  | 'error'
  | 'syncing'
  | 'disconnected'

export interface IntegrationConfig {
  clientId?: string
  clientSecret?: string
  apiKey?: string
  webhookUrl?: string
  scopes?: string[]
  redirectUri?: string
  baseUrl?: string
  customHeaders?: Record<string, string>
}

export interface CreateIntegrationRequest {
  name: string
  type: IntegrationType
  provider: string
  config: IntegrationConfig
  syncInterval: number
  isActive: boolean
}

export interface UpdateIntegrationRequest {
  name?: string
  config?: IntegrationConfig
  syncInterval?: number
  isActive?: boolean
}

export interface IntegrationSyncLog {
  id: string
  integrationId: string
  status: 'success' | 'error' | 'partial'
  startedAt: string
  completedAt?: string
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsFailed: number
  errorMessage?: string
}

// ============================================================================
// GOALS & REWARDS TYPES
// ============================================================================

export interface Goal {
  id: string
  name: string
  description: string
  type: GoalType
  target: number
  current: number
  unit: string
  startDate: string
  endDate: string
  status: GoalStatus
  assignedTo: string[] // user IDs
  kpi: string
  reward: Reward
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type GoalType = 
  | 'individual'
  | 'team'
  | 'department'
  | 'company'

export type GoalStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'overdue'
  | 'cancelled'

export interface Reward {
  id: string
  name: string
  description: string
  type: RewardType
  value: number
  currency?: string
  points?: number
  badge?: string
  isAutomatic: boolean
  triggerCondition: string
  maxRewards: number
  currentRewards: number
  isActive: boolean
}

export type RewardType = 
  | 'badge'
  | 'points'
  | 'gift_card'
  | 'bonus'
  | 'recognition'

export interface CreateGoalRequest {
  name: string
  description: string
  type: GoalType
  target: number
  unit: string
  startDate: string
  endDate: string
  assignedTo: string[]
  kpi: string
  rewardId: string
}

export interface UpdateGoalRequest {
  name?: string
  description?: string
  target?: number
  status?: GoalStatus
  assignedTo?: string[]
  endDate?: string
}

export interface CreateRewardRequest {
  name: string
  description: string
  type: RewardType
  value: number
  currency?: string
  points?: number
  badge?: string
  isAutomatic: boolean
  triggerCondition: string
  maxRewards: number
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details: string | Record<string, any>
  ipAddress: string
  userAgent: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: AuditCategory
  metadata?: Record<string, any>
}

export type AuditCategory = 
  | 'user_management'
  | 'role_management'
  | 'system_config'
  | 'data_access'
  | 'security'
  | 'integration'
  | 'billing'
  | 'general'

export interface AuditLogFilters {
  startDate?: string
  endDate?: string
  userId?: string
  action?: string
  resource?: string
  severity?: string
  category?: AuditCategory
  search?: string
}

export interface AuditLogPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AuditLogResponse {
  logs: AuditLog[]
  pagination: AuditLogPagination
  filters: AuditLogFilters
}

// ============================================================================
// SYSTEM HEALTH TYPES
// ============================================================================

export interface SystemHealth {
  overall: HealthStatus
  components: ComponentHealth[]
  metrics: SystemMetrics
  alerts: SystemAlert[]
  lastUpdated: string
}

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown'

export interface ComponentHealth {
  name: string
  status: HealthStatus
  responseTime: number
  uptime: number
  lastCheck: string
  errorMessage?: string
  metadata?: Record<string, any>
}

export interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkLatency: number
  activeConnections: number
  requestRate: number
  errorRate: number
  responseTime: number
}

export interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  component: string
  timestamp: string
  isResolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

export interface ErrorLog {
  id: string
  timestamp: string
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  stack?: string
  component: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

export interface DashboardMetrics {
  activeUsers: number
  totalUsers: number
  apiResponseTime: number
  dbHealth: HealthStatus
  queueBacklog: number
  systemUptime: number
  lastBackup: string
  integrations: {
    total: number
    active: number
    error: number
  }
  goals: {
    total: number
    completed: number
    overdue: number
  }
}

export interface PendingAction {
  id: string
  type: 'user_approval' | 'role_change' | 'integration_expiry' | 'goal_review' | 'system_alert'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  assignedTo?: string
  dueDate?: string
  metadata?: Record<string, any>
}

export interface QuickAction {
  id: string
  name: string
  description: string
  icon: string
  route: string
  permissions: string[]
  isActive: boolean
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: UserPagination | AuditLogPagination
}

export interface BulkOperationResult {
  total: number
  successful: number
  failed: number
  errors: Array<{
    row: number
    field: string
    message: string
  }>
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf'
  filters?: Record<string, any>
  columns?: string[]
  dateRange?: {
    start: string
    end: string
  }
}

// ============================================================================
// REAL-TIME EVENT TYPES
// ============================================================================

export interface RealTimeEvent {
  type: string
  payload: any
  timestamp: string
  userId?: string
  metadata?: Record<string, any>
}

export type EventType = 
  | 'user:role-changed'
  | 'user:status-changed'
  | 'integration:status-update'
  | 'system:alert'
  | 'goal:achieved'
  | 'audit:log-created'
  | 'system:health-update'

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface FilterOption {
  value: string
  label: string
  count?: number
  key?: string
  type?: 'text' | 'select' | 'date' | 'dateRange' | 'multiSelect'
  placeholder?: string
  options?: Array<{
    value: string
    label: string
  }>
}

export interface SearchFilters {
  query: string
  filters: Record<string, any>
  sortBy: string
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

export interface SortOption {
  field: string
  label: string
  defaultOrder: 'asc' | 'desc'
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface AdminNotification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  userId: string
  email: boolean
  push: boolean
  slack: boolean
  types: {
    user_management: boolean
    system_alerts: boolean
    integration_issues: boolean
    goal_updates: boolean
    audit_events: boolean
  }
}
