import { test, expect } from '@playwright/test';
/**
This file is responsible for testing the starting and ending of a live event.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });

test('start and end live event', async ({ page }) => {
  await page.goto('https://lt2srv.iar.kit.edu/');

  await expect((page).getByRole('link', { name: 'Live event Live event' })).toBeVisible();
  await page.getByRole('link', { name: 'Live event Live event' }).click();

  await expect(page.getByRole('img', { name: 'Start Event' })).toBeVisible();
  await page.getByRole('img', { name: 'Start Event' }).click();

  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.getByRole('button', { name: 'End lecture' })).toBeVisible();
  await page.getByRole('button', { name: 'End lecture' }).click();

  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();
});