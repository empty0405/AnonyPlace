#!/bin/bash

# AnonyPlace Web Server Start Script
# This script starts the web server in development mode

set -e

echo "🚀 Starting AnonyPlace Web Server..."

# Navigate to web app directory
cd "$(dirname "$0")/apps/web"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build artifacts
echo "🧹 Cleaning previous builds..."
rm -rf .next node_modules/.cache

# Start the development server
echo "🌐 Starting Next.js development server on http://localhost:3000"
npm run dev
