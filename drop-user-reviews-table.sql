-- Drop user_reviews table and related objects
-- Run this in Supabase SQL Editor

-- Drop policies first
DROP POLICY IF EXISTS "Admins can view all reviews" ON user_reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON user_reviews;
DROP POLICY IF EXISTS "Service role can manage reviews" ON user_reviews;

-- Drop indexes
DROP INDEX IF EXISTS idx_user_reviews_status;
DROP INDEX IF EXISTS idx_user_reviews_email;
DROP INDEX IF EXISTS idx_user_reviews_created_at;

-- Drop the table
DROP TABLE IF EXISTS user_reviews;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'USER_REVIEWS TABLE DROPPED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Table: user_reviews has been removed';
    RAISE NOTICE 'All related policies and indexes dropped';
    RAISE NOTICE 'Now using isApproved/isRejected columns in users table';
    RAISE NOTICE '====================================================';
END $$;


