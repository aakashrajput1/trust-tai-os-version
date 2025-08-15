-- Test the signup flow and check user_reviews table
-- Run this in Supabase SQL Editor

-- First, let's check if the user_reviews table exists
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'user_reviews' 
ORDER BY ordinal_position;

-- Check if there are any existing reviews
SELECT 
    id,
    name,
    email,
    role,
    status,
    created_at
FROM user_reviews 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any users that might have been created directly
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- Check the trigger function to see if it's creating users automatically
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check the handle_new_user function
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'SIGNUP FLOW DIAGNOSTIC COMPLETED!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Check the results above to see:';
    RAISE NOTICE '1. If user_reviews table exists and has data';
    RAISE NOTICE '2. If users are being created directly';
    RAISE NOTICE '3. If the trigger is working correctly';
    RAISE NOTICE '====================================================';
END $$;


