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

TODO List - Priority
- TODO: Check for text in the translation boxes ! -> not possible without fixing the sidebar issue
- TODO: check if the audio is there in the recording -> not possible with playwright only

TODO List - General
- TODO: User can navigate to settings, the subfolders and back.
- TODO: Transcription tests for mixed language audio -> make the test longer for the english-german audio input.
- TODO: Tests for other presentation modes: Mixed and Resending
- TODO: check the tranlation languages (selected output language is actually outputed) -> complicated test that would take lots of hours
- TODO: bugs/test('should delete a recording with the dropdown menu delete button')  should be made robust by creating a recording first.
  

TODO List - Tried and Failed
- User can open the sidebar during a recording --> The sidebar behaviour during a recording is different from sidebar behavior while navigating the lecture translator.


## Setup

1. **Install dependencies** 
   ```bash
   chmod +x run-tests.sh


2. **Authenticate and run tests**
   
    Run the following to first login and then run the tests:
    (By default only tests for english recordings)

       ./run-tests.sh

   To test if the funtionalities work for other language and combinations recordings as well, run:
   ```bash
      ./run-tests-mul.sh


Maintained by Isik Baran Sandan. Contact: uboal@student.kit.edu
