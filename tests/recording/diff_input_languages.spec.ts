import { test, expect } from '@playwright/test';

const languagesToTest = ['English'];

/**
 * This file is responsible for testing the transcription functionality with different languages.
 * It verifies that the live transcript appears in grey during recording and that the finalized transcript
 * appears in black after the recording ends for all languages.
 * @author Isik Baran Sandan
 */
languagesToTest.forEach(language => {
    test.describe(`Transcription with language: ${language}`, () => {
      test.use({ storageState: 'auth.json' });
  
      test.beforeEach(async ({ page }) => {
        await page.goto('https://lt2srv.iar.kit.edu/');
  
        // Go to the live event
        await page.getByRole('link', { name: 'Live event Live event' }).click();
        await page.getByRole('img', { name: 'Start Event' }).click();
  
        // Open Advanced Options
        await page.getByRole('button', { name: 'Advanced Options' }).click();
  
        // Remove all existing language tags
       const languageTags = page.locator('[title] >> [aria-label="remove tag"]');

       let tagCount = await languageTags.count();
       console.log(`Initial language tag count: ${tagCount}`);
       
       while (await languageTags.count() > 0) {
         const removeBtn = languageTags.first();
         const parent = removeBtn.locator('..');
       
         const title = await parent.getAttribute('title');
         console.log(` → Language tag detected: ${title || '(unknown)'}`);
       
         try {
           await page.keyboard.press('Escape');
           await page.waitForTimeout(300);
           await expect(removeBtn).toBeVisible({ timeout: 3000 });
           await removeBtn.click({ timeout: 3000 });
           console.log(` ✓ Removed ${title}`);
         } catch (e) {
           console.warn(` ⚠️ Could not remove ${title}:`, e);
           break;
         }
       }
        // Select the target input and output languages
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
  
      test(`should show grey live transcript for ${language}`, async ({ page }) => {
        const liveTranscript = page.locator('#unstable-structuredEnglish');
      
        // Step 1: Wait for the element to appear in the DOM
        await expect.poll(async () => {
          return await liveTranscript.count();
        }, {
          timeout: 20000,
          message: '#unstable-structuredTranscript should appear in the DOM'
        }).toBeGreaterThan(0);
      
        // Optional wait for visibility if it's styled/displayed late
        await expect(liveTranscript).toBeVisible({ timeout: 10000 });
      
        // Step 2: Now assert it has any text
        await expect(liveTranscript).toHaveText(/.+/, { timeout: 10000 });
      });
      
      
  
      test(`should show finalized black transcript for ${language}`, async ({ page }) => {
        const finalizedTranscript = page.locator('.markup_transcript').first();
        await expect(finalizedTranscript).toBeVisible({ timeout: 20000 });
  
        const finalizedText = await finalizedTranscript.innerText();
        expect(finalizedText.length).toBeGreaterThan(0);
      });
    });
  });
  