# Social Media Time Warden - Complete Setup Guide

This guide will walk you through setting up the complete Social Media Time Warden system.

## Prerequisites

- Node.js (v18 or later)
- Chrome browser (for extension)
- Supabase account (free tier is sufficient)

## 1. Supabase Database Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Follow the instructions in `docs/supabase-setup.md` to create the required tables
3. Note your project URL and anon key from the API settings

## 2. MCP Server Setup

```bash
# Navigate to the MCP server directory
cd mcp-server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=https://your-project-id.supabase.co
# SUPABASE_ANON_KEY=your-anon-key-here

# Start the server
npm run dev
```

The MCP server will run on `http://localhost:3001`

## 3. Web App Setup

```bash
# Navigate to the web app directory
cd web-app

# Install dependencies
npm install

# Install additional dependencies for charts and icons
npm install recharts lucide-react @headlessui/react

# Start the development server
npm run dev
```

The web app will run on `http://localhost:3000`

## 4. Browser Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" 
4. Select the `browser-extension` folder
5. The extension should appear in your extensions list

## 5. Testing the System

1. **Test MCP Server**: Visit `http://localhost:3001/health` - you should see a status message
2. **Test Web App**: Visit `http://localhost:3000` - you should see the dashboard
3. **Test Extension**: 
   - Click the extension icon in Chrome
   - Visit a social media site (Twitter, Facebook, etc.)
   - The extension should show a tracking indicator
   - Return to the dashboard to see usage data

## 6. Setting Daily Limits

1. Open the web app dashboard
2. Click "Manage Limits" or visit `http://localhost:3000/limits`
3. Set daily time limits for each platform
4. The extension will show notifications when you approach limits

## Usage Flow

1. **Install extension** → Automatically tracks time on social media sites
2. **Extension sends data** → MCP server stores in Supabase database  
3. **View dashboard** → Web app displays usage analytics and trends
4. **Set limits** → Get notifications when approaching daily limits

## API Endpoints

The MCP server provides these endpoints:

- `GET /health` - Health check
- `POST /usage` - Save usage data from extension
- `GET /usage?user_id={id}&date={date}` - Get usage stats
- `POST /limit` - Set daily limits
- `GET /limit?user_id={id}` - Get daily limits
- `GET /notifications?user_id={id}` - Get notifications

## Troubleshooting

### Extension not tracking
- Check that you're on a supported social media site
- Ensure the extension has proper permissions
- Check the browser console for errors

### Dashboard not showing data
- Verify the MCP server is running on port 3001
- Check browser network tab for API call errors
- Ensure Supabase credentials are correct

### MCP Server errors
- Check the `.env` file has correct Supabase credentials
- Verify Supabase tables are created correctly
- Check server logs for specific error messages

## Postman Documentation

A Postman Notebook will be created to document all API endpoints and provide example requests for testing the system.

## Development Notes

- The system uses a simple user ID system for the hackathon
- In production, you'd want proper authentication
- All times are stored in minutes in the database
- The extension works on major social media platforms

## Next Steps

1. Customize the platforms tracked
2. Add more detailed analytics
3. Implement user authentication
4. Add export functionality for usage data
5. Create mobile app version
