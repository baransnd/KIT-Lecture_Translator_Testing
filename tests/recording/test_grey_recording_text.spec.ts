import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('should show transcript while recording is in progress', async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/');
  
    // Go to live event
    await page.getByRole('link', { name: 'Live event Live event' }).click();
  
    // Start recording
    await page.getByRole('img', { name: 'Start Event' }).click();
    await page.getByRole('button', { name: 'Start' }).click();
  
    // Wait for unstable transcript text (grey text) to appear
    const transcriptLocator = page.locator('#unstable-structuredTranscript');
    await expect(transcriptLocator).toBeVisible({ timeout: 10000 });
  
  });
  