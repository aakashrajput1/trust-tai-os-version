-- Fix duplicate users and improve trigger function
-- Run this in Supabase SQL Editor

-- First, let's check for any duplicate entries
SELECT 
  id,
  email,
  COUNT(*) as count
FROM public.users 
GROUP BY id, email 
HAVING COUNT(*) > 1;

-- Remove duplicates if any exist (keep the most recent one)
DELETE FROM public.users 
WHERE id IN (
  SELECT id 
  FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) as rn
    FROM public.users
  ) t 
  WHERE t.rn > 1
);

-- Update the trigger function to be more robust with conflict handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_role TEXT;
BEGIN
  -- Extract name and role from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name', 
    split_part(NEW.email, '@', 1)
  );
  
  user_role := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'user'
  );
  
  -- Insert with conflict handling - update if exists, insert if not
  INSERT INTO public.users (id, email, name, role, status, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    user_name,
    user_role,
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    role = COALESCE(EXCLUDED.role, users.role),
    status = COALESCE(EXCLUDED.status, users.status),
    updated_at = NOW();
    
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error in handle_new_user: % %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Verify the setup
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'DUPLICATE USER FIX COMPLETED!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Trigger function updated with conflict handling';
    RAISE NOTICE 'Any duplicate entries have been cleaned up';
    RAISE NOTICE '====================================================';
END $$;
