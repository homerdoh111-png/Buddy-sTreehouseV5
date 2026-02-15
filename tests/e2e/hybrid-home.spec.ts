import { test, expect } from '@playwright/test';

test('hybrid home shows bottom dock and can open explore bubbles', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3500);

  // Wait for splash to finish and dock to appear
  await expect(page.getByTestId('home-dock')).toBeVisible({ timeout: 60_000 });

  await expect(page.getByTestId('dock-play')).toBeVisible();
  await expect(page.getByTestId('dock-learn')).toBeVisible();
  await expect(page.getByTestId('dock-explore')).toBeVisible();

  await page.getByTestId('dock-explore').click({ force: true });

  // One of the activity names should show up when bubbles are visible.
  // (We can't guarantee which one is on-screen, but at least root has more buttons than the dock.)
  await page.waitForTimeout(500);
  const buttons = page.getByRole('button');
  const count = await buttons.count();
  expect(count).toBeGreaterThan(5);

  await page.screenshot({ path: 'test-results/hybrid-home.png', fullPage: true });
});
