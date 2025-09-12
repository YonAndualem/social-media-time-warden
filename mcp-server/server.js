const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Error: Missing required environment variables SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Add size limit for security

// Input validation middleware
const validateUsageInput = (req, res, next) => {
  const { user_id, platform, date, time_spent } = req.body;
  
  if (!user_id || typeof user_id !== 'string' || user_id.trim().length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid user_id: must be a non-empty string' 
    });
  }
  
  if (!platform || typeof platform !== 'string' || platform.trim().length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid platform: must be a non-empty string' 
    });
  }
  
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid date: must be in YYYY-MM-DD format' 
    });
  }
  
  if (time_spent === undefined || typeof time_spent !== 'number' || time_spent < 0 || time_spent > 1440) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid time_spent: must be a number between 0 and 1440 minutes' 
    });
  }
  
  next();
};

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Social Media Time Warden MCP Server is running' });
});

// POST /usage - Receive usage data from browser extension
app.post('/usage', validateUsageInput, async (req, res) => {
  try {
    const { user_id, platform, date, time_spent } = req.body;
    
    // Additional business logic validation
    const validPlatforms = ['Twitter', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 'Snapchat'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid platform: must be one of ${validPlatforms.join(', ')}` 
      });
    }

    // Insert or update usage record
    const { data, error } = await supabase
      .from('usage_records')
      .upsert({
        user_id: user_id.trim(),
        platform: platform.trim(),
        date,
        time_spent
      }, {
        onConflict: 'user_id,platform,date'
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error saving usage data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /usage - Retrieve usage stats for a user on a given date
app.get('/usage', async (req, res) => {
  try {
    const { user_id, date } = req.query;
    
    if (!user_id || !date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required query parameters: user_id, date' 
      });
    }

    const { data, error } = await supabase
      .from('usage_records')
      .select('platform, time_spent')
      .eq('user_id', user_id)
      .eq('date', date);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /limit - Set daily limit for a platform
app.post('/limit', async (req, res) => {
  try {
    const { user_id, platform, daily_limit } = req.body;
    
    if (!user_id || !platform || daily_limit === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: user_id, platform, daily_limit' 
      });
    }

    const { data, error } = await supabase
      .from('daily_limits')
      .upsert({
        user_id,
        platform,
        daily_limit
      }, {
        onConflict: 'user_id,platform'
      });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error setting daily limit:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /limit - Get daily limits for all platforms for a user
app.get('/limit', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required query parameter: user_id' 
      });
    }

    const { data, error } = await supabase
      .from('daily_limits')
      .select('platform, daily_limit')
      .eq('user_id', user_id);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching daily limits:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /notifications - Get notifications for a user
app.get('/notifications', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required query parameter: user_id' 
      });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('platform, date, notification_type, timestamp')
      .eq('user_id', user_id)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Social Media Time Warden MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
