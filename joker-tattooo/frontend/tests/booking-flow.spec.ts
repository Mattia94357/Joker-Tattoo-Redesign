import { expect, test } from '@playwright/test';

test.describe('global booking request', () => {
  test('opens from the home CTA, validates, and reaches success', async ({ page }) => {
    let submittedBody = '';
    await page.route('**/api/bookings', route => {
      submittedBody = route.request().postData() ?? '';
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, id: 'test-message-id' }) });
    });
    await page.goto('http://127.0.0.1:4173/');
    await page.getByRole('button', { name: 'Book Your Tattoo' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Tell us your idea.' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Send Booking Request' }).click();
    await expect(dialog.getByText('Please enter your name.')).toBeVisible();

    await dialog.getByLabel('Name *').fill('Alex Morgan');
    await dialog.getByLabel('Email *').fill('alex@example.com');
    await expect(dialog.getByRole('button', { name: 'Select country' })).toContainText('United States');
    await expect(dialog.getByRole('button', { name: 'Select country' })).toContainText('+1');
    await dialog.getByRole('button', { name: 'Select country' }).click();
    await dialog.getByPlaceholder('Search by country or code').fill('Thailand');
    await dialog.getByRole('option', { name: 'Thailand +66' }).click();
    await dialog.getByLabel('WhatsApp *').fill('0812345678');
    await dialog.getByLabel('Preferred Date *').fill('2027-01-20');
    await dialog.getByLabel('Preferred Time *').fill('14:30');
    await dialog.getByRole('button', { name: 'Send Booking Request' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
    expect(submittedBody).toContain('+66812345678');
    await page.getByRole('button', { name: 'Return to Website' }).click();
    await expect(dialog).toBeHidden();
  });

  test('rejects an invalid country-specific WhatsApp number', async ({ page }) => {
    await page.goto('http://127.0.0.1:4173/');
    await page.getByRole('button', { name: 'Book Your Tattoo' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Tell us your idea.' });
    await dialog.getByLabel('Name *').fill('Alex Morgan');
    await dialog.getByLabel('Email *').fill('alex@example.com');
    await dialog.getByLabel('WhatsApp *').fill('abc12-3');
    await expect(dialog.getByLabel('WhatsApp *')).toHaveValue('123');
    await dialog.getByLabel('Preferred Date *').fill('2027-01-20');
    await dialog.getByLabel('Preferred Time *').fill('14:30');
    await dialog.getByRole('button', { name: 'Send Booking Request' }).click();
    await expect(dialog.getByText('Please enter a valid WhatsApp number for the selected country.')).toBeVisible();
  });

  test('uses a full-screen panel and sticky footer on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://127.0.0.1:4173/contact');
    await page.getByRole('button', { name: 'Request Your Booking' }).click();
    const panel = page.getByRole('dialog', { name: 'Tell us your idea.' });
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(386);
    expect(box?.height ?? 0).toBeGreaterThan(840);
    await panel.getByRole('button', { name: 'Select country' }).click();
    const countryPicker = panel.locator('.booking-phone__picker');
    await expect(countryPicker).toBeVisible();
    const pickerBox = await countryPicker.boundingBox();
    expect(pickerBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((pickerBox?.x ?? 0) + (pickerBox?.width ?? 1000)).toBeLessThanOrEqual(390);
    expect(pickerBox?.y ?? -1).toBeGreaterThanOrEqual(0);
    expect((pickerBox?.y ?? 0) + (pickerBox?.height ?? 1000)).toBeLessThanOrEqual(844);
    await expect(panel.getByRole('button', { name: 'Send Booking Request' })).toBeInViewport();
  });
});
