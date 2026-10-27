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
its own scripts for any host but `localhost`, and the page loads with no JavaScript (no fluid background, no
scroll-driven roadmap). If the page opens but looks "dead", that is the first thing to check. Allow the port in the
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
| `/`             | Hero, key figures, enquiry-to-handover roadmap, photo gallery     |
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
  components/     shared UI (Navbar, Footer, HeroDashboard, JourneyTimeline, ...)
  data/           content (see above)
  lib/            small helpers
tests/            Vitest + Testing Library
```

## Design and motion

- Light "glass" theme. Colours are hex values used through Tailwind arbitrary classes; `globals.css` holds the
  glass surfaces, reveal animations and the hero photo crossfade.
- `FluidBackground` is a WebGL fluid simulation behind the page. It needs WebGL2 float render targets and quietly
  disables itself when they are not available.
- Responsive: phones, tablets and desktops share one layout system. The full navigation appears from 1024px; below that
  a menu button opens a full-screen menu. From 1700px the root font size steps up (everything is rem-based), so 1080p,
  1440p and 4K screens scale instead of showing a small column. `viewport-fit=cover` plus safe-area padding keeps
  content clear of iPhone notches, and touch devices get 44px hit areas.
- `FluidBackground` tests whether the GPU can render half-float textures rather than checking extension names, so it
  runs on iPhones and most Android devices. Phones get a lighter simulation; without WebGL2 a CSS blob animation takes
  over (`html.no-fluid`).
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
- Do not set `position` or `overflow` from a global glass selector; it breaks absolutely positioned dropdowns.

## Tests

`npm test` checks the data (unique ids, roadmap order, wording rules), the Solutions page (search, group filter, no
card links), key components (Navbar, Footer, roadmap, counters) and the enquiry flow (validation, the `/api/enquiry`
route, and how both forms behave on success and failure).
