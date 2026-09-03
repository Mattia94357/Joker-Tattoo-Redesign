import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const productionOrigin = 'http://127.0.0.1:4173';
const routes = ['/', '/gallery', '/why-joker', '/contact'];

for (const route of routes) {
  test(`production route and assets load: ${route}`, async ({ page }) => {
    const failedResponses: string[] = [];
    const failedRequests: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
    });
    page.on('requestfailed', (request) => failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? ''}`));

    const response = await page.goto(`${productionOrigin}${route}`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('#root')).toBeVisible();
    expect(failedResponses).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}

test('deployment includes an index-safe custom 404 without an SPA catch-all', async () => {
  const [notFound, vercelConfig] = await Promise.all([
    readFile('dist/404.html', 'utf8'),
    readFile('vercel.json', 'utf8'),
  ]);
  expect(notFound).toContain('name="robots" content="noindex, follow"');
  expect(JSON.parse(vercelConfig)).not.toHaveProperty('rewrites');
});
