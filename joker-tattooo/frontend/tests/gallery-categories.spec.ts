import { expect, test } from '@playwright/test';

test.setTimeout(120_000);

const categories = [
  { label: 'All', slug: null, count: 25 },
  { label: 'Japanese', slug: 'japanese', count: 8 },
  { label: 'Realism', slug: 'realism', count: 7 },
  { label: 'Sak Yant', slug: 'sak-yant', count: 5 },
  { label: 'Black & Grey', slug: 'black-grey', count: 17 },
  { label: 'Colour', slug: 'colour', count: 8 },
] as const;

const galleryUrl = (slug: string | null) => `http://127.0.0.1:5173/gallery${slug ? `?category=${slug}` : ''}`;

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`direct category URLs and filtered lightbox work at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const category of categories) {
      await page.goto(galleryUrl(category.slug), { waitUntil: 'networkidle' });
      await expect(page.getByRole('button', { name: category.label, exact: true })).toHaveClass(/active/);
      await expect(page.locator('.gallery-tile:visible')).toHaveCount(category.count);

      await page.reload({ waitUntil: 'networkidle' });
      await expect(page.getByRole('button', { name: category.label, exact: true })).toHaveClass(/active/);
      await expect(page.locator('.gallery-tile:visible')).toHaveCount(category.count);

      const tiles = page.locator('.gallery-tile:visible');
      await tiles.first().click();
      await expect(page.locator('.lightbox')).toBeVisible();
      await expect(page.locator('.lightbox__caption span')).toContainText(`/${category.count}`);
      await page.locator('.lightbox__next').click();
      await expect(page.locator('.lightbox__caption span')).toContainText(`/${category.count}`);
      await page.locator('.lightbox__close').click();
    }
  });
}

test('filter clicks update history and rapid switching resolves to the latest category', async ({ page }) => {
  await page.goto(galleryUrl(null), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Japanese', exact: true }).click();
  await expect(page).toHaveURL(/category=japanese/);
  await page.getByRole('button', { name: 'Realism', exact: true }).click();
  await expect(page).toHaveURL(/category=realism/);

  await page.goBack();
  await expect(page.getByRole('button', { name: 'Japanese', exact: true })).toHaveClass(/active/);
  await page.goForward();
  await expect(page.getByRole('button', { name: 'Realism', exact: true })).toHaveClass(/active/);

  await page.getByRole('button', { name: 'Colour', exact: true }).click();
  await page.getByRole('button', { name: 'Black & Grey', exact: true }).click();
  await expect(page).toHaveURL(/category=black-grey/, { timeout: 15_000 });
  await expect(page.locator('.gallery-tile:visible')).toHaveCount(17);

  await page.getByRole('button', { name: 'Japanese', exact: true }).click();
  await page.getByRole('button', { name: 'Black & Grey', exact: true }).click();
  await expect(page).toHaveURL(/category=black-grey/, { timeout: 15_000 });
  await expect(page.locator('.gallery-tile:visible')).toHaveCount(17);
});

test('homepage style links target their matching filtered gallery views', async ({ page }) => {
  const links = [
    ['Realism', 'realism'],
    ['Black & Grey', 'black-grey'],
    ['Traditional', 'colour'],
    ['Japanese', 'japanese'],
    ['Fine Line', 'black-grey'],
    ['Custom Designs', 'black-grey'],
  ] as const;

  for (const [title, slug] of links) {
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    const card = page.locator('.image-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
    const link = card.getByRole('link');
    await expect(link).toHaveAttribute('href', `/gallery?category=${slug}#gallery`);
    await link.click();
    await expect(page).toHaveURL(`http://127.0.0.1:5173/gallery?category=${slug}#gallery`);
    const label = categories.find(category => category.slug === slug)!.label;
    await expect(page.getByRole('button', { name: label, exact: true })).toHaveClass(/active/);
    await expect.poll(() => page.locator('#gallery').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(80);
  }
});
