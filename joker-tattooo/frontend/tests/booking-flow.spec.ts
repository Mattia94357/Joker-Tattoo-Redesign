import { expect, test } from '@playwright/test';

test.describe('global booking request', () => {
  test('opens from the home CTA, validates, and reaches success', async ({ page }) => {
    await page.goto('http://127.0.0.1:4173/');
    await page.getByRole('button', { name: 'Book a Tattoo' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Begin your piece.' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Request Appointment' }).click();
    await expect(dialog.getByText('Please enter your name.')).toBeVisible();

    await dialog.getByLabel('Name *').fill('Alex Morgan');
    await dialog.getByLabel('Email *').fill('alex@example.com');
    await dialog.getByLabel('WhatsApp *').fill('+66 81 234 5678');
    await dialog.getByLabel('Preferred Date *').fill('2027-01-20');
    await dialog.getByLabel('Preferred Time *').fill('14:30');
    await dialog.getByRole('button', { name: 'Request Appointment' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
    await page.getByRole('button', { name: 'Return to Website' }).click();
    await expect(dialog).toBeHidden();
  });

  test('uses a full-screen panel and sticky footer on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://127.0.0.1:4173/contact');
    await page.getByRole('button', { name: 'Book a Tattoo' }).click();
    const panel = page.getByRole('dialog', { name: 'Begin your piece.' });
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(386);
    expect(box?.height ?? 0).toBeGreaterThan(840);
    await expect(panel.getByRole('button', { name: 'Request Appointment' })).toBeInViewport();
  });
});
