#!/bin/bash

# Social Media Time Warden - Setup Script
# This script helps set up the complete development environment

echo "🛡️  Social Media Time Warden - Setup Script"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Setup MCP Server
echo ""
echo "📡 Setting up MCP Server..."
cd mcp-server

if [ ! -f package.json ]; then
    echo "❌ MCP Server package.json not found!"
    exit 1
fi

echo "   Installing MCP Server dependencies..."
npm install

if [ ! -f .env ]; then
    echo "   Creating .env file from template..."
    cp .env.example .env
    echo "   ⚠️  Please update .env with your Supabase credentials!"
fi

cd ..

# Setup Web App
echo ""
echo "🌐 Setting up Web App..."
cd web-app

if [ ! -f package.json ]; then
    echo "❌ Web App package.json not found!"
    exit 1
fi

echo "   Installing Web App dependencies..."
npm install

echo "   Installing additional dependencies..."
npm install recharts lucide-react @headlessui/react

cd ..

# Setup complete
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. 📊 Set up Supabase database:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the SQL scripts from docs/supabase-setup.md"
echo "   - Update mcp-server/.env with your credentials"
echo ""
echo "2. 🚀 Start the servers:"
echo "   Terminal 1: cd mcp-server && npm run dev"
echo "   Terminal 2: cd web-app && npm run dev"
echo ""
echo "3. 🔧 Install browser extension:"
echo "   - Open Chrome -> chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click 'Load unpacked' -> Select browser-extension folder"
echo ""
echo "4. 🧪 Test the system:"
echo "   - Visit http://localhost:3001/health (MCP Server)"
echo "   - Visit http://localhost:3000 (Web Dashboard)"
echo "   - Visit a social media site with extension installed"
echo ""
echo "📚 For detailed instructions, see docs/setup-guide.md"
echo "📝 For API documentation, see docs/postman-notebook.md"
