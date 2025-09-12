# Tech Stack & Architecture

## Selected Tech Stack

### Backend (MCP Server)
- **Framework**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Purpose**: Handle API requests from browser extension and web app

### Frontend (Web App)
- **Framework**: Next.js (React-based)
- **Purpose**: Dashboard for viewing usage stats, setting limits, managing preferences

### Browser Extension
- **Type**: Manifest V3 (Chrome/Edge focused)
- **Purpose**: Track time spent on social media platforms

### Documentation
- **Tool**: Postman Notebook
- **Purpose**: Document API endpoints and demonstrate workflows

## Architecture Overview

```
Browser Extension (Manifest V3)
    ↓ (tracks usage data)
    ↓ (HTTP requests)
MCP Server (Node.js + Express)
    ↓ (stores/retrieves data)
    ↓ (Supabase API)
Supabase Database (PostgreSQL)
    ↑ (queries data)
    ↑ (REST API)
Next.js Web App (Dashboard)
```

## Data Flow

1. **Extension** → Monitors active tabs and tracks time on social media sites
2. **Extension** → Sends usage data to MCP Server via REST API
3. **MCP Server** → Stores data in Supabase database
4. **Web App** → Fetches usage stats and limits from MCP Server
5. **Web App** → Displays analytics, allows setting limits
6. **Extension** → Checks limits and shows notifications when exceeded

## Development Plan

1. Set up Supabase database and tables
2. Create MCP Server with Express and API endpoints
3. Build browser extension with time tracking
4. Develop Next.js web app with dashboard
5. Create Postman Notebook documentation
6. Test integration and deploy
