-- Social Media Time Warden Database Schema
-- Copy and paste this entire script into Supabase SQL Editor

-- Create usage_records table
CREATE TABLE usage_records (
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    time_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, platform, date)
);

-- Create daily_limits table
CREATE TABLE daily_limits (
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    daily_limit INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, platform)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    notification_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for better performance
CREATE INDEX idx_usage_records_user_date ON usage_records(user_id, date);
CREATE INDEX idx_usage_records_platform ON usage_records(platform);
CREATE INDEX idx_daily_limits_user ON daily_limits(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_date ON notifications(date);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);

-- Insert sample data for testing
INSERT INTO usage_records (user_id, platform, date, time_spent) VALUES
('demo_user', 'Twitter', CURRENT_DATE, 45),
('demo_user', 'Instagram', CURRENT_DATE, 30),
('demo_user', 'YouTube', CURRENT_DATE, 120),
('demo_user', 'Facebook', CURRENT_DATE, 25),
('demo_user', 'TikTok', CURRENT_DATE, 60);

INSERT INTO daily_limits (user_id, platform, daily_limit) VALUES
('demo_user', 'Twitter', 60),
('demo_user', 'Instagram', 45),
('demo_user', 'YouTube', 90),
('demo_user', 'Facebook', 30),
('demo_user', 'TikTok', 75),
('demo_user', 'Snapchat', 40);

-- Test query to verify data
SELECT 'Tables created successfully!' as status;
SELECT 'Usage records:', count(*) as count FROM usage_records;
SELECT 'Daily limits:', count(*) as count FROM daily_limits;
