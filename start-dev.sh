#!/bin/bash

echo "🚀 Starting OdooXCGC Full Stack Application"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if we're in the correct directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory (OdooXcGc)"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "  - Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# Install frontend dependencies
echo "  - Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "✅ Dependencies installed!"

# Check environment files
echo "🔧 Checking environment configuration..."

if [ ! -f "../backend/.env" ]; then
    echo "❌ Backend .env file not found!"
    echo "Please create backend/.env with:"
    echo "DATABASE_URL=postgres://postgres:123@localhost:5432/odoo"
    echo "PORT=5000"
    echo "JWT_SECRET=your_super_secret_jwt_key_here"
    echo "NODE_ENV=development"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo "❌ Frontend .env.local file not found!"
    echo "Please create frontend/.env.local with:"
    echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api"
    echo "NEXT_PUBLIC_APP_URL=http://localhost:3000"
    exit 1
fi

echo "✅ Environment files found!"

# Start the application
echo "🚀 Starting servers..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo "Health check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev:full
