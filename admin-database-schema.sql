-- Admin Module Database Schema
-- This file contains all the necessary tables for the admin module

-- Users table (if not already exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    permission_type VARCHAR(50) NOT NULL, -- 'page', 'action', 'resource'
    resource VARCHAR(100),
    action VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billable settings table
CREATE TABLE IF NOT EXISTS billable_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    default_hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    overtime_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.50,
    holiday_multiplier DECIMAL(3,2) NOT NULL DEFAULT 2.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billable rules table
CREATE TABLE IF NOT EXISTS billable_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    settings_id UUID REFERENCES billable_settings(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- 'role', 'project_type', 'time_of_day'
    rule_name VARCHAR(100) NOT NULL,
    rule_condition TEXT NOT NULL,
    rule_value TEXT NOT NULL,
    is_billable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing rates table
CREATE TABLE IF NOT EXISTS billing_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    settings_id UUID REFERENCES billable_settings(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id),
    project_type VARCHAR(100),
    hourly_rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'slack', 'jira', 'zoom', 'crm'
    config JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'inactive',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration logs table
CREATE TABLE IF NOT EXISTS integration_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'success', 'error', 'warning'
    message TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- 'company', 'team', 'individual'
    team_id UUID, -- Can be null for company-wide goals
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal rewards table
CREATE TABLE IF NOT EXISTS goal_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    reward_type VARCHAR(50) NOT NULL, -- 'badge', 'points', 'gift_card', 'recognition'
    reward_value TEXT NOT NULL,
    trigger_condition TEXT NOT NULL,
    is_auto_triggered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goal KPIs table
CREATE TABLE IF NOT EXISTS goal_kpis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    kpi_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    measurement_unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45), -- IPv6 compatible
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL, -- 'cpu', 'memory', 'disk', 'api_response'
    metric_value DECIMAL(15,2) NOT NULL,
    metric_unit VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'normal',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    severity VARCHAR(20) NOT NULL DEFAULT 'error', -- 'info', 'warning', 'error', 'critical'
    source VARCHAR(100), -- 'api', 'database', 'frontend', 'integration'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role change requests table
CREATE TABLE IF NOT EXISTS role_change_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_role VARCHAR(50) NOT NULL,
    new_role VARCHAR(50) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Full system administrator with all permissions'),
    ('executive', 'Executive level access with limited write permissions'),
    ('manager', 'Team manager with team-level permissions'),
    ('user', 'Standard user with basic permissions')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions for admin role
INSERT INTO role_permissions (role_id, permission_name, permission_type, resource, action)
SELECT 
    r.id,
    p.permission_name,
    p.permission_type,
    p.resource,
    p.action
FROM roles r
CROSS JOIN (
    VALUES 
        ('manage_users', 'action', 'users', 'all'),
        ('manage_roles', 'action', 'roles', 'all'),
        ('manage_billable', 'action', 'billable', 'all'),
        ('manage_integrations', 'action', 'integrations', 'all'),
        ('manage_goals', 'action', 'goals', 'all'),
        ('view_audit_logs', 'action', 'audit', 'read'),
        ('view_system_health', 'action', 'system', 'read'),
        ('export_data', 'action', 'data', 'export')
) AS p(permission_name, permission_type, resource, action)
WHERE r.name = 'admin';

-- Insert default permissions for executive role
INSERT INTO role_permissions (role_id, permission_name, permission_type, resource, action)
SELECT 
    r.id,
    p.permission_name,
    p.permission_type,
    p.resource,
    p.action
FROM roles r
CROSS JOIN (
    VALUES 
        ('view_users', 'action', 'users', 'read'),
        ('view_roles', 'action', 'roles', 'read'),
        ('view_billable', 'action', 'billable', 'read'),
        ('view_integrations', 'action', 'integrations', 'read'),
        ('view_goals', 'action', 'goals', 'read'),
        ('view_audit_logs', 'action', 'audit', 'read'),
        ('view_system_health', 'action', 'system', 'read')
) AS p(permission_name, permission_type, resource, action)
WHERE r.name = 'executive';

-- Insert default permissions for manager role
INSERT INTO role_permissions (role_id, permission_name, permission_type, resource, action)
SELECT 
    r.id,
    p.permission_name,
    p.permission_type,
    p.resource,
    p.action
FROM roles r
CROSS JOIN (
    VALUES 
        ('view_team_users', 'action', 'users', 'read_team'),
        ('view_team_goals', 'action', 'goals', 'read_team'),
        ('view_team_billable', 'action', 'billable', 'read_team')
) AS p(permission_name, permission_type, resource, action)
WHERE r.name = 'manager';

-- Insert default permissions for user role
INSERT INTO role_permissions (role_id, permission_name, permission_type, resource, action)
SELECT 
    r.id,
    p.permission_name,
    p.permission_type,
    p.resource,
    p.action
FROM roles r
CROSS JOIN (
    VALUES 
        ('view_own_profile', 'action', 'profile', 'read'),
        ('edit_own_profile', 'action', 'profile', 'update'),
        ('view_own_goals', 'action', 'goals', 'read_own')
) AS p(permission_name, permission_type, resource, action)
WHERE r.name = 'user';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);

CREATE INDEX IF NOT EXISTS idx_integration_logs_integration_id ON integration_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_status ON integration_logs(status);
CREATE INDEX IF NOT EXISTS idx_integration_logs_timestamp ON integration_logs(timestamp);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billable_settings_updated_at BEFORE UPDATE ON billable_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goal_kpis_updated_at BEFORE UPDATE ON goal_kpis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
