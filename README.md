# FEN1

Marketing and product site for **FEN1**, an ERP built for glass, aluminium and window businesses. It presents the
modules, the industry solutions and the enquiry-to-handover roadmap, and has one enquiry form where a visitor either asks for a demo or sends a question, and a careers section with its own form.

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
| `ENQUIRY_WEBHOOK_URL`       | Where the enquiry form sends enquiries (a JSON `POST`). Without it the form shows an error instead of pretending the message was sent. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. Shows a direct email address on the enquiry page when a visitor chooses "I have a question". |

## Pages

| Route           | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| `/`             | The whole site as one continuous page: Home, Solutions, About, Training, Careers, Contact, then the footer once |
| `/api/enquiry`  | Receives the demo, question and careers forms and forwards them to `ENQUIRY_WEBHOOK_URL` |

Within the page, the header links are `#home`, `#solutions`, `#about`, `#training`, `#careers` and `#contact`; the header
highlights whichever part is in the middle of the screen and keeps the address in step. Deeper links: `#windows-doors`,
`#glass`, `#fabrication`, `#contractors`, `#dealers` (open that industry), `#modules`, `#roles`, and `#demo` / `#question`
(scroll to the enquiry form and pick that choice). The old page addresses (`/solutions`, `/about`, `/training`,
`/careers`, `/request-demo`, `/contact`, `/products`) redirect to the matching part of the page.

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

