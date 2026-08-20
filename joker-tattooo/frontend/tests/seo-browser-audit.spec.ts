import { expect, test } from '@playwright/test';

const routes = ['/', '/gallery', '/why-joker', '/contact'];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

test('public pages expose unique, complete metadata', async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' });
    const result = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content,
      canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href,
      ogTitle: document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content,
      ogDescription: document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.content,
      ogImage: document.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content,
      twitterCard: document.querySelector<HTMLMetaElement>('meta[name="twitter:card"]')?.content,
      robots: document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content,
      h1Count: document.querySelectorAll('h1').length,
      schemas: [...document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')].flatMap(script => {
        const schema = JSON.parse(script.textContent || '{}');
        return Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
      }),
    }));

    expect(result.title).toBeTruthy();
    expect(result.description).toBeTruthy();
    expect(result.canonical).toBe(`https://www.jokertattoopatong.com${route}`);
    expect(result.ogTitle).toBe(result.title);
    expect(result.ogDescription).toBe(result.description);
    expect(result.ogImage).toBeTruthy();
    expect(result.twitterCard).toBe('summary_large_image');
    expect(result.robots).toContain('index, follow');
    expect(result.h1Count).toBe(1);
    expect(result.schemas).toContain('Organization');
    expect(result.schemas).toContain('WebPage');
    expect(result.schemas).toContain('ImageObject');
    expect(titles.has(result.title)).toBeFalsy();
    expect(descriptions.has(result.description!)).toBeFalsy();
    titles.add(result.title);
    descriptions.add(result.description!);
  }
});

for (const viewport of viewports) {
  test(`${viewport.name}: semantic structure, images and layout`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const consoleErrors: string[] = [];
    page.on('console', message => message.type() === 'error' && consoleErrors.push(message.text()));

    for (const route of routes) {
      await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: 'networkidle' });
      const audit = await page.evaluate(() => ({
        header: document.querySelectorAll('header.site-header').length,
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        section: document.querySelectorAll('section').length,
        article: document.querySelectorAll('article').length,
        footer: document.querySelectorAll('footer.site-footer').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        badImages: [...document.images].filter(image => !image.hasAttribute('alt') || !image.getAttribute('width') || !image.getAttribute('height')).map(image => image.src),
        internalRoutes: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')].map(link => link.getAttribute('href')),
      }));
      expect(audit.header).toBe(1);
      expect(audit.nav).toBeGreaterThan(0);
      expect(audit.main).toBe(1);
      expect(audit.section).toBeGreaterThan(0);
      expect(audit.footer).toBe(1);
      expect(audit.overflow).toBeLessThanOrEqual(1);
      expect(audit.badImages).toEqual([]);
      for (const linkedRoute of routes) expect(audit.internalRoutes).toContain(linkedRoute);
    }
    expect(consoleErrors).toEqual([]);
  });
}

test('legacy route redirects and video keeps required playback attributes', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/what-we-do', { waitUntil: 'networkidle' });
  await expect(page).toHaveURL('http://127.0.0.1:5173/why-joker');
  const video = page.locator('.service-hero__media video');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).not.toHaveAttribute('controls', '');
  expect(await video.evaluate(element => (element as HTMLVideoElement).muted)).toBeTruthy();
});

test('page ownership remains intentional with no duplicated Why Joker sections', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await expect(page.locator('.safety-section')).toHaveCount(1);
  await expect(page.locator('.reviews-section')).toHaveCount(1);
  await expect(page.locator('.booking-cta')).toHaveCount(1);

  await page.goto('http://127.0.0.1:5173/why-joker', { waitUntil: 'networkidle' });
  await expect(page.locator('.service-hero__media video')).toHaveCount(1);
  await expect(page.locator('.services')).toHaveCount(1);
  await expect(page.locator('.consultation-section')).toHaveCount(0);
  await expect(page.locator('.premium-faq')).toHaveCount(1);
  await expect(page.locator('.safety-section')).toHaveCount(0);
  await expect(page.locator('.reviews-section')).toHaveCount(0);
  await expect(page.locator('.premium-faq__cta')).toHaveCount(0);
  await expect(page.locator('.booking-cta')).toHaveCount(1);

  await page.goto('http://127.0.0.1:5173/gallery', { waitUntil: 'networkidle' });
  await expect(page.locator('.masonry')).toHaveCount(1);
  await expect(page.locator('.gallery-cta')).toHaveCount(1);
  await expect(page.locator('.safety-section, .reviews-section, .booking-cta')).toHaveCount(0);

  await page.goto('http://127.0.0.1:5173/contact', { waitUntil: 'networkidle' });
  await expect(page.locator('.contact-map')).toHaveCount(1);
  await expect(page.locator('.contact-booking-card')).toHaveCount(1);
  await expect(page.locator('.safety-section, .reviews-section, .booking-cta')).toHaveCount(0);
});

test('booking flow opens one modal from the shared header action', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  const headerBooking = page.locator('.site-header .button');
  await expect(headerBooking).toHaveCount(1);
  await headerBooking.click();
  await expect(page.locator('.booking-modal [role="dialog"]')).toHaveCount(1);
});
