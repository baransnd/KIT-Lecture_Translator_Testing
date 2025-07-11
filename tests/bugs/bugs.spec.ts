import { test, expect } from '@playwright/test';

/*
This file is responsible for testing the navigation to the Archive and its subpages.
@author Isik Baran Sandan
*/
test.use({ storageState: 'auth.json' });



/**
 * Test to verify that the "Back" button returns to the previous page after navigating to "Private Archive"
 * 
 * FAILS --> Gives "ERROR: Permission Denied" when clicking the "Back" button.
 * @param {import('@playwright/test').Page} page - The Playwright page object
 */
test('should return to previous page after clicking "Back" from  "Private Archive"', async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/login');

    const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
    await expect(archiveLink).toBeVisible();
    await archiveLink.click();
    await expect(page.getByRole('link', { name: 'Private Archive Private' })).toBeVisible();

    await page.getByRole('link', { name: 'Private Archive Private' }).click();
    const backButton = page.locator('div').filter({ hasText: 'Back' }).nth(2);
    await backButton.click();


    const privateVisible = await page.getByRole('link', { name: 'Private Archive Private' }).isVisible();
    const archiveVisible = await page.getByRole('link', { name: 'Archive Archive' }).isVisible();
   
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(privateVisible || archiveVisible).toBe(true);
});

/*

/**
 * Test to verify that the dropdown delete button deletes a recording.
 * 
 * WARNING: If this test passes, it will delete the first recording in the archive.
 * 
 * TODO: Make this test more robust by creating a recording first and then deleting it.
 */
/*
test('should delete a recording with the dropdown menu delete button', async ({ page }) => {
    await page.goto('https://lt2srv.iar.kit.edu/login');

    const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
    await expect(archiveLink).toBeVisible();
    await archiveLink.click();
    await expect(page.getByRole('link', { name: 'Private Archive Private' })).toBeVisible();

    await page.getByRole('link', { name: 'Private Archive Private' }).click();

    await expect(page.locator('#config-dropdown-button').first()).toBeVisible();
    await page.locator('#config-dropdown-button').first().hover();
    await page.waitForTimeout(1000); 

    await page.getByRole('button', { name: 'Delete session' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();

    await new Promise(resolve => setTimeout(resolve, 1000));

    await expect(page.getByRole('link', { name: 'KIT lecture translator' })).toBeVisible();
});
*/