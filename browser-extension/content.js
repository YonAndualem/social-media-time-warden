// Content script for Social Media Time Warden
// Runs on social media pages to enhance tracking and provide notifications

console.log('Social Media Time Warden content script loaded on:', window.location.hostname);

// Add visual indicator that time is being tracked
function addTrackingIndicator() {
  // Avoid duplicate indicators
  if (document.getElementById('smtw-indicator')) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'smtw-indicator';
  indicator.innerHTML = '⏱️ Time Warden Active';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    opacity: 0.8;
    transition: opacity 0.3s;
  `;
  
  document.body.appendChild(indicator);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (indicator) {
      indicator.style.opacity = '0';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  }, 3000);
}

// Show tracking indicator when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addTrackingIndicator);
} else {
  addTrackingIndicator();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LIMIT_WARNING') {
    showLimitWarningBanner(message.platform, message.timeUsed, message.limit);
  } else if (message.type === 'LIMIT_EXCEEDED') {
    showLimitExceededBanner(message.platform, message.timeUsed, message.limit);
  }
});

function showLimitWarningBanner(platform, timeUsed, limit) {
  removePreviousBanners();
  
  const banner = document.createElement('div');
  banner.id = 'smtw-warning-banner';
  banner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <strong>⚠️ Approaching Daily Limit</strong><br>
        You've spent ${timeUsed} minutes on ${platform} today (limit: ${limit} minutes)
      </div>
      <button onclick="this.parentNode.parentNode.style.display='none'" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
    </div>
  `;
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #FF9800;
    color: white;
    padding: 15px 20px;
    font-family: Arial, sans-serif;
    z-index: 10001;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(banner);
}

function showLimitExceededBanner(platform, timeUsed, limit) {
  removePreviousBanners();
  
  const banner = document.createElement('div');
  banner.id = 'smtw-exceeded-banner';
  banner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <div>
        <strong>🚫 Daily Limit Exceeded!</strong><br>
        You've spent ${timeUsed} minutes on ${platform} today (limit: ${limit} minutes). Consider taking a break!
      </div>
      <button onclick="this.parentNode.parentNode.style.display='none'" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
    </div>
  `;
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #F44336;
    color: white;
    padding: 15px 20px;
    font-family: Arial, sans-serif;
    z-index: 10001;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    animation: pulse 2s infinite;
  `;
  
  // Add pulsing animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.8; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(banner);
}

function removePreviousBanners() {
  const existingBanners = document.querySelectorAll('#smtw-warning-banner, #smtw-exceeded-banner');
  existingBanners.forEach(banner => banner.remove());
}
