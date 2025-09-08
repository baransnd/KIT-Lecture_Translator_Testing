#!/bin/bash

set -e

echo "Installing dependencies..."
npm install
npx playwright install

# Run login.js to authenticate before tests
echo "Running login script..."
node login.js

echo "Running Playwright tests..."
npx playwright test "$@"

