KIT Lecture Translator Test Suite

This project uses [Playwright](https://playwright.dev/) to test the Lecture Translator system at KIT. It checks that:

- User can successfully login
- User can navigate the page to archive, its subfolders and back. (back fails)
- User can navigate to the Live Event page, its subpages and back.
- User can open the sidebar from the homepage
- User can open the sidebar from an archived recording. (fails)
- User can create a private recording that only appears in the private archive.
- User can choose to not save a recording and it does not appear in the archive.
- Only selected inpt and output languages are active during recording.
- User can correcty set the name of a lecture.
- User can activate the AI assistant, write messages to it.
- User can select and use the available presentation formats and cannot select an unavailable format.
- Presentation mode: Offline works as intended.
- Presentation mode: Online works as intended.
- User can create a recording and the live (grey) transcription appears
- User can create a recording and final (black) transcription appears if the recorded language is selected.
- User can create a recording and final (black) transcription does not appear if the recorded language is not selected.

TODO List
- TODO: User can navigate to settings, the subfolders and back.
- TODO: User can open the sidebar during a recording
- TODO: AI assistant replies after a message.
- TODO: Transcription tests for mixed language audio
- TODO: Tests for other presentation modes: Mixed and Resending
- TODO: bash script to run the code/tests !
- TODO: Check for text in the translation boxes !
- TODO: check if the audio is there in the recording
- TODO: check the tranlation languages (selected output language is actually outputed)

## Setup

1. **Install dependencies** 
   ```bash
   npm install

2. **Authenticate once**
   
    Run the login script to generate auth.json:

       node login.js

## Running Tests

After login the file structure should be:

    login.js: Saves login session

    auth.json: Generated session file

    tests/ : the folder with all the end-to-end functional tests

Run the following to run the tests:

    npx playwright test



Maintained by Isik Baran Sandan. Contact: uboal@student.kit.edu
