// Appearance modes for the marketing site: `auto`, `light` and `dark`.
//
// The inline bootstrap in index.html <head> applies the persisted (or
// system-resolved) theme before first paint so the first frame is already
// correct. This file owns everything that needs the DOM: wiring the switch,
// keeping `aria-pressed` in sync, refreshing the `theme-color` meta from the
// resolved palette, and tracking the OS preference while in `auto` mode.
(function () {
  // Storage contract shared with the inline bootstrap in index.html.
  const STORAGE_KEY = "cosign-theme";
  const MODES = ["auto", "light", "dark"];
  const DEFAULT_MODE = "auto";
  const MEDIA_QUERY = "(prefers-color-scheme: dark)";
  // Used when `--color-bg` cannot be resolved from the stylesheet.
  const FALLBACK_THEME_COLOR = { light: "#ffffff", dark: "#190f22" };

  const darkQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia(MEDIA_QUERY)
      : null;

  // Missing, unreadable or unrecognised values all mean `auto`.
  function readMode() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      stored = null;
    }
    return MODES.indexOf(stored) === -1 ? DEFAULT_MODE : stored;
  }

  // `auto` is never a snapshot: it follows the OS preference at call time.
  function resolve(mode) {
    if (mode === "light" || mode === "dark") return mode;
    return darkQuery && darkQuery.matches ? "dark" : "light";
  }

  function resolvedBackground(theme) {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-bg")
      .trim();
    return value || FALLBACK_THEME_COLOR[theme];
  }

  function syncThemeColorMeta(theme) {
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    for (let index = 1; index < metas.length; index += 1) {
      metas[index].remove();
    }
    if (metas.length > 0) {
      metas[0].removeAttribute("media");
      metas[0].setAttribute("content", resolvedBackground(theme));
    }
  }

  function syncOptions(mode) {
    document.querySelectorAll(".theme-option").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
    });
  }

  function apply(mode) {
    const theme = resolve(mode);
    const root = document.documentElement;

    root.dataset.theme = theme;
    root.dataset.themeMode = mode;
    root.style.colorScheme = theme;

    syncOptions(mode);
    syncThemeColorMeta(theme);
  }

  // Subscribed only while the visitor has not pinned a theme.
  let mediaListener = null;

  function syncMediaSubscription(mode) {
    if (!darkQuery) return;
    const wanted = mode === DEFAULT_MODE;
    if (wanted && !mediaListener) {
      mediaListener = () => apply(readMode());
      darkQuery.addEventListener("change", mediaListener);
    } else if (!wanted && mediaListener) {
      darkQuery.removeEventListener("change", mediaListener);
      mediaListener = null;
    }
  }

  function setMode(mode) {
    const next = MODES.indexOf(mode) === -1 ? DEFAULT_MODE : mode;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* Storage may be unavailable; the mode still applies for this page. */
    }
    syncMediaSubscription(next);
    apply(next);
  }

  function init() {
    const options = document.querySelectorAll(".theme-option");
    if (options.length > 0) {
      options.forEach((button) => {
        button.addEventListener("click", () => setMode(button.dataset.mode));
      });
    }

    const mode = readMode();
    syncMediaSubscription(mode);
    apply(mode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
