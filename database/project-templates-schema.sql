-- Project Templates Schema
-- This file contains all the database tables needed for the Projects & Tasks module

-- Project Templates Table
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    estimated_duration INTEGER DEFAULT 0, -- in hours
    default_team_structure JSONB DEFAULT '{}',
    custom_fields_schema JSONB DEFAULT '[]',
    workflow_id UUID REFERENCES workflows(id),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Template Phases Table
CREATE TABLE IF NOT EXISTS project_template_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES project_templates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER DEFAULT 0, -- in hours
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Categories Table
CREATE TABLE IF NOT EXISTS task_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'tag',
    parent_category_id UUID REFERENCES task_categories(id),
    default_priority VARCHAR(20) DEFAULT 'medium',
    billable BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT false,
    auto_assign_rules JSONB DEFAULT '{}',
    time_tracking_rules JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Priority Levels Table
CREATE TABLE IF NOT EXISTS priority_levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'flag',
    badge_style VARCHAR(20) DEFAULT 'default',
    sla_hours INTEGER DEFAULT 24,
    auto_escalation JSONB DEFAULT '{}',
    notification_rules JSONB DEFAULT '{}',
    workflow_rules JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Fields Table
CREATE TABLE IF NOT EXISTS custom_fields (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    field_key VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'task', 'both'
    field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'date', 'select', 'checkbox', 'textarea', 'multi_select'
    validation_rules JSONB DEFAULT '{}',
    display_settings JSONB DEFAULT '{}',
    conditional_logic JSONB DEFAULT '{}',
    help_text TEXT,
    category VARCHAR(100) DEFAULT 'general',
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(field_key, entity_type)
);

-- Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'task'
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow States Table
CREATE TABLE IF NOT EXISTS workflow_states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'active', -- 'initial', 'active', 'review', 'final'
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50) DEFAULT 'circle',
    order_index INTEGER NOT NULL,
    permissions JSONB DEFAULT '{}',
    automation_rules JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow Transitions Table
CREATE TABLE IF NOT EXISTS workflow_transitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    from_state VARCHAR(255) NOT NULL,
    to_state VARCHAR(255) NOT NULL,
    conditions JSONB DEFAULT '[]',
    actions JSONB DEFAULT '[]',
    ui_settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_templates_category ON project_templates(category);
CREATE INDEX IF NOT EXISTS idx_project_templates_active ON project_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_project_template_phases_template ON project_template_phases(template_id);
CREATE INDEX IF NOT EXISTS idx_task_categories_parent ON task_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_task_categories_active ON task_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_priority_levels_level ON priority_levels(level);
CREATE INDEX IF NOT EXISTS idx_priority_levels_active ON priority_levels(is_active);
CREATE INDEX IF NOT EXISTS idx_custom_fields_entity ON custom_fields(entity_type);
CREATE INDEX IF NOT EXISTS idx_custom_fields_active ON custom_fields(is_active);
CREATE INDEX IF NOT EXISTS idx_workflows_entity ON workflows(entity_type);
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(is_active);
CREATE INDEX IF NOT EXISTS idx_workflow_states_workflow ON workflow_states(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_transitions_workflow ON workflow_transitions(workflow_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_templates_updated_at BEFORE UPDATE ON project_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_template_phases_updated_at BEFORE UPDATE ON project_template_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_categories_updated_at BEFORE UPDATE ON task_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_priority_levels_updated_at BEFORE UPDATE ON priority_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_fields_updated_at BEFORE UPDATE ON custom_fields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_states_updated_at BEFORE UPDATE ON workflow_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_transitions_updated_at BEFORE UPDATE ON workflow_transitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO priority_levels (name, description, level, color, icon, badge_style, sla_hours) VALUES
('Critical', 'Immediate attention required', 1, '#EF4444', 'alert-triangle', 'destructive', 2),
('High', 'High priority tasks', 2, '#F97316', 'flag', 'warning', 8),
('Medium', 'Normal priority tasks', 3, '#EAB308', 'flag', 'default', 24),
('Low', 'Low priority tasks', 4, '#22C55E', 'flag', 'secondary', 72)
ON CONFLICT (level) DO NOTHING;

INSERT INTO task_categories (name, description, color, icon, default_priority) VALUES
('Development', 'Software development tasks', '#3B82F6', 'code', 'high'),
('Design', 'UI/UX design tasks', '#8B5CF6', 'palette', 'medium'),
('Testing', 'Quality assurance and testing', '#10B981', 'test-tube', 'high'),
('Documentation', 'Documentation and writing tasks', '#F59E0B', 'file-text', 'low'),
('Bug Fixes', 'Bug fixes and maintenance', '#EF4444', 'bug', 'high')
ON CONFLICT DO NOTHING;

INSERT INTO workflows (name, description, entity_type) VALUES
('Default Task Workflow', 'Standard workflow for task management', 'task'),
('Default Project Workflow', 'Standard workflow for project management', 'project')
ON CONFLICT (name) DO NOTHING;


