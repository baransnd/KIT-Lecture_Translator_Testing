KIT Lecture Translator Test Suite

This project uses [Playwright](https://playwright.dev/) to test the Lecture Translator system at KIT. It checks that:

- User can successfully login
- User can navigate the page to archive, its subfolders and back.
- User can create a recording and the live (grey) transcription appears
- User can create a recording and final (black) transcription appears if the recorded language is selected.
- User can create a recording and final (black) transcription does not appear if the recorded language is not selected.

## Setup

1. **Install dependencies** 
   ```bash
   npm install

2. **Authenticate once**
   
    Run the login script to generate auth.json:

       npx playwright test login.js

## Running Tests

After login the file structure should be:

    login.js: Saves login session

    auth.json: Generated session file

    tests/ : the folder with all the end-to-end functional tests

Run the following to run the tests:

    npx playwright test



Maintained by Isik Baran Sandan. Contact: uboal@student.kit.edu
