import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.describe('Live transcription behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/');

    await page.getByRole('link', { name: 'Live event Live event' }).click();
    await page.getByRole('img', { name: 'Start Event' }).click();
    await page.getByRole('button', { name: 'Start' }).click();
  });

  test.afterEach(async ({ page }) => {
    // Safely end recording if buttons are visible
    const endButton = page.getByRole('button', { name: 'End lecture' });
    if (await endButton.isVisible()) {
      await endButton.click();
      await page.getByRole('button', { name: 'Confirm' }).click();
    }
  });


  test('should show live transcript in grey during recording', async ({ page }) => {
    const liveTranscript = page.locator('#unstable-structuredTranscript');
    await expect(liveTranscript).toBeVisible({ timeout: 10000 });
  });

  test('should show finalized black transcript during recording', async ({ page }) => {
    const finalizedTranscript = page.locator('.markup_transcript').first();
    await expect(finalizedTranscript).toBeVisible({ timeout: 20000 });

    const finalizedText = await finalizedTranscript.innerText();
    expect(finalizedText.length).toBeGreaterThan(0);
  });
});
