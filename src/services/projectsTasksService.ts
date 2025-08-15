// Projects & Tasks API Service Layer
// Handles all API calls for project templates, task categories, priority levels, custom fields, and workflows

const API_BASE = '/api/admin'

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  estimated_duration: number
  default_team_structure: any
  custom_fields_schema: any[]
  workflow_id?: string
  created_by: string
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
  phases?: ProjectTemplatePhase[]
  workflow?: any
  created_by_user?: any
}

export interface ProjectTemplatePhase {
  id: string
  template_id: string
  name: string
  description: string
  duration: number
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TaskCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  parent_category_id?: string
  default_priority: string
  billable: boolean
  requires_approval: boolean
  auto_assign_rules: any
  time_tracking_rules: any
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
  parent_category?: TaskCategory
  child_categories?: number
}

export interface PriorityLevel {
  id: string
  name: string
  description: string
  level: number
  color: string
  icon: string
  badge_style: string
  sla_hours: number
  auto_escalation: any
  notification_rules: any
  workflow_rules: any
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CustomField {
  id: string
  name: string
  description: string
  field_key: string
  entity_type: string
  field_type: string
  validation_rules: any
  display_settings: any
  conditional_logic: any
  help_text: string
  category: string
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  entity_type: string
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
  states?: WorkflowState[]
  transitions?: WorkflowTransition[]
  created_by_user?: any
}

export interface WorkflowState {
  id: string
  workflow_id: string
  name: string
  description: string
  type: string
  color: string
  icon: string
  order_index: number
  permissions: any
  automation_rules: any
  validation_rules: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WorkflowTransition {
  id: string
  workflow_id: string
  name: string
  from_state: string
  to_state: string
  conditions: any[]
  actions: any[]
  ui_settings: any
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  category?: string
  entity_type?: string
  parent_id?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ProjectsTasksService {
  // Project Templates
  async getProjectTemplates(params: PaginationParams = {}): Promise<PaginatedResponse<ProjectTemplate>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await fetch(`${API_BASE}/project-templates?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch project templates')
    
    const data = await response.json()
    return {
      data: data.templates || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  }

  async getProjectTemplate(id: string): Promise<ProjectTemplate> {
    const response = await fetch(`${API_BASE}/project-templates/${id}`)
    if (!response.ok) throw new Error('Failed to fetch project template')
    
    const data = await response.json()
    return data.template
  }

  async createProjectTemplate(template: Partial<ProjectTemplate>): Promise<ProjectTemplate> {
    const response = await fetch(`${API_BASE}/project-templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    })
    if (!response.ok) throw new Error('Failed to create project template')
    
    const data = await response.json()
    return data.template
  }

