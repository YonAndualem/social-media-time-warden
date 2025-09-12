// Local authentication client for browser extension
// Syncs with the web app's local authentication system

// Get authenticated user ID from local auth system
async function getAuthenticatedUserId() {
  try {
    // First check if we have a stored user from the web app sync
    const result = await chrome.storage.local.get(['local_auth_user']);
    if (result.local_auth_user) {
      const user = JSON.parse(result.local_auth_user);
      console.log('Extension using authenticated user ID:', user.id);
      return user.id;
    }

    // Try to get user from web app if available
    return await checkWebAppAuth();
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

async function checkWebAppAuth() {
  try {
    return new Promise((resolve) => {
      // Check if dashboard is open and get auth state
      chrome.tabs.query({url: 'http://localhost:3000/*'}, (tabs) => {
        if (tabs.length > 0) {
          // Execute script to get user session from web app
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const storedUser = localStorage.getItem('smtw_user');
              return storedUser ? JSON.parse(storedUser) : null;
            }
          }, (results) => {
            if (results && results[0] && results[0].result) {
              const user = results[0].result;
              // Store the user in extension storage
              chrome.storage.local.set({ local_auth_user: JSON.stringify(user) });
              resolve(user.id);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error checking web app auth:', error);
    return null;
  }
}

// Store auth session when user signs in (called from web app)
async function storeAuthSession(user) {
  await chrome.storage.local.set({
    local_auth_user: JSON.stringify(user)
  });
  console.log('Stored auth session for user:', user.id);
}

// Clear auth session when user signs out
async function clearAuthSession() {
  await chrome.storage.local.remove(['local_auth_user']);
  console.log('Cleared auth session');
}

// Export functions for use in background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAuthenticatedUserId,
    storeAuthSession,
    clearAuthSession
  };
}
