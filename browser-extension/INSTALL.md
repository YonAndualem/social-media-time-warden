# Browser Extension Installation Guide

## Quick Installation Steps

### For Chrome/Edge:

1. **Open Extensions Page**:
   - Chrome: Type `chrome://extensions/` in address bar
   - Edge: Type `edge://extensions/` in address bar

2. **Enable Developer Mode**:
   - Toggle "Developer mode" switch in top right corner

3. **Load Extension**:
   - Click "Load unpacked" button
   - Navigate to and select the `browser-extension` folder in this project
   - The extension should appear in your extensions list

4. **Pin Extension** (Optional):
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Social Media Time Warden" and click the pin icon

## Testing the Extension

1. **Check Extension Popup**:
   - Click the extension icon in your browser toolbar
   - You should see the Time Warden popup with today's stats

2. **Test Tracking**:
   - Visit any supported social media site:
     - twitter.com or x.com
     - facebook.com
     - instagram.com
     - tiktok.com
     - youtube.com
     - snapchat.com
   - You should see a small tracking indicator appear briefly

3. **Verify Data Flow**:
   - After spending time on social media sites
   - Check the dashboard at http://localhost:3000
   - Your usage should appear in the analytics

## Supported Platforms

- **Twitter/X**: twitter.com, x.com
- **Facebook**: facebook.com, www.facebook.com
- **Instagram**: instagram.com, www.instagram.com
- **TikTok**: tiktok.com, www.tiktok.com
- **YouTube**: youtube.com, www.youtube.com
- **Snapchat**: snapchat.com, www.snapchat.com

## Troubleshooting

### Extension Not Working?
- Check that Developer mode is enabled
- Make sure you selected the `browser-extension` folder (not a file)
- Check browser console for errors (F12 → Console tab)

### Not Tracking Time?
- Ensure you're on a supported social media site
- Check that the MCP server is running (http://localhost:3001/health)
- Look for the tracking indicator when visiting sites

### No Data in Dashboard?
- Verify MCP server is running and connected to Supabase
- Check browser network tab for API call errors
- Ensure Supabase credentials are correct in .env file

## Privacy Note

The extension only tracks:
- ✅ Time spent on supported platforms
- ✅ Platform names (Twitter, Facebook, etc.)
- ✅ Daily usage totals

The extension does NOT track:
- ❌ What you're viewing or posting
- ❌ Personal information or account details
- ❌ Content of your social media activity

All data stays on your own Supabase database.
