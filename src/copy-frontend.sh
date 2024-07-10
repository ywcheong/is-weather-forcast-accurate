#!/bin/bash

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Ensure the output directory exists
mkdir -p "$PROJECT_ROOT/out/frontend"

# Copy all non-TypeScript files from src/frontend to out/frontend
find "$PROJECT_ROOT/src/frontend" -type f ! -name "*.ts" -exec cp --parents {} "$PROJECT_ROOT/out/frontend" \;

# Remove the 'src/frontend' prefix from the copied files
mv "$PROJECT_ROOT/out/frontend/src/frontend"/* "$PROJECT_ROOT/out/frontend/"
rm -r "$PROJECT_ROOT/out/frontend/src"