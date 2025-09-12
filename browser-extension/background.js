// Background service worker for Social Media Time Warden
// Handles time tracking, data persistence, and notifications

const PLATFORMS = {
  'twitter.com': 'Twitter',
  'x.com': 'Twitter', 
  'facebook.com': 'Facebook',
  'www.facebook.com': 'Facebook',
  'instagram.com': 'Instagram',
  'www.instagram.com': 'Instagram',
  'tiktok.com': 'TikTok',
  'www.tiktok.com': 'TikTok',
  'youtube.com': 'YouTube',
  'www.youtube.com': 'YouTube',
  'snapchat.com': 'Snapchat',
  'www.snapchat.com': 'Snapchat'
};

const API_BASE_URL = 'http://localhost:3001';

let activeTabInfo = {
  tabId: null,
  platform: null,
  startTime: null,
  lastCheckTime: null,
  totalTimeToday: 0
};

// Import auth functions
importScripts('auth.js');

// Real-time limit checking interval
let limitCheckInterval = null;

// Listen for auth state changes from web app
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'authStateChanged') {
    if (request.user) {
      console.log('User signed in:', request.user.id);
      storeAuthSession(request.user);
    } else {
      console.log('User signed out');
      clearAuthSession();
    }
  } else if (request.action === 'closeCurrentTab') {
    // Close the current tab
    chrome.tabs.remove(sender.tab.id);
    console.log('Closed tab due to limit exceeded');
  } else if (request.action === 'snoozeLimit') {
    // Handle snooze request
    handleSnoozeLimit(request.platform, request.duration);
  } else if (request.action === 'restartRealTimeChecking') {
    // Restart real-time checking after snooze
    if (activeTabInfo.platform && !limitCheckInterval) {
      console.log('Restarting real-time checking after snooze');
      limitCheckInterval = setInterval(async () => {
        await checkLimitsRealTime();
      }, 30000);
    }
  }
});

// Track when user switches tabs or updates current tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await handleTabChange(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('Tab updated:', tabId, changeInfo, tab?.url);
  if (changeInfo.status === 'complete' && tab.active) {
    console.log('Handling tab change for:', tab.url);
    await handleTabChange(tabId);
  }
});

// Handle window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    await saveCurrentSession();
    resetActiveTab();
  } else {
    // Browser gained focus, check active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await handleTabChange(tab.id);
    }
  }
});

async function handleTabChange(tabId) {
  console.log('handleTabChange called for tabId:', tabId);
  
  // Save previous session if any
  await saveCurrentSession();
  
  // Clear any existing interval
  if (limitCheckInterval) {
    clearInterval(limitCheckInterval);
    limitCheckInterval = null;
  }
  
  // Get current tab info
  try {
    const tab = await chrome.tabs.get(tabId);
    console.log('Got tab info:', tab.url);
    
    const platform = getPlatformFromUrl(tab.url);
    console.log('Detected platform:', platform);
    
    if (platform) {
      // Get today's total time for this platform
      const userId = await getUserId();
      const today = new Date().toISOString().split('T')[0];
      const todayTotal = await getTodayUsage(userId, platform, today);
      
      // Start tracking new platform
      activeTabInfo = {
        tabId: tabId,
        platform: platform,
        startTime: Date.now(),
        lastCheckTime: Date.now(),
        totalTimeToday: todayTotal
      };
      console.log('Started tracking:', activeTabInfo);
      
      // Start real-time limit checking every 30 seconds
      limitCheckInterval = setInterval(async () => {
        await checkLimitsRealTime();
      }, 30000); // Check every 30 seconds
      
      // Also check immediately
      setTimeout(async () => {
        await checkLimitsRealTime();
      }, 5000); // Initial check after 5 seconds
      
    } else {
      // Not a tracked platform
      console.log('Not a tracked platform, resetting');
      resetActiveTab();
    }
  } catch (error) {
    console.error('Error getting tab info:', error);
    resetActiveTab();
  }
}

