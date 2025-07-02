import { test, expect } from '@playwright/test';
/**
This file is responsible for testing the starting and ending of a live event.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });

test('start and end live event', async ({ page }) => {
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
    await page.getByRole('option', { name: 'English' }).click();
    await page.locator('span').nth(3).click();
    await page.getByRole('option', { name: 'German' }).click();

    await page.getByRole('button', { name: 'Start' }).click();

    await page.waitForTimeout(10000); // Wait for the recording to play a bit

    await expect(page.getByRole('button', { name: 'End lecture' })).toBeVisible();
    await page.getByRole('button', { name: 'End lecture' }).click();
  
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirm' }).click();
});
