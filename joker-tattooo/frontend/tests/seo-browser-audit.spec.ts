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
    expect(result.canonical).toBe(`https://example.com${route}`);
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
