-- Fix RLS policies for users table
-- This will allow proper access to the users table

-- Step 1: Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.users;

-- Step 2: Disable Row Level Security temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Step 3: Create new permissive policies (optional - for future use)
-- CREATE POLICY "Allow all operations for authenticated users" ON public.users
--   FOR ALL USING (auth.role() = 'authenticated');

-- Step 4: Verify the changes
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN 'RLS ENABLED' 
    ELSE 'RLS DISABLED' 
  END as rls_status
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Step 5: Show remaining policies (should be 0)
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Step 6: Test data access
-- SELECT COUNT(*) FROM public.users;
-- SELECT id, name, email, role FROM public.users LIMIT 5;
