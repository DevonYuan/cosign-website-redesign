# Cosign marketing site (`www/`)

This directory hosts the public marketing page for the Innershell Cosign GitHub App. The site is intentionally static and simple: a single-page landing page with light/dark/auto appearance modes, an external link to the public GitHub App page, and a contact form for product, pricing, and pilot inquiries.

## Local development

No package install is required. Run the static file server from this directory:

```bash
cd www
node serve.js
```

Then open `http://localhost:4321`.

The contact form is backed by `api/contact.php`, which is not executed by `serve.js`. A PHP-enabled server is required for end-to-end mail testing:

```bash
cd www
php -S localhost:4321
```

## Appearance modes

The page supports three appearance modes — **Auto**, **Light**, and **Dark** — and remembers each visitor's choice.

- `auto` (the default) resolves against the visitor's operating-system setting via `prefers-color-scheme`, and keeps following that setting if it changes while the page is open.
- `light` and `dark` pin the palette regardless of the operating-system setting.

Implementation notes:

- The choice is stored in `localStorage` under the key `cosign-theme`, with the exact values `"auto"`, `"light"`, or `"dark"`. A missing, unreadable, or unrecognised value falls back to `"auto"`.
- The resolved theme is written to `data-theme` on `<html>` (only ever `light` or `dark` — never `auto`), and the selected mode to `data-theme-mode`.
- An inline bootstrap script in `index.html` — in `<head>`, before the stylesheet link — applies the stored theme before first paint, so there is no flash of the wrong theme. `js/theme.js` then wires the switch, keeps `aria-pressed` and `<meta name="theme-color">` in sync, and tracks the operating-system preference while in `auto` mode.
- Both palettes live in `css/styles.css`: the light palette in `:root` and the dark palette in a single `:root[data-theme="dark"]` block. No colours are written outside those two blocks, apart from the deliberately theme-independent "Core workflow" panel and the premium trust-layer decorations.
- The two `theme-color` metas in the markup are media-scoped, so a visitor without JavaScript still gets the correct browser chrome colour; once the scripts run, the two are collapsed into a single media-less meta read from the resolved palette.
- Colour transitions are applied only under `@media (prefers-reduced-motion: no-preference)`.

## Running the tests

From the repo root:

```bash
npm run test:www
```

The Playwright suite exercises the page structure, navigation, the appearance modes (`tests/e2e/theme-modes.spec.ts`, run on both Chromium and mobile Chrome), and the contact flow without needing the app backend. The tests ensure it is specific to the Cosign GitHub App rather than the legacy reference implementation.

## Content goals

The page explains:

- why the GitHub App exists
- what approvals problem it solves
- why the solution is compliant with regulatory expectations
- why the data stays under the customer's GitHub ownership and filing location
- how to ask about pricing or request a pilot

## Deployment

The site is deployed as a static bundle. Copy the contents of this directory to the marketing host that serves the public page and keep the GitHub App link pointing to `https://github.com/apps/cosign-github`. The deploy target also needs PHP enabled and a working MTA configured (see `tests/e2e/contact-php-integration.spec.ts`) — confirm both are in place on the actual deploy target.
