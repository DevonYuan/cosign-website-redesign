# Surface Brief: Landing Page

## Scope
Primary target: `/` (home/landing page)
Visitor mode: **Persuade** — visitor decides and acts; design is the product

## Audience & Job
Engineering leads at regulated companies (medtech, fintech, healthtech) evaluating GitHub-native approval workflows for 21 CFR Part 11 / eIDAS / ESIGN/UETA compliance. Job: prove exactly what was approved, by whom, when — with evidence that survives regulatory scrutiny.

## Action / Task / Proof / Constraints
- **Primary action:** "View the GitHub App" (CTA to GitHub Marketplace)
- **Secondary action:** "See how it works" (scroll to Features)
- **Proof:** frozen-by-design mechanism, GitHub-native filing, tamper-evident PDF manifests, re-authentication at sign time
- **Constraints:** preserve all product copy from modules.js/navigation.js; keep Innershell • Cosign name + logo; dark mode–first; WCAG 2.1 AA; React + Vite stack

## Chosen Direction
**Evidence Chain / Audit Trail** (assigned: grounded #5, seed key `6e0a4cee`)

### Direction Contract

**THESIS:** The page is a vertical descent through an evidence chain — each section a depth stratum proving the mechanism. The category-default hero+cards arrangement is refused; instead, the first viewport *is* the mechanism: a live depth axis showing frozen snapshot → declared intent → fresh auth → PDF manifest → GitHub filing → change detection → sovereignty → regulatory alignment, each stratum earning the next.

**OWN-WORLD:** Abyssal ink blue (`#0a0e1a` → `#0d1426` → `#111a33` by stratum) ground deepening on scroll. Chalk-white (`#f0f4f8`) marine-snow particle field as ambient trust texture. One thermocline cyan (`#00d4ff`) band marks the active stratum. Monospace dive-computer digits (`JetBrains Mono`, cap-height measured) for metrics/timestamps; quiet grotesk (`Space Grotesk`) for body. All strata share one vertical axis — the depth ruler — ruling every line of copy. Component family: depth cards (plate-like, elevated), stratum headers (thermocline rules), particle emitters (trust signals), depth ruler (sticky vertical rail).

**STORY:** Visitor enters at the surface (hero: "Capture compliant approvals before the record changes"). The depth ruler appears — a thin cyan line tracking scroll. Each stratum proves one capability: frozen snapshot (hash displayed), declared intent (checklist visible), fresh auth (re-auth badge), PDF manifest (document icon with tamper seal), GitHub filing (repo path), change detection (stale flag), sovereignty (lock icon), regulatory (compliance badges). As they descend, the ground deepens, particles increase, the cyan thermocline band marks their position. At the turnaround (Pricing), the ruler inverts — ascent begins: pilot access, contact. Surfaced: footer with GitHub App link.

**FIRST VIEWPORT:** Full-viewport hero at 100vh. Top: Innershell • Cosign logo + depth ruler (sticky left rail, 2px cyan, 0→100% scroll). Center: headline in Space Grotesk Display, cap-height ~72px, set on abyssal ground. Sub-headline in JetBrains Mono at 16px, chalk-white, showing live hash prefix `sha256:a3f2...` updating on subtle interval (frozen snapshot proof). Primary CTA: "View the GitHub App" — plate button, elevated, thermocline cyan fill, chalk-white text. Secondary: "See how it works" — ghost button, chalk-white outline, depth ruler step-down animation on hover. Marine-snow particle field: 60 chalk-white specks drifting up at 0.3px/frame, `prefers-reduced-motion` = static. No illustration, no stock photo — the mechanism *is* the visual.

**FORM:** Evidence Chain / Audit Trail (assigned, grounded #5, seed `6e0a4cee`)

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved Decisions
- Exact abyssal blue scale (3–5 strata stops)
- Particle density / performance budget
- Whether depth ruler is sticky left or right
- Pricing section treatment in ascent phase
- Comp-led vs code-led (toggle in UI; no image gen available → code-led default)