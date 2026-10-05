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

test('iOS repaint branch runs once and restores only the video wrapper', async ({ page }) => {
  // Exercise the iOS-only branch on desktop automation; this is not an iPhone test.
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = (property: string, value?: string) => {
      if (property === '-webkit-touch-callout' && value === 'none') return true;
      return value === undefined ? supports(property) : supports(property, value);
    };
  });
  const repaintEvents: string[] = [];
  page.on('console', message => {
    if (!message.text().startsWith('[hero-video] ')) return;
    const state = JSON.parse(message.text().slice('[hero-video] '.length));
    if (state.event.startsWith('ios-repaint-')) repaintEvents.push(state.event);
  });
  await page.goto(process.env.HERO_TEST_ORIGIN ?? 'http://127.0.0.1:4173');
  await expect.poll(() => repaintEvents).toEqual(['ios-repaint-start', 'ios-repaint-complete']);
  const video = page.locator('.hero video');
  await video.evaluate(element => {
    for (const event of ['loadeddata', 'canplay', 'loadeddata', 'canplay']) element.dispatchEvent(new Event(event));
  });
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.5);
  expect(repaintEvents).toEqual(['ios-repaint-start', 'ios-repaint-complete']);
  const state = await video.evaluate((v: HTMLVideoElement) => {
    const layer = v.parentElement!;
    const hero = layer.parentElement!;
    const videoBounds = v.getBoundingClientRect();
    const heroBounds = hero.getBoundingClientRect();
    return {
      isolation: layer.style.isolation, videoTransform: getComputedStyle(v).transform,
      visibility: getComputedStyle(v).visibility, opacity: getComputedStyle(v).opacity,
      aligned: videoBounds.x === heroBounds.x && videoBounds.y === heroBounds.y &&
        videoBounds.width === heroBounds.width && videoBounds.height === heroBounds.height,
      scrollY: window.scrollY, paused: v.paused,
    };
  });
  expect(state).toEqual({ isolation: '', videoTransform: 'none', visibility: 'visible', opacity: '1', aligned: true, scrollY: 0, paused: false });
});

test.describe('desktop hero', () => {
  test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });
  test('plays with the original route animation and no iOS repaint', async ({ page }, testInfo) => {
    const mobileLogs: string[] = [];
    page.on('console', message => {
      if (message.text().startsWith('[hero-video]')) mobileLogs.push(message.text());
    });
    await page.goto(process.env.HERO_TEST_ORIGIN ?? 'http://127.0.0.1:4173');
    const video = page.locator('.hero video');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > .5)).toBe(true);
    const state = await video.evaluate((v: HTMLVideoElement) => ({
      isolation: v.parentElement!.style.isolation, transform: getComputedStyle(v).transform,
      height: document.querySelector('.hero')!.getBoundingClientRect().height,
      scrollY: window.scrollY,
    }));
    expect(state).toEqual({ isolation: '', transform: 'none', height: 900, scrollY: 0 });
    expect(mobileLogs).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('hero-desktop.png') });
  });
});
