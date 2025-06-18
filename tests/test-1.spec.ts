import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://lt2srv.iar.kit.edu/');
  await page.getByRole('link', { name: 'Login Login' }).click();
  await page.getByRole('button', { name: 'Log in with KIT-Account (' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('uboal');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('3436.nevizadE!');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('link', { name: 'Archive Archive' }).click();
  await page.getByRole('link', { name: 'Home Home' }).click();
  await page.getByRole('link', { name: 'Live event Live event' }).click();
  await page.getByRole('img', { name: 'Start Event' }).click();
  await page.getByRole('button', { name: 'Advanced Options' }).click();
  await page.locator('div:nth-child(10) > div:nth-child(2)').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'End lecture' }).click();
  await page.getByRole('checkbox', { name: 'Save the content of this' }).check();
  await page.getByRole('button', { name: 'Confirm' }).click();
});