import { expect, test } from '@playwright/test';
import sharp from 'sharp';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test('hero advances time and visible frames on a fresh mobile load and reload without interaction', async ({ page }, testInfo) => {
  // Routing disables the HTTP cache: both navigations exercise cold media loads.
  await page.route('**/*', route => route.continue());
  await page.goto(process.env.HERO_TEST_ORIGIN ?? 'http://127.0.0.1:4173');
  for (const load of ['initial', 'reload']) {
    if (load === 'reload') await page.reload();
    const video = page.locator('.hero video');
    await expect(video).toHaveCount(1);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > .2), { timeout: 15000 }).toBe(true);
    const before = await video.evaluate((v: HTMLVideoElement) => ({
      paused: v.paused, currentTime: v.currentTime, readyState: v.readyState,
      networkState: v.networkState, currentSrc: v.currentSrc,
      videoWidth: v.videoWidth, videoHeight: v.videoHeight,
      autoplay: v.autoplay, muted: v.muted, defaultMuted: v.defaultMuted,
      playsInline: v.playsInline, loop: v.loop, preload: v.preload,
      scrollY: window.scrollY, interacted: navigator.userActivation?.hasBeenActive ?? false,
      parentTransform: getComputedStyle(document.querySelector('.page-transition')!).transform,
    }));
    // WebKit automation can report userActivation even with no input commands.
    expect(before).toMatchObject({ paused: false, autoplay: true, muted: true, defaultMuted: true, playsInline: true, loop: true, preload: 'auto', scrollY: 0, parentTransform: 'none' });
    expect(before.videoWidth).toBeGreaterThan(0);
    expect(before.videoHeight).toBeGreaterThan(0);
    expect(before.currentSrc).toContain('.mp4');
    // Page screenshots avoid locator screenshots, which can scroll the element.
    const clip = { x: 230, y: 110, width: 150, height: 190 };
    const first = await page.screenshot({ clip });
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 5000 }).toBeGreaterThan(before.currentTime + .6);
    const second = await page.screenshot({ clip });
    const pixelsA = await sharp(first).raw().toBuffer();
    const pixelsB = await sharp(second).raw().toBuffer();
    const meanDifference = pixelsA.reduce((sum, value, i) => sum + Math.abs(value - pixelsB[i]), 0) / pixelsA.length;
    expect(meanDifference).toBeGreaterThan(.2);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    console.log(load, JSON.stringify(before), 'visible pixel difference', meanDifference);
    await testInfo.attach(`${load}-frame-before`, { body: first, contentType: 'image/png' });
    await testInfo.attach(`${load}-frame-after`, { body: second, contentType: 'image/png' });
    if (load === 'initial') await page.screenshot({ path: testInfo.outputPath('hero-mobile.png') });
  }
});
