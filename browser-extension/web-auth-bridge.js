// Bridge script to sync authentication between web app and extension
// This runs on the web app pages to help the extension get auth state

console.log('Web auth bridge loaded');

// Listen for messages from extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAuthSession') {
    try {
      // Try to get Supabase session from localStorage
      const keys = Object.keys(localStorage);
      const supabaseKey = keys.find(key => key.startsWith('sb-') && key.includes('-auth-token'));
      
      if (supabaseKey) {
        const authData = localStorage.getItem(supabaseKey);
        if (authData) {
          const session = JSON.parse(authData);
          if (session.user && session.expires_at > Date.now() / 1000) {
            sendResponse({ userId: session.user.id, session: session });
            return;
          }
        }
      }
      
      sendResponse({ userId: null });
    } catch (error) {
      console.error('Error getting auth session:', error);
      sendResponse({ userId: null });
    }
  }
});

// Monitor auth state changes and notify extension
let lastUserId = null;

function checkAuthState() {
  try {
    const keys = Object.keys(localStorage);
    const supabaseKey = keys.find(key => key.startsWith('sb-') && key.includes('-auth-token'));
    
    if (supabaseKey) {
      const authData = localStorage.getItem(supabaseKey);
      if (authData) {
        const session = JSON.parse(authData);
        if (session.user && session.expires_at > Date.now() / 1000) {
          if (lastUserId !== session.user.id) {
            lastUserId = session.user.id;
            // Notify extension of auth change
            chrome.runtime.sendMessage({
              action: 'authStateChanged',
              userId: session.user.id,
              session: session
            });
          }
          return;
        }
      }
    }
    
    // No valid session
    if (lastUserId !== null) {
      lastUserId = null;
      chrome.runtime.sendMessage({
        action: 'authStateChanged',
        userId: null
      });
    }
  } catch (error) {
    console.error('Error monitoring auth state:', error);
  }
}

// Check auth state periodically
setInterval(checkAuthState, 5000);
checkAuthState(); // Initial check
