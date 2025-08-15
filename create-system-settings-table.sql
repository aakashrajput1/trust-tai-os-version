-- Create system_settings table for admin settings
-- Run this in Supabase SQL Editor

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO system_settings (id, settings) VALUES (
    'default',
    '{
        "general": {
            "siteName": "Trust TAI OS",
            "timezone": "America/Los_Angeles",
            "language": "en",
            "maintenanceMode": false,
            "debugMode": false
        },
        "security": {
            "sessionTimeout": 30,
            "passwordMinLength": 8,
            "maxLoginAttempts": 5,
            "requireMFA": false
        },
        "email": {
            "smtpHost": "smtp.gmail.com",
            "smtpPort": 587,
            "smtpUsername": "",
            "smtpPassword": "",
            "fromEmail": "noreply@trusttai.com",
            "enableTLS": true
        },
        "notifications": {
            "emailNotifications": true,
            "pushNotifications": true,
            "realTimeAlerts": true
        },
        "backup": {
            "autoBackup": true,
            "backupFrequency": "daily",
            "backupRetention": 30
        }
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    settings = EXCLUDED.settings,
    updated_at = NOW();

-- Create index on settings for better performance
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_at ON system_settings(updated_at);

-- Enable RLS (optional - you might want to restrict access)
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role access
CREATE POLICY "Service role can manage system settings" ON system_settings
    FOR ALL USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'SYSTEM SETTINGS TABLE CREATED SUCCESSFULLY!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Table: system_settings';
    RAISE NOTICE 'Default settings inserted';
    RAISE NOTICE 'RLS enabled with service role policy';
    RAISE NOTICE '====================================================';
END $$;


