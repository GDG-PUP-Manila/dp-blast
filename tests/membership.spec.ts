import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

const eventPath = '/events/membership-2027';
const framePath = '/DP_Blast_mem.png';
const photoColor = [239, 33, 69, 255];

const uploadPhoto = async (page: Page) => {
  const buffer = await sharp({
    create: { width: 700, height: 700, channels: 3, background: '#ef2145' },
  }).png().toBuffer();
  await page.locator('#photo').setInputFiles({ name: 'membership-photo.png', mimeType: 'image/png', buffer });
  await expect(page).toHaveURL(/\/events\/membership-2027\/customize\?frameId=membership-2027-frame/);
  await expect(page.locator('#canvas-status')).toContainText('Loaded your selected photo');
};

const assertCaption = (caption: string, name: string) => {
  expect(caption).toContain('𝙏𝙃𝙀 𝙀𝙓𝙋𝙀𝘿𝙄𝙏𝙄𝙊𝙉 𝙎𝙏𝘼𝙍𝙏𝙎 𝙉𝙊𝙒!');
  expect(caption).toContain('After traversing a long, vast wormhole');
  expect(caption).toContain(`Hi, I'm ${name}!`);
  expect(caption).toContain('at 𝗚𝗗𝗚 𝗣𝗨𝗣!');
  expect(caption).toContain("I'm all set to 𝗴𝗿𝗼𝘄, 𝗰𝗼𝗻𝗻𝗲𝗰𝘁, 𝗮𝗻𝗱 𝗲𝘅𝗽𝗹𝗼𝗿𝗲 𝗯𝗲𝘆𝗼𝗻𝗱 𝘁𝗵𝗲 𝗴𝗮𝗹𝗮𝘅𝗶𝗲𝘀!");
  expect(caption).toContain('🎨 Layout by 𝘝𝘪𝘯𝘤𝘦 𝘋𝘦𝘭𝘪𝘨𝘦𝘯𝘵𝘦');
  expect(caption).toContain('🖌️ Assets by 𝘒𝘦𝘯𝘯𝘦𝘵𝘩 𝘔𝘢𝘳𝘲𝘶𝘦𝘻');
  expect(caption).toContain('✍️ Spiel by 𝘛𝘰𝘮𝘮𝘺 𝘙𝘦𝘵𝘶𝘭𝘪𝘯');
  expect(caption.split('https://forms.gle/6bwhYTCKF8wbymuKA')).toHaveLength(4);
  expect(caption.split('https://surl.li/ywgejf')).toHaveLength(4);
  expect(caption.split('frame.gdgpup.org')).toHaveLength(4);
  for (const hashtag of ['#GDGPUP27', '#GoogleDevelopersGroups', '#GDGrowsBeyond', '#GDGInfoSession2026', '#LeapWithGDG']) {
    expect(caption).toContain(hashtag);
  }
  expect(caption).not.toContain('{{name}}');
  expect(caption).not.toContain('[Name]');
};

test('membership frame is discoverable and exports a personalized photo with a copyable caption', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const source = sharp('public/DP_Blast_mem.png');
  const metadata = await source.metadata();
  expect([metadata.width, metadata.height, metadata.hasAlpha]).toEqual([2160, 2160, true]);
  const sourceCenter = await source.extract({ left: 1080, top: 1080, width: 1, height: 1 }).raw().toBuffer();
  expect(sourceCenter[3]).toBe(0);

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const card = page.locator(`#events-section a[href="${eventPath}"]`);
  await expect(card).toBeVisible();
  await expect(card.locator('img')).toHaveAttribute('src', '/DP_Blast_mem_thumbnail.png');
  await expect(page.locator('#events-section a').first()).toHaveAttribute('href', eventPath);
  await card.click();
  await page.locator('#dpblast-name-input').fill('Kian QA');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page).toHaveURL(eventPath);
  await expect(page.locator('h1')).toContainText('Membership');
  await expect(page.locator('#frame-preview')).toHaveAttribute('src', framePath);
  const og = await page.request.get('/api/og/membership-2027');
  expect(og.ok()).toBe(true);
  const ogMetadata = await sharp(await og.body()).metadata();
  expect([ogMetadata.format, ogMetadata.width, ogMetadata.height]).toEqual(['jpeg', 1200, 630]);
  await uploadPhoto(page);
  await page.screenshot({ path: 'test-results/membership-desktop-light.png', fullPage: true });

  await expect.poll(() => page.locator('#preview-canvas').evaluate((canvas: HTMLCanvasElement) =>
    [...canvas.getContext('2d')!.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data],
  )).toEqual(photoColor);
  const downloading = page.waitForEvent('download');
  await page.locator('#download-result').click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('membership-2027-membership-2027-frame-custom.png');
  const exported = sharp((await download.path())!);
  const outputMetadata = await exported.metadata();
  expect([outputMetadata.format, outputMetadata.width, outputMetadata.height]).toEqual(['png', 2048, 2048]);
  const exportedCenter = await exported.extract({ left: 1024, top: 1024, width: 1, height: 1 }).ensureAlpha().raw().toBuffer();
  expect([...exportedCenter]).toEqual(photoColor);
  await expect(page.locator('#caption-popup')).toBeVisible();
  const caption = await page.locator('#caption-popup-text').inputValue();
  assertCaption(caption, 'Kian QA');
  await page.locator('#caption-popup-copy').click();
  await expect(page.locator('#caption-popup-status')).toContainText('Caption copied');
  const copiedCaption = await page.evaluate(() => navigator.clipboard.readText());
  // Windows uses CRLF in its clipboard; textarea values use LF in the browser.
  expect(copiedCaption.replaceAll('\r\n', '\n')).toBe(caption.trim());
  expect(errors).toEqual([]);
});

test('membership editor fits mobile dark mode and preserves caption copying without Clipboard API', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark',
  });
  const page = await context.newPage();
  try {
    await page.addInitScript(() => {
      localStorage.setItem('dpblast-user-name', 'Sparkmate QA');
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    });
    await page.goto(eventPath);
    await uploadPhoto(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: 'test-results/membership-mobile-dark.png', fullPage: true });
    await page.locator('#download-result').click();
    await expect(page.locator('#caption-popup')).toBeVisible();
    const caption = await page.locator('#caption-popup-text').inputValue();
    assertCaption(caption, 'Sparkmate QA');
    await page.locator('#caption-popup-copy').click();
    await expect(page.locator('#caption-popup-status')).toContainText('Caption copied');
    const selection = await page.locator('#caption-popup-text').evaluate((textarea: HTMLTextAreaElement) =>
      textarea.value.slice(textarea.selectionStart, textarea.selectionEnd),
    );
    expect(selection).toBe(caption);
    await page.keyboard.press('Escape');
    await expect(page.locator('#caption-popup')).toBeHidden();
    await expect(page).toHaveURL(/membership-2027\/customize/);
  } finally {
    await context.close();
  }
});
