-- Fix the signup trigger to not automatically create user profiles
-- This allows the admin review system to work properly
-- Run this in Supabase SQL Editor

-- First, let's disable the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a new trigger function that only creates user profiles for admin-created users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_role TEXT;
BEGIN
  -- Only create user profile if the user is created by admin (has admin metadata)
  -- For regular signups, we'll let the admin review system handle profile creation
  IF NEW.raw_user_meta_data->>'created_by' = 'admin' THEN
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
  END IF;
    
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the signup
    RAISE LOG 'Error in handle_new_user: % %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'SIGNUP TRIGGER FIXED!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'The trigger now only creates user profiles for admin-created users';
    RAISE NOTICE 'Regular signups will go to the review queue instead';
    RAISE NOTICE 'This allows the admin review system to work properly';
    RAISE NOTICE '====================================================';
END $$;


