const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
app.post('/usage', async (req, res) => {
  try {
    const { user_id, platform, date, time_spent } = req.body;
    
    // Validate required fields
    if (!user_id || !platform || !date || time_spent === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: user_id, platform, date, time_spent' 
      });
    }

    // Insert or update usage record
    const { data, error } = await supabase
      .from('usage_records')
      .upsert({
        user_id,
        platform,
        date,
        time_spent
      }, {
        onConflict: 'user_id,platform,date'
      });

    if (error) throw error;

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
