import {test, expect} from '@playwright/test';

test.use({storageState: 'auth.json'});

/**
 * This file is responsible for testing if the lecture name is shown as it was set.
 */

test('setting the name of a lecture', async ({page}) => {
    let lectureName: string;
    lectureName = `privateLectureExample ${Date.now()}`;

    await page.goto('https://lt2srv.iar.kit.edu/');
    await page.getByRole('link', { name: 'Live event Live event' }).click();
    await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
    await page.getByRole('textbox', { name: 'Lecture Name' }).fill(lectureName);
    await page.getByRole('button', { name: 'Start' }).click();

    await expect(page.getByRole('heading', { name: lectureName })).toBeVisible();

    await page.getByRole('button', { name: 'End lecture' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
});



