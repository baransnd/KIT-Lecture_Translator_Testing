import { test, expect, type Page, type Locator } from '@playwright/test';

test.use({ storageState: 'auth.json' });

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

// ---- Your test ----
test('successfull login', async ({ page }) => {
  const sidebarTrigger = page.locator('.sidebar-icon');    
  const sidebarContent = page.locator('#delete_recording');  // whatever proves the sidebar opened

  await page.goto('https://lt2srv.iar.kit.edu/login');
  await expect((page).getByRole('link', { name: 'Live event Live event' })).toBeVisible();
  await page.getByRole('link', { name: 'Live event Live event' }).click();
  await expect(page.getByRole('img', { name: 'Start Event' })).toBeVisible();
  await page.getByRole('img', { name: 'Start Event' }).click();
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();

  await openSidebar(page, sidebarTrigger, sidebarContent, 4000);
});
