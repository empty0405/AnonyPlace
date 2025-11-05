#!/bin/bash

# AnonyPlace Stop Script
# This script stops all running Docker containers

set -e

echo "🛑 Stopping AnonyPlace services..."

docker-compose down

echo "✅ All services stopped successfully"
