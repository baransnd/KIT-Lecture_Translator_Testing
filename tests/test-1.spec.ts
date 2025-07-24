import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://lecture-translator.kit.edu/');
  await page.getByRole('link', { name: 'Login Login' }).click();
  await page.getByRole('button', { name: 'Log in with KIT-Account (' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('uboal');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('3436.nevizadE!');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('link', { name: 'Live event Live event' }).click();
  await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
  await page.getByRole('button', { name: 'Advanced Options' }).click({
    button: 'right'
  });
  await page.getByRole('button', { name: 'Advanced Options' }).click();
  await page.getByLabel('Presentation Format').selectOption('online');
  const select = page.getByLabel('Presentation Format');
  await expect(select).toHaveValue('online');

  await page.getByLabel('Presentation Format').selectOption('mixed');
  await page.getByLabel('Presentation Format').selectOption('offline');
  await page.getByLabel('Presentation Format').selectOption('resending');
});