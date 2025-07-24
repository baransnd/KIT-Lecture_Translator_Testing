import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

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
  await page.getByRole('button', { name: 'Confirm' }).click();
});