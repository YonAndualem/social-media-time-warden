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
    return new Promise((resolve, reject) => {
      // Check if dashboard is open and get auth state
      chrome.tabs.query({url: 'http://localhost:3000/*'}, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        if (tabs.length > 0) {
          // Execute script to get user session from web app
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              try {
                // Check session storage for authentication
                const sessionToken = sessionStorage.getItem('smtw_session_token');
                const storedUser = sessionStorage.getItem('smtw_user');
                
                if (sessionToken && storedUser) {
                  return JSON.parse(storedUser);
                }
                return null;
              } catch (error) {
                console.error('Error getting user from sessionStorage:', error);
                return null;
              }
            }
          }, (results) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
              return;
            }
            
            if (results && results[0] && results[0].result) {
              const user = results[0].result;
              // Store the user in extension storage
              chrome.storage.local.set({ local_auth_user: JSON.stringify(user) }, () => {
                if (chrome.runtime.lastError) {
                  console.error('Error storing auth session:', chrome.runtime.lastError);
                }
                resolve(user.id);
              });
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
  try {
    if (!user || !user.id) {
      throw new Error('Invalid user object provided');
    }
    
    await chrome.storage.local.set({
      local_auth_user: JSON.stringify(user)
    });
    console.log('Stored auth session for user:', user.id);
  } catch (error) {
    console.error('Error storing auth session:', error);
    throw error;
  }
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
