# ROOTFO prototype

Node.js 24 / npm 11. React 19 + Vite 7. No secrets, backend, or external service required. Fonts and SVG UI studies are served locally.

```sh
cd /workspace/root4homepage
npm ci --cache /tmp/rootfo-npm-cache
npm run dev -- --port 5173
```

Production: `npm run build`, then `npm run preview -- --port 4173`.

- Content: `src/data.js`; project mockups: `public/projects/*.svg`.
- Asymmetric desktop gallery, image parallax, entry masks, 1.03× hover, pointer label.
- Accessible detail dialog: focus trap, Escape, browser back, focus and scroll restoration.
- Mobile one-column layout; reduced-motion support; touch pointer disabled.
- Lab notes and all projects are illustrative concepts, not customer work.
- Contact is an explicitly labeled demo with a copyable inquiry template. Register real contact details and connect a backend separately.

Validated with headless Chromium at desktop 1440×1000 and mobile 390×844; no horizontal overflow or console errors. Checked six projects, modal focus trap, Escape, browser back, scroll restoration, notes, contact demo and reduced motion. Reference websites were inaccessible (network policy 403); no claim of current visual inspection.
