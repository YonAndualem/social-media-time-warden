// Popup script for Social Media Time Warden extension

const API_BASE_URL = 'http://localhost:3002';

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthState();
  
  // Set up button event listeners
  document.getElementById('openDashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' }); // Next.js app URL
  });
  
  document.getElementById('setLimits').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000/limits' }); // Limits page
  });

  document.getElementById('openLoginBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' }); // Open login page
  });

  document.getElementById('signOutBtn').addEventListener('click', async () => {
    await signOut();
  });
});

async function checkAuthState() {
  try {
    const user = await getCurrentAuthenticatedUser();
    
    if (user) {
      showUserInfo(user);
      await loadTodayStats(user.id);
    } else {
      showLoginPrompt();
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
    showLoginPrompt();
  }
}

function showUserInfo(user) {
  document.getElementById('userInfo').style.display = 'block';
  document.getElementById('loginPrompt').style.display = 'none';
  document.getElementById('userEmail').textContent = user.email;
}

function showLoginPrompt() {
  document.getElementById('userInfo').style.display = 'none';
  document.getElementById('loginPrompt').style.display = 'block';
  document.getElementById('content').innerHTML = '<div class="no-data">Please log in to view your stats</div>';
}

async function signOut() {
  try {
    // Clear local auth data
    await chrome.storage.local.remove(['local_auth_user']);
    
    // Notify background script
    chrome.runtime.sendMessage({
      action: 'authStateChanged',
      user: null
    });

    // Notify web app if open
    try {
      chrome.tabs.query({url: 'http://localhost:3000/*'}, (tabs) => {
        if (tabs.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              localStorage.removeItem('smtw_user');
              localStorage.removeItem('smtw_session');
              window.location.reload();
            }
          });
        }
      });
    } catch (error) {
      console.log('Web app not open, skipping notification');
    }

    // Update UI
    showLoginPrompt();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

async function getCurrentAuthenticatedUser() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['local_auth_user'], (result) => {
      if (result.local_auth_user) {
        try {
          const user = JSON.parse(result.local_auth_user);
          resolve(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

async function loadTodayStats(userId) {
  const contentDiv = document.getElementById('content');
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    console.log('Extension popup - User ID:', userId);
    console.log('Extension popup - Date:', today);
    
    // Fetch today's usage data
    const response = await fetch(`${API_BASE_URL}/usage?user_id=${userId}&date=${today}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch usage data');
    }
    
    const usageData = await response.json();
    console.log('Extension popup - Usage data:', usageData);
    
    if (usageData.length === 0) {
      contentDiv.innerHTML = '<div class="no-data">No social media usage today! 🎉</div>';
      return;
    }
    
    // Display usage stats
    let statsHTML = '<div class="stats-container">';
    
    usageData.forEach(item => {
      const hours = Math.floor(item.time_spent / 60);
      const minutes = item.time_spent % 60;
      const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      statsHTML += `
        <div class="stat-item">
          <span class="platform-name">${getPlatformEmoji(item.platform)} ${item.platform}</span>
          <span class="time-spent">${timeText}</span>
        </div>
      `;
    });
    
    statsHTML += '</div>';
    
    // Add total time
    const totalMinutes = usageData.reduce((sum, item) => sum + item.time_spent, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const totalTimeText = totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    
    statsHTML += `
      <div class="stats-container">
        <div class="stat-item">
          <span class="platform-name"><strong>📱 Total Time</strong></span>
          <span class="time-spent"><strong>${totalTimeText}</strong></span>
        </div>
      </div>
    `;
    
    contentDiv.innerHTML = statsHTML;
    
  } catch (error) {
    console.error('Error loading stats:', error);
    contentDiv.innerHTML = `
      <div class="no-data">
        Unable to load stats<br>
        <small>Make sure the server is running</small>
      </div>
    `;
  }
}

function getPlatformEmoji(platform) {
  const emojis = {
    'Twitter': '🐦',
    'Facebook': '📘',
    'Instagram': '📷',
    'TikTok': '🎵',
    'YouTube': '📺',
    'Snapchat': '👻'
  };
  return emojis[platform] || '🌐';
}
