import { expect, test } from '@playwright/test';

test('keyboard arithmetic and local history survive reload', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.type('0.1+0.2');
  await page.keyboard.press('Enter');
  await expect(page.locator('.result')).toHaveText('0.3');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.locator('.history-list li')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.history-list li')).toHaveCount(1);
  await expect(page.locator('.history-list li')).toContainText(['0.1+0.2 = 0.3']);
});

test('keypad arithmetic and controlled errors', async ({ page }) => {
  await page.goto('/');
  for (const key of ['2', '+', '3', '×', '4', 'Equals']) await page.getByRole('button', { name: key, exact: true }).click();
  await expect(page.locator('.result')).toHaveText('14');
  await page.getByRole('button', { name: 'Clear all' }).click();
  for (const key of ['1', '0', '÷', '0', 'Equals']) await page.getByRole('button', { name: key, exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Cannot divide by zero');
});

test('GST and discount validate and calculate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'GST' }).click();
  await page.getByRole('button', { name: 'Calculate GST' }).click();
  await expect(page.locator('.breakdown .total dd')).toHaveText('₹1180.00');
  await page.getByLabel('Calculation').selectOption('inclusive');
  await page.getByLabel('Amount', { exact: true }).fill('1180');
  await page.getByRole('button', { name: 'Calculate GST' }).click();
  await expect(page.locator('.breakdown dd').first()).toHaveText('₹1000.00');
  await page.getByRole('link', { name: 'Discount' }).click();
  await page.getByRole('button', { name: 'Calculate discount' }).click();
  await expect(page.locator('.breakdown .total dd')).toHaveText('₹1600.00');
  await page.getByLabel('Discount percentage').fill('101');
  await page.getByRole('button', { name: 'Calculate discount' }).click();
  await expect(page.getByRole('alert')).toContainText('100% or less');
});

test('Tamil, dark theme, and decimal display persist', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.getByLabel('Language').selectOption('ta');
  await page.getByLabel('தோற்றம்').selectOption('dark');
  await page.getByLabel('தசமக் காட்சி').selectOption('2');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ta');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('heading', { name: 'அமைப்புகள்' })).toBeVisible();
  await page.getByRole('link', { name: 'அடிப்படை' }).click();
  await page.keyboard.type('1/8');
  await page.keyboard.press('Enter');
  await expect(page.locator('.result')).toHaveText('0.13');
});

test('small screen has no horizontal overflow and usable controls', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.viewport);
  const box = await page.getByRole('button', { name: '7', exact: true }).boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await page.getByRole('link', { name: 'GST' }).click();
  await expect(page.getByRole('heading', { name: 'GST calculator' })).toBeVisible();
});

test('production service worker supports offline routes', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Offline PWA smoke test runs in Chromium');
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  try {
    await page.reload();
    await page.keyboard.type('0.1+0.2');
    await page.keyboard.press('Enter');
    await expect(page.locator('.result')).toHaveText('0.3');
    await page.goto('/gst');
    await page.getByRole('button', { name: 'Calculate GST' }).click();
    await expect(page.locator('.breakdown .total dd')).toHaveText('₹1180.00');
  } finally { await context.setOffline(false); }
});
