# FEN1

Marketing and product site for **FEN1**, an ERP built for glass, aluminium and window businesses. It presents the
modules, the industry solutions and the enquiry-to-handover roadmap, and has one enquiry where a visitor either asks for a demo or sends a question by clicking through five short questions, one at a time, and a careers section with its own form.

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
its own scripts for any host but `localhost`, and the page loads with no JavaScript (no menu, no workflow
stepper, no tabs). If the page opens but looks "dead", that is the first thing to check. Allow the port in the
Windows firewall if the device cannot reach it at all.

## Configuration

Copy `.env.example` to `.env.local` and set:

| Variable                    | Purpose                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `ENQUIRY_WEBHOOK_URL`       | Where the enquiry form sends enquiries (a JSON `POST`). Without it the form shows an error instead of pretending the message was sent. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional. Shows a direct email address on the enquiry page when a visitor chooses "I have a question". |
| `ADMIN_PASSWORD`            | Optional. The starting password for `/admin`; without it the starting password is `123456`. Once the password has been changed on the Account tab, the saved one is used instead. |
| `ADMIN_SESSION_SECRET`      | Optional. A separate secret for signing the admin cookie. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Where jobs and enquiries are saved when deployed (see Admin). |

## Pages

| Route           | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| `/`             | The whole site as one continuous page: Home, Solutions, About, Training, Careers, Contact, then the footer once |
| `/api/enquiry`  | Receives the demo, question and careers forms; saves them to the admin inbox and forwards them to `ENQUIRY_WEBHOOK_URL` |
| `/api/jobs`     | The open job openings, for the Careers section (public) |
| `/admin`        | Password-protected: the enquiry inbox and job openings (not linked from the site, not indexed) |

Within the page, the header links are `#home`, `#solutions`, `#about`, `#training`, `#careers` and `#contact`; the header
highlights whichever part is in the middle of the screen and keeps the address in step. Deeper links:
`#windows-doors`, `#glass-railing`, `#curtain-wall` (open that industry), `#modules`, `#roles`, and `#demo` / `#question`
(scroll to the enquiry and pick the first answer, opening on the second question). The old page addresses (`/solutions`, `/about`, `/training`,
`/careers`, `/request-demo`, `/contact`, `/products`) redirect to the matching part of the page.

## Admin: job openings and the enquiry inbox

`/admin` is for the team. The starting password is `123456` (or `ADMIN_PASSWORD` if you set it); **change it straight away on the Account tab**. Then:

- **Enquiries**: every demo request, question and job application, newest first. Filter by type and by waiting / handled,
  search, open one to see everything the visitor typed, reply by email, mark it handled, delete it, or export the filtered
  list as CSV.
- **Account**: change the password from the website (current password, then the new one twice; at least 8 characters). The new password is saved as a salted scrypt hash in the database (never the password itself), and every other signed-in browser is signed out. This needs the database on a deployed site. If it is ever forgotten, delete the `credential` field of the `fen1:settings` hash in Redis (or `settings.credential` in `.data/fen1.json`) and the starting password works again.
- **Job openings**: add, edit, close (hides it from the site but keeps it) and delete roles. Open roles appear in the Careers
  section with a Read more and an Apply button; Apply fills the form with the role, so the application arrives tagged with it.
  With no open roles the Careers section says none are listed.

**Where it saves.** A deployed site has no writable disk, so connect a database: in Vercel, *Storage > Marketplace > Upstash
Redis* (free tier), and the project gets `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (the `KV_REST_API_*` names
also work). Locally, with none set, everything is saved to `.data/fen1.json` (git-ignored). With neither, the admin says
nothing can be saved and new enquiries only reach the webhook. Add `ADMIN_PASSWORD` (and optionally `ADMIN_SESSION_SECRET`) to
the Vercel environment variables, then redeploy.

**How it is protected.** The password is compared in constant time; a successful login sets a signed, `httpOnly`,
`SameSite=Strict` cookie (`Secure` in production) valid for 12 hours; every `/api/admin/*` route checks it; repeated wrong
passwords from one address are slowed and then blocked for a while; the public jobs endpoint returns only open roles and only
the fields the page shows; the enquiry form has a hidden spam-trap field; CSV cells that start with `=`, `+`, `-` or `@` are
neutralised so a spreadsheet cannot run them. One shared password is the simplest thing that works: if several people need
access, or you need to know who did what, move to individual accounts (see below).

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

- A colourful light theme, and only light. White and ice-blue pages (#FFFFFF, #F3F7FF), deep slate text (#1E2B45, reading text
  #55637A), blue-tinted borders, and a blue-indigo-violet brand range: #0078D4 (lines and marks), #0067C0 (text and buttons: white
  on it is 5.4:1), deep blue #005A9E, indigo #4353D8, violet #7655D9, lavender #B66CE0, with teal #00A6A6, green #27A66B and amber
  #F2A23A. The soft backgrounds are ice blue, soft blue #DCEBFF, lavender #E9E7FF, teal #E0F5F4 and pink #F5D8EC. All tokens are at
  the top of `globals.css`. There are no dark sections or backgrounds anywhere.
- Colour gives each part of the page its own identity: the hero is white into ice blue with a blue-violet headline accent and a
  gradient window-frame outline behind the photo; manufacturing (the drawing) is soft blue; the workflow is pale blue into teal;
  the platform (About) is lavender with indigo; each industry has its own colour (tab, number and frame behind its photo);
  module icons are coloured by their module group, with a legend; Careers is ice blue with violet; the footer is ice blue. Gradients are used only for the hero headline accent, primary
  buttons, the window-frame outline and the workflow line: never as glows, orbs or glass, and not on every
  section. `tests/theme.test.ts` enforces the palette, no dark backgrounds and no radial or conic gradients.
- The logo is `public/brand/fen1-logo.png` (the supplied artwork with a transparent background; `fen1-mark.png` is the window mark
  alone, and `src/app/icon.png` is the browser tab icon). It is used in the header, the footer, the admin header and the opening
  splash. To change it, replace those files and keep the same names.
- Clicking a link scrolls so a part's first line lands just under the header: each section's stop point is worked out from its own top
  padding (`--pad` in `sections.css`), so changing a section's padding does not bring back a big gap.
- Type: IBM Plex Sans for headings, Inter for text, the same Inter for the small uppercase labels (`font-mono` / `.tech`, which no longer use a monospace font), all
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
  - **Hero**: header fade, mono eyebrow, heading lines rising through a mask (`KineticHeading`), paragraph, then the photo
    wiping in by clip-path while it settles from 1.03 to 1. There are no buttons in the hero or the header: the header links reach everything, and the forms are in Contact and Careers.
  - **Scroll reveals** (`MotionProvider`): the top-most element of each group (a card, a heading, a paragraph, a list item) fades
    up in order; delay maths is in `src/lib/stagger.ts`. Route changes get a short fade with a few pixels of lift; header and
    footer stay put, and there is no loading screen between pages.
  - **Window drawing** (`WindowDrawing`): an aluminium window elevation, its width and height dimensions and a section through
    the profile are drawn in SVG strokes, then resolve into a photograph. The dimension labels are letters (W, H), not numbers.
  - **Workflow** (`Workflow`, data in `src/data/roadmap.ts`): driven by scrolling and nothing else, so there is nothing to click. It
    is a tall block (about four screens of scrolling in all, a quarter of a screen per stage) with one panel held in place
    (`position: sticky`) while you scroll past it; the stage changes as you go; scrolling down walks through all 13 stages, and coming back up from the next section (Solutions) shows step 1 at once instead of replaying them in reverse. The page scrolls as normal and nothing captures the
    wheel. The stage comes from 13 invisible markers and an `IntersectionObserver` (no scroll listener, and it re-renders only when
    the stage changes). The 13 numbers along the top and the line between them show where you are; they are not buttons. Each
    stage shows its description, the module it is worked in, the record it leaves and three ERP screens in a row: the main one
    big in the middle, a smaller one on each side. Point at any of them and it grows while the other two shrink and blur (pure
    CSS, `.wf3-shots`). For screen readers the whole workflow is a plain list.
  - **ERP screens** (`src/data/stageScreens.ts`): RIGHT NOW THESE ARE DEMO IMAGES, wireframe placeholders in `public/erp/` (three
    per stage, 39 in all, marked "Demo image" on the picture, showing no data). To use real FEN1 screenshots, drop them in
    `public/erp/` and change the file names in that one data file (three per stage, 16:10 works best).
  - **Solutions** (`SolutionsSection`): the three industries (aluminium and uPVC windows and doors, glass railing, curtain wall) as tabs, each with its own photograph (`SOLUTION_PHOTOS` in
    `src/data/gallery.ts`). The photos are stacked; choosing an industry wipes its photo in over the last one from alternating
    sides while it settles from 1.03 to 1, and the text enters after it. The industry tabs and an up / down arrow pair stay in
    view while you read (sticky), and choosing an industry from further down brings its photo back into view. Nothing is pinned,
    there is no scroll engine, and the numbered module list follows.
  - **Careers** (`CareersSection`) follows what fenestration employers actually hire for (estimating, fabrication and production,
    glazing and installation, project management), plus software roles and early careers. It lists no vacancies, salaries or
    benefits it does not have, and its form posts to the same webhook as `careers`.
  - Tablet and mobile use shorter, lighter fades and no parallax. With `prefers-reduced-motion` there is no travel, no
    line-drawing and no wipes: everything is shown with short fades, so nothing is lost.
- Photos are hot-linked from Unsplash at 2400px and served resized as AVIF or WebP (see `images.remotePatterns` and `images.formats` in
  `next.config.ts`). They are named in `src/data/gallery.ts`: the hero, the contact section, the picture the drawing resolves into, and
  one for each industry. Swap a photo by changing its address there.

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
card links), key components (Navbar, Footer, workflow), the motion system (observers, splash, drawing, no polling) and the light theme and the enquiry flow (validation, the `/api/enquiry`
route, and how both forms behave on success and failure).