function getPlatformFromUrl(url) {
  if (!url) return null;
  
  try {
    const hostname = new URL(url).hostname;
    console.log('Checking hostname for platform:', hostname);
    const platform = PLATFORMS[hostname] || null;
    console.log('Platform detected:', platform);
    return platform;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

async function saveCurrentSession() {
  if (!activeTabInfo.platform || !activeTabInfo.startTime) {
    console.log('No active session to save');
    return;
  }
  
  const timeSpent = Math.floor((Date.now() - activeTabInfo.startTime) / 1000 / 60); // Convert to minutes
  
  console.log(`Attempting to save session: ${activeTabInfo.platform}, ${timeSpent} minutes`);
  
  if (timeSpent < 1) {
    console.log('Session too short, not saving');
    return; // Don't save sessions less than 1 minute
  }
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  try {
    const userId = await getUserId();
    if (!userId) {
      console.warn('No authenticated user found, cannot save session');
      return;
    }
    
    console.log(`Saving usage: userId=${userId}, platform=${activeTabInfo.platform}, date=${today}, time=${timeSpent}`);
    
    // Send usage data to MCP server with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_BASE_URL}/usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        platform: activeTabInfo.platform,
        date: today,
        time_spent: timeSpent
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.text();
    console.log(`Successfully saved ${timeSpent} minutes for ${activeTabInfo.platform}`);
    console.log('Server response:', responseData);
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out while saving usage data');
    } else {
      console.error('Error saving usage data:', error);
    }
    
    // Store locally if server is unavailable
    await storeUsageLocally(userId, activeTabInfo.platform, today, timeSpent);
  }
}

async function checkLimitsRealTime() {
  if (!activeTabInfo.platform || !activeTabInfo.startTime) {
    console.log('No active session for real-time check');
    return;
  }
  
  const currentTime = Date.now();
  const sessionTime = Math.floor((currentTime - activeTabInfo.startTime) / 1000 / 60); // Current session time in minutes
  const totalTimeToday = activeTabInfo.totalTimeToday + sessionTime; // Total time including current session
  
  console.log(`Real-time check - ${activeTabInfo.platform}: ${sessionTime}m this session, ${totalTimeToday}m today total`);
  
  try {
    const userId = await getUserId();
    if (!userId) {
      console.warn('No authenticated user for real-time check');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if platform is snoozed
    const snoozeData = await getSnoozeData(activeTabInfo.platform, today);
    if (snoozeData && snoozeData.isActive) {
      console.log(`${activeTabInfo.platform} is snoozed until ${new Date(snoozeData.endsAt).toLocaleTimeString()}`);
      return; // Skip limit check during snooze
    }

    // Get daily limits with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const limitsResponse = await fetch(`${API_BASE_URL}/limit?user_id=${userId}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!limitsResponse.ok) {
      throw new Error(`HTTP error! status: ${limitsResponse.status}`);
    }
    
    const limits = await limitsResponse.json();
    
    const platformLimit = limits.find(l => l.platform === activeTabInfo.platform);
    if (!platformLimit) {
      console.log(`No limit set for ${activeTabInfo.platform}`);
      return;
    }
    
    // Adjust limit if there are any snoozes applied today
    const adjustedLimit = platformLimit.daily_limit + (snoozeData ? snoozeData.totalSnoozeTime : 0);
    
    console.log(`Limit check: ${totalTimeToday}m used / ${adjustedLimit}m limit for ${activeTabInfo.platform}`);
    
    // Check if limit exceeded
    if (totalTimeToday >= adjustedLimit) {
      console.log(`LIMIT EXCEEDED: ${activeTabInfo.platform} - ${totalTimeToday}m >= ${adjustedLimit}m`);
      showLimitNotification(activeTabInfo.platform, totalTimeToday, adjustedLimit);
      
      // Stop the interval to avoid repeated notifications
      if (limitCheckInterval) {
        clearInterval(limitCheckInterval);
        limitCheckInterval = null;
      }
    } else if (totalTimeToday >= adjustedLimit * 0.8) {
      console.log(`WARNING: ${activeTabInfo.platform} - ${totalTimeToday}m >= ${adjustedLimit * 0.8}m (80% of limit)`);
      showWarningNotification(activeTabInfo.platform, totalTimeToday, adjustedLimit);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Real-time limit check timed out');
    } else {
      console.error('Error during real-time limit check:', error);
    }
    // Continue silently - don't disrupt user experience for limit check failures
  }
}

async function getTodayUsage(userId, platform, date) {
  try {
    if (!userId) {
      console.warn('No user ID provided for getTodayUsage');
      return 0;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch(`${API_BASE_URL}/usage?user_id=${userId}&date=${date}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const usage = await response.json();
    
    const platformUsage = usage.find(u => u.platform === platform);
    const totalTime = platformUsage ? platformUsage.time_spent : 0;
    
    console.log(`Today's usage for ${platform}: ${totalTime} minutes`);
    return totalTime;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Getting today usage timed out');
    } else {
      console.error('Error getting today usage:', error);
    }
    return 0;
  }
}

async function getUserId() {
  // First try to get authenticated user ID
  try {
    const authUserId = await getAuthenticatedUserId();
    if (authUserId) {
      console.log('Using authenticated user ID:', authUserId);
      return authUserId;
    }
  } catch (error) {
    console.log('No authenticated user, falling back to local storage');
  }

  // Fallback to local storage for backwards compatibility
  const result = await chrome.storage.local.get(['userId']);
  if (result.userId) {
    return result.userId;
  }
  
  // Generate new user ID if not exists (for demo/offline use)
  const newUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  await chrome.storage.local.set({ userId: newUserId });
  console.log('Generated new fallback user ID:', newUserId);
  return newUserId;
}

async function storeUsageLocally(userId, platform, date, timeSpent) {
  const key = `usage_${userId}_${platform}_${date}`;
  const result = await chrome.storage.local.get([key]);
  const existingTime = result[key] || 0;
  
  await chrome.storage.local.set({
    [key]: existingTime + timeSpent
  });
}

async function checkDailyLimit(userId, platform, date) {
  try {
    // Check if platform is snoozed
    const snoozeData = await getSnoozeData(platform, date);
    if (snoozeData && snoozeData.isActive) {
      console.log(`${platform} is snoozed until ${new Date(snoozeData.endsAt).toLocaleTimeString()}`);
      return; // Skip limit check during snooze
    }

    // Get daily limits
    const limitsResponse = await fetch(`${API_BASE_URL}/limit?user_id=${userId}`);
    const limits = await limitsResponse.json();
    
    const platformLimit = limits.find(l => l.platform === platform);
    if (!platformLimit) return;
    
    // Get today's usage
    const usageResponse = await fetch(`${API_BASE_URL}/usage?user_id=${userId}&date=${date}`);
    const usage = await usageResponse.json();
    
    const platformUsage = usage.find(u => u.platform === platform);
    const totalTime = platformUsage ? platformUsage.time_spent : 0;
    
    // Adjust limit if there are any snoozes applied today
    const adjustedLimit = platformLimit.daily_limit + (snoozeData ? snoozeData.totalSnoozeTime : 0);
    
    // Check if limit exceeded
    if (totalTime >= adjustedLimit) {
      showLimitNotification(platform, totalTime, adjustedLimit);
    } else if (totalTime >= adjustedLimit * 0.8) {
      showWarningNotification(platform, totalTime, adjustedLimit);
    }
    
  } catch (error) {
    console.error('Error checking daily limit:', error);
  }
}

function showLimitNotification(platform, used, limit) {
  console.log(`Showing limit notification for ${platform}: ${used}/${limit} minutes`);
  
  // Send modal message to current social media tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && getPlatformFromUrl(tab.url) === platform) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'showModal',
          type: 'limit',
          platform: platform,
          used: used,
          limit: limit
        }).catch(error => {
          console.log('Could not send modal message to tab:', error);
          // Fallback to system notification
          showSystemNotification(platform, used, limit, 'limit');
        });
      }
    });
  });
}

