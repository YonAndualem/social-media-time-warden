# MCP Server

Node.js Express server that provides API endpoints for the Social Media Time Warden app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase credentials:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

- `GET /health` - Health check
- `POST /usage` - Save usage data from browser extension
- `GET /usage?user_id={id}&date={date}` - Get usage stats
- `POST /limit` - Set daily limits
- `GET /limit?user_id={id}` - Get daily limits
- `GET /notifications?user_id={id}` - Get notifications

## Database Tables

The server expects the following Supabase tables:

### usage_records
- user_id (text)
- platform (text)
- date (date)
- time_spent (integer) - in minutes
- Primary key: (user_id, platform, date)

### daily_limits  
- user_id (text)
- platform (text)
- daily_limit (integer) - in minutes
- Primary key: (user_id, platform)

### notifications
- id (uuid, auto-generated)
- user_id (text)
- platform (text)
- date (date)
- notification_type (text)
- timestamp (timestamp)

## Development

- Use `npm run dev` for development with auto-reload
- Use `npm start` for production
- Use `npm test` to run tests
