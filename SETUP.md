# Social Media Time Warden - Setup Guide

## Quick Start

Your Social Media Time Warden system is now running with local authentication! Here's how to use it:

## 🚀 Current Status
- ✅ MCP Server running on port 3002
- ✅ Web Dashboard running on port 3000
- ✅ Local authentication system active
- ✅ Browser extension ready for installation

## 🔧 Installation Steps

### 1. Install the Browser Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder from this project
5. The extension should appear in your extensions list

### 2. Test the Authentication System
1. Open http://localhost:3000 in your browser
2. You'll see the login screen with these options:
   - **Demo Login**: Click "Login as Demo User" for instant access
   - **Create Account**: Enter email/password to create a new account
   - **Sign In**: Use existing email/password credentials

### 3. Test Extension Integration
1. After logging in to the web app, open the extension popup
2. You should see your email address displayed in the extension
3. The extension will now track time for your authenticated user
4. You can sign out directly from the extension popup if needed

### 4. Start Tracking
1. With the extension installed and user authenticated
2. Visit social media sites (Facebook, Twitter, Instagram, etc.)
3. The extension will automatically track your time
4. Return to the dashboard to see real-time updates

## 🎯 Features Working

### Extension Authentication & User Display
- ✅ Shows logged-in user's email in extension popup
- ✅ Sign-out button directly in extension popup
- ✅ Auto-sync with web app authentication state
- ✅ Login prompt when user is not authenticated

### Extension Tracking
- Automatically tracks time on social media platforms
- Syncs with your authenticated user ID
- Works across all browser tabs
- Real-time auth state synchronization

### Web Dashboard
- Real-time usage analytics
- Auto-refreshes every 5 seconds
- Beautiful charts and statistics
- Seamless auth integration

### Limits Management
- Set daily time limits for each platform
- Modal notifications when limits are reached
- Custom success/error messages

### Authentication
- Local authentication system (no external dependencies)
- User session sync between extension and dashboard
- 24-hour session persistence
- Real-time auth state updates across all components

## 🔧 Troubleshooting

### Extension Not Tracking?
1. Check the browser console for error messages
2. Ensure the extension is enabled in `chrome://extensions/`
3. Make sure you're logged in (check extension popup for user email)
4. Refresh social media pages after installing
5. Try reloading the extension if needed

### Dashboard Not Updating?
1. Ensure you're logged in with the same account as the extension
2. Check that the MCP server is running on port 3002
3. Refresh the dashboard page
4. Verify extension popup shows your email address

### Authentication Issues?
1. Clear browser localStorage and try again
2. Use the "Demo Login" option for quick testing
3. Check browser console for error messages
4. Try signing out from extension popup and back in
5. Ensure web bridge script is loaded (check browser console)

## 🎉 You're All Set!

Your Social Media Time Warden is ready to help you manage your social media usage. The system now uses a robust local authentication system that works offline and ensures your extension and dashboard stay synchronized.

Enjoy mindful social media usage! 🌟
