# ROOTFO prototype

Node.js 24 / npm 11. React 19 + Vite 7. No secrets, backend, or external service required. Fonts and SVG UI studies are served locally.

```sh
cd /workspace/root4homepage
npm ci --cache /tmp/rootfo-npm-cache
npm run dev -- --port 5173
```

Production: `npm run build`, then `npm run preview -- --port 4173`.

- Content: `src/data.js`; project mockups: `public/projects/*.svg`.
- Desktop opens with all six projects in a full-screen mosaic. Native scroll pins the viewport, expands the first project, then reveals the remaining projects sequentially. Reverse scrolling reverses the timeline. Separate image/background movement creates parallax. No wheel interception or scroll snapping.
- Bottom numbered controls jump to each project; overview and next controls work with mouse and keyboard. Detail buttons open the project study.
- The timeline lives in `src/ScrollGallery.jsx`, with styles in `src/gallery.css`. It uses measured transforms and opacity, updated in requestAnimationFrame.
- Hover magnifies the image 1.03× and shows a pointer label.
- Accessible detail dialog: focus trap, Escape, browser back, focus and scroll restoration.
- Under 768px, or with reduced motion enabled, the pinned timeline is replaced by a regular accessible project grid. Mobile is one column; touch pointer disabled.
- Lab notes and all projects are illustrative concepts, not customer work.
- Contact is an explicitly labeled demo with a copyable inquiry template. Register real contact details and connect a backend separately.

Validated with headless Chromium at desktop 1440×900 and mobile 390×844; no horizontal overflow or console errors. All six projects fit on the initial desktop screen. Checked the pinned stage at each of the six timeline stops, direct numbered navigation, return to overview, About anchor, modal Escape and scroll restoration, plus the reduced-motion grid. Reference websites were inaccessible (network policy 403); no claim of current visual inspection.
