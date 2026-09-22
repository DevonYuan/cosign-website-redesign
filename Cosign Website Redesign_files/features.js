// Renders the Cosign feature cards into the marketing page.
(function () {
  const GROUP_LABELS = {
    "membership-money": "Review & approval",
    "union-operations": "Operational controls",
    "growth-community": "Trust & compliance",
  };

  function renderCoreHero(core) {
    const hero = document.getElementById("core-membership");
    if (!hero || !core) return;

    hero.setAttribute("data-testid", "module-core");
    hero.className = "module-core";
    hero.innerHTML = `
      <span class="module-core-badge">Core workflow</span>
      <h3 class="module-core-name">${core.name}</h3>
      <p class="module-core-tagline">${core.tagline}</p>
    `;
  }

  function renderModuleCard(module, options) {
    const premium = Boolean(options && options.premium);
    const card = document.createElement("article");
    card.className = premium
      ? "module-card module-card-premium"
      : "module-card";
    card.setAttribute("data-testid", "module-card");
    card.setAttribute("data-group", module.group || "");

    card.innerHTML = premium
      ? `
      <span class="module-card-premium-badge">★ Trust layer</span>
      <h4 class="module-card-name">${module.name}</h4>
      <p class="module-card-tagline">${module.tagline}</p>
    `
      : `
      <h4 class="module-card-name">${module.name}</h4>
      <p class="module-card-tagline">${module.tagline}</p>
    `;
    return card;
  }

  function renderGroupedGrid(container, modules) {
    const groups = ["membership-money", "union-operations", "growth-community"];
    for (const groupId of groups) {
      const groupModules = modules.filter((m) => m.group === groupId);
      if (groupModules.length === 0) continue;

      const groupSection = document.createElement("div");
      groupSection.className = "module-group";
      groupSection.setAttribute("data-testid", "module-group");

      const heading = document.createElement("h4");
      heading.className = "module-group-heading";
      heading.textContent = GROUP_LABELS[groupId] || groupId;
      groupSection.appendChild(heading);

      const cards = document.createElement("div");
      cards.className = "module-cards";
      for (const module of groupModules) {
        cards.appendChild(renderModuleCard(module));
      }
      groupSection.appendChild(cards);

      container.appendChild(groupSection);
    }
  }

  function renderFlatGrid(container, modules, options) {
    const cards = document.createElement("div");
    cards.className = "module-cards";
    for (const module of modules) {
      cards.appendChild(renderModuleCard(module, options));
    }
    container.appendChild(cards);
  }

  function init() {
    if (typeof COSIGN_MODULES === "undefined") return;

    const core = COSIGN_MODULES.find((m) => m.isCore);
    const localModules = COSIGN_MODULES.filter(
      (m) => !m.isCore && m.billedTo === "local",
    );

    renderCoreHero(core);

    const localGrid = document.getElementById("local-modules-grid");
    if (localGrid) renderGroupedGrid(localGrid, localModules);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
