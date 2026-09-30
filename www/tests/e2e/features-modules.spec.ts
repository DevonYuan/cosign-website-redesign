import { test, expect } from "@playwright/test";

// Covers docs/tickets/20260920-cct-12-www-marketing-site.md Acceptance
// Criteria for the Features section's module content: Core workflow as a
// distinct hero, followed by the local compliance-focused add-ons.

test("Features section renders the core Cosign workflow and eight supporting modules", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator('[data-testid="module-core"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="module-card"]')).toHaveCount(8);
});

test("modules are grouped into review and compliance sections for the product story", async ({
  page,
}) => {
  await page.goto("/");

  const localCards = page.locator(
    '[data-testid="local-modules-section"] [data-testid="module-card"]',
  );

  await expect(localCards).toHaveCount(8);
  await expect(page.locator('[data-testid="billing-tag"]')).toHaveCount(0);
});

test("each feature section carries an introductory statement about the product story", async ({
  page,
}) => {
  await page.goto("/");

  const localIntro = await page
    .locator('[data-testid="billing-intro-local"]')
    .innerText();

  expect(localIntro.trim().length).toBeGreaterThan(0);
  expect(localIntro).toMatch(/approval|review|compliance|workflow/i);
});

test("core workflow banner is framed as the central Cosign approval flow", async ({
  page,
}) => {
  await page.goto("/");

  const coreText = await page
    .locator('[data-testid="module-core"]')
    .innerText();
  expect(coreText).toMatch(/Frozen-by-design routing|core workflow/i);
  expect(coreText).toMatch(/approval|GitHub issue|pull request/i);
});
