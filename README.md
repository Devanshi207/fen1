# FEN1

Marketing and product site for **FEN1**, an ERP built for glass, aluminium and window businesses. It presents the
modules, the industry solutions and the enquiry-to-handover roadmap, and has contact and demo-request forms.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the dev server                  |
| `npm run build`     | Production build                      |
| `npm start`         | Serve the production build            |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | TypeScript, no emit                   |
| `npm test`          | Run the test suite once (Vitest)      |
| `npm run test:watch`| Re-run tests on change                |

Requires Node 20.19+ (22 recommended).

### Trying it on a phone or tablet

Run `npm run dev`, then open the **Network** address it prints (for example `http://192.168.0.109:3000`) on a device
on the same Wi-Fi. `allowedDevOrigins` in `next.config.ts` allows private-network addresses; without it Next.js blocks
its own scripts for any host but `localhost`, and the page loads with no JavaScript (no scroll-driven
roadmap, no counters). If the page opens but looks "dead", that is the first thing to check. Allow the port in the
Windows firewall if the device cannot reach it at all.

## Configuration

Copy `.env.example` to `.env.local` and set:

| Variable                    | Purpose                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `ENQUIRY_WEBHOOK_URL`       | Where the contact and demo forms send enquiries (a JSON `POST`). Without it the forms show an error instead of pretending the message was sent. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. Shows a direct email address on the Contact page.                               |

## Pages

| Route           | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| `/`             | Five full-screen chapters: hero, figures, pinned roadmap, photo slabs, closing statement |
| `/solutions`    | Industry solutions and the full module directory (search, groups) |
| `/about`        | What FEN1 is and the problems it removes                          |
| `/training`     | Role-based training tracks                                        |
| `/contact`      | Contact form (posts to `/api/enquiry`)                            |
| `/request-demo` | Demo request form (posts to `/api/enquiry`)                       |

`/products` and `/products/*` redirect to `/solutions#modules`.

## Where the content lives

All site copy that repeats lives in `src/data/`, so pages never hard-code lists:

- `modules.ts`: the modules shown on Solutions and in the home hero demo
- `solutions.ts`: the industry solutions
- `roadmap.ts`: the 13 roadmap stages on the home page, in display order

The figures in the home "key figures" strip are computed from these files, so they cannot drift from the content.
The dashboard in the home hero is an illustration and is labelled "Sample data".

## Project structure

```
src/
  app/            routes, layouts and per-route metadata
  components/     shared UI (Navbar, Footer, HeroGallery, JourneyTimeline, ...)
  data/           content (see above)
  lib/            small helpers
tests/            Vitest + Testing Library
```

## Design and motion

- Flat, clean light theme: a cool white page, graphite-navy text, one blue accent, solid white cards with hairline borders and soft shadows.
  Colours are hex values used through Tailwind arbitrary classes plus the tokens at the top of `globals.css`.
  `scripts/palette.py` swaps the whole palette (blue or petrol teal) in one command.
- Navigation is one full-screen menu on every screen size: an OPEN MENU / CLOSE MENU button in the header wipes a blue
  panel in from the right, then the five pages and their rules draw in one after another (`Navbar.tsx`). It locks page
  scroll, closes on Escape or a route change, keeps keyboard focus inside, and keeps the wipe and fades (but drops the
  vertical slide) for people who prefer reduced motion.
- Responsive: phones, tablets and desktops share one layout system. From 1700px the root font size steps up (everything is rem-based), so 1080p,
  1440p and 4K screens scale instead of showing a small column. `viewport-fit=cover` plus safe-area padding keeps
  content clear of iPhone notches, and touch devices get 44px hit areas.
- The home page is built as scroll "chapters" (`[data-chapter]`), in the spirit of Webflow showcase sites:
  - `KineticHeading` splits headlines into letters that rise into place (server-rendered, plain text kept for screen readers).
  - `RoadmapScene` pins the screen and swaps the 13 stages as you scroll (progress dots, giant outlined step number).
  - `ProjectSlabs` stacks full-screen photos that start tilted, straighten, fill their outlined titles and recede when covered.
  - `WordBand` slides two rows of giant outlined words against each other; `ScrollWords` lights the closing statement word by word.
  - `ChapterRail` is the dot timeline on the right edge;
    pill buttons lean toward the mouse. On desktop the intro, figures and finale snap into place (`scroll-snap-type: y proximity`).
  - The scroll maths for each lives in `src/lib/` (`roadmap`, `slabs`, `scrollwords`, `chapters`, `magnet`, `stagger`) and is unit-tested.
  - With reduced motion the scenes stay (so nothing is lost) but drop the large movement: stages cross-fade, photos do not tilt, the magnetic pull is off.
- `MotionProvider` drives the staggered scroll: the top-most element of each group (a card, a heading, a paragraph, a
  list item, a pill button) reveals in order, with the delay worked out from the layout at the moment it appears, so a
  grid cascades left to right row by row, alternate columns travel further, and the gallery photos drift at different
  speeds (`data-speed`). The delay maths lives in `src/lib/stagger.ts`. `prefers-reduced-motion` keeps fades but drops
  movement and drift.
- Fonts (Bricolage Grotesque for headings, Outfit for text) load through `next/font`; the weight scale is set in one block at the end of `globals.css`.
- Photos are hot-linked from Unsplash (see `images.remotePatterns` in `next.config.ts`).

### Gotchas worth knowing

- A parent with `backdrop-filter`, `filter` or `transform` becomes the containing block for `position: fixed`
  children, which breaks full-screen overlays. `globals.css` has a `:has(.fixed.inset-0)` rule that clears them
  while an overlay is open. Keep large page wrappers free of those properties.
- Do not set `position` or `overflow` from a broad global selector; it breaks absolutely positioned dropdowns.

## Tests

`npm test` checks the data (unique ids, roadmap order, wording rules), the Solutions page (search, group filter, no
card links), key components (Navbar, Footer, roadmap, counters) and the enquiry flow (validation, the `/api/enquiry`
route, and how both forms behave on success and failure).