function showWarningNotification(platform, used, limit) {
  console.log(`Showing warning notification for ${platform}: ${used}/${limit} minutes`);
  
  // Send modal message to current social media tab
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && getPlatformFromUrl(tab.url) === platform) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'showModal',
          type: 'warning',
          platform: platform,
          used: used,
          limit: limit
        }).catch(error => {
          console.log('Could not send modal message to tab:', error);
          // Fallback to system notification
          showSystemNotification(platform, used, limit, 'warning');
        });
      }
    });
  });
}

function showSystemNotification(platform, used, limit, type) {
  // System notification fallback
  if (type === 'limit') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Daily Limit Exceeded!',
      message: `You've spent ${used} minutes on ${platform} today (limit: ${limit} minutes). Consider taking a break!`
    });
  } else {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Approaching Daily Limit',
      message: `You've spent ${used} minutes on ${platform} today (limit: ${limit} minutes). ${limit - used} minutes remaining.`
    });
  }
}

function resetActiveTab() {
  // Clear any existing interval
  if (limitCheckInterval) {
    clearInterval(limitCheckInterval);
    limitCheckInterval = null;
  }
  
  activeTabInfo = {
    tabId: null,
    platform: null,
    startTime: null,
    lastCheckTime: null,
    totalTimeToday: 0
  };
}

