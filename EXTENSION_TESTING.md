# Extension Testing Guide

## ✅ Testing Your Updated Extension

Your Social Media Time Warden extension now has full authentication integration! Here's how to test it:

### Step 1: Install/Reload Extension
1. Go to `chrome://extensions/`
2. If already installed, click the refresh button on the extension
3. If not installed, click "Load unpacked" and select the `browser-extension` folder

### Step 2: Test Authentication Flow

#### Without Login:
1. Click the extension icon in your browser toolbar
2. You should see a "Please log in to track your usage" message
3. Click the "🔑 Login" button - this will open the web app

#### With Login:
1. In the web app, log in using Demo Login or create an account
2. Return to the extension popup
3. You should now see:
   - Your email address displayed at the top
   - A "Sign Out" button next to your email
   - Your actual usage statistics for today

### Step 3: Test Real-Time Sync
1. Sign out from the extension popup
2. The web app should automatically redirect to login screen
3. Sign back in from the web app
4. The extension popup should immediately show your email again

### Step 4: Test Tracking
1. With user authenticated, visit social media sites:
   - twitter.com
   - facebook.com
   - instagram.com
   - youtube.com
2. Stay on each for 1-2 minutes
3. Return to extension popup - you should see tracked time
4. Check the dashboard - it should show the same data

## 🎯 What Should Work Now:

### Extension Popup Features:
- ✅ User email display when logged in
- ✅ Sign out button
- ✅ Login prompt when not authenticated
- ✅ Real usage statistics
- ✅ Quick access to dashboard and limits

### Authentication Sync:
- ✅ Extension knows when you log in/out from web app
- ✅ Web app knows when you sign out from extension
- ✅ Data syncs between extension and dashboard
- ✅ Same user ID used across all components

### Tracking Integration:
- ✅ Only tracks when user is authenticated
- ✅ Uses correct user ID for data storage
- ✅ Stats appear in both popup and dashboard
- ✅ Real-time updates across all interfaces

## 🐛 If Something Doesn't Work:

1. **Extension popup shows login prompt but you're logged in:**
   - Refresh the web app page
   - Wait a few seconds for sync
   - Try logging out and back in

2. **Stats not showing in extension:**
   - Check browser console for errors
   - Ensure MCP server is running (port 3001)
   - Visit social media sites for at least 1 minute

3. **Sign out doesn't work:**
   - Check extension permissions in manifest.json
   - Look for console errors
   - Try reloading the extension

Your extension is now a complete authentication-aware tracking system! 🎉
