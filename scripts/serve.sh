#!/bin/bash

# Serve script for production build
# Serves the static files from ./static directory

echo "🌐 Serving HRM Training Visualization production build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if static directory exists
if [ ! -d "static" ]; then
    echo "⚠️  No build found!"
    echo "   Run ./scripts/build.sh first to create a production build"
    exit 1
fi

# Check if static directory has content
if [ -z "$(ls -A static)" ]; then
    echo "⚠️  Build directory is empty!"
    echo "   Run ./scripts/build.sh to create a production build"
    exit 1
fi

# Default port
PORT=${1:-8080}

echo "📁 Serving from: ./static"
echo "🌍 Server URL: http://localhost:$PORT"
echo ""

# Try to use Python 3 if available (most universal option)
if command -v python3 &> /dev/null; then
    echo "📦 Using Python 3 HTTP server"
    echo "Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cd static && python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    # Try Python 2 as fallback
    echo "📦 Using Python 2 SimpleHTTPServer"
    echo "Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    cd static && python -m SimpleHTTPServer $PORT
elif command -v npx &> /dev/null; then
    # Use npx serve as another option
    echo "📦 Using npx serve"
    echo "Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    npx serve static -l $PORT
else
    echo "❌ No suitable HTTP server found!"
    echo "   Please install Python 3 or Node.js"
    echo ""
    echo "   Alternatively, you can use any static file server"
    echo "   to serve the contents of the ./static directory"
    exit 1
fi