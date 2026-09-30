import { test, expect } from "@playwright/test";

// Covers docs/tickets/20260920-cct-12-www-marketing-site.md Acceptance
// Criteria: page load / no backend calls, in-page nav scrolling, the
// external Launch/Login link, the mobile nav, title/copy, and basic
// responsiveness.

test.describe("page load", () => {
  test("renders Home, Features, Pricing, and Support with no console errors and no backend/API calls", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const backendRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (/concerto-app\.com/i.test(url) || /localhost:808\d/.test(url)) {
        backendRequests.push(url);
      }
    });

    await page.goto("/");

    await expect(page.locator("#home")).toBeVisible();
    await expect(page.locator("#features")).toBeAttached();
    await expect(page.locator("#pricing")).toBeAttached();
    await expect(page.locator("#support")).toBeAttached();

    expect(consoleErrors).toEqual([]);
    expect(backendRequests).toEqual([]);
  });

  test("title and visible copy reference the Innershell Cosign product", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Cosign|Innershell/i);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toMatch(/Cosign|Innershell/i);
    expect(bodyText).not.toMatch(/Concerto/i);
  });

  test("hero copy is forward-looking rather than describing the prior system, and no plaintext email is exposed", async ({
    page,
  }) => {
    await page.goto("/");

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toMatch(/decades-old/i);
    expect(bodyText).not.toMatch(/single-computer/i);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).not.toMatch(/decades-old/i);
    expect(description).not.toMatch(/single-computer/i);

    // The direct support mailto: was replaced by the contact/apply modal
    // (see contact-and-apply.spec.ts) — no plaintext email should remain.
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  });
});

test.describe("in-page navigation", () => {
  // Desktop viewport: the nav links this test clicks sit behind a collapsed
  // mobile toggle at narrow widths, which is covered separately below.
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Home/Features/Pricing/Support nav links scroll to their section without a full page reload", async ({
    page,
  }) => {
    await page.goto("/");

    for (const { testId, hash, sectionId } of [
      { testId: "nav-link-features", hash: "#features", sectionId: "features" },
      { testId: "nav-link-pricing", hash: "#pricing", sectionId: "pricing" },
      { testId: "nav-link-support", hash: "#support", sectionId: "support" },
      { testId: "nav-link-home", hash: "#home", sectionId: "home" },
    ]) {
      await page.locator(`[data-testid="${testId}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${hash}$`));

      // `scroll-behavior: smooth` animates asynchronously, so poll until it
      // settles rather than checking the bounding box immediately.
      await expect
        .poll(() =>
          page.locator(`#${sectionId}`).evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          }),
        )
        .toBe(true);
    }
  });

  test("GitHub App link points to the public app and is visually distinguished", async ({
    page,
  }) => {
    await page.goto("/");
    const launchLink = page.locator('[data-testid="nav-link-launch"]');

    await expect(launchLink).toHaveAttribute(
      "href",
      /^https:\/\/github\.com\/apps\/cosign-github\/?$/,
    );

    const sectionLinkClass = await page
      .locator('[data-testid="nav-link-features"]')
      .getAttribute("class");
    const launchLinkClass = await launchLink.getAttribute("class");
    expect(launchLinkClass).not.toBe(sectionLinkClass);
  });
});

test.describe("mobile nav", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("collapses to a toggleable menu with all four items reachable", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.locator('[data-testid="nav-toggle"]');
    const menu = page.locator('[data-testid="nav-menu"]');

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    for (const testId of [
      "nav-link-home",
      "nav-link-features",
      "nav-link-pricing",
      "nav-link-support",
      "nav-link-launch",
    ]) {
      await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
    }
  });
});

test.describe("responsive layout", () => {
  for (const { name, width, height } of [
    { name: "desktop", width: 1280, height: 800 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 },
  ]) {
    test(`no horizontal overflow at ${name} width`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");

      const hasOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(hasOverflow).toBe(false);
    });
  }
});
