import { expect, test } from '@playwright/test';

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

test('unknown production route returns a real 404', async ({ page }) => {
  const response = await page.goto(`${productionOrigin}/missing-search-test-page`, { waitUntil: 'networkidle' });
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
});
