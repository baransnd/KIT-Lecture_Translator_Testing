KIT Lecture Translator Test Suite

This project uses [Playwright](https://playwright.dev/) to test the Lecture Translator system at KIT. It checks that:

- ...

## Setup

1. **Install dependencies** 
   ```bash
   npm install

2.Authenticate once
    Run the login script to generate auth.json:

    npx playwright test login.js

Running Tests

After login:

    npx playwright test

File Overview

    login.js: Saves login session

    auth.json: Generated session file

    tests/ : the folder with all the end-to-end functional tests

Maintained by Isik Baran Sandan. Contact: uboal@student.kit.edu