  async updateProjectTemplate(id: string, template: Partial<ProjectTemplate>): Promise<ProjectTemplate> {
    const response = await fetch(`${API_BASE}/project-templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    })
    if (!response.ok) throw new Error('Failed to update project template')
    
    const data = await response.json()
    return data.template
  }

  async deleteProjectTemplate(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/project-templates/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete project template')
  }

  async cloneProjectTemplate(id: string, newName: string, modifications?: any): Promise<ProjectTemplate> {
    const response = await fetch(`${API_BASE}/project-templates/${id}/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_name: newName, modifications })
    })
    if (!response.ok) throw new Error('Failed to clone project template')
    
    const data = await response.json()
    return data.template
  }

  // Task Categories
  async getTaskCategories(params: PaginationParams = {}): Promise<PaginatedResponse<TaskCategory>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await fetch(`${API_BASE}/task-categories?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch task categories')
    
    const data = await response.json()
    return {
      data: data.categories || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  }

  async createTaskCategory(category: Partial<TaskCategory>): Promise<TaskCategory> {
    const response = await fetch(`${API_BASE}/task-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
    if (!response.ok) throw new Error('Failed to create task category')
    
    const data = await response.json()
    return data.category
  }

  async updateTaskCategory(id: string, category: Partial<TaskCategory>): Promise<TaskCategory> {
    const response = await fetch(`${API_BASE}/task-categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
    if (!response.ok) throw new Error('Failed to update task category')
    
    const data = await response.json()
    return data.category
  }

  async deleteTaskCategory(id: string, moveTasksToCategory?: string): Promise<void> {
    const searchParams = new URLSearchParams()
    if (moveTasksToCategory) searchParams.append('move_tasks_to_category', moveTasksToCategory)

    const response = await fetch(`${API_BASE}/task-categories/${id}?${searchParams}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete task category')
  }

  // Priority Levels
  async getPriorityLevels(params: PaginationParams = {}): Promise<PaginatedResponse<PriorityLevel>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await fetch(`${API_BASE}/priority-levels?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch priority levels')
    
    const data = await response.json()
    return {
      data: data.priorities || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  }

  async createPriorityLevel(priority: Partial<PriorityLevel>): Promise<PriorityLevel> {
    const response = await fetch(`${API_BASE}/priority-levels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priority)
    })
    if (!response.ok) throw new Error('Failed to create priority level')
    
    const data = await response.json()
    return data.priority
  }

  async updatePriorityLevel(id: string, priority: Partial<PriorityLevel>): Promise<PriorityLevel> {
    const response = await fetch(`${API_BASE}/priority-levels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(priority)
    })
    if (!response.ok) throw new Error('Failed to update priority level')
    
    const data = await response.json()
    return data.priority
  }

  async deletePriorityLevel(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/priority-levels/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete priority level')
  }

  async reorderPriorityLevels(priorityOrder: Array<{ id: string; level: number }>): Promise<void> {
    const response = await fetch(`${API_BASE}/priority-levels/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority_order: priorityOrder })
    })
    if (!response.ok) throw new Error('Failed to reorder priority levels')
  }

  // Custom Fields
  async getCustomFields(params: PaginationParams = {}): Promise<PaginatedResponse<CustomField>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await fetch(`${API_BASE}/custom-fields?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch custom fields')
    
    const data = await response.json()
    return {
      data: data.fields || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  }

  async createCustomField(field: Partial<CustomField>): Promise<CustomField> {
    const response = await fetch(`${API_BASE}/custom-fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(field)
    })
    if (!response.ok) throw new Error('Failed to create custom field')
    
    const data = await response.json()
    return data.field
  }

  async updateCustomField(id: string, field: Partial<CustomField>): Promise<CustomField> {
    const response = await fetch(`${API_BASE}/custom-fields/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(field)
    })
    if (!response.ok) throw new Error('Failed to update custom field')
    
    const data = await response.json()
    return data.field
  }

  async deleteCustomField(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/custom-fields/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete custom field')
  }

  async getCustomFieldTypes(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/custom-fields/types`)
    if (!response.ok) throw new Error('Failed to fetch custom field types')
    
    const data = await response.json()
    return data.types || []
  }

  // Workflows
  async getWorkflows(params: PaginationParams = {}): Promise<PaginatedResponse<Workflow>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString())
    })

    const response = await fetch(`${API_BASE}/workflows?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch workflows')
    
    const data = await response.json()
    return {
      data: data.workflows || [],
      pagination: data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  }

  async getWorkflow(id: string): Promise<Workflow> {
    const response = await fetch(`${API_BASE}/workflows/${id}`)
    if (!response.ok) throw new Error('Failed to fetch workflow')
    
    const data = await response.json()
    return data.workflow
  }

  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await fetch(`${API_BASE}/workflows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    })
    if (!response.ok) throw new Error('Failed to create workflow')
    
    const data = await response.json()
    return data.workflow
  }

  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await fetch(`${API_BASE}/workflows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workflow)
    })
    if (!response.ok) throw new Error('Failed to update workflow')
    
    const data = await response.json()
    return data.workflow
  }

  async deleteWorkflow(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/workflows/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete workflow')
  }

  // Workflow States
  async getWorkflowStates(workflowId: string): Promise<WorkflowState[]> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/states`)
    if (!response.ok) throw new Error('Failed to fetch workflow states')
    
    const data = await response.json()
    return data.states || []
  }

  async createWorkflowState(workflowId: string, state: Partial<WorkflowState>): Promise<WorkflowState> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/states`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    })
    if (!response.ok) throw new Error('Failed to create workflow state')
    
    const data = await response.json()
    return data.state
  }

  async updateWorkflowState(workflowId: string, stateId: string, state: Partial<WorkflowState>): Promise<WorkflowState> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/states/${stateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    })
    if (!response.ok) throw new Error('Failed to update workflow state')
    
    const data = await response.json()
    return data.state
  }

  async deleteWorkflowState(workflowId: string, stateId: string, moveTasksToState?: string): Promise<void> {
    const searchParams = new URLSearchParams()
    if (moveTasksToState) searchParams.append('move_tasks_to_state', moveTasksToState)

    const response = await fetch(`${API_BASE}/workflows/${workflowId}/states/${stateId}?${searchParams}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete workflow state')
  }

  async updateWorkflowStateOrder(workflowId: string, stateOrder: Array<{ state_id: string; order: number }>): Promise<void> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/states/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state_order: stateOrder })
    })
    if (!response.ok) throw new Error('Failed to update workflow state order')
  }

  // Workflow Transitions
  async getWorkflowTransitions(workflowId: string): Promise<WorkflowTransition[]> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/transitions`)
    if (!response.ok) throw new Error('Failed to fetch workflow transitions')
    
    const data = await response.json()
    return data.transitions || []
  }

  async createWorkflowTransition(workflowId: string, transition: Partial<WorkflowTransition>): Promise<WorkflowTransition> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/transitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transition)
    })
    if (!response.ok) throw new Error('Failed to create workflow transition')
    
    const data = await response.json()
    return data.transition
  }

  async updateWorkflowTransition(workflowId: string, transitionId: string, transition: Partial<WorkflowTransition>): Promise<WorkflowTransition> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/transitions/${transitionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transition)
    })
    if (!response.ok) throw new Error('Failed to update workflow transition')
    
    const data = await response.json()
    return data.transition
  }

  async deleteWorkflowTransition(workflowId: string, transitionId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/transitions/${transitionId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete workflow transition')
  }

  // Testing and Validation
  async testWorkflowTransition(workflowId: string, fromState: string, toState: string, userRole: string, testData: any): Promise<any> {
    const response = await fetch(`${API_BASE}/workflows/${workflowId}/test-transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_state: fromState,
        to_state: toState,
        user_role: userRole,
        test_data: testData
      })
    })
    if (!response.ok) throw new Error('Failed to test workflow transition')
    
    return await response.json()
  }

  async validateTemplate(templateData: any): Promise<any> {
    const response = await fetch(`${API_BASE}/project-templates/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_data: templateData })
    })
    if (!response.ok) throw new Error('Failed to validate template')
    
    return await response.json()
  }

  async validateWorkflow(workflowData: any): Promise<any> {
    const response = await fetch(`${API_BASE}/workflows/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_data: workflowData })
    })
    if (!response.ok) throw new Error('Failed to validate workflow')
    
    return await response.json()
  }

  async testCustomField(fieldDefinition: any, testValues: any[]): Promise<any> {
    const response = await fetch(`${API_BASE}/custom-fields/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        field_definition: fieldDefinition,
        test_values: testValues
      })
    })
    if (!response.ok) throw new Error('Failed to test custom field')
    
    return await response.json()
  }
}

export default new ProjectsTasksService()


