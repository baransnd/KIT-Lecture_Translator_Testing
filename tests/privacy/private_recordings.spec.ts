import { test, expect, type Page, type Locator } from '@playwright/test';
/**
 * This file is responsible for testing the private recordings functionality.
 * It checks that a lecture marked as private
 * 1) appears in the Private Archive
 * 2) does NOT appear in the Public Archive.
 * 
 * After the tests are done, the created lecture is deleted.
 * @author Isik Baran Sandan
 */

test.use({ storageState: 'auth.json' });



test.describe('Private recording archive behavior', () => {
    let lectureName: string;

    /**
     * Set up: Start a private lecture before running the tests and save it to the private archive.
     */
    test.beforeAll(async ({ page }) => {
      lectureName = `privateLectureExample ${Date.now()}`;
  
      await page.goto('https://lt2srv.iar.kit.edu/');
      await page.getByRole('link', { name: 'Live event Live event' }).click();
      await page.locator('div').filter({ hasText: 'Start Event' }).nth(3).click();
      await page.getByRole('textbox', { name: 'Lecture Name' }).fill(lectureName);
      await page.getByRole('button', { name: 'Advanced Options' }).click();
  
      await page.getByLabel('Availability').selectOption('public'); // reset then select
      await page.getByLabel('Availability').selectOption('private');

      await page.getByRole('checkbox', { name: 'Save Session (can be deleted' }).check();
  
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

      /*  Clean up: Delete the created lecture -> TODO: Does not work reliably yet.
      await page.goto('https://lt2srv.iar.kit.edu/'); 
      await page.getByRole('link', { name: 'Archive Archive' }).click(); 
      await page.getByRole('link', { name: 'Private Archive Private' }).click(); 
      const lectureBox = page.locator('div').filter({ hasText: lectureName }).nth(2); 
      await lectureBox.locator('a').first().click();
      
      const sidebarTrigger = page.locator('.sidebar-icon');    
      const sidebarContent = page.locator('#delete_recording');  
      console.log(await sidebarTrigger.count()); // should be 1+
      console.log(await sidebarTrigger.isVisible()); // true/false
      console.log(await sidebarTrigger.isHidden()); // true/false

      await expect(sidebarTrigger).toBeVisible({ timeout: 10000 }); 
      await openSidebar(page, sidebarTrigger, sidebarContent, 4000); 
      await sidebarContent.click(); 
      await page.getByRole('button', { name: 'Delete' }).click(); 
      */
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


  /**
   * Below are helpers to open the sidebar, can be moved to a separate file if needed
   * 
   */
  async function waitVisible(locator: Locator, timeout = 500) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }
  
  async function approachFrom(
    page: Page,
    box: { x: number; y: number; width: number; height: number },
    side: 'left' | 'right' | 'top' | 'bottom'
  ) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const pad = Math.max(30, Math.ceil(Math.max(box.width, box.height) * 0.6));
  
    let startX = cx;
    let startY = cy;
    if (side === 'left')   { startX = box.x - pad;                 startY = cy; }
    if (side === 'right')  { startX = box.x + box.width + pad;     startY = cy; }
    if (side === 'top')    { startX = cx;                          startY = box.y - pad; }
    if (side === 'bottom') { startX = cx;                          startY = box.y + box.height + pad; }
  
    await page.mouse.move(startX, startY);
    await page.mouse.move(cx, cy, { steps: 24 });
  }
  
  async function jiggle(page: Page, cx: number, cy: number) {
    const d = 6;
    await page.mouse.move(cx - d, cy);
    await page.mouse.move(cx + d, cy);
    await page.mouse.move(cx, cy - d);
    await page.mouse.move(cx, cy + d);
    await page.mouse.move(cx, cy);
  }
  
  async function circle(page: Page, cx: number, cy: number, r: number) {
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      await page.mouse.move(cx + r * Math.cos(t), cy + r * Math.sin(t));
    }
  }
  
  async function forceHoverEvents(trigger: Locator) {
    await trigger.dispatchEvent('pointerover');
    await trigger.dispatchEvent('mouseover');
    await trigger.dispatchEvent('mouseenter');
  }
  
  async function openSidebar(page: Page, trigger: Locator, content: Locator, timeout = 3000) {
    await trigger.scrollIntoViewIfNeeded();
    await expect(trigger).toBeVisible();
    await trigger.hover();
    if (await waitVisible(content, 300)) return;
    const handle = await trigger.elementHandle();
    const box = handle ? await handle.boundingBox() : null;
    if (!box) throw new Error('Sidebar trigger not hittable (no bounding box)');
  
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const sides: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'top', 'right', 'bottom'];
    for (const side of sides) {
      await approachFrom(page, box, side);
      if (await waitVisible(content, 350)) return;
  
      await page.mouse.move(box.x - 2, cy);
      await page.mouse.move(cx, cy, { steps: 10 });
      if (await waitVisible(content, 350)) return;
  
      await jiggle(page, cx, cy);
      if (await waitVisible(content, 350)) return;
    }
    await circle(page, cx, cy, Math.max(box.width, box.height));
    if (await waitVisible(content, 350)) return;
    await page.mouse.move(1, cy);
    await page.mouse.move(cx, cy, { steps: 25 });
    if (await waitVisible(content, 350)) return;
    await forceHoverEvents(trigger);
    if (await waitVisible(content, 500)) return;
    await trigger.hover({ force: true });
    await expect(content).toBeVisible({ timeout: 1500 });
  }