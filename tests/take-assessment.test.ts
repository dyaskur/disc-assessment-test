import { expect, test } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

async function dragAndDrop(page: Page, source: Locator, target: Locator) {
  await source.waitFor({ state: 'visible' });
  await target.waitFor({ state: 'visible' });

// Get element positions
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (sourceBox && targetBox) {
    // Move to source element and press mouse down
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();

    // Wait for dnd-zone to register the press
    await page.waitForTimeout(100); // Important!

    // Now drag to target – but **move a bit outside**
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2 + 10, // +10 to simulate deeper drop
      { steps: 25 }
    );

    // Wait a bit before drop
    await page.waitForTimeout(100); // Important for drop effect

    // Release mouse
    await page.mouse.up();
    await page.waitForTimeout(100); // Important for drop effect
  }}
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
  await resetButton.click();
  expect(await nextButton.isDisabled()).toBe(true);
  for (let i = 0; i < 19; i++) {
    await page.waitForTimeout(100);
    await moveAnswers(page);
    await page.waitForTimeout(100);
    await page.screenshot({ path: 'tests/screenshots/question'+i+'.png', fullPage: true });
    await nextButton.click();
  }

  const timestamp = Date.now();
  const saveButton = page.locator('.btn-wide.btn-primary').first();
  expect(await saveButton.isVisible()).toBe(true);
  expect(await saveButton.textContent()).toBe('Download & Save');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/screenshots/finished'+timestamp+'.png', fullPage: true });
});
