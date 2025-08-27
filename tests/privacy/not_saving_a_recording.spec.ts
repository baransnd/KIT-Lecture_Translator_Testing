import {test, expect} from '@playwright/test'

test.use({storageState: 'auth.json'})

/**
 * This file is responsible for testing the functionality of not saving a recording.
 * For saving a recording, the tests are in the file /privacy/private_recordings.spec.ts
 * As of now there are no tests for saving a recording as public, 
 * since the functionality is the same as saving it as private.
 * @author Isik Baran Sandan
 */
test('Should not save a recording if the box is unckecked',async ({page}) => {
    let lectureName: string;
    lectureName = `privateLectureExample ${Date.now()}`;
  
    await page.goto('https://lt2srv.iar.kit.edu/');
    await page.getByRole('link', { name: 'Live event Live event' }).click();
    await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
    await page.getByRole('textbox', { name: 'Lecture Name' }).fill(lectureName);
    await page.getByRole('button', { name: 'Advanced Options' }).click();
    await page.getByLabel('Availability').selectOption('private');
    await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).uncheck();
    //dont save the recording
    await expect(page.getByRole('checkbox', { name: 'Save Session (can be deleted' })).not.toBeChecked()
    //record
    await page.getByRole('button', { name: 'Start' }).click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'End lecture' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    //go to archive
    await page.goto('https://lt2srv.iar.kit.edu/');
    const archiveLink = page.getByRole('link', { name: 'Archive Archive' });
    await archiveLink.click();
    await expect(page.getByRole('link', { name: 'Private Archive Private' })).toBeVisible();
    await page.getByRole('link', { name: 'Private Archive Private' }).click();
    //check if the recording is truly not there
    await expect(page.getByText(new RegExp(lectureName))).toHaveCount(0); 
})