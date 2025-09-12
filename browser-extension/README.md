# Browser Extension

Chrome/Edge browser extension for tracking time spent on social media platforms.

## Features

- **Real-time tracking**: Monitors active tabs and tracks time spent on supported social media platforms
- **Visual indicators**: Shows when tracking is active
- **Popup dashboard**: Quick view of today's usage stats
- **Notifications**: Warns when approaching or exceeding daily limits
- **Cross-platform**: Supports Twitter, Facebook, Instagram, TikTok, YouTube, and Snapchat

## Installation

### Development Mode

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select this `browser-extension` folder
4. The extension should appear in your extensions list

### Files Structure

- `manifest.json` - Extension configuration and permissions
- `background.js` - Service worker for time tracking and API communication
- `content.js` - Content script that runs on social media pages
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and stats display
- `icons/` - Extension icons (you'll need to add these)

## Usage

1. Install the extension in Chrome
2. Visit any supported social media platform
3. The extension will automatically track your time
4. Click the extension icon to see today's stats
5. Use the buttons to open the web dashboard or set limits

## Supported Platforms

- **Twitter/X**: twitter.com, x.com
- **Facebook**: facebook.com, www.facebook.com  
- **Instagram**: instagram.com, www.instagram.com
- **TikTok**: tiktok.com, www.tiktok.com
- **YouTube**: youtube.com, www.youtube.com
- **Snapchat**: snapchat.com, www.snapchat.com

## Technical Details

### Permissions Required

- `activeTab` - To detect current active tab
- `tabs` - To monitor tab changes
- `storage` - To store user preferences locally
- `alarms` - For periodic data syncing
- `host_permissions` - Access to social media domains

### Data Flow

1. Background script monitors tab changes
2. When user visits a social media site, timer starts
3. When user leaves, time is calculated and sent to MCP server
4. Content script provides visual feedback
5. Popup displays real-time stats

### Privacy

- Only tracks time spent, not browsing content
- Data is sent to your own MCP server
- User ID is randomly generated locally

## Development

Make sure the MCP server is running on `http://localhost:3001` for the extension to sync data properly.
