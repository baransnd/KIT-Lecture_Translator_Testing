import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://lecture-translator.kit.edu/');
  await page.getByRole('link', { name: 'Login Login' }).click();
  await page.getByRole('button', { name: 'Log in with KIT-Account (' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('uboal');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('3436.nevizadE!');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('link', { name: 'Live event Live event' }).click();
  await page.getByRole('img', { name: 'Start Event' }).click({
    button: 'right'
  });
  await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
  await page.getByText('Lecture Name Accept Terms of').click();
  await page.getByRole('button', { name: 'Advanced Options' }).click();
  await page.locator('#aiassistant').check();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.locator('i').nth(4).click();
  await page.getByRole('textbox', { name: 'Type your message...' }).click();
  await page.getByRole('textbox', { name: 'Type your message...' }).fill('test');
  await page.getByRole('button', { name: 'Send' }).click();
  await page.getByRole('button', { name: '' }).nth(1).click();
  await page.locator('i').nth(4).click();
  await page.getByRole('button', { name: '' }).nth(1).click();
  await page.locator('.open-chat-icon').click();
  await page.getByRole('button', { name: '' }).nth(1).click();
  await page.getByRole('button', { name: 'End lecture' }).click();
  
});