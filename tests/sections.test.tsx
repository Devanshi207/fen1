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
import { PROBLEMS, PRINCIPLES } from "@/data/aboutContent";

// the address the header reads the current page from
const nav = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.path }));

const PAGES: [string, () => React.JSX.Element, string][] = [
  ["/", Page, "home"],
  ["/solutions", SolutionsPage, "solutions"],
  ["/about", AboutPage, "about"],
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
    expect(pages.sort()).toEqual(["about", "careers", "contact", "solutions", "training"]);
    for (const name of pages) expect(existsSync(join("src", "app", "(site)", name, "page.tsx"))).toBe(true);
    expect(existsSync(join("src", "components", "solutions"))).toBe(false);
    const redirects = (await (await import("../next.config")).default.redirects?.()) ?? [];
    for (const name of pages) expect(redirects.some((r) => r.source === `/${name}`)).toBe(false);
  });

  it("gives each page its own title", async () => {
    const titles = await Promise.all(["solutions", "about", "training", "careers", "contact"].map(async (n) => (await import(`@/app/(site)/${n}/page`)).metadata.title));
    expect(titles).toEqual(["Solutions", "About", "Training", "Careers", "Contact us"]);
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
  });

  it("links to every page, with no separate call-to-action button in the header", () => {
    render(<Navbar />);
    const links = within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/", "/solutions", "/about", "/training", "/careers", "/contact"]);
    expect(screen.queryByRole("link", { name: /get in touch/i })).toBeNull();
  });

  it.each([
    ["/", "Home"],
    ["/solutions", "Solutions"],
    ["/about", "About"],
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
});

describe("Solutions workflow", () => {
  it("shows the workflow as plain text with arrows, not boxes or screens", () => {
    render(<SolutionsSection />);
    const chain = document.querySelector(".sol-chain") as HTMLElement;
    expect(chain.textContent).toContain("CRM →");
    expect(chain.querySelector("button, li, [class*='rounded']")).toBeNull();
    expect(document.querySelector(".sol-flow, .sol-flow-card, [role='dialog']")).toBeNull();
  });
});

describe("AboutSection", () => {
  it("is short: the problems and the three ideas as plain rows, with no cards", () => {
    render(<AboutSection />);
    expect(document.querySelectorAll(".about-list li")).toHaveLength(PROBLEMS.length + PRINCIPLES.length);
    expect(document.querySelector(".rounded-2xl, [class*='shadow']")).toBeNull();
    expect((document.body.textContent ?? "").length).toBeLessThan(2400);
  });
});

describe("Careers research is applied honestly", () => {
  const src = readFileSync(join("src", "components", "sections", "CareersSection.tsx"), "utf8");
  it("covers the trade's own roles and the software side, and early careers", () => {
    for (const word of ["Estimators", "Glaziers and installers", "Product engineering", "Apprentices"]) expect(src).toContain(word);
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

  it("uses the same one-line, sentence-case style for every button label", () => {
    render(<Page />);
    const labels = [...document.querySelectorAll("a[class*='rounded-full'], button[type='submit']")].map((b) => (b.textContent ?? "").trim());
    for (const l of labels) expect(l).not.toBe(l.toUpperCase());
  });
});
