-- Create Admin User for Trust TAI OS
-- Run this in Supabase SQL Editor

-- First, make sure we have the users table with proper structure
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert admin user (if not already exists)
INSERT INTO users (name, email, role) VALUES (
    'Super Admin',
    'admin@trusttai.com',
    'admin'
) ON CONFLICT (email) DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();

-- Display the admin user info
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM users 
WHERE email = 'admin@trusttai.com';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'ADMIN USER CREATED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Email: admin@trusttai.com';
    RAISE NOTICE 'Role: admin';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'You need to create this user in Supabase Auth first!';
    RAISE NOTICE 'Go to Authentication > Users > Add User';
    RAISE NOTICE 'Email: admin@trusttai.com';
    RAISE NOTICE 'Password: admin123';
    RAISE NOTICE '====================================================';
END $$;
