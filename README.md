# Cosign Website

Marketing website for **Cosign** — a GitHub App for compliant approval workflows, protected issue/PR snapshots, and tamper-evident audit trails for regulated engineering teams.

Built with React 19 + Vite, styled with a bright terminal aesthetic (IBM Plex Mono).

---

## Description

Cosign is a GitHub App that freezes the exact issue or pull request being approved, re-checks each signer's identity, and writes a tamper-evident record — so your sign-off means the same thing today and in an audit three years from now.

This website showcases:
- **Hero** — Terminal-style hero with live audit log panel
- **Features** — Log-grid layout showing 6 approval checks (snapshot capture, intent review, re-auth, PDF manifests, GitHub filing, drift alerts)
- **Compliance** — Framework badges (21 CFR Part 11, eIDAS, ESIGN/UETA)
- **Pricing** — Three tiers: Starter (free), Team (beta), Pilot (custom)
- **Support** — Contact modal for inquiries

---

## File Structure

```
Cosign Website Redesign/          # Repository root
├── README.md                     # This file
├── .github/                      # GitHub workflows/skills
├── .gitignore
├── cosign-website/               # Vite + React application
│   ├── index.html                # Entry HTML (loads IBM Plex Mono)
│   ├── package.json              # Dependencies & scripts
│   ├── vite.config.js            # Vite config (React plugin)
│   ├── PRODUCT.md                # Product specification
│   ├── public/                   # Static assets
│   ├── design-inspo/             # Design reference (terminal redesign HTML)
│   ├── dist/                     # Production build output (gitignored)
│   └── src/
│       ├── main.jsx              # App bootstrap
│       ├── App.jsx               # Root component (routing, modal state)
│       ├── data/
│       │   ├── modules.js        # Feature module definitions
│       │   └── navigation.js     # Nav links, footer config
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.jsx    # Terminal titlebar (tabs, window dots)
│       │   │   └── Footer.jsx    # Terminal prompt footer
│       │   ├── sections/
│       │   │   ├── Hero.jsx      # Hero + terminal audit log panel
│       │   │   ├── Features.jsx  # Log-grid feature sections
│       │   │   ├── Pricing.jsx   # Three-tier pricing grid
│       │   │   └── Support.jsx   # Support cards with contact links
│       │   └── ui/
│       │       ├── Button.jsx    # Button variants (plate, ghost, stratum)
│       │       ├── Card.jsx      # DepthCard, TrustSignal, StratumCore/Group
│       │       └── Modal.jsx     # Contact dialog (centered)
│       └── styles/
│           ├── main.css          # Imports all stylesheets
│           ├── variables.css     # Design tokens (bright terminal palette)
│           ├── components/
│           │   ├── button.css    # Button variants
│           │   ├── card.css      # Cards, grids, trust signals
│           │   ├── modal.css     # Contact modal
│           │   └── terminal.css  # Shared terminal UI (.term, .dots, .cmd)
│           ├── layout/
│           │   ├── header.css    # Titlebar styles
│           │   └── footer.css    # Footer styles
│           └── sections/
│               ├── hero.css
│               ├── features.css
│               ├── pricing.css
│               └── support.css
```

---

## Development Setup

### Prerequisites
- Node.js 18+ (tested with 20+)
- npm 9+

### Install Dependencies
```bash
cd cosign-website
npm install
```

### Start Development Server
```bash
npm run dev
# Opens at http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output in ./dist
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## Key Design Decisions

- **Bright Terminal Theme**: Warm paper background (`#f5f0e8`), dark ink text, amber accents — inverted from typical dark terminal
- **IBM Plex Mono**: Single typeface for all text (display, body, mono)
- **CSS Variables**: All colors, spacing, typography in `src/styles/variables.css`
- **Native Dialog**: Contact modal uses `<dialog>` with `showModal()` for accessibility
- **No CSS Framework**: Custom CSS with design tokens, organized by component/section
- **Responsive Grids**: CSS Grid with 3/2/1 column breakpoints at 980px/760px

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

---

## Design Reference

See `design-inspo/Cosign — terminal redesign.html` for the original dark terminal design that inspired this bright variant.
