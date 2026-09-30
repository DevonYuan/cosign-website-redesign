import { test, expect } from "@playwright/test";

// Covers the Support section's replacement for the old mailto: link — a
// popup contact/apply form that POSTs JSON to www/api/contact.php — and
// the "apply" pathways for prospective new locals and prospective new
// members/employers (docs/tickets/20260920-cct-12-www-marketing-site.md,
// post-review revisions).

const TRIGGERS = [
  { testId: "open-pricing", reason: "pricing" },
  { testId: "open-beta", reason: "beta" },
  { testId: "open-contact-general", reason: "general" },
];

test.describe("opening the modal", () => {
  for (const { testId, reason } of TRIGGERS) {
    test(`"${testId}" opens the modal preset to reason "${reason}"`, async ({
      page,
    }) => {
      await page.goto("/");

      await page.locator(`[data-testid="${testId}"]`).click();

      const modal = page.locator('[data-testid="contact-modal"]');
      await expect(modal).toBeVisible();
      await expect(page.locator('[data-testid="contact-reason"]')).toHaveValue(
        reason,
      );
    });
  }

  test("close and cancel buttons dismiss the modal", async ({ page }) => {
    await page.goto("/");
    const modal = page.locator('[data-testid="contact-modal"]');

    await page.locator('[data-testid="open-contact-general"]').click();
    await expect(modal).toBeVisible();
    await page.locator('[data-testid="contact-close"]').click();
    await expect(modal).toBeHidden();

    await page.locator('[data-testid="open-contact-general"]').click();
    await expect(modal).toBeVisible();
    await page.locator('[data-testid="contact-cancel"]').click();
    await expect(modal).toBeHidden();
  });
});

test.describe("submitting the form", () => {
  test("blocks submission when required fields are empty", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="open-contact-general"]').click();

    let requestSent = false;
    await page.route("**/api/contact.php", (route) => {
      requestSent = true;
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    });

    await page.locator('[data-testid="contact-submit"]').click();
    // Native required-field validation should keep the modal open and the
    // network request unsent.
    await expect(page.locator('[data-testid="contact-modal"]')).toBeVisible();
    expect(requestSent).toBe(false);
  });

  test("sends the expected payload and shows a success message", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator('[data-testid="open-pricing"]').click();

    let capturedBody: Record<string, unknown> | null = null;
    await page.route("**/api/contact.php", (route) => {
      capturedBody = route.request().postDataJSON();
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.locator('[data-testid="contact-name"]').fill("Jamie Rivera");
    await page
      .locator('[data-testid="contact-email"]')
      .fill("jamie@example.com");
    await page
      .locator('[data-testid="contact-message"]')
      .fill("We'd like to understand pricing for the Cosign GitHub App.");

    await page.locator('[data-testid="contact-submit"]').click();

    await expect(page.locator('[data-testid="contact-status"]')).toContainText(
      /thanks|touch/i,
    );

    expect(capturedBody).toMatchObject({
      reason: "pricing",
      name: "Jamie Rivera",
      email: "jamie@example.com",
      message: "We'd like to understand pricing for the Cosign GitHub App.",
    });
  });

  test("shows an error message when the request fails", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-testid="open-contact-general"]').click();

    await page.route("**/api/contact.php", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: "{}",
      }),
    );

    await page.locator('[data-testid="contact-name"]').fill("Jamie Rivera");
    await page
      .locator('[data-testid="contact-email"]')
      .fill("jamie@example.com");
    await page.locator('[data-testid="contact-message"]').fill("Test message.");
    await page.locator('[data-testid="contact-submit"]').click();

    await expect(page.locator('[data-testid="contact-status"]')).toContainText(
      /wrong|try again/i,
    );
  });
});

test("serve.js itself reports that it cannot execute the PHP endpoint", async ({
  request,
}) => {
  // Exercises www/serve.js directly (no route mocking) — since serve.js is
  // a plain Node static file server with no PHP runtime, it should fail
  // loudly and helpfully rather than silently serving contact.php's source
  // as if it were a successful JSON response.
  const response = await request.post("/api/contact.php", {
    data: {
      reason: "general",
      name: "x",
      email: "x@example.com",
      message: "x",
    },
  });

  expect(response.status()).toBe(501);
  const body = await response.json();
  expect(body.error).toMatch(/php/i);
});
