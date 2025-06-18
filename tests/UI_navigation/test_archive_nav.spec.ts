import { test, expect } from '@playwright/test';

/*
This file is responsible for testing the navigation to the Archive and its subpages.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });

/**
 * Helper to navigate from login page to Archive page
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
async function goToArchivePage(page) {
  const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
  await expect(archiveLink).toBeVisible();
  await archiveLink.click();
  await expect(page.getByRole('link', { name: 'Private Archive Private' })).toBeVisible();
}


test.describe('UI Navigation - Archive navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/login');
  });


  test('login successfully', async ({ page }) => {
    await expect(page).toHaveURL(/login/);
  });

  test('should show the "Archive" link from home page', async ({ page }) => {
    const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
    await expect(archiveLink).toBeVisible();
  });

  test('should navigate to "Archive"', async ({ page }) => {
    await goToArchivePage(page);
  });

  test('should navigate to "Private Archive" from Archive', async ({ page }) => {
    await goToArchivePage(page);
    const privateLink = page.getByRole('link', { name: 'Private Archive Private' });
    await expect(privateLink).toBeVisible();
    await privateLink.click();

    await expect(page.getByRole('img', { name: 'Create directory' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Record video' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Upload video' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Back' }).nth(2)).toBeVisible();
  });

  test('should navigate to "Public Archive" from Archive', async ({ page }) => {
    await goToArchivePage(page);
    const publicLink = page.getByRole('link', { name: 'Public Archive Public' });
    await expect(publicLink).toBeVisible();
    await publicLink.click();

    await expect(page.getByRole('img', { name: 'Create directory' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Record video' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Upload video' })).toBeVisible();
  });


  test('should return to previous page after clicking "Back" from  "Private Archive"', async ({ page }) => {
    await goToArchivePage(page);
    await page.getByRole('link', { name: 'Private Archive Private' }).click();
    const backButton = page.locator('div').filter({ hasText: 'Back' }).nth(2);
    await backButton.click();


    const privateVisible = await page.getByRole('link', { name: 'Private Archive Private' }).isVisible();
    const archiveVisible = await page.getByRole('link', { name: 'Archive Archive' }).isVisible();
    expect(privateVisible || archiveVisible).toBe(true);
  });
});
