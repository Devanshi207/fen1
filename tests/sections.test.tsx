import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import SolutionsPage from "@/app/(site)/solutions/page";
import AboutPage from "@/app/(site)/about/page";
import TrainingPage from "@/app/(site)/training/page";
import CareersPage from "@/app/(site)/careers/page";
import ContactPage from "@/app/(site)/contact/page";
import Navbar from "@/components/Navbar";
import SolutionsSection from "@/components/sections/SolutionsSection";
import AboutSection from "@/components/sections/AboutSection";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { CLOSING, PROBLEMS, PRINCIPLES } from "@/data/aboutContent";

// the address the header reads the current page from
const nav = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.path }));

const PAGES: [string, () => React.JSX.Element, string][] = [
  ["/", Page, "home"],
  ["/about", AboutPage, "about"],
  ["/solutions", SolutionsPage, "solutions"],
  ["/training", TrainingPage, "training"],
  ["/careers", CareersPage, "careers"],
  ["/contact", ContactPage, "contact"],
];

describe("the site's pages", () => {
  it.each(PAGES)("%s is a page of its own, holding just its part", (_path, Component, id) => {
    render(<Component />);
    expect([...document.querySelectorAll("[data-section]")].map((s) => s.id)).toEqual([id]);
  });

  it("has a folder for each page (plus the admin area and the API), and no redirect hides a real page", async () => {
    const app = readdirSync(join("src", "app"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    expect(app).toEqual(["(site)", "admin", "api"]);
    const pages = readdirSync(join("src", "app", "(site)"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    expect(pages.sort()).toEqual(["about", "book", "careers", "contact", "solutions", "training"]);
    for (const name of pages) expect(existsSync(join("src", "app", "(site)", name, "page.tsx"))).toBe(true);
    expect(existsSync(join("src", "components", "solutions"))).toBe(false);
    const redirects = (await (await import("../next.config")).default.redirects?.()) ?? [];
    for (const name of pages) expect(redirects.some((r) => r.source === `/${name}`)).toBe(false);
  });

  it("gives each page its own title", async () => {
    const titles = await Promise.all(["solutions", "about", "training", "careers", "contact"].map(async (n) => (await import(`@/app/(site)/${n}/page`)).metadata.title));
    expect(titles).toEqual(["Solutions", "About", "Training", "Careers", "Contact us"]);
  });

  it("has no small blue label above the heading of any page, and none above Workflow on Home", () => {
    for (const [, Component] of PAGES) {
      const { unmount } = render(<Component />);
      expect(document.querySelector(".sec-eyebrow, .wd-eyebrow, .wf-eyebrow")).toBeNull();
      unmount();
    }
    // the first thing in each section head is its heading
    render(<SolutionsPage />);
    expect(document.querySelector(".sec-head")!.firstElementChild!.tagName).toBe("H2");
    expect(document.body.textContent).not.toMatch(/^\s*Solutions\s*Set up/);
  });

  it("starts every page a little under the header, not a screenful below it", () => {
    const layout = readFileSync(join("src", "app", "(site)", "layout.tsx"), "utf8");
    expect(layout).toMatch(/pt-\[4\.4rem\]/);
    expect(layout).not.toMatch(/pt-16|sm:pt-20/);
    const css = readFileSync(join("src", "app", "sections.css"), "utf8");
    const pad = /#solutions, #about, #training, #careers, #contact \{ --pad: clamp\(([\d.]+)rem, ([\d.]+)vw, ([\d.]+)rem\); \}/.exec(css)!;
    expect(Number(pad[3])).toBeLessThanOrEqual(3); // at most 48px of space above the first heading
    expect(/\.contact-grid \{[^}]*align-items: start/.test(css)).toBe(true);
  });

  it("has no rule above the section labels on any page", () => {
    for (const [, Component] of PAGES) {
      const { unmount } = render(<Component />);
      expect(document.querySelector(".tech-rule")).toBeNull();
      unmount();
    }
  });

  it("shows no caption boxes over photos and no photo credit line", () => {
    render(<Page />);
    expect(document.querySelector(".wd-cap, .hero-frame-caption, figcaption")).toBeNull();
    expect(document.body.textContent).not.toMatch(/Photography via Unsplash/i);
  });
});

describe("Navbar across the pages", () => {
  afterEach(() => {
    nav.path = "/";
    vi.unstubAllGlobals();
  });

  it("jumps straight to the top, instantly, when the logo or Home is clicked on the home page", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(screen.getByRole("link", { name: "FEN1, home" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    await user.click(within(screen.getByRole("navigation", { name: "Primary" })).getByRole("link", { name: "Home" }));
    expect(scrollTo).toHaveBeenCalledTimes(2);
  });

  it("does the same for the link of whichever page you are on, and leaves links to other pages to the browser", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    nav.path = "/solutions";
    const user = userEvent.setup();
    render(<Navbar />);
    const primary = within(screen.getByRole("navigation", { name: "Primary" }));
    await user.click(primary.getByRole("link", { name: "Solutions" }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
    // Home and the logo are another page from here: no jump, the browser navigates
    await user.click(primary.getByRole("link", { name: "Home" }));
    await user.click(screen.getByRole("link", { name: "FEN1, home" }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("leaves a click with a modifier key alone, so opening in a new tab still works", async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    const user = userEvent.setup();
    render(<Navbar />);
    await user.keyboard("{Control>}");
    await user.click(screen.getByRole("link", { name: "FEN1, home" }));
    await user.keyboard("{/Control}");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("links to every page, with no separate call-to-action button in the header", () => {
    render(<Navbar />);
    const links = within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/", "/about", "/solutions", "/training", "/careers", "/contact"]);
    expect(screen.queryByRole("link", { name: /get in touch/i })).toBeNull();
  });

  it.each([
    ["/", "Home"],
    ["/about", "About"],
    ["/solutions", "Solutions"],
    ["/training", "Training"],
    ["/careers", "Careers"],
    ["/contact", "Contact us"],
  ])("marks %s as the current page", (path, name) => {
    nav.path = path;
    render(<Navbar />);
    const current = within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.textContent)).toEqual([name]);
  });
});

describe("SolutionsSection", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("opens on the first industry and lists the three industries as tabs", () => {
    render(<SolutionsSection />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(INDUSTRY_SOLUTIONS.length);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[0].title);
  });

  it("switches the panel on click and with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    await user.click(screen.getAllByRole("tab")[1]);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[1].solutionSummary);
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[2].title);
  });

  it("opens an industry when a link points at it (#curtain-wall)", async () => {
    window.history.replaceState(null, "", "/#curtain-wall");
    render(<SolutionsSection />);
    await vi.waitFor(() => expect(screen.getByRole("tabpanel")).toHaveTextContent("Curtain Wall"));
  });

  it("has an anchor for every industry, and no list of the ERP modules", () => {
    render(<SolutionsSection />);
    for (const s of INDUSTRY_SOLUTIONS) expect(document.getElementById(s.id)).toBeTruthy();
    expect(document.getElementById("modules")).toBeNull();
    expect(document.querySelectorAll(".mod-tile")).toHaveLength(0);
    expect(screen.queryByText(/all \d+ modules/i)).toBeNull();
  });

  it("calls the first industry Windows & Doors, with Aluminium and uPVC in smaller letters", () => {
    expect(INDUSTRY_SOLUTIONS[0].title).toBe("Windows & Doors");
    render(<SolutionsSection />);
    const heading = screen.getByRole("heading", { level: 3, name: /Windows & Doors/ });
    expect(heading.querySelector("small.sol-parts")).toHaveTextContent("Aluminium and uPVC");
    expect(JSON.stringify(INDUSTRY_SOLUTIONS)).not.toContain("Aluminium Windows");
  });

  it("keeps the tabs short: just the number and the name, with the bracketed parts only in the panel heading", () => {
    render(<SolutionsSection />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.textContent)).toEqual(INDUSTRY_SOLUTIONS.map((i) => `${i.number}${i.title}`));
    for (const t of tabs) expect(t.querySelector(".sol-parts")).toBeNull();
    expect(screen.getByRole("tabpanel").querySelector(".sol-parts")).toHaveTextContent("Aluminium and uPVC");
  });
});

describe("Solutions workflow", () => {
  it("shows the stages as one line of plain words in sentence case, joined by arrows drawn in CSS, not boxes, capitals or screens", () => {
    render(<SolutionsSection />);
    const chain = document.querySelector(".sol-chain") as HTMLElement;
    expect(chain.textContent).toContain("CRM");
    expect(chain.textContent).toContain("Estimation");
    expect(chain.textContent).not.toMatch(/ESTIMATION|→/);
    expect(chain.querySelector("button, [class*='rounded']")).toBeNull();
    const css = readFileSync(join("src", "app", "sections.css"), "utf8");
    expect(/\.sol-chain \{[^}]*\}/.exec(css)![0]).not.toMatch(/letter-spacing|uppercase/);
    expect(document.querySelector(".sol-flow, .sol-flow-card, [role='dialog']")).toBeNull();
  });
});

describe("AboutSection", () => {
  it("has no table and no problems list: the comparison is on Home, so nothing is said twice", () => {
    render(<AboutSection />);
    expect(screen.queryByRole("table")).toBeNull();
    expect(document.querySelector(".compare, .compare-table, .about-list")).toBeNull();
    expect(document.querySelector(".rounded-2xl, [class*='shadow']")).toBeNull();
  });

  it("Home sets the six problems against the six FEN1 answers as a table, one row each, below the window drawing", () => {
    render(<Page />);
    const table = screen.getByRole("table", { name: "Working without an integrated system, compared with the FEN1 way" });
    expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Area", "Without an Integrated System", "The FEN1 Way"]);
    const rows = within(table).getAllByRole("row").slice(1);
    expect(rows).toHaveLength(PROBLEMS.length);
    expect(PRINCIPLES).toHaveLength(PROBLEMS.length);
    rows.forEach((row, i) => {
      expect(within(row).getByRole("rowheader")).toHaveTextContent(PROBLEMS[i].name);
      const cells = within(row).getAllByRole("cell");
      expect(cells[0]).toHaveTextContent(PROBLEMS[i].issue);
      expect(cells[1]).toHaveTextContent(PRINCIPLES[i].title);
      expect(cells[1]).toHaveTextContent(PRINCIPLES[i].text);
    });
    expect(document.querySelector(".compare-closing")).toHaveTextContent(CLOSING.title);
    expect(document.getElementById("drawing")).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "From scattered tools to one system" })).toBeInTheDocument();
  });

  it("the Workflow is on Solutions and not on Home, so the whole job is told once, above the industry tabs", () => {
    const { unmount } = render(<Page />);
    expect(document.getElementById("roadmap")).toBeNull();
    expect(document.body).not.toHaveTextContent("From enquiry to handover");
    unmount();
    render(<SolutionsPage />);
    const roadmap = document.getElementById("roadmap")!;
    expect(roadmap).toBeTruthy();
    expect(screen.getByText("From enquiry to handover", { selector: ".wf3-heading" })).toBeInTheDocument();
    expect(roadmap.compareDocumentPosition(document.getElementById("solutions")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("has no Fen1 ERP page: the address redirects to Solutions, and the header and footer do not link to it", async () => {
    const redirects = (await (await import("../next.config")).default.redirects?.()) ?? [];
    expect(redirects).toContainEqual({ source: "/erp", destination: "/solutions", permanent: true });
    render(<Navbar />);
    expect(screen.queryByRole("link", { name: "Fen1 ERP" })).toBeNull();
    expect(existsSync(join("src", "app", "(site)", "erp"))).toBe(false);
  });
});

describe("Careers research is applied honestly", () => {
  const src = readFileSync(join("src", "components", "sections", "CareersSection.tsx"), "utf8") + readFileSync(join("src", "data", "careersContent.ts"), "utf8");
  it("covers the fenestration experts and the software side, and fresh graduates", () => {
    for (const word of ["Fenestration Industry Experts", "Software Development & Technology", "Fresh graduates"]) expect(src).toContain(word);
  });
  it("lists no invented vacancies, salaries or benefits", () => {
    expect(src).not.toMatch(/salary|per annum|\$\d|£\d|₹\d|health insurance|stock option|remote-first/i);
  });
});

describe("editorial audit of the whole page", () => {
  it("has no all-capital headings: headings are written in sentence case", () => {
    render(<Page />);
    const shouting = [...document.querySelectorAll("h1, h2, h3")]
      .map((h) => (h.getAttribute("aria-label") ?? h.textContent ?? "").trim())
      .filter((t) => t.length > 6 && t === t.toUpperCase() && /[A-Z]{4}/.test(t));
    expect(shouting).toEqual([]);
  });

  it("has no looping decorative animation, marquee or zero-valued counters", () => {
    render(<Page />);
    expect(document.querySelector(".wordband, .hero-slide, .figures, .hero-frame-slide")).toBeNull();
    const motion = readFileSync(join("src", "app", "motion.css"), "utf8") + readFileSync(join("src", "app", "globals.css"), "utf8");
    expect(motion).not.toMatch(/animation:[^;]*\binfinite\b/);
  });

  it("shows a short video of the official BAU 2027 banner beside the Home headline: silent, looping, with a poster, and no looping CSS animation", () => {
    render(<Page />);
    const video = screen.getByLabelText(/We are participating in BAU 2027, 11 to 15 January 2027, Messe München, Hall B4, Stand 527/) as HTMLVideoElement;
    expect(video.tagName).toBe("VIDEO");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.getAttribute("poster")).toBe("/video/bau-2027-official-poster-1080.jpg");
    expect(video.querySelector("source")).toHaveAttribute("src", "/video/bau-2027-story-web-720.mp4");
    expect(video.closest(".hero-split")).not.toBeNull();
    for (const f of ["bau-2027-story-web-720.mp4", "bau-2027-official-poster-1080.jpg"]) expect(existsSync(join("public", "video", f))).toBe(true);
  });

  it("uses the same one-line, sentence-case style for every button label", () => {
    render(<Page />);
    const labels = [...document.querySelectorAll("a[class*='rounded-full'], button[type='submit']")].map((b) => (b.textContent ?? "").trim());
    for (const l of labels) expect(l).not.toBe(l.toUpperCase());
  });
});
