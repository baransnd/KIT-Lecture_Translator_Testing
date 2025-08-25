import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://lecture-translator.kit.edu/');
  await page.getByRole('link', { name: 'Login Login' }).click();
  await page.getByRole('button', { name: 'Log in with KIT-Account (' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('uboal');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('3436.nevizadE!');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('link', { name: 'Live event Live event' }).click();
  await page.locator('#start-lecture').click();
  await page.getByRole('button', { name: 'Advanced Options' }).click();
  await page.locator('#aiassistant').check();
  await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).uncheck();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('i').nth(4).click();
  await expect(page.getByRole('textbox', { name: 'Type your message...' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Type your message...' }).click();
  await page.getByRole('textbox', { name: 'Type your message...' }).fill('Can you summarize the lecture so far?');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('article', { name: 'user: Can you summarize the' }).getByRole('paragraph')).toBeVisible();
  await page.getByRole('button', { name: 'End lecture' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
});