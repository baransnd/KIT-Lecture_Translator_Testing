import { test, expect, type Page, type Locator } from '@playwright/test';
test.use({ storageState: 'auth.json' });

/**
 * This file is responsible for testing the opening of the sidebar 
 * from an archived recording (in order to delete it).
 * 
 * IMPORTANT: This file is meant as a simple trial for a robust sidebar opener in a 
 * archived recording. The functionality is requiered for the private recording tests
 * and is currently NOT working.
 */

test('opening the sidebar from archive recording and deleting it', async ({ page }) => {
  
  //Name of a lecture in the private archive to be deleted. Change if necessary.  
  const lectureName = "Lecture 02.07.2025 13:52_284542";

  await page.goto('https://lt2srv.iar.kit.edu/login');

  // Navigate into Private Archive
  await page.getByRole('link', { name: 'Archive Archive' }).click(); 
  await page.getByRole('link', { name: 'Private Archive Private' }).click(); 

  //Locate the lecture row and open it
  const lectureBox = page.locator('div').filter({ hasText: lectureName }).nth(2);
  await lectureBox.locator('a').first().click();

  const sidebarTrigger = page.locator('.sidebar-icon');
  const sidebarContent = page.locator('#delete_recording');

  // Attempt opening the sidebar
  await openSidebarRobust(page, sidebarTrigger, sidebarContent, 6000, lectureBox);
  await expect(sidebarContent).toBeVisible();
});


async function getBBoxForLocator(locator: Locator) {
  const handle = await locator.elementHandle();
  return handle ? await handle.boundingBox() : null;
}

async function debugElementUnderPoint(page: Page, x: number, y: number) {
  return await page.evaluate(
    ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        id: el.id || null,
        class: el.className || null,
        outerSnippet: el.outerHTML?.slice(0, 400) || null,
        computed: {
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          pointerEvents: cs.pointerEvents,
        },
      };
    },
    { x, y }
  );
}

async function openSidebarRobust(
  page: Page,
  trigger: Locator,
  content: Locator,
  timeout = 4000,
  container?: Locator 
) {
  await page.bringToFront();
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeVisible({ timeout: 5000 });
  const triggerBox = await getBBoxForLocator(trigger);
  const containerBox = container ? await getBBoxForLocator(container) : null;
  if (!triggerBox) throw new Error('sidebar trigger has no boundingBox');

  const cx = Math.round(triggerBox.x + triggerBox.width / 2);
  const cy = Math.round(triggerBox.y + triggerBox.height / 2);
  const startX = Math.max(1, Math.round((containerBox ? containerBox.x - 200 : triggerBox.x - 400)));
  const startY = Math.round(containerBox ? containerBox.y + containerBox.height / 2 : cy);
  await page.mouse.move(startX, startY);
  await page.mouse.move(
    Math.round((startX + (containerBox ? (containerBox.x + containerBox.width / 2) : cx)) / 2),
    Math.round((startY + cy) / 2),
    { steps: 40 }
  );
  await page.mouse.move(cx, cy, { steps: 80 });

  await page.waitForTimeout(120);

  const under = await debugElementUnderPoint(page, cx, cy);
  console.log('element under cursor:', JSON.stringify(under, null, 2));

  if (container) {
    try {
      await container.evaluate((el: HTMLElement) => {
        el.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });
    } catch (e) {
      console.log('container dispatch failed', String(e));
    }
  }
  await trigger.evaluate((el: HTMLElement) => {
    el.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  });

  await page.mouse.move(cx - 6, cy, { steps: 4 });
  await page.mouse.move(cx + 6, cy, { steps: 4 });
  await page.mouse.move(cx, cy, { steps: 4 });
  try {
    await content.waitFor({ state: 'visible', timeout });
    console.log('sidebar content became visible via movement/dispatch');
    return;
  } catch (e) {
    console.log('sidebar content not visible after movement/dispatch:', String(e));
  }
  try {
    console.log('Trying click as last resort');
    await trigger.click({ force: true });
    await content.waitFor({ state: 'visible', timeout: 2000 });
    console.log('sidebar opened after click');
    return;
  } catch (e) {
    console.log('click fallback failed', String(e));
  }
  await page.screenshot({ path: 'debug-sidebar-fail.png', fullPage: true });
  throw new Error('openSidebarRobust: failed to open sidebar');
}