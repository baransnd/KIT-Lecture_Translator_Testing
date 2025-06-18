import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.describe('UI Navigation - Archive navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/login');
  });

  test('should load login page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/login/);
  });

  test('should show the "Archive Archive" link', async ({ page }) => {
    const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
    await expect(archiveLink).toBeVisible();
  });

  test('should navigate to "Archive Archive"', async ({ page }) => {
    const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
    await archiveLink.click();
    await expect(page.getByRole('link', { name: 'Private Archive Private' })).toBeVisible();
  });

  test('should navigate to "Private Archive" from Archive', async ({ page }) => {
    await page.getByRole('link', { name: 'Archive Archive' }).click();
    const privateLink = page.getByRole('link', { name: 'Private Archive Private' });
    await expect(privateLink).toBeVisible();
    await privateLink.click();
    await expect(page.locator('div').filter({ hasText: 'Back' }).nth(2)).toBeVisible();
  });

  test('should return to previous page after clicking "Back"', async ({ page }) => {
    await page.getByRole('link', { name: 'Archive Archive' }).click();
    await page.getByRole('link', { name: 'Private Archive Private' }).click();
    const backButton = page.locator('div').filter({ hasText: 'Back' }).nth(2);
    await backButton.click();

    const privateVisible = await page.getByRole('link', { name: 'Private Archive Private' }).isVisible();
    const archiveVisible = await page.getByRole('link', { name: 'Archive Archive' }).isVisible();
    expect(privateVisible || archiveVisible).toBe(true);
  });
});
