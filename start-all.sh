#!/bin/bash

# AnonyPlace Full Stack Start Script
# This script starts both API and Web servers using Docker Compose

set -e

echo "🚀 Starting AnonyPlace Full Stack..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env from .env.example (if exists)..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created. Please update with your configuration."
    else
        echo "❌ No .env.example found. Please create .env file manually."
        exit 1
    fi
fi

# Start all services with Docker Compose
echo "🐳 Starting all services with Docker Compose..."
docker-compose up --build

# Note: Use 'docker-compose up -d' to run in detached mode
