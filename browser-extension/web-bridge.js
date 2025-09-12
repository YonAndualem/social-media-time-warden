// Bridge between web app and extension for auth synchronization

// Listen for auth state changes in the web app
function syncAuthWithExtension() {
  const user = localStorage.getItem('smtw_user');
  
  if (user) {
    // User is signed in, notify extension
    chrome.runtime.sendMessage({
      action: 'authStateChanged',
      user: JSON.parse(user)
    }).catch(() => {
      // Extension might not be installed, ignore
    });
  } else {
    // User is signed out, notify extension
    chrome.runtime.sendMessage({
      action: 'authStateChanged',
      user: null
    }).catch(() => {
      // Extension might not be installed, ignore
    });
  }
}

// Watch for localStorage changes
window.addEventListener('storage', (e) => {
  if (e.key === 'smtw_user') {
    syncAuthWithExtension();
  }
});

// Initial sync
syncAuthWithExtension();

// Listen for messages from extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAuthSession') {
    const user = localStorage.getItem('smtw_user');
    sendResponse({
      user: user ? JSON.parse(user) : null
    });
  }
});
