#!/bin/bash
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Run login.js to generate auth.json
# node login.js

TRANS_EXIT_CODE=0
OTHER_EXIT_CODE=0

TRANSCRIPTION_SPEC="tests/recording/transcribe/transcribe_new.spec.ts"

# Run transcription tests
if [ -f "$TRANSCRIPTION_SPEC" ]; then
  echo "Running transcription tests with all projects..."
  npx playwright test "$TRANSCRIPTION_SPEC" --headed --workers=1 --reporter=list || TRANS_EXIT_CODE=$?
else
  echo "No transcription spec found at $TRANSCRIPTION_SPEC, skipping."
fi

# Run all other tests
echo "Running all other tests with English project only..."
npx playwright test --project=chromium-fake-audio-english --grep-invert "Transcription" --headed --workers=1 --reporter=list || OTHER_EXIT_CODE=$?

# Launch the HTML report at the end (non-blocking)
echo "Opening combined HTML report..."
npx playwright show-report || true

# Exit with failure if any tests failed
if [ $TRANS_EXIT_CODE -ne 0 ] || [ $OTHER_EXIT_CODE -ne 0 ]; then
  echo "Some tests failed."
  exit 1
fi

echo "All tests completed successfully."
