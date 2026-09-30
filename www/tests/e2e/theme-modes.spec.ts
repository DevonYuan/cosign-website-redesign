import { test, expect, type Page } from "@playwright/test";

// Covers docs/tickets/COS-097-www-light-dark-mode.md Acceptance Criteria:
// light / dark / auto appearance modes — default resolution against
// `prefers-color-scheme`, explicit selection, persistence, no flash of the
// wrong theme, theme plumbing (color-scheme / theme-color / tokens), the
// colour-literal audit, accessibility, and regression coverage.

const STORAGE_KEY = "cosign-theme";
// Absolute URL for the specs that build their own browser contexts, which do
// not inherit the config's `use.baseURL`.
const BASE_URL = "http://localhost:4321";
const LIGHT_BG = "#ffffff";
const DARK_BG = "#190f22";

type Mode = "auto" | "light" | "dark";
type Rgb = [number, number, number];

function html(page: Page) {
  return page.locator("html");
}

function option(page: Page, mode: Mode) {
  return page.locator(`[data-testid="theme-option-${mode}"]`);
}

function themeColorMeta(page: Page) {
  return page.locator('meta[name="theme-color"]');
}

/** Seeds a stored preference before any page script runs. */
async function seedPreference(page: Page, value: string) {
  await page.addInitScript(
    (payload: { key: string; value: string }) =>
      window.localStorage.setItem(payload.key, payload.value),
    { key: STORAGE_KEY, value },
  );
}

/** Reads a resolved CSS custom property from `<html>`. */
async function token(page: Page, name: string) {
  return page.evaluate(
    (property) =>
      getComputedStyle(document.documentElement)
        .getPropertyValue(property)
        .trim(),
    name,
  );
}

