import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';
import { randomFillSync } from 'node:crypto';

const editor = '/events/cosmos/customize?frameId=cosmos-frame';
const photo = async () => ({ name: 'photo.png', mimeType: 'image/png', buffer: await sharp({ create: { width: 700, height: 700, channels: 3, background: '#ef2145' } }).png().toBuffer() });
const upload = async (page: Page) => {
  await page.goto('/events/cosmos');
  await page.locator('#photo').setInputFiles(await photo());
  await expect(page).toHaveURL(/customize/);
  await expect(page.locator('#canvas-status')).toContainText('Loaded your selected photo');
};

test('device theme, saved toggle, all pages and maintainer', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByText('Kian Angelo M. Florendo')).toBeVisible();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  for (const route of ['/events/cosmos', editor, '/events/sparkfest', '/events/sparkfest/customize']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.screenshot({ path: 'test-results/desktop-light.png', fullPage: true });
});

test('photo renders, mouse and pen dragging synchronize sliders, PNG downloads', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await upload(page);
  const colored = await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => {
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] === 239 && pixels[i + 1] === 33 && pixels[i + 2] === 69) return true;
    return false;
  });
  expect(colored).toBe(true);
  const box = (await page.locator('canvas').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 25, box.y + box.height / 2 + 20);
  await page.mouse.up();
  expect(Number(await page.locator('#x-range').inputValue())).toBeGreaterThan(0);
  expect(Number(await page.locator('#y-range').inputValue())).toBeGreaterThan(0);
  const beforePen = Number(await page.locator('#x-range').inputValue());
  const cdp = await page.context().newCDPSession(page);
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1, pointerType: 'pen' });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + 20, y, buttons: 1, pointerType: 'pen' });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x + 20, y, button: 'left', buttons: 0, clickCount: 1, pointerType: 'pen' });
  expect(Number(await page.locator('#x-range').inputValue())).toBeGreaterThan(beforePen);
  const download = page.waitForEvent('download');
  await page.locator('#download-result').click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/cosmos.*\.png$/);
  const metadata = await sharp((await file.path())!).metadata();
  expect(metadata.format).toBe('png');
  expect(Math.max(metadata.width!, metadata.height!)).toBeLessThanOrEqual(2048);
  await expect(page.locator('#caption-popup')).toBeVisible();
  await expect(page.locator('#caption-popup-text')).toHaveValue(/🚀/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#caption-popup')).toBeHidden();
  await expect(page.locator('#download-result')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/customize/);
  expect(errors).toEqual([]);
});

test('large photo survives navigation and reload using IndexedDB', async ({ page }) => {
  const pixels = randomFillSync(Buffer.alloc(1500 * 1500 * 3));
  const buffer = await sharp(pixels, { raw: { width: 1500, height: 1500, channels: 3 } }).png().toBuffer();
  expect(buffer.length).toBeGreaterThan(5 * 1024 * 1024);
  await page.goto('/events/cosmos');
  await page.locator('#photo').setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer });
  await expect(page).toHaveURL(/customize/);
  await expect(page.locator('#canvas-status')).toContainText('Loaded your selected photo');
  await page.reload();
  await expect(page.locator('#canvas-status')).toContainText('Loaded your selected photo');
  expect(await page.evaluate(() => sessionStorage.getItem('dpblast-customize-image'))).toBeNull();
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('dpblast-photos', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('photos', 'readwrite');
        const store = tx.objectStore('photos');
        const key = sessionStorage.getItem('dpblast-photo-tab')!;
        const read = store.get(key);
        read.onsuccess = () => store.put({ ...read.result, savedAt: Date.now() - 2 * 86400000 }, key);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => reject(tx.error);
      };
    });
  });
  await page.reload();
  await expect(page.locator('#canvas-status')).toContainText('Upload a photo');
  await page.locator('#photo').setInputFiles(await photo());
  await expect(page.locator('#canvas-status')).toContainText('Photo loaded.');
  await page.reload();
  await expect(page.locator('#canvas-status')).toContainText('Loaded your selected photo');
  await page.goto('/events/sparkfest/customize');
  await expect(page.locator('#canvas-status')).toContainText('Upload a photo');
});

test('session fallback works when IndexedDB is unavailable', async ({ page }) => {
  await page.addInitScript(() => { indexedDB.open = () => { throw new Error('blocked'); }; });
  await upload(page);
  await page.reload();
  await expect(page.locator('#canvas-status')).toContainText('Loaded your selected photo');
});

test('storage failures preserve the editor photo and explain navigation failure', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('dpblast-user-name', 'QA'); } catch {}
    indexedDB.open = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('quota'); };
  });
  await page.goto('/events/cosmos');
  await page.locator('#photo').setInputFiles(await photo());
  await expect(page.locator('#upload-status')).toContainText('could not save');
  await page.getByRole('link', { name: 'Open Customize' }).click();
  await page.locator('#photo').setInputFiles(await photo());
  await expect(page.locator('#canvas-status')).toContainText('Photo loaded for this visit');
  await page.locator('#download-result').click();
  await expect(page.locator('#caption-popup')).toBeVisible();
});

test('reduced motion name dialog remains visible, traps focus, Escape restores it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(editor);
  const trigger = page.getByRole('button', { name: 'Edit Name' });
  await trigger.click();
  const dialog = page.locator('#dpblast-name-modal');
  await expect(dialog).toHaveCSS('opacity', '1');
  await expect(page.locator('#dpblast-name-input')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#dpblast-name-input')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/customize/);
});

test('upload button is keyboard operable and invalid photos are rejected', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('dpblast-user-name', 'QA'); } catch {} });
  await page.goto('/events/cosmos');
  await page.getByRole('button', { name: 'Choose Your Photo' }).focus();
  const chooser = page.waitForEvent('filechooser');
  await page.keyboard.press('Enter');
  await (await chooser).setFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('bad') });
  await expect(page.locator('#upload-status')).toContainText('Unsupported file type');
  await page.locator('#photo').setInputFiles({ name: 'big.png', mimeType: 'image/png', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
  await expect(page.locator('#upload-status')).toContainText('too large');
});

test('uploader prompts for the visitor name on first open and skips it once set', async ({ page }) => {
  await page.goto('/events/cosmos');
  await expect(page.locator('#dpblast-name-input')).toBeVisible();
  await page.locator('#dpblast-name-input').fill('Kian QA');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#dpblast-name-modal')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('#dpblast-name-modal')).toHaveCount(0);
});

test('stored Sparkmate placeholder is treated as unset so the prompt returns', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('dpblast-user-name', 'Sparkmate'); } catch {} });
  await page.goto('/events/cosmos');
  await expect(page.locator('#dpblast-name-input')).toBeVisible();
  // Continuing with an empty field must not persist the placeholder, so it re-prompts.
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#dpblast-name-modal')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('dpblast-user-name'))).toBeNull();
  await page.reload();
  await expect(page.locator('#dpblast-name-input')).toBeVisible();
});

test('mobile layout and touch dragging still work in dark mode', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark' });
  const page = await context.newPage();
  await upload(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const box = (await page.locator('canvas').boundingBox())!;
  const cdp = await context.newCDPSession(page);
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 25, y: y + 20 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  expect(Number(await page.locator('#x-range').inputValue())).toBeGreaterThan(0);
  await page.screenshot({ path: 'test-results/mobile-dark.png', fullPage: true });
  await context.close();
});
