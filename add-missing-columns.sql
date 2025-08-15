-- Add missing columns to users table for admin functionality
-- Run this in Supabase SQL Editor

-- Add status column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Add department column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS department VARCHAR(100);

-- Add position column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS position VARCHAR(100);

-- Add phone column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Add avatar_url column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add mfa_enabled column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;

-- Add last_active column
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE;

-- Add manager_id column (self-referencing foreign key)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.users(id);

-- Add deleted_at column for soft deletes
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to have 'active' status
UPDATE public.users 
SET status = 'active' 
WHERE status IS NULL;

-- Create index on status for better performance
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Create index on role for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Create index on department for better performance
CREATE INDEX IF NOT EXISTS idx_users_department ON public.users(department);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'MISSING COLUMNS ADDED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Added columns:';
    RAISE NOTICE '- status (VARCHAR(20), default: active)';
    RAISE NOTICE '- department (VARCHAR(100))';
    RAISE NOTICE '- position (VARCHAR(100))';
    RAISE NOTICE '- phone (VARCHAR(20))';
    RAISE NOTICE '- avatar_url (TEXT)';
    RAISE NOTICE '- mfa_enabled (BOOLEAN, default: false)';
    RAISE NOTICE '- last_active (TIMESTAMP WITH TIME ZONE)';
    RAISE NOTICE '- manager_id (UUID, foreign key)';
    RAISE NOTICE '- deleted_at (TIMESTAMP WITH TIME ZONE)';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Indexes created for better performance';
    RAISE NOTICE '====================================================';
END $$;


