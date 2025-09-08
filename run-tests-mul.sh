#!/bin/bash
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Run login.js to generate auth.json
# you can comment this out if you are already logged in
# auth.json will be valid upto a week
echo "Running login script..."
node login.js

# Run transcription tests with ALL projects
TRANSCRIPTION_SPEC="tests/recording/transcribe/transcribe_new.spec.ts"

if [ -f "$TRANSCRIPTION_SPEC" ]; then
  echo "Running transcription tests with all projects..."
  npx playwright test "$TRANSCRIPTION_SPEC" --headed --workers=1 || true
else
  echo "No transcription spec found at $TRANSCRIPTION_SPEC, skipping."
fi

# Run all other tests (excluding transcription) with English-only project
echo "Running all other tests with English project only..."
npx playwright test --project=chromium-fake-audio-english --grep-invert "Transcription" --headed --workers=1


