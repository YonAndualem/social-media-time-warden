# 🚀 Next Steps: Supabase Setup & System Testing

## Step 1: Create Supabase Project

1. **Go to Supabase**: Visit [supabase.com](https://supabase.com)
2. **Sign up/Login**: Create a free account or login
3. **Create New Project**: 
   - Click "New Project"
   - Choose organization
   - Name: `social-media-time-warden`
   - Database password: Choose a strong password
   - Region: Choose closest to you
   - Click "Create new project"

## Step 2: Set Up Database Tables

Once your project is created:

1. **Go to SQL Editor**: In your Supabase dashboard, click "SQL Editor"
2. **Run the following SQL script**:

```sql
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
('demo_user', 'Twitter', '2025-09-12', 45),
('demo_user', 'Instagram', '2025-09-12', 30),
('demo_user', 'YouTube', '2025-09-12', 120);

INSERT INTO daily_limits (user_id, platform, daily_limit) VALUES
('demo_user', 'Twitter', 60),
('demo_user', 'Instagram', 45),
('demo_user', 'YouTube', 90);
```

3. **Click "Run"** to execute the script

## Step 3: Get Your Supabase Credentials

1. **Go to Settings**: Click "Settings" in sidebar
2. **Click "API"**: You'll see your project credentials
3. **Copy these values**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Update Environment Variables

I'll help you update the .env file with your credentials.

**Please provide your Supabase credentials and I'll update the files:**
- Supabase URL: `https://your-project.supabase.co`
- Supabase Anon Key: `eyJhbGci...`

Once you have these, let me know and I'll update the configuration files!

## What We'll Test Next

After Supabase setup:
1. ✅ Test MCP server API endpoints
2. ✅ Install browser extension in Chrome  
3. ✅ Test complete data flow
4. ✅ Verify dashboard analytics
5. ✅ Test limit notifications

**Ready to continue? Get your Supabase credentials and let's connect everything!** 🚀
