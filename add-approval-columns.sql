-- Add approval columns to users table
-- Run this in Supabase SQL Editor

-- Add isApproved column with default false
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS isApproved BOOLEAN DEFAULT false;

-- Add isRejected column with default false  
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS isRejected BOOLEAN DEFAULT false;

-- Update existing users to have both columns as false if they are null
UPDATE public.users 
SET 
  isApproved = COALESCE(isApproved, false),
  isRejected = COALESCE(isRejected, false)
WHERE isApproved IS NULL OR isRejected IS NULL;

-- Create indexes for better performance on approval queries
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON public.users(isApproved, isRejected);
CREATE INDEX IF NOT EXISTS idx_users_pending_approval ON public.users(isApproved, isRejected) 
WHERE isApproved = false AND isRejected = false;

-- Update the trigger function to set default values for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Extract name from metadata or use email prefix
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name', 
    split_part(NEW.email, '@', 1)
  );
  
  -- Insert with conflict handling and default approval values
  INSERT INTO public.users (id, email, name, isApproved, isRejected, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    user_name,
    false, -- isApproved default
    false, -- isRejected default
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    isApproved = COALESCE(EXCLUDED.isApproved, users.isApproved, false),
    isRejected = COALESCE(EXCLUDED.isRejected, users.isRejected, false),
    updated_at = NOW();
    
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error in handle_new_user: % %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'APPROVAL COLUMNS ADDED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Added columns: isApproved, isRejected';
    RAISE NOTICE 'Default values: false for both';
    RAISE NOTICE 'Indexes created for performance';
    RAISE NOTICE 'Trigger function updated for new users';
    RAISE NOTICE '====================================================';
END $$;


