-- Create Roles Table for Dynamic Role Management
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50), -- For Lucide icons
    color_scheme VARCHAR(100), -- CSS gradient classes
    permissions JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_system_role BOOLEAN DEFAULT false, -- System roles cannot be deleted
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES admin(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create role_permissions table for detailed permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_name VARCHAR(100) NOT NULL,
    permission_type VARCHAR(50) NOT NULL, -- 'page', 'action', 'resource'
    resource VARCHAR(100),
    action VARCHAR(100),
    is_granted BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_is_active ON roles(is_active);
CREATE INDEX IF NOT EXISTS idx_roles_sort_order ON roles(sort_order);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_name ON role_permissions(permission_name);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all roles" ON roles FOR ALL USING (true);
CREATE POLICY "Admins can manage all role permissions" ON role_permissions FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_roles_updated_at();

-- Insert default system roles
INSERT INTO roles (name, display_name, description, icon_name, color_scheme, is_system_role, sort_order, permissions) VALUES 
    ('admin', 'Admin', 'Full system administrator with all permissions', 'Shield', 'from-purple-500 to-blue-500', true, 1, '{"all": true}'::jsonb),
    ('executive', 'Executive', 'Strategic leadership and decision-making for the organization', 'Crown', 'from-purple-500 to-pink-500', true, 2, '{"reports": true, "analytics": true, "strategic": true}'::jsonb),
    ('project-manager', 'Project Manager', 'Coordinate and manage project teams and deliverables', 'Users', 'from-blue-500 to-cyan-500', true, 3, '{"projects": true, "teams": true, "planning": true}'::jsonb),
    ('developer', 'Developer', 'Build and maintain software applications and systems', 'Code', 'from-green-500 to-emerald-500', true, 4, '{"development": true, "code": true, "tasks": true}'::jsonb),
    ('support-lead', 'Support Lead', 'Lead customer support team and handle complex issues', 'Headphones', 'from-orange-500 to-red-500', true, 5, '{"support": true, "escalations": true, "team": true}'::jsonb),
    ('support-agent', 'Support Agent', 'Provide customer support and resolve user issues', 'HelpCircle', 'from-yellow-500 to-orange-500', true, 6, '{"support": true, "tickets": true}'::jsonb),
    ('hr', 'HR', 'Manage human resources and employee relations', 'UserCheck', 'from-indigo-500 to-purple-500', true, 7, '{"hr": true, "employees": true, "reports": true}'::jsonb),
    ('sales', 'Sales', 'Drive revenue growth and manage customer relationships', 'TrendingUp', 'from-pink-500 to-rose-500', true, 8, '{"sales": true, "leads": true, "deals": true}'::jsonb)
ON CONFLICT (name) DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    color_scheme = EXCLUDED.color_scheme,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- Insert default permissions for each role
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
        ('view_dashboard', 'page', 'dashboard', 'read'),
        ('view_profile', 'page', 'profile', 'read'),
        ('edit_profile', 'page', 'profile', 'update'),
        ('view_reports', 'page', 'reports', 'read'),
        ('view_analytics', 'page', 'analytics', 'read'),
        ('manage_users', 'action', 'users', 'all'),
        ('manage_roles', 'action', 'roles', 'all'),
        ('manage_projects', 'action', 'projects', 'all'),
        ('manage_support', 'action', 'support', 'all'),
        ('manage_sales', 'action', 'sales', 'all'),
        ('manage_hr', 'action', 'hr', 'all')
) AS p(permission_name, permission_type, resource, action)
WHERE r.name = 'admin';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'ROLES TABLE CREATED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Default roles created:';
    RAISE NOTICE '- Admin (System Role)';
    RAISE NOTICE '- Executive (System Role)';
    RAISE NOTICE '- Project Manager (System Role)';
    RAISE NOTICE '- Developer (System Role)';
    RAISE NOTICE '- Support Lead (System Role)';
    RAISE NOTICE '- Support Agent (System Role)';
    RAISE NOTICE '- HR (System Role)';
    RAISE NOTICE '- Sales (System Role)';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'You can now add custom roles via admin panel!';
    RAISE NOTICE '====================================================';
END $$;
