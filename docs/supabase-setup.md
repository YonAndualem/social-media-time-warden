# Supabase Database Setup

## Tables Required

Create the following tables in your Supabase database:

### 1. usage_records

```sql
CREATE TABLE usage_records (
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    time_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, platform, date)
);

-- Add index for better query performance
CREATE INDEX idx_usage_records_user_date ON usage_records(user_id, date);
CREATE INDEX idx_usage_records_platform ON usage_records(platform);
```

### 2. daily_limits

```sql
CREATE TABLE daily_limits (
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    daily_limit INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (user_id, platform)
);

-- Add index for better query performance
CREATE INDEX idx_daily_limits_user ON daily_limits(user_id);
```

### 3. notifications

```sql
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    date DATE NOT NULL,
    notification_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_date ON notifications(date);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp);
```

## Setup Instructions

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL statements above to create the tables
4. Go to Settings > API to get your project URL and anon key
5. Update the `.env` file in the `mcp-server` directory with your credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Row Level Security (Optional)

If you want to add row-level security:

```sql
-- Enable RLS
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (basic example - customize as needed)
CREATE POLICY "Users can only see their own records" ON usage_records
    FOR ALL USING (user_id = current_user_id());

CREATE POLICY "Users can only see their own limits" ON daily_limits
    FOR ALL USING (user_id = current_user_id());

CREATE POLICY "Users can only see their own notifications" ON notifications
    FOR ALL USING (user_id = current_user_id());
```

## Sample Data

To test the system, you can insert some sample data:

```sql
-- Sample usage records
INSERT INTO usage_records (user_id, platform, date, time_spent) VALUES
('user_demo', 'Twitter', '2025-09-12', 45),
('user_demo', 'Instagram', '2025-09-12', 30),
('user_demo', 'YouTube', '2025-09-12', 120);

-- Sample daily limits  
INSERT INTO daily_limits (user_id, platform, daily_limit) VALUES
('user_demo', 'Twitter', 60),
('user_demo', 'Instagram', 45),
('user_demo', 'YouTube', 90);
```

## Environment Variables

Make sure your MCP server has these environment variables set:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous/public key
- `PORT`: Port for the MCP server (default: 3001)
