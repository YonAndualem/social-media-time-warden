// Content script for displaying limit notifications on social media pages
(function() {
  console.log('Social Media Time Warden content script loaded');

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'showModal') {
      showLimitModal(request);
    }
  });

  function showLimitModal(data) {
    // Remove any existing modal
    const existingModal = document.getElementById('smtw-limit-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'smtw-limit-modal';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      text-align: center;
      position: relative;
      animation: slideIn 0.3s ease-out;
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Modal content based on type
    let title, message, icon, color;
    
    if (data.type === 'limit') {
      title = '⏰ Daily Limit Exceeded!';
      message = `You've spent <strong>${data.used} minutes</strong> on ${data.platform} today.<br>Your limit is <strong>${data.limit} minutes</strong>.`;
      icon = '🚫';
      color = '#e74c3c';
    } else if (data.type === 'warning') {
      title = '⚠️ Approaching Limit';
      message = `You've spent <strong>${data.used} minutes</strong> on ${data.platform} today.<br>You have <strong>${data.limit - data.used} minutes</strong> remaining.`;
      icon = '⚠️';
      color = '#f39c12';
    }

    modalContent.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 15px;">${icon}</div>
      <h2 style="margin: 0 0 15px 0; color: ${color}; font-size: 24px;">${title}</h2>
      <p style="margin: 0 0 25px 0; color: #333; font-size: 16px; line-height: 1.5;">${message}</p>
      <div style="margin-bottom: 20px;">
        <p style="color: #666; font-size: 14px; margin: 0;">Consider taking a break for your digital wellbeing!</p>
      </div>
      <div id="smtw-modal-buttons" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        ${data.type === 'limit' ? `
          <button id="smtw-snooze-btn" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
          ">⏰ Snooze 5min</button>
          <button id="smtw-close-tab-btn" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
          ">❌ Close Tab</button>
        ` : ''}
        <button id="smtw-dismiss-btn" style="
          background: #95a5a6;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        ">✋ Dismiss</button>
      </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Add button event listeners
    const snoozeBtn = document.getElementById('smtw-snooze-btn');
    const closeTabBtn = document.getElementById('smtw-close-tab-btn');
    const dismissBtn = document.getElementById('smtw-dismiss-btn');

    if (snoozeBtn) {
      snoozeBtn.addEventListener('click', () => {
        handleSnooze();
        modalOverlay.remove();
      });
      snoozeBtn.addEventListener('mouseenter', () => {
        snoozeBtn.style.background = '#2980b9';
      });
      snoozeBtn.addEventListener('mouseleave', () => {
        snoozeBtn.style.background = '#3498db';
      });
    }

    if (closeTabBtn) {
      closeTabBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'closeCurrentTab' });
        modalOverlay.remove();
      });
      closeTabBtn.addEventListener('mouseenter', () => {
        closeTabBtn.style.background = '#c0392b';
      });
      closeTabBtn.addEventListener('mouseleave', () => {
        closeTabBtn.style.background = '#e74c3c';
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        modalOverlay.remove();
      });
      dismissBtn.addEventListener('mouseenter', () => {
        dismissBtn.style.background = '#7f8c8d';
      });
      dismissBtn.addEventListener('mouseleave', () => {
        dismissBtn.style.background = '#95a5a6';
      });
    }

    // Auto-dismiss after 30 seconds for warnings
    if (data.type === 'warning') {
      setTimeout(() => {
        if (document.getElementById('smtw-limit-modal')) {
          modalOverlay.remove();
        }
      }, 30000);
    }

    console.log('Limit modal displayed for:', data.platform);
  }

  function handleSnooze() {
    console.log('Snooze requested for 5 minutes');
    
    // Send snooze request to background script
    chrome.runtime.sendMessage({ 
      action: 'snoozeLimit',
      platform: getCurrentPlatform(),
      duration: 5 // 5 minutes
    });

    // Show snooze confirmation
    showSnoozeConfirmation();
    
    // Notify background to restart checking after snooze
    setTimeout(() => {
      chrome.runtime.sendMessage({ 
        action: 'restartRealTimeChecking'
      });
    }, 1000);
  }

  function showSnoozeConfirmation() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2ecc71;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      animation: slideInRight 0.3s ease-out;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 18px;">⏰</span>
        <span><strong>Snoozed for 5 minutes!</strong><br>Your limit will be temporarily extended.</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function getCurrentPlatform() {
    const hostname = window.location.hostname;
    const platforms = {
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
    return platforms[hostname] || 'Unknown';
  }

  console.log('Content script ready for platform:', getCurrentPlatform());
})();
