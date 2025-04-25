#!/bin/bash

# Script to package the extension for Chrome Web Store

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Chrome packaging process...${NC}"

# Create a temporary directory for packaging
TEMP_DIR="temp_package_chrome"
PACKAGE_NAME="spotify-playlist-creator-chrome"

# Create directories
echo "Creating temporary directory..."
mkdir -p $TEMP_DIR

# Copy all necessary files
echo "Copying files..."
cp -r assets background content dialog popup utils manifest.json $TEMP_DIR/
cp privacy-policy.md $TEMP_DIR/

# Remove any existing zip file
rm -f "${PACKAGE_NAME}.zip"

# Create the zip file
echo "Creating zip file..."
cd $TEMP_DIR
zip -r "../${PACKAGE_NAME}.zip" . -x ".*" -x "__MACOSX" -x "*.md"
cd ..

# Clean up
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo -e "${GREEN}Chrome package created successfully: ${PACKAGE_NAME}.zip${NC}"
echo "You can now submit this package to the Chrome Web Store." 