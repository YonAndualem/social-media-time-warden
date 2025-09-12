#!/bin/bash

echo "🧪 Testing Social Media Time Warden System"
echo "=========================================="

# Test MCP Server Health
echo "1. Testing MCP Server Health..."
curl -s http://localhost:3001/health
echo -e "\n"

# Test posting sample usage data
echo "2. Testing Usage Data POST..."
curl -s -X POST http://localhost:3001/usage \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "platform": "Twitter", 
    "date": "2025-09-12",
    "time_spent": 25
  }'
echo -e "\n"

# Test getting usage data  
echo "3. Testing Usage Data GET..."
curl -s "http://localhost:3001/usage?user_id=test_user&date=2025-09-12"
echo -e "\n"

# Test setting a limit
echo "4. Testing Limit POST..."
curl -s -X POST http://localhost:3001/limit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "platform": "Twitter",
    "daily_limit": 60
  }'
echo -e "\n"

# Test getting limits
echo "5. Testing Limits GET..."
curl -s "http://localhost:3001/limit?user_id=test_user"
echo -e "\n"

echo "✅ API Tests Complete!"
echo ""
echo "Next steps:"
echo "1. Set up Supabase database (see NEXT-STEPS.md)"
echo "2. Update .env with Supabase credentials"
echo "3. Install browser extension (see browser-extension/INSTALL.md)"
echo "4. Test complete system end-to-end"
