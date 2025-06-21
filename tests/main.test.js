import { expect, test } from '@playwright/test';
import fs from 'fs';

test('Home page has expected h1', async ({ page }) => {
  await page.goto('/');
  expect(await page.textContent('h1')).toBe('DISC Assessment');

  // Check language buttons
  const languageButtons = page.locator('.btn.basis-1\\/4');
  const data = JSON.parse(fs.readFileSync('static/languages/list.json', 'utf-8'));
  const count = Object.keys(data).length;
  // it should have the same number of buttons
  expect(await languageButtons.count()).toBe(count);
});


test('Lang page has expected begin button', async ({ page }, testInfo) => {
  await page.goto('/en/');
  const element = page.locator('.container .btn.btn-wide').first()

  expect(await element.textContent()).toBe('BEGIN ASSESSMENT');
  await element.click();
  await page.waitForLoadState('networkidle');

// Extract and assert the current URL
  const url = new URL(page.url());
  expect(url.pathname).toBe('/en/test');
});
