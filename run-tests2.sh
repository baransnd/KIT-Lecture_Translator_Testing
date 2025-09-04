#!/bin/bash
set -e

# 1️⃣ Install dependencies
echo "Installing dependencies..."
npm install

# 2️⃣ Run login.js to generate auth.json
echo "Running login script..."
node login.js

# 3️⃣ Run transcription tests with ALL projects
TRANSCRIPTION_SPEC="tests/recording/transcribe/transcribe_new.spec.ts"

if [ -f "$TRANSCRIPTION_SPEC" ]; then
  echo "Running transcription tests with all projects..."
  npx playwright test "$TRANSCRIPTION_SPEC" --headed --workers=1
else
  echo "No transcription spec found at $TRANSCRIPTION_SPEC, skipping."
fi

# 4️⃣ Run all other tests (excluding transcription) with English-only project
echo "Running all other tests with English project only..."
npx playwright test --project=chromium-fake-audio-english --grep-invert "Transcription" --headed --workers=1


