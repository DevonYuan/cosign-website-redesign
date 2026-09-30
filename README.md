# Cosign Website

Marketing website for **Cosign** — a GitHub App for compliant approval workflows, protected issue/PR snapshots, and tamper-evident audit trails for regulated engineering teams.

**Production deployment uses `cosign-website-vanilla/`** — a lightweight vanilla HTML/CSS/JS implementation (no build step, no framework). The React + Vite version in `cosign-website/` serves as a design reference and component library.

---

## Description

Cosign is a GitHub App that freezes the exact issue or pull request being approved, re-checks each signer's identity, and writes a tamper-evident record — so your sign-off means the same thing today and in an audit three years from now.

This website showcases:
- **Hero** — Terminal-style hero with app preview panel showing the approval workflow
- **Features** — Clean card grid with icons (Review & Approval, Operational Controls)
- **Compliance** — Framework badges (21 CFR Part 11, eIDAS, ESIGN/UETA)
- **Pricing** — Three tiers: Starter (free), Team (beta), Pilot (custom)
- **Support** — Contact modal with PHP backend for form submissions

---

## File Structure

```
Cosign Website Redesign/              # Repository root
├── README.md                         # This file
├── .github/                          # GitHub workflows/skills
├── .gitignore
├── cosign-website-vanilla/           # 🚀 PRODUCTION DEPLOYMENT (vanilla HTML/CSS/JS)
│   ├── index.html                    # Single-page marketing site
│   ├── styles.css                    # Complete stylesheet (design tokens + components)
│   ├── app.js                        # Theme switching, smooth scroll, contact modal
│   ├── server.js                     # Optional Node dev server (serves PHP via proxy)
│   ├── package.json                  # Dev dependencies only (linter, etc.)
│   ├── favicon.svg / logo.svg        # Brand assets
│   └── api/
│       └── contact.php               # Contact form handler (mail + validation)
├── cosign-website/                   # Design reference (React 19 + Vite)
│   ├── index.html                    # Entry HTML (loads IBM Plex Mono)
│   ├── package.json                  # Dependencies & scripts
│   ├── vite.config.js                # Vite config (React plugin)
│   ├── PRODUCT.md                    # Product specification
│   ├── public/                       # Static assets
│   ├── design-inspo/                 # Design reference (terminal redesign HTML)
│   ├── dist/                         # Production build output (gitignored)
│   └── src/
│       ├── main.jsx                  # App bootstrap
│       ├── App.jsx                   # Root component (routing, modal state)
│       ├── data/
│       │   ├── modules.js            # Feature module definitions
│       │   └── navigation.js         # Nav links, footer config
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.jsx        # Terminal titlebar (tabs, window dots)
│       │   │   └── Footer.jsx        # Terminal prompt footer
│       │   ├── sections/
│       │   │   ├── Hero.jsx          # Hero + terminal audit log panel
│       │   │   ├── Features.jsx      # Log-grid feature sections
│       │   │   ├── Pricing.jsx       # Three-tier pricing grid
│       │   │   └── Support.jsx       # Support cards with contact links
│       │   └── ui/
│       │       ├── Button.jsx        # Button variants (plate, ghost, stratum)
│       │       ├── Card.jsx          # DepthCard, TrustSignal, StratumCore/Group
│       │       └── Modal.jsx         # Contact dialog (centered)
│       └── styles/
│           ├── main.css              # Imports all stylesheets
│           ├── variables.css         # Design tokens (bright terminal palette)
│           ├── components/
│           │   ├── button.css        # Button variants
│           │   ├── card.css          # Cards, grids, trust signals
│           │   ├── modal.css         # Contact modal
│           │   └── terminal.css      # Shared terminal UI (.term, .dots, .cmd)
│           ├── layout/
│           │   ├── header.css        # Titlebar styles
│           │   └── footer.css        # Footer styles
│           └── sections/
│               ├── hero.css
│               ├── features.css
│               ├── pricing.css
│               └── support.css
├── www/                              # Legacy/alternate vanilla implementation
│   ├── index.html
│   ├── css/styles.css
│   ├── js/ (nav.js, theme.js, features.js, contact.js, modules-data.js)
│   └── api/contact.php
└── cosign-website-vanilla/           # (duplicate entry - see above)
```

---

## Development Setup — `cosign-website-vanilla/` (Production)

### Prerequisites
- PHP 8.1+ (for contact form backend)
- Python 3 or Node.js (for static file serving)
- Modern browser (ES2020+)

### Quick Start (Python)
```bash
cd cosign-website-vanilla
python3 -m http.server 8080
# Opens at http://localhost:8080
# Note: PHP contact form will return 501 (use PHP server for full functionality)
```

### Full Stack (PHP Built-in Server)
```bash
cd cosign-website-vanilla
php -S localhost:8080
# Opens at http://localhost:8080
# Contact form POSTs to /api/contact.php will work
```

### With Node Dev Server (Optional)
```bash
cd cosign-website-vanilla
npm install
npm run dev
# Opens at http://localhost:3000 (proxies /api to PHP)
```

### Lint / Format
```bash
cd cosign-website-vanilla
npm run lint      # Oxlint
npm run format    # Prettier
```

---

## Development Setup — `cosign-website/` (React Reference)

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

## Scripts — `cosign-website-vanilla/`

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Node dev server (proxies /api to PHP) |
| `npm run start` | Same as dev |
| `npm run lint` | Run Oxlint on JS/CSS/HTML |
| `npm run format` | Format with Prettier |

## Scripts — `cosign-website/` (React Reference)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

---

## Design Reference

See `design-inspo/Cosign — terminal redesign.html` for the original dark terminal design that inspired this bright variant.
