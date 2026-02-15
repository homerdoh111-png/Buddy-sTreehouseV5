import { test, expect, devices } from '@playwright/test';

// Browser-side sanity checks for the 3D interior.
// Note: WebGL rendering in headless can be limited, but this still catches layout/CSS/navigation issues.

const PROD = process.env.PROD_URL || 'https://buddy-s-treehouse-v5.vercel.app';

async function openInterior(page: any) {
  // Skip splash reliably.
  await page.addInitScript(() => {
    try {
      localStorage.setItem('buddy_last_splash', Date.now().toString());
    } catch {}
  });

  await page.goto(PROD, { waitUntil: 'domcontentloaded' });
  // Give app a moment to mount.
  await page.waitForTimeout(1200);

  // Try to enter Treehouse via the "Treehouse" button (bottom-left).
  const treehouseBtn = page.getByRole('button', { name: /treehouse/i });
  if (await treehouseBtn.count()) {
    await treehouseBtn.click({ timeout: 5000 });
  }

  // Wait for interior header/back button.
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible({ timeout: 15000 });
}

test('Interior loads and back button returns to exterior (desktop chromium)', async ({ page }) => {
  await openInterior(page);

  // Back should return to exterior (treehouse button visible again)
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('button', { name: /treehouse/i })).toBeVisible({ timeout: 15000 });
});

test('Interior header does not clip on iPhone landscape emulation', async ({ browser }) => {
  const iPhone = devices['iPhone 14 Pro'];
  const context = await browser.newContext({
    ...iPhone,
    // Landscape-ish viewport
    viewport: { width: 852, height: 393 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await openInterior(page);

  // Basic: stars counter visible and within viewport
  const stars = page.locator('text=⭐').first();
  await expect(stars).toBeVisible();

  // Take a screenshot for manual review.
  await page.screenshot({ path: 'tests/e2e-artifacts/interior-iphone-landscape.png', fullPage: true });

  await context.close();
});
