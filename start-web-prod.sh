#!/bin/bash

# AnonyPlace Web Server Start Script (Production)
# This script builds and starts the web server in production mode

set -e

echo "🚀 Starting AnonyPlace Web Server (Production Mode)..."

# Navigate to web app directory
cd "$(dirname "$0")/apps/web"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Start the production server
echo "🌐 Starting Next.js production server on http://localhost:3000"
npm run start
