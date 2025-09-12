# Testing Your Real-Time Limit Notification System

## 🚀 Test the Real-Time Popup Notifications

Your extension now has **real-time** automatic popup notifications that appear while you're actively using social media, not just when sessions end! Here's how to test it:

### Step 1: Update Your Extension
1. Go to `chrome://extensions/`
2. Find "Social Media Time Warden" 
3. Click the refresh/reload button to update with new changes
4. Ensure it's enabled

### Step 2: Set a Low Twitter Limit (for testing)
1. Go to http://localhost:3000
2. Login if not already logged in
3. Click "⚙️ Manage Limits"
4. Set Twitter limit to **1 minute** (for easy testing)
5. Save the limit

### Step 3: Test Real-Time Detection
1. Open a new tab and go to twitter.com (or x.com)
2. Stay on the page and browse normally
3. **Within 30-60 seconds after exceeding the limit**, you should see the popup appear
4. The popup shows real-time usage including your current active session

### Step 4: Real-Time Features
- ✅ **Checks every 30 seconds** while you're on social media
- ✅ **Immediate detection** when you cross the limit threshold  
- ✅ **Live session tracking** - includes current active time
- ✅ **No waiting** for tab switches or page closes

### Step 5: Test the Actions

#### Test Snooze:
1. Click "⏰ Snooze 5min" 
2. You should see a green confirmation: "Snoozed for 5 minutes!"
3. Your limit is temporarily extended by 5 minutes
4. Continue using Twitter - no more popups for 5 minutes

#### Test Close Tab:
1. Trigger the limit again (after snooze expires or use test button)
2. Click "❌ Close Tab"
3. The Twitter tab should automatically close

#### Test Dismiss:
1. Click "✋ Dismiss" to just close the popup

### Step 6: Check Dashboard Integration
1. Return to the dashboard (http://localhost:3000)
2. You should see your Twitter usage reflected
3. The time tracking continues normally

## 🎯 What You Should See

### Real-Time Detection:
- ✅ Popup appears **while browsing** Twitter, not after leaving
- ✅ Shows combined time: previous sessions + current active session
- ✅ Updates every 30 seconds with fresh data from server
- ✅ Warning at 80% of limit, limit exceeded popup at 100%

### Visual Popup Features:
- ✅ Beautiful modal overlay covering the entire page
- ✅ Slide-in animation effect
- ✅ Red warning colors for limit exceeded
- ✅ Clear usage statistics (minutes used vs limit)
- ✅ Three action buttons with hover effects
- ✅ Professional design matching your app

### Functional Features:
- ✅ Popup appears automatically when limit exceeded **in real-time**
- ✅ Snooze extends limit temporarily and restarts checking
- ✅ Close tab action works immediately
- ✅ Dismiss allows continuing (if user chooses)
- ✅ Integration with existing tracking system

### Smart Real-Time Behavior:
- ✅ Continuous monitoring every 30 seconds while on social media
- ✅ Combines stored usage + current session time
- ✅ Stops checking during snooze periods
- ✅ Automatically resumes checking when snooze expires
- ✅ Only shows on the social media platform that exceeded limit

## 🐛 Troubleshooting

**Popup not appearing in real-time?**
1. Check browser console on Twitter page for errors
2. Verify extension is reloaded after changes  
3. Ensure content script permissions are working
4. Wait at least 30-60 seconds after crossing limit
5. Check background console for "Real-time check" logs

**Real-time checking not working?**
1. Verify you see "Started tracking" messages in background console
2. Look for "Real-time check" logs every 30 seconds
3. Check if limits are set correctly in dashboard
4. Ensure you're logged in (check extension popup for user email)

**Snooze not working?**
1. Check extension background console for snooze logs
2. Verify alarms permission is granted
3. Test with a fresh browser session

**Close tab not working?**
1. Ensure tabs permission is granted in extension
2. Check for popup blockers interfering

Your Twitter limit notification system is now ready to help you maintain healthy social media habits! 🌟
