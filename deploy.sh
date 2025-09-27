#!/bin/bash
# Deployment script for safetrip-response-system

echo "🚀 Starting deployment process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build

# Test production build
echo "🧪 Testing production build..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test if server is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Production build is working!"
    kill $SERVER_PID
    echo "🎉 Ready for deployment!"
else
    echo "❌ Production build failed!"
    kill $SERVER_PID
    exit 1
fi
