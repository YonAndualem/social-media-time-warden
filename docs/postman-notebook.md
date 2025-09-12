# Postman Notebook - Social Media Time Warden API

## Overview
This Postman Notebook documents the API endpoints for the Social Media Time Warden MCP Server. The server provides RESTful endpoints for tracking social media usage, managing daily limits, and retrieving analytics data.

**Base URL**: `http://localhost:3001`

## Authentication
Currently uses a simple user_id system for the hackathon. In production, this would be replaced with proper authentication tokens.

## API Endpoints

### 1. Health Check

**GET** `/health`

Verify that the MCP server is running and accessible.

**Response:**
```json
{
  "status": "OK",
  "message": "Social Media Time Warden MCP Server is running"
}
```

---

### 2. Save Usage Data

**POST** `/usage`

Records time spent on a social media platform. Called by the browser extension when user changes tabs or closes browser.

**Request Body:**
```json
{
  "user_id": "user_1726156800000_abc123def",
  "platform": "Twitter",
  "date": "2025-09-12",
  "time_spent": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "user_1726156800000_abc123def",
    "platform": "Twitter", 
    "date": "2025-09-12",
    "time_spent": 15
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Missing required fields: user_id, platform, date, time_spent"
}
```

---

### 3. Get Usage Statistics

**GET** `/usage?user_id={id}&date={date}`

Retrieves usage data for a specific user and date. Used by the web dashboard to display daily analytics.

**Query Parameters:**
- `user_id`: User identifier
- `date`: Date in YYYY-MM-DD format

**Example Request:**
`GET /usage?user_id=user_1726156800000_abc123def&date=2025-09-12`

**Response:**
```json
[
  {
    "platform": "Twitter",
    "time_spent": 45
  },
  {
    "platform": "Instagram", 
    "time_spent": 30
  },
  {
    "platform": "YouTube",
    "time_spent": 120
  }
]
```

---

### 4. Set Daily Limit

**POST** `/limit`

Sets or updates the daily time limit for a specific platform. Used by the limits management page.

**Request Body:**
```json
{
  "user_id": "user_1726156800000_abc123def",
  "platform": "Twitter",
  "daily_limit": 60
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "user_1726156800000_abc123def",
    "platform": "Twitter",
    "daily_limit": 60
  }
}
```

---

### 5. Get Daily Limits

**GET** `/limit?user_id={id}`

Retrieves all daily limits set by a user. Used by both the dashboard and limits management page.

**Query Parameters:**
- `user_id`: User identifier

**Example Request:**
`GET /limit?user_id=user_1726156800000_abc123def`

**Response:**
```json
[
  {
    "platform": "Twitter",
    "daily_limit": 60
  },
  {
    "platform": "Instagram",
    "daily_limit": 45
  },
  {
    "platform": "YouTube", 
    "daily_limit": 90
  }
]
```

---

### 6. Get Notifications

**GET** `/notifications?user_id={id}`

Retrieves notification history for a user. Shows when limits were exceeded or warnings triggered.

**Query Parameters:**
- `user_id`: User identifier

**Example Request:**
`GET /notifications?user_id=user_1726156800000_abc123def`

**Response:**
```json
[
  {
    "platform": "Twitter",
    "date": "2025-09-12",
    "notification_type": "limit_exceeded",
    "timestamp": "2025-09-12T14:30:00Z"
  },
  {
    "platform": "Instagram",
    "date": "2025-09-12", 
    "notification_type": "limit_warning",
    "timestamp": "2025-09-12T13:15:00Z"
  }
]
```

## Data Models

### Usage Record
- `user_id`: String - Unique user identifier
- `platform`: String - Social media platform (Twitter, Facebook, Instagram, TikTok, YouTube, Snapchat)
- `date`: String - Date in YYYY-MM-DD format
- `time_spent`: Number - Time in minutes

### Daily Limit
- `user_id`: String - Unique user identifier  
- `platform`: String - Social media platform
- `daily_limit`: Number - Time limit in minutes

### Notification
- `user_id`: String - Unique user identifier
- `platform`: String - Social media platform
- `date`: String - Date in YYYY-MM-DD format
- `notification_type`: String - "limit_warning" or "limit_exceeded"
- `timestamp`: String - ISO 8601 timestamp

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing parameters, invalid data)
- `500` - Internal Server Error

Error responses include:
```json
{
  "success": false,
  "error": "Description of the error"
}
```

## Sample Workflow

1. **Browser Extension Setup**: Extension generates user_id and stores locally
2. **Time Tracking**: Extension monitors active tabs and calls POST /usage when user leaves social media sites
3. **Dashboard Loading**: Web app calls GET /usage to display daily statistics
4. **Limit Management**: User sets limits via POST /limit, retrieved via GET /limit
5. **Notifications**: Extension checks limits and triggers notifications when exceeded

## Testing with Postman

1. Import this collection into Postman
2. Set base URL variable to `http://localhost:3001`
3. Start the MCP server: `npm run dev` in the mcp-server directory
4. Test endpoints in order: Health Check → Save Usage → Get Usage → Set Limits → Get Limits

## Environment Variables

The MCP server requires these environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `PORT`: Server port (default: 3001)

## Database Schema

See `docs/supabase-setup.md` for complete database table structures and setup instructions.
