import { test, expect } from '@playwright/test';

const languagesToTest = [
  { name: 'English', shouldTranscribe: true },
  { name: 'German', shouldTranscribe: false },
  { name: 'French', shouldTranscribe: false },
  { name: 'Spanish', shouldTranscribe: false },
];

/**
 * This file is responsible for testing the transcription functionality with different languages.
 * It verifies that the live transcript appears in grey during recording of correct languages
 * and that the finalized transcript appears in black after the recording of correct languages.
 * 
 * For languages that are not in the audio, it checks that no transcript (in black) appears.
 * @author Isik Baran Sandan
 */

languagesToTest.forEach(({ name: language, shouldTranscribe }) => {
  test.describe(`Transcription with language: ${language}`, () => {
    test.use({ storageState: 'auth.json' });

    test.beforeEach(async ({ page }) => {
      await page.goto('https://lt2srv.iar.kit.edu/');

      await page.getByRole('link', { name: 'Live event Live event' }).click();
      await page.getByRole('img', { name: 'Start Event' }).click();
      await page.getByRole('button', { name: 'Advanced Options' }).click();

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

    if (shouldTranscribe) {
      test(`should show grey live transcript for ${language}`, async ({ page }) => {
        const liveTranscript = page.locator('#unstable-structuredEnglish');

        await expect.poll(async () => await liveTranscript.count(), {
          timeout: 20000,
          message: 'Live transcript should appear',
        }).toBeGreaterThan(0);

        await expect(liveTranscript).toBeVisible({ timeout: 10000 });
        await expect(liveTranscript).toHaveText(/.+/, { timeout: 10000 });
      });
    }

    test(`should ${
      shouldTranscribe ? '' : 'not '
    }show finalized black transcript for ${language}`, async ({ page }) => {
      const finalizedTranscript = page.locator('.markup_transcript').first();

      if (shouldTranscribe) {
        await expect(finalizedTranscript).toBeVisible({ timeout: 20000 });
        const finalizedText = await finalizedTranscript.innerText();
        expect(finalizedText.trim().length).toBeGreaterThan(0);
      } else {
        await expect(finalizedTranscript).toHaveCount(0);
        // If `.markup_transcript` may exist but be empty:
        // const text = await finalizedTranscript.innerText();
        // expect(text.trim()).toBe('');
      }
    });
  });
});
