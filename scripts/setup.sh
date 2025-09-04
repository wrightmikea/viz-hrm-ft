#!/bin/bash

# Setup script for initial project configuration
# Installs dependencies and prepares the development environment

echo "🎯 Setting up HRM Training Visualization..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js version
echo "🔍 Checking environment..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is too old (v$NODE_VERSION)"
    echo "   Please upgrade to Node.js 18 or higher"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completed successfully!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🚀 Quick start commands:"
    echo "   • Development:  ./scripts/dev.sh"
    echo "   • Build:        ./scripts/build.sh"
    echo "   • Serve:        ./scripts/serve.sh"
    echo ""
    echo "📚 Or use npm directly:"
    echo "   • npm run dev   - Start development server"
    echo "   • npm run build - Build for production"
    echo ""
else
    echo ""
    echo "❌ Setup failed! Please check the error messages above."
    exit 1
fi