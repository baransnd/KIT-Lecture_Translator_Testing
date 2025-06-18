import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://lt2srv.iar.kit.edu/archive/%252F');
  await page.getByRole('link', { name: 'KIT lecture translator' }).click();
  await page.getByRole('link', { name: 'Login Login' }).click();
  await page.getByRole('button', { name: 'Log in with KIT-Account (' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('uboal');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('3436.nevizadE!');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('link', { name: 'Archive Archive' }).click();
  await page.getByRole('link', { name: 'Public Archive Public Archive' }).click();
  
});