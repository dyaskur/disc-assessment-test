import { expect, test } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import fs from 'fs';
import { dragAndDrop } from './helpers';

async function moveAnswers(page: Page) {
  const availableAnswer = page.locator('.options .answer .rounded-box').nth(0);
  const arr = [0, 1, 2, 3];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  for (let i = 0; i < 4; i++) {
    await dragAndDrop(page, availableAnswer, page.locator('.answers .answer').nth(arr[i]));
  }
}
test.setTimeout(120000);
test('Test page has expected drag and drop', async ({ page }) => {
  await page.goto('/en/test');
  const nextButton = page.locator('.flex.justify-evenly.space-x-2.mt-1').locator('button').nth(1);
  await nextButton.waitFor({ state: 'visible' });
  const isDisabled = await nextButton.isDisabled();
  expect(isDisabled).toBe(true);
  // Locate draggable and droppable
  for (let i = 0; i < 19; i++) {
    await page.waitForTimeout(100);
    await moveAnswers(page);
    await page.waitForTimeout(100);
    await page.screenshot({ path: 'tests/screenshots/question' + i + '.png', fullPage: true });
    await nextButton.click();
  }

  const timestamp = Date.now();
  const saveButton = page.locator('.btn-wide.btn-primary').first();
  expect(await saveButton.isVisible()).toBe(true);
  expect(await saveButton.textContent()).toBe('Download & Save');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'tests/screenshots/finished' + timestamp + '.png',
    fullPage: true
  });
  page.on('download', (download) => download.path().then(console.log));
  const [download] = await Promise.all([page.waitForEvent('download'), saveButton.click()]);

  // Save to a specific path
  const suggestedFilename = download.suggestedFilename();
  const savePath = `tests/downloads/${suggestedFilename}`;

  await download.saveAs(savePath);

  // Verify file exist
  expect(fs.existsSync(savePath)).toBe(true);
});
