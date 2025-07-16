import {test, expect, Page, Locator} from '@playwright/test';

/**
 * This file is responsible for testing the private recordings functionality.
 * It checks that a lecture marked as private
 * 1) appears in the Private Archive
 * 2) does NOT appear in the Public Archive.
 * @author Isik Baran Sandan
 */

async function moveAwayAndHover(page: Page, locator: Locator) {
  // Get the bounding box of the element
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');
  const outsideX = box.x - 20;
  const outsideY = box.y + box.height / 2;
  const insideX = box.x + box.width / 2;
  const insideY = box.y + box.height / 2;
  await page.mouse.move(outsideX, outsideY);
  await page.waitForTimeout(100); // brief pause
  await page.mouse.move(insideX, insideY);
}


/**
 * TODO:
 * Method to ensure that the sidebar opens correctly.
 * @param page - The Playwright page object to interact with the web application.
 * @returns 
 */
async function ensureSidebarOpens(page: Page) {
  const sidebarTrigger = page.locator('.sidebar-icon');
  const sidebarContent = page.locator('#delete_recording');

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await moveAwayAndHover(page, sidebarTrigger);

      await page.waitForTimeout(200);

      if (await sidebarContent.isVisible()) {
        return;
      }
    } catch {
      // ignore and retry
    }
  }
  throw new Error('Failed to open the sidebar after multiple attempts');
}


test.use({ storageState: 'auth.json' });



test.describe('Private recording archive behavior', () => {
    let lectureName: string;
  
    test.beforeAll(async ({ page }) => {
      lectureName = `privateLectureExample ${Date.now()}`;
  
      await page.goto('https://lt2srv.iar.kit.edu/');
      await page.getByRole('link', { name: 'Live event Live event' }).click();
      await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
      await page.getByRole('textbox', { name: 'Lecture Name' }).fill(lectureName);
      await page.getByRole('button', { name: 'Advanced Options' }).click();
  
      await page.getByLabel('Availability').selectOption('public'); // reset then select
      await page.getByLabel('Availability').selectOption('private');
  
      await page.getByRole('button', { name: 'Start' }).click();
      await page.waitForTimeout(3000); // simulate lecture duration
      await page.getByRole('button', { name: 'End lecture' }).click();
      await page.getByRole('checkbox', { name: 'Save the content of this' }).check();
      await page.getByRole('button', { name: 'Confirm' }).click();
    });

    /* COMMENTED OUT AS I CURRENTLY CANNOT OPEN THE SIDEBAR TO DELETE
    test.afterAll(async ({ page }) => {
      // Clean up: Delete the private lecture after tests
      await page.goto('https://lt2srv.iar.kit.edu/');
      const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
      await archiveLink.click();
  
      await page.getByRole('link', { name: 'Private Archive Private' }).click();
  
      const lectureBox = page.locator('div').filter({ hasText: lectureName }).nth(2);
      await lectureBox.locator('a').first().click();
      
      await ensureSidebarOpens(page);
      await page.locator('#delete_recording').click();
      await page.getByRole('button', { name: 'Delete' }).click();
    });
    */
    
    /**
     * This test checks that a lecture marked as private does appear in the Private Archive
     */
    test('should appear in the Private Archive', async ({ page }) => {
      await page.goto('https://lt2srv.iar.kit.edu/');
      const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
      await archiveLink.click();
  
      await expect(page.getByRole('link', { name: 'Private Archive Private' })).toBeVisible();
      await page.getByRole('link', { name: 'Private Archive Private' }).click();
  
      await expect(page.getByText(new RegExp(lectureName))).toBeVisible();
    });
  
    /**
     * This test checks that a lecture marked as private does NOT appear in the Public Archive
     */
    test('should NOT appear in the Public Archive', async ({ page }) => {
      await page.goto('https://lt2srv.iar.kit.edu/');
      const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
      await archiveLink.click();
  
      const publicLink = page.getByRole('link', { name: 'Public Archive Public' });
      await publicLink.click();
  
      await expect(page.getByText(new RegExp(lectureName))).toHaveCount(0); // or .not.toBeVisible()
    });
  });
