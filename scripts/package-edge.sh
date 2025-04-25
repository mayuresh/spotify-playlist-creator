#!/bin/bash

# Script to package the extension for Microsoft Edge Add-ons

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Edge packaging process...${NC}"

# Create a temporary directory for packaging
TEMP_DIR="temp_package_edge"
PACKAGE_NAME="spotify-playlist-creator-edge"

# Create directories
echo "Creating temporary directory..."
mkdir -p $TEMP_DIR

# Copy all necessary files
echo "Copying files..."
cp -r assets background content dialog popup utils manifest.json $TEMP_DIR/
cp privacy-policy.md $TEMP_DIR/

# Update manifest for Edge (if needed)
# Currently, no changes are needed as Edge accepts Chrome extensions

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

echo -e "${GREEN}Edge package created successfully: ${PACKAGE_NAME}.zip${NC}"
echo "You can now submit this package to the Microsoft Edge Add-ons store." 