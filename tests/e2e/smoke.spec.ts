import { test, expect } from '@playwright/test';

test('home loads and shows Buddy\'s Treehouse title', async ({ page }) => {
  await page.goto('/');
  // Give the app a moment to hydrate / animate
  await page.waitForTimeout(3000);

  await expect(page).toHaveTitle(/Buddy's Treehouse/i);

  // Basic sanity: root should exist and have content
  const root = page.locator('#root');
  await expect(root).toBeVisible();
  await expect(root).not.toBeEmpty();
});
