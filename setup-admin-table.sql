-- Simplified Admin Table Setup for Trust TAI OS
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    login_count INTEGER DEFAULT 0,
    last_login TIMESTAMP WITH TIME ZONE,
    last_active TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Insert admin user
INSERT INTO admin (name, email, password_hash, role, status) VALUES (
    'Super Admin',
    'admin@trusttai.com',
    crypt('admin123', gen_salt('bf')), -- password = admin123
    'admin',
    'active'
) ON CONFLICT (email) DO UPDATE SET 
    password_hash = crypt('admin123', gen_salt('bf')),
    role = 'admin',
    status = 'active',
    updated_at = NOW();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin(email);
CREATE INDEX IF NOT EXISTS idx_admin_role ON admin(role);
CREATE INDEX IF NOT EXISTS idx_admin_status ON admin(status);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'ADMIN TABLE SETUP COMPLETED!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Admin user created:';
    RAISE NOTICE 'Email: admin@trusttai.com';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE '====================================================';
END $$;