- Light industrial theme, and only light: the page is warm mineral grey (#F6F7F5), cards are white, secondary surfaces are
  #E9EDEB, text is #34434A (reading text #5B6B73, labels #788991), borders are #DCE2DF, and the one accent is copper
  (#B87545 for lines and marks, #A0602F for text and filled buttons, which keeps white-on-copper above 4.5:1).
  There are no dark or navy sections (the footer and menu included), no gradients except page-coloured fades over photos,
  no glows, no blur and no glass. Contrast comes from type, spacing, hairline borders and photography.
  The tokens sit at the top of `globals.css`; components use the same hex values through Tailwind arbitrary classes.
- Type: IBM Plex Sans for headings, Inter for text, IBM Plex Mono for technical labels (`font-mono` / `.tech`), all
  through `next/font`. Weights are set in one block at the top of `globals.css`.
- Technical-drawing details: `.tech-rule` (a measuring rule with end ticks) and `.tech-grid` (hairline blueprint grid),
  plus the engineering-line animation of the opening FEN1 mark.
- Navigation is one full-screen menu on small screens (links in the header from 1024px): a MENU / CLOSE button wipes a
  light panel down from the top, then the five pages slide in one after another (`Navbar.tsx`, CSS only). It locks page
  scroll and closes on Escape or a route change.
- Responsive: phones, tablets and desktops share one layout system. From 1700px the root font size steps up (everything is rem-based), so 1080p,
  1440p and 4K screens scale instead of showing a small column. `viewport-fit=cover` plus safe-area padding keeps
  content clear of iPhone notches, and touch devices get 44px hit areas.
- Motion is one small system (`src/app/motion.css`, `src/lib/inview.ts`), CSS first, with no animation library (framer-motion
  was removed). One easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`), reveals of 450-750ms with 15-30px of travel and a
  70-120ms stagger, and only transform, opacity and clip-path are animated. Nothing polls and no work runs per scroll
  event: an `IntersectionObserver` adds a class the first time something nears the screen, and anything a fast jump skipped
  is revealed once scrolling settles (`scrollend`), so content is never left hidden. Hidden start states exist only under
  `@media (scripting: enabled)`, so without JavaScript every section is simply visible.
  - **Opening splash** (`HomeIntro`): FEN rises in, the "1" is drawn as a line and then filled, a hairline progress line runs
    underneath; about 1.3s, CSS only. It plays on the first visit in a tab only (a `sessionStorage` flag, checked by the
    script in `app/layout.tsx` before first paint), never when moving between pages, and the hero waits behind it.
  - **Hero**: header fade, mono eyebrow, heading lines rising through a mask (`KineticHeading`), paragraph, buttons, the photo
    wiping in by clip-path while it settles from 1.03 to 1, then corner ticks and a measuring line.
  - **Scroll reveals** (`MotionProvider`): the top-most element of each group (a card, a heading, a paragraph, a list item) fades
    up in order; delay maths is in `src/lib/stagger.ts`. Route changes get a short fade with a few pixels of lift; header and
    footer stay put, and there is no loading screen between pages.
  - **Window drawing** (`WindowDrawing`): an aluminium window elevation, its width and height dimensions and a section through
    the profile are drawn in SVG strokes, then resolve into a photograph. The dimension labels are letters (W, H), not numbers.
  - **Workflow** (`Workflow`): a compact stepper instead of a long scroll. All 13 stages sit on one line, grouped into four phases
    (win the job, define it, make it, deliver it); the line fills as you move forward and the chosen stage shows below. Real
    buttons with arrow-key support; two rows of numbers on phones. Nothing is pinned.
  - **Industry features** (`ProjectSlabs`): each photo is unmasked from alternating sides while it settles from 1.03 to 1, then
    its label, title, note and link enter in turn.
  - **Solutions** (`SolutionsSection`): the five industries as tabs with one panel that crossfades (no scroll engine), then the
    numbered module list. **Careers** (`CareersSection`) follows what fenestration employers actually hire for (estimating,
    fabrication and production, glazing and installation, project management, plus software roles and early careers); it lists
    no vacancies, salaries or benefits it does not have, and its form posts to the same webhook as `careers`.
  - Tablet and mobile use shorter, lighter fades and no parallax. With `prefers-reduced-motion` there is no travel, no
    line-drawing and no wipes: everything is shown with short fades, so nothing is lost.
- Photos are hot-linked from Unsplash (see `images.remotePatterns` in `next.config.ts`).

### Gotchas worth knowing

- A parent with `backdrop-filter`, `filter` or `transform` becomes the containing block for `position: fixed`
  children, which breaks full-screen overlays. `globals.css` has a `:has(.fixed.inset-0)` rule that clears them
  while an overlay is open. Keep large page wrappers free of those properties.
- Do not set `position` or `overflow` from a broad global selector; it breaks absolutely positioned dropdowns.

## Deploying

### 1. Push to GitHub

```bash
git status                       # see what changed
git add -A
git commit -m "Describe the change"
git push origin main             # first push of a new branch: git push -u origin main
```

`.env*` files are git-ignored (only `.env.example` is committed), so secrets never reach GitHub.

### 2. Deploy on Vercel

Vercel detects Next.js by itself; no `vercel.json` is needed.

1. In Vercel choose **Add New... > Project**, import the GitHub repository and keep the detected **Next.js** preset.
2. Under **Environment Variables** add `ENQUIRY_WEBHOOK_URL` (required, or the enquiry form reports an error instead of
   sending) and, optionally, `NEXT_PUBLIC_CONTACT_EMAIL`. Add them for Production and Preview.
3. Click **Deploy**. Every later `git push` to `main` redeploys; pushes to other branches get a preview URL.

Or from the terminal:

```bash
npm i -g vercel
vercel login
vercel link                              # connect this folder to a Vercel project
vercel env add ENQUIRY_WEBHOOK_URL production
vercel                                   # preview deployment
vercel --prod                            # production deployment
```

Environment variables are read at build time for `NEXT_PUBLIC_*` and at run time for the rest, so after changing one in
Vercel, redeploy. Photos are served from Unsplash through `next/image`; the allowed host is in `next.config.ts`.

## Tests

`npm test` checks the data (unique ids, roadmap order, wording rules), the Solutions page (search, group filter, no
card links), key components (Navbar, Footer, workflow, counters), the motion system (observers, splash, drawing, no polling) and the light theme and the enquiry flow (validation, the `/api/enquiry`
route, and how both forms behave on success and failure).
