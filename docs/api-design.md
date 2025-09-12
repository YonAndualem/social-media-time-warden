# API Design

## Data Schema

### Usage Record
```json
{
  "user_id": "string",
  "platform": "string", // Twitter, Facebook, Instagram, TikTok, YouTube, Snapchat
  "date": "string", // YYYY-MM-DD format
  "time_spent": "number" // in minutes
}
```

### Daily Limit
```json
{
  "user_id": "string", 
  "platform": "string",
  "daily_limit": "number" // in minutes
}
```

### Notification
```json
{
  "user_id": "string",
  "platform": "string", 
  "date": "string",
  "notification_type": "string", // limit_warning, limit_exceeded
  "timestamp": "string"
}
```

## API Endpoints

### POST /usage
**Description**: Receive usage data from browser extension
**Request Body**:
```json
{
  "user_id": "string",
  "platform": "string", 
  "date": "string",
  "time_spent": "number"
}
```
**Response**:
```json
{
  "success": true
}
```

### GET /usage?user_id={id}&date={date}
**Description**: Retrieve usage stats for a user on a given date
**Response**:
```json
[
  {
    "platform": "string",
    "time_spent": "number"
  }
]
```

### POST /limit
**Description**: Set daily limit for a platform
**Request Body**:
```json
{
  "user_id": "string",
  "platform": "string",
  "daily_limit": "number"
}
```
**Response**:
```json
{
  "success": true
}
```

### GET /limit?user_id={id}
**Description**: Get daily limits for all platforms for a user
**Response**:
```json
[
  {
    "platform": "string", 
    "daily_limit": "number"
  }
]
```

### GET /notifications?user_id={id}
**Description**: Get notifications for a user
**Response**:
```json
[
  {
    "platform": "string",
    "date": "string", 
    "notification_type": "string",
    "timestamp": "string"
  }
]
```
