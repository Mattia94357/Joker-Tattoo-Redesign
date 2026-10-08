import { expect, test, type Page } from '@playwright/test';

const origin = process.env.BOOKING_TEST_ORIGIN ?? 'http://127.0.0.1:4173';
const failureMessage = "We couldn't send your request. Please try again or contact us on WhatsApp.";
test.beforeEach(async ({ page }) => {
  await page.route('https://www.google.com/maps/**', route => route.abort());
});

async function fillBooking(page: Page) {
  await page.goto(`${origin}/contact`);
  await page.getByRole('button', { name: 'Request Your Booking' }).click();
  const dialog = page.getByRole('dialog', { name: 'Tell us your idea.' });
  await expect(dialog.getByRole('button', { name: 'Close booking form' })).toBeFocused();
  await dialog.getByLabel('Name *').fill('Booking Test');
  await dialog.getByLabel('Email *').fill('booking-test@example.com');
  await dialog.getByLabel('WhatsApp *').fill('2025550123');
  await dialog.getByLabel('Preferred Date *').fill('2027-01-20');
  const time = dialog.getByLabel('Preferred Time *');
  await expect(time).toHaveValue('');
  expect(await time.locator('option').allTextContents()).toEqual(['Select a time', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']);
  await time.selectOption('14:30');
  return dialog;
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test.describe(`${viewport.width}px booking`, () => {
    test.use({ viewport });
    test('HTTP errors clear loading and preserve form values', async ({ page }, testInfo) => {
      await page.route('**/api/bookings', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'SMTP secret technical error' }) }));
      const dialog = await fillBooking(page);
      await dialog.getByRole('button', { name: 'Send Booking Request' }).click();
      await expect(dialog.getByRole('alert')).toHaveText(failureMessage);
      await expect(dialog.getByRole('button', { name: 'Send Booking Request' })).toBeEnabled();
      await expect(dialog.getByLabel('Name *')).toHaveValue('Booking Test');
      await expect(dialog.getByText('SMTP secret technical error')).toHaveCount(0);
      await page.screenshot({ path: testInfo.outputPath('booking-error.png') });
    });
    test('active requests are guarded against duplicate form submissions', async ({ page }) => {
      let requests = 0;
      let release!: () => void;
      const pending = new Promise<void>(resolve => { release = resolve; });
      await page.route('**/api/bookings', async route => {
        requests++;
        await pending;
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, id: 'smtp-test-id' }) });
      });
      const dialog = await fillBooking(page);
      const form = dialog.locator('form');
      await form.evaluate(element => {
        element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
      await expect.poll(() => requests).toBe(1);
      await expect(dialog.getByRole('button', { name: 'Sending request…' })).toBeDisabled();
      release();
      await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
      expect(requests).toBe(1);
    });
  });
}

test('15-second timeout aborts an unresponsive request and restores submission', async ({ page }) => {
  test.setTimeout(45000);
  await page.route('**/api/bookings', () => undefined);
  const dialog = await fillBooking(page);
  const start = Date.now();
  await dialog.getByRole('button', { name: 'Send Booking Request' }).click();
  await expect(dialog.getByRole('alert')).toHaveText(failureMessage, { timeout: 20000 });
  expect(Date.now() - start).toBeGreaterThanOrEqual(14500);
  await expect(dialog.getByRole('button', { name: 'Send Booking Request' })).toBeEnabled();
});

test('malformed success response does not display a false confirmation', async ({ page }) => {
  await page.route('**/api/bookings', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Missing API</html>' }));
  const dialog = await fillBooking(page);
  await dialog.getByRole('button', { name: 'Send Booking Request' }).click();
  await expect(dialog.getByRole('alert')).toHaveText(failureMessage);
  await expect(dialog.getByRole('heading', { name: 'Thank you!' })).toHaveCount(0);
});

test('Italian time placeholder and delivery failure use customer translations', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('joker-language', 'it'));
  await page.route('**/api/bookings', route => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto(origin);
  await page.getByRole('button', { name: 'Prenota il tuo tatuaggio' }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByLabel('Orario preferito *').locator('option').first()).toHaveText('Seleziona un orario');
  await dialog.getByLabel('Nome *').fill('Booking Test');
  await dialog.getByLabel('Email *').fill('booking-test@example.com');
  await dialog.getByLabel('WhatsApp *').fill('2025550123');
  await dialog.getByLabel('Data preferita *').fill('2027-01-20');
  await dialog.getByLabel('Orario preferito *').selectOption('14:30');
  await dialog.getByRole('button', { name: 'Invia la richiesta', exact: true }).click();
  await expect(dialog.getByRole('alert')).toHaveText('Non è stato possibile inviare la richiesta. Riprova tra qualche istante o contattaci su WhatsApp.');
});
