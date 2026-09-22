// Mobile nav toggle and active-section highlighting. Smooth in-page
// scrolling is handled entirely by CSS (`scroll-behavior: smooth`) — this
// file only manages the toggle and highlight state.
(function () {
  function init() {
    const toggle = document.querySelector('[data-testid="nav-toggle"]');
    const menu = document.querySelector('[data-testid="nav-menu"]');
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("nav-menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("nav-menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    const sectionLinks = Array.from(
      menu.querySelectorAll(".nav-link[href^='#']"),
    );
    const sections = sectionLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (sections.length === 0 || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((link) => {
            link.classList.toggle(
              "nav-link-active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
