import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

/**
 * Simple test to simulate recording using fake audio. (More for my own testing purposes)
 * @author Isik Baran Sandan
 */
test('should simulate recording using fake audio', async ({ page }) => {
  await page.goto('https://lt2srv.iar.kit.edu/');

  // Go to live event
  await page.getByRole('link', { name: 'Live event Live event' }).click();

  // Start recording
  await page.getByRole('img', { name: 'Start Event' }).click();
  await page.getByRole('button', { name: 'Start' }).click();


  // Wait 2 seconds to simulate recording time
  await page.waitForTimeout(20000);

  // End recording
  await page.getByRole('button', { name: 'End lecture' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
});
