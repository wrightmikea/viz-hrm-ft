#!/bin/bash

# Development server script
# Starts the Vite dev server with hot reload

echo "🚀 Starting HRM Training Visualization in development mode..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
fi

# Start dev server
echo "🔧 Starting development server..."
echo "📍 Server will be available at http://localhost:3000"
echo "   (If port 3000 is busy, it will use 3001)"
echo "🔄 Hot reload is enabled"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm run dev