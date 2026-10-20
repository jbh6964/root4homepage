# ROOTFO prototype

Node.js 24 / npm 11. React 19 + Vite 7. No secrets, backend or external service is required. Fonts and artwork are served locally.

```sh
cd /workspace/root4homepage
npm ci --cache /tmp/rootfo-npm-cache
npm run dev -- --port 5173
```

Production: `npm run build`, then `npm run preview -- --port 4173`. Vercel uses `vercel.json` and deploys the connected `main` branch.

- Content: `src/data.js`. Project artwork sources: `public/projects/*.svg`; optimized 2400×1650 previews: matching `.webp` files. Update both when replacing a project image. The TV and commerce artwork contains generated concept photography, not customer material.
- `src/ScrollGallery.jsx` owns one sticky viewport for the entire desktop site. All projects, About, Lab and Contact share the same native scroll timeline. There is no handoff to ordinary document scrolling after the gallery, wheel interception or forced snap.
- Entry composition: six individually art-directed rectangles with different widths, heights, rotations and depth, plus four decorative detail fragments. Pointer movement applies damped depth and tilt; scroll expands the first project, then reveals the rest sequentially. Image and background layers move independently. Reverse scrolling reverses the sequence.
- About: text, background typography, strategy document, wireframe and process rows have different parallax amounts. Process buttons update the strategy document on hover, focus and click.
- Lab: three overlapping, independently moving editorial notes; hover and focus raise a note for reading. Each opens its example article.
- Contact: independent type, symbol and background motion; inquiry opens an explicit demo with a copyable template. No message is sent.
- Main navigation uses the gallery's `navigationRef` to seek the matching timeline position. Desktop narrative panels are absolute; ordinary anchor positioning is unsuitable for them. Section hashes are supported on initial load.
- Hidden projects and chapters are inert and excluded from accessibility navigation. Detail dialogs support focus trapping, Escape, browser back, and focus/scroll restoration.
- Under 768px, or with reduced motion enabled, the same content becomes a normal accessible document. Mobile has one project column. Touch has no custom pointer. Idle artwork does not run perpetual animations.
- Pacing and motion profiles live in `src/motion.js`. Each project has a 0.9-unit entry followed by a 1.35-unit dwell/inspection interval before the next entry. Separate overview breathing room, a 115ms visual damping time constant and longer chapter reading intervals keep normal wheel input from immediately advancing past a scene. Native scrolling remains unmodified.
- `src/FeatureDetail.jsx` presents three scope-specific detail crops for each project. Scroll advances them automatically; hover, focus and click can inspect a chosen point. Hovering the main UI connects a reticle to the detail magnifier. Camera pan/zoom profiles vary by project; TV has aperture mattes, commerce has material swatches, and mobility has a scroll-drawn route. Progress indicators show the current project's reading interval.
- About's four process stages advance with scroll and remain selectable. Lab's notes unfold separately and fully open on hover/focus. Contact reveals two title lines, supporting copy, inquiry action and the typographic seal in distinct beats. Menu links land at readable states with the target action available.
- Timeline geometry and styles live in `src/ScrollGallery.jsx` and `src/gallery.css`; narrative content and process interaction live in `src/StoryContent.jsx`. The desktop composition is specifically designed for six projects; review the composition when adding more.

Browser verification: native wheel, forward/reverse scene motion, six project stops, pointer depth, all three narrative panels remaining pinned and moving with scroll, section navigation, process selection, project/notes dialogs, focus trap, Escape, browser back, scroll restoration, and inquiry demo. A 700px wheel gesture from the first project’s resting state stays on that project and advances its details; reverse wheel rewinds inspection. All six detail variants and scope selectors, pointer magnification, automatic process stages, sequential note unfolding and staged contact passed. Detail cards and controls do not overlap at desktop sizes 1440×900, 1366×768, 1920×1080, 1024×650 and 768×600. Mobile widths: 320, 390, 767. Reduced motion retains all six projects and all chapters. No horizontal overflow or console/page errors in those checks.

The Active Theory reference remained inaccessible (network policy 403); the current reference screen was not visually inspected. All projects and notes are labeled illustrative concepts, not actual customer work.
