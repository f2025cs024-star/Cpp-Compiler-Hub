#!/bin/bash

# NexCPP Multi-Platform Build Script
# This script builds all targets locally if you have the dependencies installed.

set -e

echo "🚀 Starting NexCPP Multi-Platform Build..."

cd client

# 1. Install Dependencies
echo "📦 Installing npm dependencies..."
npm install

# 2. Build Web Assets
echo "🏗️ Building web assets..."
npm run build

# 3. Build Windows x64 (requires Windows & Rust)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Building Windows x64..."
    npm run tauri:build:win
fi

# 4. Build Linux x64 (requires Linux & Rust)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Building Linux x64..."
    npm run tauri:build
fi

# 5. Build Android (requires Android SDK & Java)
echo "🤖 Building Android APKs..."
npm run cap:build:android

echo "✅ All builds completed successfully!"
echo "Check client/src-tauri/target/release and client/android/app/build/outputs/apk/release for artifacts."
