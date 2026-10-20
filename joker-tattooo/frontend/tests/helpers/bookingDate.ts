import { expect, type Page } from '@playwright/test';

export async function selectBookingDate(page: Page, value: string) {
  await page.locator('.booking-date-trigger').click();
  const calendar = page.locator('.booking-calendar');
  await expect(calendar).toBeVisible();
  const day = calendar.locator(`[data-date="${value}"]`);
  for (let month = 0; month < 132 && !await day.count(); month++) {
    await calendar.locator('.booking-calendar__header button').last().click();
  }
  await day.click();
  await expect(calendar).toHaveCount(0);
  await expect(page.locator('input[name="preferredDate"]')).toHaveValue(value);
}
