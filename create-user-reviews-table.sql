-- Create user_reviews table for admin approval system
-- Run this in Supabase SQL Editor

-- Create user_reviews table
CREATE TABLE IF NOT EXISTS user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_reviews_status ON user_reviews(status);
CREATE INDEX IF NOT EXISTS idx_user_reviews_email ON user_reviews(email);
CREATE INDEX IF NOT EXISTS idx_user_reviews_created_at ON user_reviews(created_at);

-- Enable RLS
ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all reviews" ON user_reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update reviews" ON user_reviews
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Service role can manage reviews" ON user_reviews
    FOR ALL USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'USER REVIEWS TABLE CREATED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Table: user_reviews';
    RAISE NOTICE 'Statuses: pending, approved, rejected';
    RAISE NOTICE 'RLS enabled with admin policies';
    RAISE NOTICE '====================================================';
END $$;


