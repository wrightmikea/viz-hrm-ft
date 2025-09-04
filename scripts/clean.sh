#!/bin/bash

# Clean script to remove build artifacts and dependencies
# Use with caution!

echo "🧹 Cleaning HRM Training Visualization project..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "This will remove:"
echo "  • node_modules (dependencies)"
echo "  • static (build output)"
echo "  • .vite (cache)"
echo ""

read -p "Are you sure you want to clean? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🗑️  Removing node_modules..."
    rm -rf node_modules
    
    echo "🗑️  Removing static build..."
    rm -rf static
    
    echo "🗑️  Removing Vite cache..."
    rm -rf node_modules/.vite
    
    echo ""
    echo "✅ Cleanup completed!"
    echo "   Run ./scripts/setup.sh to reinstall dependencies"
else
    echo "❌ Cleanup cancelled"
fi