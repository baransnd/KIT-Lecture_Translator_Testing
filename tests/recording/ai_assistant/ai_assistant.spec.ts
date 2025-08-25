import { test, expect } from '@playwright/test';
/**
This file is responsible for testing the AI assistant.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });

test.describe('AI Assistant', () => {

    test.beforeEach(async ({ page }) => {
        // This will run before each test and ensure the user is logged in
        await page.goto('https://lt2srv.iar.kit.edu/');
        await page.goto('https://lt2srv.iar.kit.edu/');
        await page.getByRole('link', { name: 'Live event Live event' }).click();
        await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
        await page.getByRole('button', { name: 'Advanced Options' }).click();
        await page.getByLabel('Availability').selectOption('private');
        await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).check();
    });

    /**
     * Test to check if the AI assistant is visible when selected.
     */
    test('The assistant should be visible if selected', async ({ page }) => {
        await page.locator('#aiassistant').check();
        await page.getByRole('button', { name: 'Start' }).click();

        const chatButton = page.locator('.open-chat-icon');
        await expect(chatButton).toBeVisible();
        await chatButton.click();
    });

    /**
     * Test to check if the AI assistant is not visible when not selected.
     */
    test('The assistant should not be visible if not selected', async ({ page }) => {
        await page.locator('#aiassistant').uncheck();
        await page.getByRole('button', { name: 'Start' }).click();

        const chatButton = page.locator('.open-chat-icon');
        await expect(chatButton).not.toBeVisible();
    });

    test('Can write messages to the assistant', async ({ page }) => {
        let text: string;
        text = `hello`;
        await page.locator('#aiassistant').check();
        await page.getByRole('button', { name: 'Start' }).click();
        await page.locator('.open-chat-icon').click();
        await page.getByRole('textbox', { name: 'Type your message...' }).fill(text);
        await page.getByRole('button', { name: 'Send' }).click();
        await expect(page.getByRole('article', { name: 'user: hello'}).getByRole('paragraph')).toBeVisible();

    });

    test.afterEach(async ({ page }) => {
        await page.getByRole('button', { name: 'End lecture' }).click();
        await page.getByRole('button', { name: 'Confirm' }).click();
    });
});