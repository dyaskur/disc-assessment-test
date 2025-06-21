import type { Locator, Page } from '@playwright/test';

export async function dragAndDrop(page: Page, source: Locator, target: Locator) {
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
