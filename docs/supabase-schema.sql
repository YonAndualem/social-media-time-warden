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
    PRIMARY KEY (user_id, platform, date),
    CONSTRAINT valid_platform_usage CHECK (platform IN ('Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Snapchat')),
    CONSTRAINT valid_time_spent CHECK (time_spent >= 0 AND time_spent <= 1440), -- 0 to 24 hours in minutes
    CONSTRAINT valid_user_id CHECK (user_id != '' AND LENGTH(user_id) > 0),
    CONSTRAINT valid_date CHECK (date <= CURRENT_DATE) -- Can't record future usage
);

-- Create daily_limits table
CREATE TABLE daily_limits (
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    daily_limit INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, platform),
    CONSTRAINT valid_platform_limits CHECK (platform IN ('Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Snapchat')),
    CONSTRAINT valid_daily_limit CHECK (daily_limit >= 0 AND daily_limit <= 1440), -- 0 to 24 hours in minutes
    CONSTRAINT valid_user_id_limits CHECK (user_id != '' AND LENGTH(user_id) > 0)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    notification_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_platform_notifications CHECK (platform IN ('Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Snapchat')),
    CONSTRAINT valid_notification_type CHECK (notification_type IN ('warning', 'limit_exceeded', 'daily_summary')),
    CONSTRAINT valid_user_id_notifications CHECK (user_id != '' AND LENGTH(user_id) > 0),
    CONSTRAINT valid_notification_date CHECK (date <= CURRENT_DATE + INTERVAL '1 day') -- Allow next day for summary notifications
);

-- Add indexes for better performance
CREATE INDEX idx_usage_records_user_date ON usage_records(user_id, date);
CREATE INDEX idx_usage_records_platform ON usage_records(platform);
CREATE INDEX idx_usage_records_date ON usage_records(date);
CREATE INDEX idx_daily_limits_user ON daily_limits(user_id);
CREATE INDEX idx_daily_limits_platform ON daily_limits(platform);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_date ON notifications(date);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_usage_records_updated_at
    BEFORE UPDATE ON usage_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_limits_updated_at
    BEFORE UPDATE ON daily_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (using demo_user_12345 to match the app)
INSERT INTO usage_records (user_id, platform, date, time_spent) VALUES
('demo_user_12345', 'Twitter', CURRENT_DATE, 45),
('demo_user_12345', 'Instagram', CURRENT_DATE, 30),
('demo_user_12345', 'YouTube', CURRENT_DATE, 120),
('demo_user_12345', 'Facebook', CURRENT_DATE, 25),
('demo_user_12345', 'TikTok', CURRENT_DATE, 60),
('demo_user_12345', 'Twitter', CURRENT_DATE - INTERVAL '1 day', 75),
('demo_user_12345', 'Instagram', CURRENT_DATE - INTERVAL '1 day', 45),
('demo_user_12345', 'YouTube', CURRENT_DATE - INTERVAL '1 day', 90);

INSERT INTO daily_limits (user_id, platform, daily_limit) VALUES
('demo_user_12345', 'Twitter', 60),
('demo_user_12345', 'Instagram', 45),
('demo_user_12345', 'YouTube', 90),
('demo_user_12345', 'Facebook', 30),
('demo_user_12345', 'TikTok', 75),
('demo_user_12345', 'Snapchat', 40);

-- Insert sample notifications
INSERT INTO notifications (user_id, platform, date, notification_type) VALUES
('demo_user_12345', 'YouTube', CURRENT_DATE, 'limit_exceeded'),
('demo_user_12345', 'Twitter', CURRENT_DATE, 'warning'),
('demo_user_12345', 'TikTok', CURRENT_DATE - INTERVAL '1 day', 'daily_summary');

-- Test query to verify data
SELECT 'Tables created successfully!' as status;
SELECT 'Usage records:', count(*) as count FROM usage_records;
SELECT 'Daily limits:', count(*) as count FROM daily_limits;
