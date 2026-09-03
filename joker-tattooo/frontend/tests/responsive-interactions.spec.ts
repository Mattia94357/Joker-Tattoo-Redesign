import { expect, test } from '@playwright/test';

const productionOrigin = 'http://127.0.0.1:4173';

test('mobile navigation fits and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(`${productionOrigin}/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigate the studio' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigate the studio' })).toBeHidden();
});

test('mobile gallery lightbox preserves the full image inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${productionOrigin}/gallery`, { waitUntil: 'networkidle' });
  const tiles = page.locator('.gallery-tile');
  expect(await tiles.count()).toBeGreaterThan(0);
  await tiles.nth(0).click();
  await expect(page.getByRole('dialog', { name: 'Gallery image viewer' })).toBeVisible();
  const image = page.locator('.lightbox__image');
  const result = await image.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, objectFit: getComputedStyle(element).objectFit };
  });
  expect(result.objectFit).toBe('contain');
  expect(result.left).toBeGreaterThanOrEqual(0);
  expect(result.right).toBeLessThanOrEqual(390);
  expect(result.top).toBeGreaterThanOrEqual(0);
  expect(result.bottom).toBeLessThanOrEqual(844);
});

test('contact booking controls remain inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(`${productionOrigin}/contact`, { waitUntil: 'networkidle' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole('button', { name: 'Request Your Booking' }).click();
  const upload = page.locator('.booking-upload');
  const bounds = await upload.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
});

test('responsive hero and safety media load', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${productionOrigin}/`, { waitUntil: 'networkidle' });
  await expect.poll(() => page.locator('.hero img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${productionOrigin}/`, { waitUntil: 'networkidle' });
  const safetySection = page.locator('.safety-section');
  await safetySection.scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.safety-section__visual img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
});
