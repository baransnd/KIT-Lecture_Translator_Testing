/*
This tests the login functionality of the KIT Lecture Translator via the saved login state.
*/
import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('successfull login', async ({ page }) => {
  await page.goto('https://lt2srv.iar.kit.edu/login');
  await expect(page.getByRole('link', { name: 'Logout Logout' })).toBeVisible();
});