@echo off
echo 🛡️  Social Media Time Warden - Setup Script
echo =============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version

REM Setup MCP Server
echo.
echo 📡 Setting up MCP Server...
cd mcp-server

if not exist package.json (
    echo ❌ MCP Server package.json not found!
    pause
    exit /b 1
)

echo    Installing MCP Server dependencies...
call npm install

if not exist .env (
    echo    Creating .env file from template...
    copy .env.example .env
    echo    ⚠️  Please update .env with your Supabase credentials!
)

cd ..

REM Setup Web App
echo.
echo 🌐 Setting up Web App...
cd web-app

if not exist package.json (
    echo ❌ Web App package.json not found!
    pause
    exit /b 1
)

echo    Installing Web App dependencies...
call npm install

echo    Installing additional dependencies...
call npm install recharts lucide-react @headlessui/react

cd ..

REM Setup complete
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Next steps:
echo 1. 📊 Set up Supabase database:
echo    - Create a new project at https://supabase.com
echo    - Run the SQL scripts from docs/supabase-setup.md
echo    - Update mcp-server/.env with your credentials
echo.
echo 2. 🚀 Start the servers:
echo    Terminal 1: cd mcp-server ^&^& npm run dev
echo    Terminal 2: cd web-app ^&^& npm run dev
echo.
echo 3. 🔧 Install browser extension:
echo    - Open Chrome -^> chrome://extensions/
echo    - Enable Developer mode
echo    - Click 'Load unpacked' -^> Select browser-extension folder
echo.
echo 4. 🧪 Test the system:
echo    - Visit http://localhost:3001/health (MCP Server)
echo    - Visit http://localhost:3000 (Web Dashboard)
echo    - Visit a social media site with extension installed
echo.
echo 📚 For detailed instructions, see docs/setup-guide.md
echo 📝 For API documentation, see docs/postman-notebook.md
echo.
pause
