// User ID Synchronization Tool
// Run this in the browser console on the dashboard page to sync user IDs

console.log('=== User ID Debug Tool ===');

// Check what's in localStorage
const dashboardUserId = localStorage.getItem('smtw_user_id');
console.log('Dashboard User ID (localStorage):', dashboardUserId);

// Check what's in extension storage (if available)
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get(['userId'], (result) => {
    console.log('Extension User ID (chrome.storage):', result.userId);
    
    if (result.userId && dashboardUserId !== result.userId) {
      console.log('🔄 User IDs are different! Syncing dashboard to extension...');
      localStorage.setItem('smtw_user_id', result.userId);
      console.log('✅ Synced! Reloading page...');
      window.location.reload();
    } else if (result.userId === dashboardUserId) {
      console.log('✅ User IDs are already synchronized');
    } else {
      console.log('⚠️ No extension user ID found');
    }
  });
} else {
  console.log('❌ Chrome extension API not available');
}

// Function to manually set user ID
window.setUserId = function(userId) {
  localStorage.setItem('smtw_user_id', userId);
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ userId: userId });
  }
  console.log('Set user ID to:', userId);
  window.location.reload();
};

console.log('💡 To manually set user ID, run: setUserId("your-user-id")');
