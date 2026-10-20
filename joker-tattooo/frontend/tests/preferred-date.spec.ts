import { expect, test } from '@playwright/test';
import { selectBookingDate } from './helpers/bookingDate';

const origin = process.env.BOOKING_TEST_ORIGIN ?? 'http://127.0.0.1:4173';
test.use({ timezoneId: 'Australia/Perth' });

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-19T16:30:00Z'));
  await page.route('https://www.google.com/maps/**', route => route.abort());
});

test('required calendar blocks past days, selects today, and closes without dismissing the form', async ({ page }) => {
  await page.goto(`${origin}/contact`, { waitUntil: 'domcontentloaded' });
  await page.locator('.contact-booking-card button').click();
  const trigger = page.locator('.booking-date-trigger');
  const calendar = page.getByRole('dialog', { name: 'Choose preferred date' });
  await expect(page.locator('input[type="date"],.booking-date select')).toHaveCount(0);
  await page.locator('.booking-submit').click();
  await expect(page.locator('.booking-date .booking-field__error')).toHaveText('Please choose a preferred date.');
  await trigger.click();
  await expect(calendar).toBeVisible();
  await expect(calendar.getByRole('button', { name: 'Previous month' })).toBeDisabled();
  await expect(calendar.locator('[data-date="2026-10-19"]')).toBeDisabled();
  await expect(calendar.locator('[data-date="2026-10-20"]')).toBeEnabled();
  await calendar.locator('[data-date="2026-10-20"]').click();
  await expect(trigger).toContainText('20 October 2026');
  await expect(page.locator('input[name="preferredDate"]')).toHaveValue('2026-10-20');
  await trigger.click();
  await expect(calendar.locator('[aria-selected="true"] button')).toHaveCSS('background-color', 'rgb(114, 239, 115)');
  await expect(calendar.locator('[data-date="2026-10-20"]')).toHaveAttribute('aria-current', 'date');
  await page.keyboard.press('Escape');
  await expect(calendar).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Tell us your idea.' })).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('.booking-modal__panel').click({ position: { x: 2, y: 200 } });
  await expect(calendar).toHaveCount(0);
});

test('keyboard navigation handles leap years, short months, and year boundaries', async ({ page }) => {
  await page.goto(`${origin}/contact`, { waitUntil: 'domcontentloaded' });
  await page.locator('.contact-booking-card button').click();
  await selectBookingDate(page, '2028-02-29');
  await page.locator('.booking-date-trigger').click();
  const calendar = page.locator('.booking-calendar');
  await expect(calendar.locator('[data-date="2028-02-29"]')).toBeFocused();
  await page.keyboard.press('Shift+PageDown');
  await expect(calendar.locator('[data-date="2029-02-28"]')).toBeFocused();
  await expect(calendar.locator('[data-date="2029-02-29"]')).toHaveCount(0);
  await page.keyboard.press('PageDown');
  await calendar.locator('[data-date="2029-03-31"]').focus();
  await page.keyboard.press('PageDown');
  await expect(calendar.locator('[data-date="2029-04-30"]')).toBeFocused();
  await expect(calendar.locator('[data-date="2029-04-31"]')).toHaveCount(0);
  await page.keyboard.press('ArrowLeft');
  await expect(calendar.locator('[data-date="2029-04-29"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('input[name="preferredDate"]')).toHaveValue('2029-04-29');
  await selectBookingDate(page, '2029-12-31');
  await page.locator('.booking-date-trigger').click();
  await calendar.getByRole('button', { name: 'Next month' }).click();
  await expect(calendar.locator('[data-date="2030-01-31"]')).toBeFocused();
  await page.keyboard.press('Escape');
});

test('popup remains dark, reachable, and within the viewport while the form scrolls', async ({ page }, testInfo) => {
  await page.goto(`${origin}/contact`, { waitUntil: 'domcontentloaded' });
  await page.locator('.contact-booking-card button').click();
  await selectBookingDate(page, '2026-10-21');
  await page.locator('.booking-date-trigger').focus();
  await page.keyboard.press('Enter');
  const calendar = page.locator('.booking-calendar');
  await expect(calendar).toHaveCSS('background-color', 'rgb(14, 17, 15)');
  await expect(calendar).toHaveCSS('color', 'rgb(237, 236, 229)');
  const selected = calendar.locator('[aria-selected="true"] button');
  await expect(selected).toHaveCSS('background-color', 'rgb(114, 239, 115)');
  await expect(selected).toHaveCSS('outline-color', 'rgb(114, 239, 115)');
  await page.locator('.booking-request__body').evaluate(element => { element.scrollTop += 100; });
  const box = await calendar.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  const panel = await page.locator('.booking-modal__panel').boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(panel!.y);
  expect(box!.y + box!.height).toBeLessThanOrEqual(panel!.y + panel!.height);
  expect(await selected.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) === element;
  })).toBe(true);
  expect(await page.locator('.booking-modal__panel').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('calendar-open.png') });
  await selected.click();
  await expect(calendar).toHaveCount(0);
});

for (const italian of [false, true]) {
  test(`${italian ? 'Italian' : 'English'} calendar labels and YYYY-MM-DD submission`, async ({ page }, testInfo) => {
    await page.addInitScript(it => localStorage.setItem('joker-language', it ? 'it' : 'en'), italian);
    let submitted = '';
    await page.route('**/api/bookings', route => {
      submitted = route.request().postData() ?? '';
      return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, id: 'calendar-test' }) });
    });
    await page.goto(`${origin}/contact`, { waitUntil: 'domcontentloaded' });
    await page.locator('.contact-booking-card button').click();
    await expect(page.locator('.booking-date-trigger')).toHaveAccessibleName(italian ? 'Data preferita Seleziona una data' : 'Preferred Date Select a date');
    await page.locator('.booking-date-trigger').click();
    const calendar = page.getByRole('dialog', { name: italian ? 'Scegli la data preferita' : 'Choose preferred date' });
    await expect(calendar.getByRole('grid')).toHaveAccessibleName(italian ? 'ottobre 2026' : 'October 2026');
    await expect(calendar.getByRole('columnheader', { name: italian ? 'lunedì' : 'Monday', exact: true })).toBeVisible();
    await expect(calendar.getByRole('button', { name: italian ? 'Mese successivo' : 'Next month' })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(italian ? 'calendar-italian.png' : 'calendar-english.png') });
    await calendar.locator('[data-date="2026-10-21"]').click();
    await expect(page.locator('.booking-date-trigger')).toContainText(italian ? '21 ottobre 2026' : '21 October 2026');
    await page.locator('input[name="name"]').fill('Calendar test');
    await page.locator('input[name="email"]').fill('calendar@example.com');
    await page.locator('input[type="tel"]').fill('+12025550123');
    const time = page.locator('select[name="preferredTime"]');
    expect(await time.locator('option').allTextContents()).toEqual([italian ? 'Seleziona un orario' : 'Select a time', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']);
    await time.selectOption('14:30');
    await page.locator('.booking-submit').click();
    await expect(page.locator('.booking-success')).toBeVisible();
    expect(submitted).toContain('name="preferredDate"\r\n\r\n2026-10-21');
    expect(submitted).toContain('name="preferredTime"\r\n\r\n14:30');
  });
}
