#!/bin/bash
set -e

echo "Building NewsoBet Africa API..."

# Navigate to API directory
cd api

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build TypeScript
echo "Building TypeScript..."
npm run build

echo "Build completed successfully!"