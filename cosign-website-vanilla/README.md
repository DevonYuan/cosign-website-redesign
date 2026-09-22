# Cosign Website — Vanilla JS/HTML/CSS

A framework-free implementation of the Cosign marketing site using vanilla JavaScript, HTML, and CSS.

## Quick Start

```bash
# Install dependencies (for dev server with contact form API)
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`.

## Project Structure

```
cosign-website-vanilla/
├── index.html       # Main HTML document
├── styles.css       # All styles (dark/light themes, responsive)
├── app.js           # Client-side JavaScript
├── server.js        # Express dev server + contact API
├── favicon.svg      # Site favicon
├── logo.svg         # Cosign logo
├── package.json     # Dev dependencies
└── node_modules/    # Installed dependencies
```

## Features

- **Dark/Light theme switching** — Persisted to localStorage
- **Animated hero hash** — Rotating content hash every 3 seconds
- **Smooth scroll navigation** — Active section highlighting
- **Contact modal** — With honeypot spam protection
- **Responsive design** — Mobile-first, works at all breakpoints
- **Terminal aesthetic** — Scanline texture, amber accent, IBM Plex Mono
- **Accessible** — Semantic HTML, focus management, ARIA labels, WCAG 2.1 AA

## Contact Form

The contact form submits to `/api/contact` (POST). In development, this is handled by the Express server in `server.js`. In production, deploy the API endpoint to your preferred platform (Netlify Functions, Vercel Serverless Functions, Cloudflare Workers, etc.).

### Expected payload:

```json
{
  "reason": "general|pricing|beta",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here",
  "website": "",           // Honeypot — must be empty
  "opened_at": 1234567890  // Timestamp when modal opened
}
```

### Response:

```json
{ "ok": true }
```

Or on error:

```json
{ "ok": false, "error": "Error message" }
```

## Production Deployment

For static hosting (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.):

1. Build not required — just deploy the `cosign-website-vanilla/` folder as-is
2. Configure the contact form endpoint:
   - **Netlify**: Create `netlify/functions/contact.js`
   - **Vercel**: Create `api/contact.js`
   - **Cloudflare Pages**: Create `functions/api/contact.js`
3. Update the fetch URL in `app.js` if needed (currently `/api/contact`)

## Design System

### Colors (CSS Custom Properties)

| Token | Dark | Light |
|-------|------|-------|
| `--bg` | `#060907` | `#f5f0e8` |
| `--bg-raised` | `#0c1310` | `#ffffff` |
| `--bg-inset` | `#04100a` | `#ebe6dc` |
| `--line` | `rgba(255,179,42,0.22)` | `rgba(169,122,38,0.35)` |
| `--line-soft` | `rgba(233,228,216,0.10)` | `rgba(124,128,121,0.18)` |
| `--amber` | `#ffb62a` | `#a97a26` |
| `--amber-dim` | `#a97a26` | `#87641f` |
| `--paper` | `#e9e4d6` | `#1a1d19` |
| `--paper-dim` | `#a6a195` | `#4a4d47` |
| `--paper-mut` | `#7c8079` | `#7c8079` |
| `--green` | `#6dffb3` | `#2d8a4e` |
| `--red` | `#ff6b5e` | `#c44335` |

### Typography

- **Font**: IBM Plex Mono (all weights)
- **Sizes**: Clamp-based fluid scaling via `--cap-h1` through `--cap-mono-sm`

### Spacing & Layout

- `--max-width`: 1040px (main content)
- `--stratum-width`: 700px (reading width)
- `--radius`: 3px (consistent rounded corners)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm start` | Same as dev (for production-like start) |

## Browser Support

Modern browsers (last 2 versions of Chrome, Firefox, Safari, Edge). Uses:
- CSS Custom Properties
- CSS Grid / Flexbox
- `<dialog>` element (with polyfill if needed)
- `fetch` API
- `localStorage`

## License

Proprietary — Innershell 2026