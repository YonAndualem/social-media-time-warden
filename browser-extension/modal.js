// Modal notification system for Social Media Time Warden
// Creates prominent modal dialogs for limit notifications

function createModal(type, platform, used, limit) {
  // Remove any existing modals
  const existingModal = document.getElementById('smtw-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'smtw-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease-out;
  `;

  // Add animation keyframes
  if (!document.getElementById('smtw-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'smtw-modal-styles';
    style.textContent = `
      @keyframes modalSlideIn {
        from {
          transform: scale(0.8) translateY(-50px);
          opacity: 0;
        }
        to {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  let icon, title, message, buttonColor;

  if (type === 'limit') {
    icon = '🚨';
    title = 'Daily Limit Exceeded!';
    message = `You've spent <strong>${used} minutes</strong> on ${platform} today.<br>Your limit is <strong>${limit} minutes</strong>.<br><br>Consider taking a break to maintain healthy digital habits!`;
    buttonColor = '#e53e3e';
  } else {
    icon = '⚠️';
    title = 'Approaching Daily Limit';
    message = `You've spent <strong>${used} minutes</strong> on ${platform} today.<br>Your limit is <strong>${limit} minutes</strong>.<br><br>You have <strong>${limit - used} minutes</strong> remaining.`;
    buttonColor = '#ffa500';
  }

  modalContent.innerHTML = `
    <div style="font-size: 60px; margin-bottom: 20px;">${icon}</div>
    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">${title}</h2>
    <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">${message}</p>
    <div style="display: flex; gap: 15px; justify-content: center;">
      <button id="smtw-take-break" style="
        background: ${buttonColor};
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      ">Take a Break</button>
      <button id="smtw-continue" style="
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
      ">Continue (5 min)</button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Add hover effects
  const takeBreakBtn = modal.querySelector('#smtw-take-break');
  const continueBtn = modal.querySelector('#smtw-continue');

  takeBreakBtn.addEventListener('mouseenter', () => {
    takeBreakBtn.style.transform = 'scale(1.05)';
  });
  takeBreakBtn.addEventListener('mouseleave', () => {
    takeBreakBtn.style.transform = 'scale(1)';
  });

  continueBtn.addEventListener('mouseenter', () => {
    continueBtn.style.background = 'rgba(255, 255, 255, 0.3)';
  });
  continueBtn.addEventListener('mouseleave', () => {
    continueBtn.style.background = 'rgba(255, 255, 255, 0.2)';
  });

  // Handle button clicks
  takeBreakBtn.addEventListener('click', () => {
    window.close(); // Try to close the tab
    if (!window.closed) {
      // If tab can't be closed, redirect to a break page
      window.location.href = 'data:text/html,<h1 style="text-align:center;font-family:Arial;color:#667eea;margin-top:100px;">Take a break! 🧘‍♀️<br><small>Close this tab when you\'re ready.</small></h1>';
    }
  });

  continueBtn.addEventListener('click', () => {
    modal.remove();
    // Set a reminder to show modal again in 5 minutes if still on the platform
    setTimeout(() => {
      // Check if still on the same platform
      if (window.location.hostname.includes(platform.toLowerCase())) {
        createModal(type, platform, used + 5, limit);
      }
    }, 5 * 60 * 1000); // 5 minutes
  });

  // Allow closing with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modal.remove();
    }
  });

  // Prevent clicking outside to close (force user to make a choice)
  modal.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showModal') {
    createModal(request.type, request.platform, request.used, request.limit);
  }
});
