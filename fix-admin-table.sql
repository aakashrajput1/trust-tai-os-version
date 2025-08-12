-- =====================================================
-- FIX ADMIN TABLE STRUCTURE
-- Run this in Supabase SQL Editor to fix your current setup
-- =====================================================

-- First, let's see what you currently have
-- Drop the existing admin table if it exists
DROP TABLE IF EXISTS admin;

-- Create the proper users table structure
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    password_hash VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    manager_id UUID REFERENCES users(id),
    hourly_rate DECIMAL(10,2),
    timezone VARCHAR(50) DEFAULT 'UTC',
    last_active TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable necessary extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Insert your admin user into the users table
INSERT INTO users (name, email, password_hash, role, status) VALUES (
    'Super Admin',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')), -- password = admin123
    'admin',
    'active'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a simple RLS policy (you can modify this later)
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'executive')
        )
    );

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'ADMIN TABLE FIXED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Users table created with proper structure';
    RAISE NOTICE 'Admin user created: admin@example.com / admin123';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'You can now login with:';
    RAISE NOTICE 'Email: admin@example.com';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE '====================================================';
END $$;
