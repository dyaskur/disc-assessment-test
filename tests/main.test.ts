import { expect, test } from '@playwright/test';
import fs from 'fs';
import { dragAndDrop } from './helpers';

test('hello world test', async ({ page }) => {
  expect(1).toBe(1);
});
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


test('Lang page has expected begin button', async ({ page }) => {
  await page.goto('/en/');
  const element = page.locator('.container .btn.btn-wide').first()

  expect(await element.textContent()).toBe('BEGIN ASSESSMENT');
  await element.click();
  await page.waitForLoadState('networkidle');

// Extract and assert the current URL
  const url = new URL(page.url());
  expect(url.pathname).toBe('/en/test');
});

test('Assessment page has expected reset droppable', async ({ page }) => {
  await page.goto('/en/test');
  const resetButton = page.locator('.flex.justify-evenly.space-x-2.mt-1').locator('button').nth(0);
  const nextButton = page.locator('.flex.justify-evenly.space-x-2.mt-1').locator('button').nth(1);
  nextButton.waitFor({ state: 'visible' });
  const isDisabled = await nextButton.isDisabled();
  expect(isDisabled).toBe(true);
  // Locate draggable and droppable
  const availableAnswer = page.locator('.options .answer .rounded-box').nth(0);
  const target1 = page.locator('.answers .answer').nth(0);
  const target2 = page.locator('.answers .answer').nth(1);
  const target3 = page.locator('.answers .answer').nth(2);
  const target4 = page.locator('.answers .answer').nth(3);
  await dragAndDrop(page, availableAnswer, target1);
  await dragAndDrop(page, availableAnswer, target2);
  await dragAndDrop(page, availableAnswer, target3);
  await dragAndDrop(page, availableAnswer, target4);
  await page.waitForTimeout(300);
  expect(await nextButton.isDisabled()).toBe(false);
  expect(await target1.textContent()).toContain('Likes Control');
  await resetButton.click();
  // text should revert to original
  expect(await target1.textContent()).toContain('Very Much');
});
