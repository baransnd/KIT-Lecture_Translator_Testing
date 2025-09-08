import { test, expect } from '@playwright/test';


/**
 * Map project name -> which language(s) should transcribe.
 */
function shouldTranscribeFor(projectName: string, language: string) {
  const name = projectName.toLowerCase();
  if (name.includes('english-german') || name.includes('english_german')) {
    return language === 'English' || language === 'German';
  }
  if (name.includes('german')) {
    return language === 'German';
  }
  // default -> english audio
  return language === 'English';
}

const LANGUAGES = ['English', 'French', 'German'];

/**
 * Transcription tests: tests that live and finalized transcription 
 * work as expected for different languages. 
 */ 
test.describe('Transcription tests', () => {
  test.use({ storageState: 'auth.json' });

  // run each describe serially to avoid overlapping recordings in the same browser/page
  test.describe.configure({ mode: 'serial' });

  for (const language of LANGUAGES) {
    test.describe(`Transcription with language: ${language}`, () => {
      test.beforeEach(async ({ page }) => {
        // navigate and set up event + languages
        await page.goto('https://lt2srv.iar.kit.edu/');

        await page.getByRole('link', { name: 'Live event Live event' }).click();
        await page.getByRole('img', { name: 'Start Event' }).click();
        await page.getByRole('button', { name: 'Advanced Options' }).click();
        await page.getByLabel('Presentation Format').selectOption('online');

        // Remove all existing language tags
        const languageTags = page.locator('[title] >> [aria-label="remove tag"]');
        while (await languageTags.count() > 0) {
          const removeBtn = languageTags.first();
          try {
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
            await removeBtn.click({ timeout: 3000 });
          } catch {
            break;
          }
        }

        // Select input/output languages
        await page.locator('span').nth(1).click();
        await page.getByRole('option', { name: language }).click();
        await page.locator('span').nth(3).click();
        await page.getByRole('option', { name: language }).click();

        // Start recording
        await page.getByRole('button', { name: 'Start' }).click();
      });

      test.afterEach(async ({ page }) => {
        const endButton = page.getByRole('button', { name: 'End lecture' });
        if (await endButton.isVisible()) {
          await endButton.click();
          await page.getByRole('button', { name: 'Confirm' }).click();
        }
      });

      /* 
       * Live-transcript check — only runs when this language is selected as input,
      skips if the language is not expected to transcribe for the project,
      since what is important is that final transcription does not appear 
      */ 
      test(`live transcript appears for ${language} (if expected)`, async ({ page }, testInfo) => {
        const shouldTranscribe = shouldTranscribeFor(testInfo.project.name, language);
        if (!shouldTranscribe) {
          test.skip(true, `${language} is not expected to transcribe for project ${testInfo.project.name}`);
        }

        const liveTranscript = page.locator('[id*="unstable-structured"]');
        await expect.poll(async () => await liveTranscript.count(), {
          timeout: 20000,
          message: 'Live transcript should appear',
        }).toBeGreaterThan(0);
        await expect(liveTranscript).toHaveText(/.+/, { timeout: 10000 });
      });

      // Finalized transcript — assert presence OR absence depending on project/language
      test(`finalized transcript presence for ${language}`, async ({ page }, testInfo) => {
        const shouldTranscribe = shouldTranscribeFor(testInfo.project.name, language);
        const finalizedTranscript = page.locator('.markup_transcript').first();

        if (shouldTranscribe) {
          await expect(finalizedTranscript).toContainText(/.+/, { timeout: 20000 });
          const finalizedText = await finalizedTranscript.innerText();
          expect(finalizedText.trim().length).toBeGreaterThan(0);
        } else {
          // wait some time for recording to play and then assert no transcript
          await page.waitForTimeout(10000);
          await expect(finalizedTranscript).toHaveCount(0);
        }
      });
    });
  }
}); 