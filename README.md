# 🛡️ Social Media Time Warden

> **Winner of Postman Web Dev Challenge Hackathon** - A comprehensive digital wellbeing solution that helps you take control of your social media usage through real-time tracking, smart limits, and proactive interventions.

<div align="center">

![Social Media Time Warden](https://img.shields.io/badge/Hackathon-Postman%20Web%20Dev%20Challenge-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-green?style=for-the-badge)

</div>

## 🎯 Overview

Social Media Time Warden is a full-stack application that combines a **Chrome browser extension**, **web dashboard**, and **MCP-powered backend** to provide comprehensive social media usage tracking and management. Built specifically for the Postman Web Dev Challenge Hackathon, it demonstrates the power of modern web technologies working together for digital wellbeing.

### 🏆 Hackathon Features
- **MCP Server Integration**: Backend powered by Model Context Protocol
- **Real-time Browser Extension**: Manifest V3 Chrome extension with live tracking
- **Beautiful Web Dashboard**: Next.js 15 + React 19 frontend
- **Local Authentication**: Self-contained auth system for offline demo
- **Smart Interventions**: Proactive popups with snooze/close options

## 🚀 Key Features

### 📊 **Real-Time Usage Tracking**
- Automatically tracks time spent on major social media platforms
- Live session monitoring with 30-second precision
- Seamless background tracking across browser tabs

### ⏰ **Smart Daily Limits**
- Set custom time limits for each platform
- Real-time limit monitoring and enforcement
- Warning notifications at 80% of daily limit

### 🔔 **Proactive Interventions**
- Beautiful modal popups when limits are exceeded
- **Snooze** option: Extend limit by 5 minutes
- **Close Tab** option: Automatic tab closure for enforcement
- **Dismiss** option: Respect user autonomy

### 📈 **Analytics Dashboard**
- Clean, modern interface with real-time updates
- Daily usage statistics and trends
- Platform-specific insights and progress tracking

### 🔒 **Privacy-First Design**
- Local authentication system - no external dependencies
- All data stored locally or in your own database
- Complete offline functionality

## 🛠️ Tech Stack

### Backend (MCP Server)
- **Node.js + Express**: RESTful API server
- **Supabase**: PostgreSQL database (with local fallback)
- **CORS**: Cross-origin resource sharing enabled
- **Real-time APIs**: Live data synchronization

### Frontend (Web Dashboard)
- **Next.js 15**: Latest React framework with Turbopack
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Beautiful, responsive design
- **Real-time Updates**: Auto-refresh every 5 seconds

### Browser Extension
- **Manifest V3**: Latest Chrome extension standards
- **Service Worker**: Background time tracking
- **Content Scripts**: Real-time popup interventions
- **Chrome APIs**: Tab management and storage

## 📱 Supported Platforms

<div align="center">

| Platform | Tracking | Limits | Notifications |
|----------|----------|--------|---------------|
| 🐦 Twitter (X) | ✅ | ✅ | ✅ |
| 📘 Facebook | ✅ | ✅ | ✅ |
| 📷 Instagram | ✅ | ✅ | ✅ |
| 🎵 TikTok | ✅ | ✅ | ✅ |
| 📺 YouTube | ✅ | ✅ | ✅ |
| 👻 Snapchat | ✅ | ✅ | ✅ |

</div>

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ installed
- Chrome browser
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YonAndualem/social-media-time-warden.git
cd social-media-time-warden
```

### 2️⃣ Start Backend Server
```bash
cd mcp-server
npm install
npm start
# Server runs on http://localhost:3002
```

### 3️⃣ Start Web Dashboard
```bash
cd web-app
npm install
npm run dev
# Dashboard runs on http://localhost:3000
```

### 4️⃣ Install Browser Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder
5. Extension is now installed and active!

### 5️⃣ Start Tracking
1. Visit http://localhost:3000
2. Sign up or use "Demo Login"
3. Set daily limits for social media platforms
4. Browse social media - extension tracks automatically
5. Watch real-time updates in dashboard

## 📖 Documentation

### Setup Guides
- [📋 **Complete Setup Guide**](./SETUP.md) - Detailed installation instructions
- [🧪 **Testing Guide**](./POPUP_TESTING.md) - How to test real-time popups
- [🔧 **Extension Testing**](./EXTENSION_TESTING.md) - Browser extension validation

### API Documentation
- [📡 **Postman Notebook**](./docs/postman-notebook.md) - Complete API documentation
- [🗄️ **Database Schema**](./docs/supabase-setup.md) - Database setup and structure

## 🎮 How It Works

### 1. **Real-Time Tracking**
- Extension monitors active browser tabs
- Detects when you visit supported social media platforms
- Tracks time spent with 1-minute precision
- Sends data to MCP server every session

### 2. **Smart Limit Checking**
- Continuously monitors usage every 30 seconds
- Combines stored daily usage + current active session
- Triggers warnings at 80% of daily limit
- Shows intervention popup when limit exceeded

### 3. **User Interventions**
- Beautiful modal appears directly on social media page
- **Snooze**: Get 5 more minutes, limit temporarily extended
- **Close Tab**: Immediate tab closure for strict enforcement
- **Dismiss**: Continue browsing (respects user choice)

### 4. **Dashboard Analytics**
- Real-time usage statistics and trends
- Set and manage daily limits per platform
- Track progress towards digital wellbeing goals

## 🔧 Development

### Project Structure
```
social-media-time-warden/
├── browser-extension/          # Chrome extension
│   ├── manifest.json          # Extension configuration
│   ├── background.js           # Service worker
│   ├── content-script.js       # Page intervention
│   ├── popup.html/js           # Extension popup
│   └── auth.js                # Authentication sync
├── mcp-server/                # Backend API server
│   ├── server.js              # Express server
│   └── package.json           # Dependencies
├── web-app/                   # Next.js dashboard
│   ├── src/app/               # App router pages
│   ├── src/components/        # React components
│   └── public/                # Static assets
└── docs/                      # Documentation
    └── postman-notebook.md    # API documentation
```

### Key Files
- `background.js`: Real-time tracking and limit monitoring
- `content-script.js`: Beautiful intervention modals
- `server.js`: MCP server with 6 REST endpoints
- `Dashboard.tsx`: Real-time analytics interface
- `LimitsManager.tsx`: Limit setting and management

## 🏆 Hackathon Highlights

This project was built for the **Postman Web Dev Challenge Hackathon** and showcases:

### ✨ **Innovation**
- First-of-its-kind real-time social media intervention system
- Seamless integration between browser extension and web app
- Smart snooze functionality for balanced digital wellbeing

### 🛠️ **Technical Excellence**
- Modern tech stack with latest frameworks (Next.js 15, React 19)
- Clean, maintainable code with TypeScript
- Comprehensive error handling and fallbacks

### 🎨 **User Experience**
- Beautiful, intuitive interface design
- Smooth animations and interactions
- Non-intrusive but effective interventions

### 📊 **MCP Integration**
- RESTful API server built with MCP principles
- Real-time data synchronization
- Scalable architecture for future enhancements

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Postman**: For hosting the Web Dev Challenge Hackathon
- **Chrome Extension Team**: For excellent Manifest V3 documentation
- **Next.js Team**: For the amazing React framework
- **Supabase**: For the backend database solution

---

<div align="center">

**Built with ❤️ for the Postman Web Dev Challenge Hackathon**

[🌟 **Star this repo**](https://github.com/YonAndualem/social-media-time-warden) | [🐛 **Report Bug**](https://github.com/YonAndualem/social-media-time-warden/issues) | [💡 **Request Feature**](https://github.com/YonAndualem/social-media-time-warden/issues)

</div>