// Snooze functionality
async function handleSnoozeLimit(platform, durationMinutes) {
  const today = new Date().toISOString().split('T')[0];
  const now = Date.now();
  const endsAt = now + (durationMinutes * 60 * 1000);
  
  console.log(`Snoozing ${platform} for ${durationMinutes} minutes`);
  
  // Store snooze data
  const snoozeKey = `snooze_${platform}_${today}`;
  const existingSnooze = await chrome.storage.local.get([snoozeKey]);
  
  let snoozeData;
  if (existingSnooze[snoozeKey]) {
    // Update existing snooze
    snoozeData = existingSnooze[snoozeKey];
    snoozeData.totalSnoozeTime += durationMinutes;
    snoozeData.endsAt = endsAt;
    snoozeData.isActive = true;
  } else {
    // Create new snooze
    snoozeData = {
      platform: platform,
      date: today,
      totalSnoozeTime: durationMinutes,
      endsAt: endsAt,
      isActive: true,
      createdAt: now
    };
  }
  
  await chrome.storage.local.set({ [snoozeKey]: snoozeData });
  
  // Set alarm to end snooze
  chrome.alarms.create(`snooze_end_${platform}_${today}`, {
    when: endsAt
  });
  
  console.log('Snooze activated:', snoozeData);
}

async function getSnoozeData(platform, date) {
  const snoozeKey = `snooze_${platform}_${date}`;
  const result = await chrome.storage.local.get([snoozeKey]);
  
  if (result[snoozeKey]) {
    const snoozeData = result[snoozeKey];
    
    // Check if snooze is still active
    if (snoozeData.isActive && Date.now() < snoozeData.endsAt) {
      return snoozeData;
    } else if (snoozeData.isActive && Date.now() >= snoozeData.endsAt) {
      // Snooze expired, mark as inactive
      snoozeData.isActive = false;
      await chrome.storage.local.set({ [snoozeKey]: snoozeData });
      return snoozeData; // Still return for totalSnoozeTime
    }
    
    return snoozeData;
  }
  
  return null;
}

// Handle alarm events (snooze endings)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('snooze_end_')) {
    const parts = alarm.name.split('_');
    const platform = parts[2];
    const date = parts[3];
    
    console.log(`Snooze ended for ${platform} on ${date}`);
    
    // Mark snooze as inactive
    const snoozeKey = `snooze_${platform}_${date}`;
    const result = await chrome.storage.local.get([snoozeKey]);
    
    if (result[snoozeKey]) {
      const snoozeData = result[snoozeKey];
      snoozeData.isActive = false;
      await chrome.storage.local.set({ [snoozeKey]: snoozeData });
    }
    
    // If user is still on the same platform, restart real-time checking
    if (activeTabInfo.platform === platform) {
      console.log(`Restarting real-time checks for ${platform} after snooze ended`);
      
      // Restart interval checking
      if (limitCheckInterval) {
        clearInterval(limitCheckInterval);
      }
      
      limitCheckInterval = setInterval(async () => {
        await checkLimitsRealTime();
      }, 30000); // Check every 30 seconds
      
      // Check immediately
      await checkLimitsRealTime();
    }
  }
});

// Save session when extension is suspended
chrome.runtime.onSuspend.addListener(async () => {
  await saveCurrentSession();
});

console.log('Social Media Time Warden background script loaded');
