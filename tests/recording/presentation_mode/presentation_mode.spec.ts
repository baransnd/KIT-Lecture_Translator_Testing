import { test, expect } from '@playwright/test';
/**
This file is responsible for testing the AI assistant.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });

test.describe('AI Assistant', () => {

  test('should be able to select the presentation formats', async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/');
    await page.getByRole('link', { name: 'Live event Live event' }).click();
    await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
    await page.getByRole('button', { name: 'Advanced Options' }).click();
  
    await page.getByLabel('Availability').selectOption('private');
    await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).check();
  
    const presentationFormat = page.getByLabel('Presentation Format');
  
    for (const format of ['online', 'mixed', 'offline', 'resending']) {
      await presentationFormat.selectOption(format);
      await expect(presentationFormat).toHaveValue(format);
    }
  });

    test('should not allow selecting an invalid presentation format', async ({ page }) => {
        await page.goto('https://lt2srv.iar.kit.edu/');
        await page.getByRole('link', { name: 'Live event Live event' }).click();
        await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
        await page.getByRole('button', { name: 'Advanced Options' }).click();
      
        const presentationFormat = page.getByLabel('Presentation Format');

        const optionValues = await presentationFormat.locator('option').evaluateAll(options =>
          options.map(option => (option as HTMLOptionElement).value)
        );
        
        expect(optionValues).not.toContain('invalid_format');
      });
});