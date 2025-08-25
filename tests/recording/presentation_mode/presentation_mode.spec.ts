import { test, expect } from '@playwright/test';
/**
This file is responsible for testing the AI assistant.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });

test.describe('Presentation Format Tests', () => {

  test('should be able to select the presentation formats', async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/');
    await page.getByRole('link', { name: 'Live event Live event' }).click();
    await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
    await page.getByRole('button', { name: 'Advanced Options' }).click();
  
    await page.getByLabel('Availability').selectOption('private');
    await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).check();
  
    const presentationFormat = page.getByLabel('Presentation Format');
  
    for (const format of ['online', 'mixed', 'offline', 'resending']) {
      await presentationFormat.selectOption(format);
      await expect(presentationFormat).toHaveValue(format);
    }
  });

  test('should not allow selecting an invalid presentation format', async ({ page }) => {
      await page.goto('https://lt2srv.iar.kit.edu/');
      await page.getByRole('link', { name: 'Live event Live event' }).click();
      await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
      await page.getByRole('button', { name: 'Advanced Options' }).click();
      
      const presentationFormat = page.getByLabel('Presentation Format');

      const optionValues = await presentationFormat.locator('option').evaluateAll(options =>
        options.map(option => (option as HTMLOptionElement).value)
      );
        
      expect(optionValues).not.toContain('invalid_format');
    });
    
  /**
   * Offline mode should not generate grey text (live transcript).
   * However it should generate black text (final transcript) in long intervals.
   * 
   * Make sure the english recording is played (npx playwright test --project=chromium-fake-audio-english)
   */
  test('offline mode test', async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/');
    await page.getByRole('link', { name: 'Live event Live event' }).click();
    await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
    await page.getByRole('button', { name: 'Advanced Options' }).click();
    await page.getByLabel('Availability').selectOption('private');
    await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).check();
    await page.getByLabel('Presentation Format').selectOption('offline');

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
    await page.getByRole('option', { name: 'English' }).click();
    await page.locator('span').nth(3).click();
    await page.getByRole('option', { name: 'English' }).click();
    
  
    await page.getByRole('button', { name: 'Start' }).click();
  
    // Simulate a short wait time to allow any potential grey text to appear
    await page.waitForTimeout(10000);
  
    // Check that no grey text (live transcript) appears
    const greyText = page.locator('.transcript-live'); // Adjust the selector based on actual implementation
    await expect(greyText).toHaveCount(0);

    // Wait longer to allow black text (final transcript) to appear
    const finalizedTranscript = page.locator('.markup_transcript').first();
    await expect(finalizedTranscript).toBeVisible({ timeout: 120000 }); // Wait up to 120 seconds for the final transcript to appear.
    const finalizedText = await finalizedTranscript.innerText();
    expect(finalizedText.trim().length).toBeGreaterThan(0);

    //end lecture
    const endButton = page.getByRole('button', { name: 'End lecture' });
    if (await endButton.isVisible()) {
      await endButton.click();
      await page.getByRole('button', { name: 'Confirm' }).click();
    }
  });
  
});