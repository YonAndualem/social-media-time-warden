// Web bridge for auth synchronization between dashboard and extension
(function() {
  console.log('Web bridge loaded for Social Media Time Warden');
  
  // Function to notify extension of auth state changes
  function notifyExtensionAuthChange(user) {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          action: 'authStateChanged',
          user: user
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Extension not available:', chrome.runtime.lastError);
          } else {
            console.log('Auth state synced with extension:', user ? user.email : 'signed out');
          }
        });
      }
    } catch (error) {
      console.log('Extension communication not available:', error);
    }
  }

  // Monitor auth state changes
  function checkAuthState() {
    const storedUser = localStorage.getItem('smtw_user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    
    // Store current state to compare with future checks
    if (!window.lastKnownUser) {
      window.lastKnownUser = currentUser;
      if (currentUser) {
        notifyExtensionAuthChange(currentUser);
      }
      return;
    }
    
    // Check if auth state changed
    const wasLoggedIn = !!window.lastKnownUser;
    const isLoggedIn = !!currentUser;
    
    if (wasLoggedIn !== isLoggedIn || 
        (currentUser && window.lastKnownUser && currentUser.id !== window.lastKnownUser.id)) {
      console.log('Auth state changed:', { 
        wasLoggedIn, 
        isLoggedIn, 
        user: currentUser ? currentUser.email : null 
      });
      
      window.lastKnownUser = currentUser;
      notifyExtensionAuthChange(currentUser);
    }
  }

  // Check auth state immediately and then periodically
  checkAuthState();
  setInterval(checkAuthState, 1000);

  // Listen for storage events (when user logs in/out in another tab)
  window.addEventListener('storage', (event) => {
    if (event.key === 'smtw_user') {
      console.log('Auth storage changed, checking state');
      checkAuthState();
    }
  });

  // Override localStorage setItem to catch auth changes
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    if (key === 'smtw_user') {
      setTimeout(checkAuthState, 100); // Small delay to ensure state is updated
    }
  };

  // Override localStorage removeItem to catch auth changes
  const originalRemoveItem = localStorage.removeItem;
  localStorage.removeItem = function(key) {
    originalRemoveItem.call(this, key);
    if (key === 'smtw_user') {
      setTimeout(checkAuthState, 100);
    }
  };

  console.log('Web bridge authentication monitoring active');
})();