function tokenToRgb(value: string): Rgb {
  const raw = value.trim().replace(/^#/, "");
  const hex =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => char + char)
          .join("")
      : raw;
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: Rgb) {
  const channel = (value: number) => {
    const scaled = value / 255;
    return scaled <= 0.03928
      ? scaled / 12.92
      : Math.pow((scaled + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb) {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const [high, low] = first > second ? [first, second] : [second, first];
  return (high + 0.05) / (low + 0.05);
}

test.describe("default and auto resolution", () => {
  test("with no stored preference the site defaults to auto", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(html(page)).toHaveAttribute("data-theme-mode", "auto");
    await expect(option(page, "auto")).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator('[data-testid^="theme-option-"][aria-pressed="true"]'),
    ).toHaveCount(1);
  });

  test("auto resolves to dark when the OS prefers dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await expect(html(page)).toHaveAttribute("data-theme-mode", "auto");
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
    expect((await token(page, "--color-bg")).toLowerCase()).toBe(DARK_BG);
  });

  test("auto resolves to light when the OS prefers light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    await expect(html(page)).toHaveAttribute("data-theme-mode", "auto");
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    expect((await token(page, "--color-bg")).toLowerCase()).toBe(LIGHT_BG);
  });

  test("auto re-resolves live when the OS preference changes", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(html(page)).toHaveAttribute("data-theme", "dark");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(html(page)).toHaveAttribute("data-theme", "light");

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
  });

  test("an unrecognised stored value falls back to auto", async ({ page }) => {
    await seedPreference(page, "purple");
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    await expect(html(page)).toHaveAttribute("data-theme-mode", "auto");
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await expect(option(page, "auto")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("explicit selection", () => {
  for (const mode of ["light", "dark"] as const) {
    test(`selecting ${mode} applies it immediately without navigating`, async ({
      page,
    }) => {
      await page.goto("/");
      const before = page.url();

      await option(page, mode).click();

      expect(page.url()).toBe(before);
      await expect(html(page)).toHaveAttribute("data-theme-mode", mode);
      await expect(html(page)).toHaveAttribute("data-theme", mode);
      await expect(option(page, mode)).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.locator('[data-testid^="theme-option-"][aria-pressed="true"]'),
      ).toHaveCount(1);
    });
  }

  test("an explicit light choice beats a dark OS preference", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await option(page, "light").click();

    await expect(html(page)).toHaveAttribute("data-theme-mode", "light");
    await expect(html(page)).toHaveAttribute("data-theme", "light");
  });

  test("an explicit dark choice beats a light OS preference", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    await option(page, "dark").click();

    await expect(html(page)).toHaveAttribute("data-theme-mode", "dark");
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
  });

  test("re-selecting auto re-resolves against the current OS preference", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await option(page, "light").click();
    await expect(html(page)).toHaveAttribute("data-theme", "light");

    await option(page, "auto").click();
    await expect(html(page)).toHaveAttribute("data-theme-mode", "auto");
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("persistence", () => {
  test("the chosen mode is stored under the documented key", async ({
    page,
  }) => {
    await page.goto("/");

    await option(page, "dark").click();
    expect(
      await page.evaluate(
        (key) => window.localStorage.getItem(key),
        STORAGE_KEY,
      ),
    ).toBe("dark");

    await option(page, "auto").click();
    expect(
      await page.evaluate(
        (key) => window.localStorage.getItem(key),
        STORAGE_KEY,
      ),
    ).toBe("auto");
  });

  test("a reload preserves the resolved theme and the selected mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    await option(page, "dark").click();
    await page.reload();

    await expect(html(page)).toHaveAttribute("data-theme-mode", "dark");
    await expect(html(page)).toHaveAttribute("data-theme", "dark");
    await expect(option(page, "dark")).toHaveAttribute("aria-pressed", "true");
  });

  test("a returning visitor sees the persisted mode on first load", async ({
    browser,
  }) => {
    const firstVisit = await browser.newContext();
    const firstPage = await firstVisit.newPage();
    await firstPage.goto(BASE_URL);
    await firstPage.locator('[data-testid="theme-option-light"]').click();
    await expect(firstPage.locator("html")).toHaveAttribute(
      "data-theme",
      "light",
    );
    const storageState = await firstVisit.storageState();
    await firstVisit.close();

    const secondVisit = await browser.newContext({ storageState });
    const secondPage = await secondVisit.newPage();
    // Emulate a dark OS preference so only the stored choice can produce light.
    await secondPage.emulateMedia({ colorScheme: "dark" });
    await secondPage.goto(BASE_URL);

    await expect(secondPage.locator("html")).toHaveAttribute(
      "data-theme-mode",
      "light",
    );
    await expect(secondPage.locator("html")).toHaveAttribute(
      "data-theme",
      "light",
    );
    await secondVisit.close();
  });
});

test.describe("no flash of the wrong theme", () => {
  test("the inline bootstrap precedes the stylesheet link", async ({
    page,
  }) => {
    await page.goto("/");

    const order = await page.evaluate(() => {
      const bootstrap = Array.from(
        document.head.querySelectorAll("script"),
      ).find(
        (script) =>
          !script.src && /cosign-theme/.test(script.textContent ?? ""),
      );
      const sheet = document.head.querySelector(
        'link[rel="stylesheet"][href$="styles.css"]',
      );
      if (!bootstrap || !sheet) return "missing";
      const position = bootstrap.compareDocumentPosition(sheet);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? "before" : "after";
    });

    expect(order).toBe("before");
  });

  test("a seeded preference is applied even when js/theme.js never loads", async ({
    page,
  }) => {
    await page.route("**/js/theme.js", (route) => route.abort());
    await seedPreference(page, "dark");
    await page.emulateMedia({ colorScheme: "light" });

    await page.goto("/");

    await expect(html(page)).toHaveAttribute("data-theme", "dark");
    expect((await token(page, "--color-bg")).toLowerCase()).toBe(DARK_BG);
  });
});

test.describe("theme plumbing", () => {
  for (const [mode, expectedBg] of [
    ["light", LIGHT_BG],
    ["dark", DARK_BG],
  ] as const) {
    test(`color-scheme and theme-color follow the ${mode} theme`, async ({
      page,
    }) => {
      await seedPreference(page, mode);
      await page.goto("/");

      expect(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).colorScheme,
        ),
      ).toBe(mode);

      await expect(themeColorMeta(page)).toHaveCount(1);
      expect(
        (await themeColorMeta(page).getAttribute("content"))?.toLowerCase(),
      ).toBe(expectedBg);
      expect((await token(page, "--color-bg")).toLowerCase()).toBe(expectedBg);
    });
  }

  test("the core colour tokens differ between the two themes", async ({
    page,
  }) => {
    const readTokens = () =>
      page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return [
          "--color-bg",
          "--color-surface",
          "--color-ink",
          "--color-ink-muted",
        ].map((property) => style.getPropertyValue(property).trim());
      });

    await seedPreference(page, "light");
    await page.goto("/");
    const light = await readTokens();

    await option(page, "dark").click();
    const dark = await readTokens();

    light.forEach((value, index) => {
      expect(value, `token ${index}`).not.toBe(dark[index]);
    });
  });

  test("body text tokens meet WCAG AA contrast in both themes", async ({
    page,
  }) => {
    for (const mode of ["light", "dark"] as const) {
      await seedPreference(page, mode);
      await page.goto("/");

      const pairs: Array<[string, string]> = [
        ["--color-ink", "--color-bg"],
        ["--color-ink", "--color-surface"],
        ["--color-ink-muted", "--color-bg"],
        ["--color-ink-muted", "--color-surface-alt"],
      ];

      for (const [foreground, background] of pairs) {
        const ratio = contrastRatio(
          tokenToRgb(await token(page, foreground)),
          tokenToRgb(await token(page, background)),
        );
        expect(
          ratio,
          `${mode}: ${foreground} on ${background}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  test("no colour literal is written outside the token blocks", async ({
    request,
    baseURL,
  }) => {
    const response = await request.get(`${baseURL}/css/styles.css`);
    expect(response.ok()).toBe(true);

    const css = await response.text();
    // Drop the two token blocks — everything that remains is a rule body.
    const outsideTokens = css.replace(/:root(\[[^\]]*\])?\s*\{[^}]*\}/g, "");
    const rule = /([^{}]+)\{([^}]*)\}/g;
    const offenders: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = rule.exec(outsideTokens)) !== null) {
      const selector = match[1].replace(/\s+/g, " ").trim();
      if (!/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(match[2])) continue;
      // Fixed brand colours: the "Core workflow" panel and the premium
      // trust-layer decorations look identical in both themes.
      if (
        /\.module-core|\.module-card-premium|\.billing-section-musician/.test(
          selector,
        )
      ) {
        continue;
      }
      offenders.push(selector);
    }

    expect(offenders).toEqual([]);
  });
});

test.describe("accessibility and layout", () => {
  test("the switch is a named group of named, pressable options", async ({
    page,
  }) => {
    await page.goto("/");

    const group = page.locator('[data-testid="theme-toggle"]');
    await expect(group).toHaveAttribute("role", "group");
    await expect(group).toHaveAttribute("aria-label", /theme/i);

    for (const mode of ["auto", "light", "dark"] as const) {
      await expect(option(page, mode)).toHaveAttribute(
        "aria-pressed",
        /^(true|false)$/,
      );
      const name = await option(page, mode).evaluate(
        (element) => element.textContent?.trim() ?? "",
      );
      expect(name.length, `${mode} accessible name`).toBeGreaterThan(0);
    }
  });

  test("options are reachable with Tab and operable with Enter", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const reached: string[] = [];
    for (let press = 0; press < 10 && reached.length < 3; press += 1) {
      await page.keyboard.press("Tab");
      const testId = await page.evaluate(
        () => document.activeElement?.getAttribute("data-testid") ?? "",
      );
      if (testId.startsWith("theme-option-")) reached.push(testId);
    }
    expect(reached).toEqual([
      "theme-option-auto",
      "theme-option-light",
      "theme-option-dark",
    ]);

    await option(page, "dark").focus();
    await expect(option(page, "dark")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(html(page)).toHaveAttribute("data-theme-mode", "dark");
  });

  test("the switch stays visible beside the collapsed nav at 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/");

    const group = page.locator('[data-testid="theme-toggle"]');
    const navToggle = page.locator('[data-testid="nav-toggle"]');

    await expect(group).toBeVisible();
    await expect(navToggle).toBeVisible();

    const groupBox = await group.boundingBox();
    const toggleBox = await navToggle.boundingBox();
    expect(groupBox).not.toBeNull();
    expect(toggleBox).not.toBeNull();

    // The switch must not overlap or displace the hamburger.
    expect(groupBox!.x + groupBox!.width).toBeLessThanOrEqual(toggleBox!.x + 1);
    expect(toggleBox!.x + toggleBox!.width).toBeLessThanOrEqual(360);

    // Nor may it push the brand onto a second line or overflow the viewport.
    const brandHeight = await page
      .locator(".nav-brand")
      .evaluate((element) => element.getBoundingClientRect().height);
    expect(brandHeight).toBeLessThanOrEqual(44);

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });
});

test.describe("reduced motion", () => {
  test("no colour transition is applied when motion is reduced", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    expect(
      await page.evaluate(
        () => getComputedStyle(document.body).transitionDuration,
      ),
    ).toBe("0s");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    expect(
      await page.evaluate(
        () => getComputedStyle(document.body).transitionDuration,
      ),
    ).toContain("0.2s");
  });
});

test.describe("regression", () => {
  test("the unused primary tokens are gone", async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/css/styles.css`);
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toContain("--color-primary");
  });

  test("the page still renders its core hero and every module card", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator('[data-testid="module-core"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="module-card"]')).toHaveCount(8);
  });
});
