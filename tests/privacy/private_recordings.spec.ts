import {test, expect} from '@playwright/test';

/**
 * This file is responsible for testing the private recordings functionality.
 * It checks that a lecture marked as private
 * 1) appears in the Private Archive
 * 2) does NOT appear in the Public Archive.
 * @author Isik Baran Sandan
 */


test.use({ storageState: 'auth.json' });

test.describe('Private recording archive behavior', () => {
    let lectureName: string;
  
    test.beforeEach(async ({ page }) => {
      lectureName = `privateLectureExample_${Date.now()}`;
  
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
