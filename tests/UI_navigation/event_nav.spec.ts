import { test, expect } from '@playwright/test';

/*
This file is responsible for testing the navigation to the Live Event page and its subpages.
@author Isik Baran Sandan

*/
test.use({ storageState: 'auth.json' });

/**
 * Helper to navigate from login page to Live event page
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
async function goToLiveEventPage(page) {
  const archiveLink = page.getByRole('link', { name: 'Live Event Live Event' });
  await expect(archiveLink).toBeVisible();
  await archiveLink.click();
  await expect(page.getByRole('img', { name: 'Start Event' })).toBeVisible();
}


test.describe('UI Navigation - Live Event navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/login');
  });


  test('should show the "Live Event" link from home page', async ({ page }) => {
    const liveEventLink = page.getByRole('link', { name: 'Live Event Live Event' });
    await expect(liveEventLink).toBeVisible();
  });

  test('should navigate to "Live Event"', async ({ page }) => {
    await goToLiveEventPage(page);
    await expect(page.getByRole('link', { name: 'Join Event Join Event' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Start Event' })).toBeVisible();
  });

  test('should navigate to "Join Event" from "Live Event"', async ({ page }) => {
    await goToLiveEventPage(page);
    const joinLink = page.getByRole('link', { name: 'Join Event Join Event' });
    await expect(joinLink).toBeVisible();
    await joinLink.click();

    await expect(page.getByRole('heading', { name: 'Available Sessions' })).toBeVisible();
  });

  test('should navigate to "Start Event" from "Live Event"', async ({ page }) => {
    await goToLiveEventPage(page);
    const startLink = page.getByRole('img', { name: 'Start Event' });
    await expect(startLink).toBeVisible();
    await startLink.click();

    await expect(page.locator('#lectureSession')).toBeVisible();

  });

  test('should navigate to back to "Home" from "Live Event"', async ({ page }) => {
    await goToLiveEventPage(page);
    const homeLink = page.getByRole('link', { name: 'Home Home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page.getByRole('link', { name: 'Live Event Live Event' })).toBeVisible();

  });

});
