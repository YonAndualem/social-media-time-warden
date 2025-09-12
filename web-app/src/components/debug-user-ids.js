// Debug script to check and sync user IDs between extension and dashboard

// Function to get extension user ID
async function getExtensionUserId() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      const result = await chrome.storage.local.get(['userId']);
      return result.userId;
    } catch (error) {
      console.error('Could not access extension storage:', error);
      return null;
    }
  }
  return null;
}

// Function to get dashboard user ID
function getDashboardUserId() {
  return localStorage.getItem('smtw_user_id');
}

// Function to sync user IDs
async function syncUserIds() {
  const extensionUserId = await getExtensionUserId();
  const dashboardUserId = getDashboardUserId();
  
  console.log('Extension User ID:', extensionUserId);
  console.log('Dashboard User ID:', dashboardUserId);
  
  if (extensionUserId && dashboardUserId && extensionUserId !== dashboardUserId) {
    console.log('User IDs are different! Syncing...');
    
    // Use the extension ID as the master (since it has the tracking data)
    localStorage.setItem('smtw_user_id', extensionUserId);
    console.log('Synced dashboard to use extension user ID:', extensionUserId);
    
    // Reload the page to update the dashboard
    window.location.reload();
  } else if (extensionUserId && !dashboardUserId) {
    console.log('Dashboard has no user ID, using extension ID');
    localStorage.setItem('smtw_user_id', extensionUserId);
    window.location.reload();
  } else if (!extensionUserId && dashboardUserId) {
    console.log('Extension has no user ID, setting it to dashboard ID');
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ userId: dashboardUserId });
    }
  } else if (extensionUserId === dashboardUserId) {
    console.log('User IDs are synchronized:', extensionUserId);
  } else {
    console.log('No user IDs found, will generate new ones');
  }
}

// Auto-run sync when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncUserIds);
} else {
  syncUserIds();
}

// Expose functions globally for manual debugging
window.debugUserIds = {
  getExtensionUserId,
  getDashboardUserId,
  syncUserIds
};
