-- =====================================================
-- CREATE SEPARATE ADMIN TABLE
-- Admin table will be separate from users table
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create separate admin table
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    avatar_url TEXT,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    permissions JSONB DEFAULT '{}'::jsonb,
    last_login TIMESTAMP WITH TIME ZONE,
    last_active TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES admin(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create admin_roles table for role management
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_sessions table for session management
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_audit_logs table for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin(id),
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity VARCHAR(20) DEFAULT 'info'
);

-- Create password verification function
CREATE OR REPLACE FUNCTION verify_admin_password(
    p_email VARCHAR(255),
    p_password VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash VARCHAR(255);
BEGIN
    -- Get the stored password hash for the email
    SELECT password_hash INTO stored_hash
    FROM admin
    WHERE email = p_email AND status = 'active';
    
    -- If no admin found, return false
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verify the password using pgcrypto
    RETURN crypt(p_password, stored_hash) = stored_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin roles
INSERT INTO admin_roles (name, description, permissions) VALUES
('super_admin', 'Full system access', '{"all": true}'),
('admin', 'Administrative access', '{"users": true, "reports": true, "settings": true}'),
('executive', 'Executive level access', '{"reports": true, "analytics": true}'),
('moderator', 'Moderation access', '{"content": true, "users": true}');

-- Insert your super admin user
INSERT INTO admin (name, email, password_hash, role, status, permissions) VALUES (
    'Super Admin',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')), -- password = admin123
    'super_admin',
    'active',
    '{"all": true}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin(email);
CREATE INDEX IF NOT EXISTS idx_admin_role ON admin(role);
CREATE INDEX IF NOT EXISTS idx_admin_status ON admin(status);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON admin_audit_logs(timestamp);

-- Enable Row Level Security
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin table
CREATE POLICY "Admins can view all admins" ON admin
    FOR ALL USING (true);

CREATE POLICY "Admins can view all roles" ON admin_roles
    FOR ALL USING (true);

CREATE POLICY "Admins can view all sessions" ON admin_sessions
    FOR ALL USING (true);

CREATE POLICY "Admins can view all audit logs" ON admin_audit_logs
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_admin_updated_at
    BEFORE UPDATE ON admin
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_updated_at();

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_admin_id UUID,
    p_action VARCHAR(100),
    p_details JSONB DEFAULT '{}'::jsonb,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_severity VARCHAR(20) DEFAULT 'info'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_audit_logs (admin_id, action, details, ip_address, user_agent, severity)
    VALUES (p_admin_id, p_action, p_details, p_ip_address, p_user_agent, p_severity);
END;
$$ LANGUAGE plpgsql;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'SEPARATE ADMIN TABLE CREATED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Admin table created separately from users table';
    RAISE NOTICE 'Admin roles: super_admin, admin, executive, moderator';
    RAISE NOTICE 'Super admin created: admin@example.com / admin123';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Login credentials:';
    RAISE NOTICE 'Email: admin@example.com';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE 'Role: super_admin';
    RAISE NOTICE '====================================================';
END $$;
