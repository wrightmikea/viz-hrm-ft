#!/bin/bash

# Build script for production
# Creates optimized static files in ./static directory

echo "🏗️  Building HRM Training Visualization for production..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
fi

# Clean previous build
if [ -d "static" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf static/*
fi

# Run TypeScript compiler and Vite build
echo "🔨 Compiling TypeScript and building assets..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📁 Output directory: ./static"
    echo "📊 Build stats:"
    
    # Count files
    html_count=$(find static -name "*.html" | wc -l | xargs)
    js_count=$(find static -name "*.js" | wc -l | xargs)
    css_count=$(find static -name "*.css" | wc -l | xargs)
    
    echo "   • HTML files: $html_count"
    echo "   • JavaScript bundles: $js_count"
    echo "   • CSS files: $css_count"
    
    # Calculate total size
    total_size=$(du -sh static | cut -f1)
    echo "   • Total size: $total_size"
    
    echo ""
    echo "🚀 Ready for deployment!"
    echo "   Run ./scripts/serve.sh to preview the production build"
else
    echo ""
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi