# Prompt: Build the website in `D:\quotation` with the FEN1 design system

You are building (or restyling) the website that lives in **`D:\quotation`**. Treat it exactly like a premium B2B product site and apply the design system below. Do NOT invent business content: first inspect `D:\quotation` (files, README, existing pages, data, copy) and keep its real content, pages, forms and logic. Only where something is missing, use clearly-labelled placeholder copy in the same tone (precise, engineered, professional).

## 0. Before writing any code
- Read `D:\quotation\CLAUDE.md` / `AGENTS.md` if present. If it is a Next.js project, read the relevant guides in `node_modules/next/dist/docs/` first. This Next.js version has breaking changes, so don't rely on memory.
- If `D:\quotation` is empty or not a web project, scaffold: **Next.js (App Router) + TypeScript + Tailwind CSS v4 + framer-motion + lucide-react + clsx**, with `@/` alias to `src/`.
- Run `npx tsc --noEmit` at the end and fix errors. Check the pages in a browser.

## 1. Look and feel: "Light Luxury Liquid Glass + Bento"
Light theme only (no dark mode). Premium, calm, engineered. Frosted translucent glass panels floating over soft, slowly drifting light. Rounded bento-style cards.

**Hard rules (the client rejected these):** no dark theme, no gold/beige/yellow, no pale blue/indigo/purple, no emerald/green primary, no grid-line backgrounds, no decorative plus/crosshair/circle line art, no "AI-generic" look or wording (no sparkles, chips, "intelligent/smart/predictive/AI" copy; use plain terms like "Analytics", "Forecast").

### Palette: deep petrol-teal + aluminium silver + graphite
| Role | Value |
|---|---|
| Page background (pearl) | `#F4F7F9` |
| Section veil / pills | `#E8EFF3` → used at ~38% alpha |
| Soft surface | `#F8FAFC`, `#DDE7ED`, `#D0DDE5` |
| Cards (glass base) | `#FFFFFF` at ~52% alpha |
| Primary (deep teal) | `#0E5A6B` |
| Primary mid / accent | `#0F7C90`, `#1494A8` |
| Bright aqua highlight | `#3CC4D4` |
| Primary gradient (buttons) | `linear-gradient(135deg, #3CC4D4 0%, #12849A 45%, #083C4A 100%)` |
| Ink (headings) | `#0F1C22` |
| Body text | `#4D6169` ; muted `#75878E` |
| Hairline borders | `#D3DEE5` ; accent border `#A5D3DC` |
| Error / "not included" | muted red `#A85E55` (only warm colour allowed) |
| Success | muted sage `#4F7556` |

Ambient background (fixed `body::before`, blurred 30px, drifting 22s): radial blobs of aqua `rgba(60,196,212,.38)`, silver-blue `rgba(148,186,204,.45)`, sky `rgba(34,211,238,.22)`, pale mint-silver `rgba(196,224,232,.55)`, plus a soft teal glow at the top of the body.

Define the colours as CSS variables in `:root` as well (`--bg-base`, `--text-primary`, `--accent`, etc.) and use them consistently.

### Typography
- Headings H1/H2: **Playfair Display** (400-700), weight 500, tight tracking (`-0.01em`), often uppercase for hero lines.
- Everything else (H3+, body, buttons, labels): **Plus Jakarta Sans** (300-800). Small uppercase labels use the same font at weight 600 with `letter-spacing: .04em` (no monospace anywhere).
- Load both via Google Fonts `<link>` in `<head>`. Hero H1 `text-3xl → sm:text-5xl → lg:text-6xl`, light weight.

### Liquid glass components
- **Glass card:** `background: rgba(255,253,248→255,255,255,.52)` + `linear-gradient(145deg, rgba(255,255,255,.55), rgba(255,255,255,.08) 55%)`, `backdrop-filter: blur(22px) saturate(180%)`, 1px white-ish border, inset top highlight `inset 0 1px 0 rgba(255,255,255,.95)`, faint teal lower edge, soft cool shadow `0 22px 48px -24px rgba(8,52,66,.32)`. Fall back to solid white with `@supports not (backdrop-filter)`.
- **Radii (bento):** lg 14px, xl 20px, 2xl 28px, pills fully round.
- **Header:** fixed, frosted bar (`blur(26px) saturate(190%)`, translucent white), with a floating glass pill for the nav links; active link has a white pill that animates between items (framer-motion `layoutId`).
- **Primary button:** teal gradient above, white text, 1px translucent white border, glossy `inset 0 1px 0 rgba(255,255,255,.7)` + inner bottom shade, glow shadow `0 10px 28px -10px rgba(14,90,107,.55)`. **Secondary button:** glass/white pill with teal border and teal or ink text.
- **Closing CTA band (light):** soft icy-aqua gradient (`#E3F6F9 → #BDE6EE → #98D3E0`) with a white glow top-left, dark text, solid teal primary button + outlined secondary. No dark band, no grid, no line art.
- **Dropdown / mega menus:** solid near-white panel (`rgba(255,255,255,.97)`), `rounded-2xl`, big soft shadow, no backdrop blur inside the header, `position:absolute` under the trigger.

## 2. Motion
- **Page enter:** `#page` fades up on each route change (`opacity 0→1`, `translate 0 16px → none`, `blur(6px) → none`, 0.7s, `cubic-bezier(.22,.8,.24,1)`). Animate with `backwards` fill, never `both`.
- **Hero H1:** rise-in (0.05s delay, 1s).
- **Scroll reveal:** a small client component (`MotionProvider`) tags sections, cards, `h2/h3`, tables and forms with `.reveal` (opacity 0 + `translate: 0 28px`, 0.9s ease) and adds `.in` when they enter the viewport, staggered by sibling index (70ms steps, max 8). Use a scroll/resize listener plus a 250ms interval check on `getBoundingClientRect` (not IntersectionObserver alone, it proved unreliable). A MutationObserver picks up newly mounted content (tabs, modals). Ends at `translate: none`.
- **Micro-interactions:** global 0.3s transitions on colour/background/border/shadow/transform; buttons scale to .97 when pressed; primary buttons lift 2px and brighten on hover; trailing arrow icons nudge 3px right on hover; glass cards lift 3px with a deeper shadow; a diagonal white **sheen sweep** crosses glass cards on hover (use a `::after` with `border-radius: inherit` and animated `background-position`, no `overflow:hidden`).
- Smooth scroll; slow ambient drift of the background light.
- **`prefers-reduced-motion`:** drop translate/blur/drift but keep gentle fades and hover feedback (do not disable everything, the user's OS may have it on).
- Use framer-motion for dropdowns (`opacity/y 8px, 0.18s`), modals and shared-layout nav pill.

## 3. Hard-won engineering rules (avoid these bugs)
1. **Never override positioning from a global glass rule.** Don't set `position`/`overflow` on all cards. Only add `position:relative` when the element is not `.absolute/.fixed/.sticky/.relative`, and never `overflow:hidden` on cards (it clips dropdowns/tooltips).
2. **`backdrop-filter`, `filter`, `transform`, `perspective` or a non-`none` `translate` on any ancestor traps `position:fixed` modals** (they size to the ancestor instead of the viewport). So: no blur on page-wide wrappers or big section veils (veils are plain translucent colour); end all enter animations with `none`; add `:has(.fixed.inset-0) { backdrop-filter:none!important; filter:none!important; transform:none!important; perspective:none!important; transition:none!important; animation:none!important; }`.
3. Don't put `translate: none !important` together with `transform: none !important` in one rule. The CSS minifier merges them into `translate3d(0,0,0)`, which re-creates the trap.
4. Header already blurs, so nothing inside it should blur again (nested backdrop-filters glitch).
5. After every visual change run a contrast check (text vs background ≥ 3:1, body ≥ 4.5:1) on every route, and test every modal by opening it and confirming the fixed overlay rect equals the viewport.
6. Hard-coded colours go through one palette. Prefer CSS variables/Tailwind theme tokens over scattering hex values.

## 4. Layout and structure to mirror
- Root layout: Google Fonts links, `<Navbar/>`, `<main id="page" class="flex-1 w-full pt-16 sm:pt-20">`, `<Footer/>`, `<MotionProvider/>`. Body: `min-h-full flex flex-col bg-[#F4F7F9] text-[#0F1C22]`, selection `#3CC4D4` with white text. `themeColor: #F4F7F9`.
- Container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; generous vertical rhythm (`py-24` sections).
- Home: centred hero (H1, one-line sub-copy, primary + secondary button) → bento grid of glass cards (3-up on desktop, icon top-right, small uppercase teal label, title, 2-line clamped description) → feature/workflow sections → light CTA band → footer with 4 link columns.
- Navbar: logo mark (teal gradient square with rotated inner diamond) + wordmark, centred glass pill nav with dropdowns, right-aligned primary CTA; full-screen mobile menu rendered **outside** `<header>`.
- Fully responsive (phone to desktop), keyboard-accessible, visible focus rings in teal.

## 5. The quotation website (what to build in `D:\quotation`)
Keep and style whatever exists in `D:\quotation` (quotation/estimate builder, price tables, line items, PDF/print views, customer forms, etc.). Apply the glass cards, teal buttons, fonts and motion above to it. Where a quotation flow needs UI, use these patterns:
- A multi-step or single-page **quote builder** in a large glass card: left = inputs (customer, items, quantity, unit price, tax/discount), right = sticky live **summary card** (subtotal, tax, discount, grand total in Playfair Display, teal primary "Generate quotation" button).
- Line-item table with hairline rows, hover highlight, inline editing, add/remove row with a smooth height/opacity transition.
- A clean, printable **quotation document view** (white page, teal accent header, quote number, validity date, terms) plus "Download PDF" and "Send" actions.
- Quote list with status chips (Draft = silver, Sent = teal, Accepted = sage, Expired/Rejected = muted red), search and filters.
- Empty states, form validation messages and toasts in the same visual language. Number formatting and currency must be consistent; totals must be computed, never hard-coded.

## 6. Definition of done
- Every route renders in the new theme with no leftover dark/gold/purple/green styling, no grids, no line-art decorations.
- Dropdowns open without layout shift; all modals cover the viewport exactly.
- Transitions work with and without reduced-motion.
- `npx tsc --noEmit` is clean, the contrast check passes on all routes, and you have looked at the pages in a browser.
- Summarise what you changed and anything you couldn't verify.
