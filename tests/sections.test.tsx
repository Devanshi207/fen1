import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import Navbar from "@/components/Navbar";
import SolutionsSection from "@/components/sections/SolutionsSection";
import AboutSection from "@/components/sections/AboutSection";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { FEN1_MODULES } from "@/data/modules";
import { PROBLEMS, PRINCIPLES } from "@/data/aboutContent";

const SECTIONS = ["home", "solutions", "about", "training", "careers", "contact"];

describe("the one continuous page", () => {
  it("holds Home, Solutions, About, Training, Careers and Contact in order", () => {
    render(<Page />);
    const ids = [...document.querySelectorAll("[data-section]")].map((s) => s.id);
    expect(ids).toEqual(SECTIONS);
  });

  it("has one public page (plus the admin area and the API): the old routes only redirect", () => {
    const app = readdirSync(join("src", "app"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
    expect(app).toEqual(["(site)", "admin", "api"]);
    expect(existsSync(join("src", "components", "solutions"))).toBe(false);
  });

  it("shows no caption boxes over photos and no photo credit line", () => {
    render(<Page />);
    expect(document.querySelector(".wd-cap, .hero-frame-caption, figcaption")).toBeNull();
    expect(document.body.textContent).not.toMatch(/Photography via Unsplash/i);
  });
});

describe("Navbar on one page", () => {
  class IO {
    static last: IO | null = null;
    constructor(public cb: IntersectionObserverCallback) {
      IO.last = this;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  beforeEach(() => vi.stubGlobal("IntersectionObserver", IO));
  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.replaceState(null, "", "/");
  });

  it("highlights the part of the page in the middle of the screen and keeps the address in step", () => {
    render(
      <>
        <Navbar />
        {SECTIONS.map((id) => (
          <section key={id} id={id} data-section={id} />
        ))}
      </>
    );
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    act(() => {
      // the observers are created in order; the one that watches the sections is the one with the centre band
      IO.last!.cb([{ target: document.getElementById("careers")!, isIntersecting: true } as unknown as IntersectionObserverEntry], IO.last as unknown as IntersectionObserver);
    });
    expect(within(nav).getByRole("link", { name: "Careers" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(window.location.hash).toBe("#careers");
  });

  it("leaves a link into the middle of a part alone (#question stays #question while Contact is current)", () => {
    document.body.innerHTML = "";
    window.history.replaceState(null, "", "/#question");
    render(
      <>
        <Navbar />
        {SECTIONS.map((id) => (
          <section key={id} id={id} data-section={id}>
            {id === "contact" && <span id="question" />}
          </section>
        ))}
      </>
    );
    act(() => {
      IO.last!.cb([{ target: document.getElementById("contact")!, isIntersecting: true } as unknown as IntersectionObserverEntry], IO.last as unknown as IntersectionObserver);
    });
    expect(window.location.hash).toBe("#question");
  });

  it("links to every part, with no separate call-to-action button in the header", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["#home", "#solutions", "#about", "#training", "#careers", "#contact"]);
    expect(screen.queryByRole("link", { name: /get in touch/i })).toBeNull();
  });
});

describe("SolutionsSection", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("opens on the first industry and lists all five as tabs", () => {
    render(<SolutionsSection />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(INDUSTRY_SOLUTIONS.length);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[0].title);
  });

  it("switches the panel on click and with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    await user.click(screen.getAllByRole("tab")[2]);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[2].solutionSummary);
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(INDUSTRY_SOLUTIONS[3].title);
  });

  it("opens an industry when a link points at it (#glass)", async () => {
    window.history.replaceState(null, "", "/#glass");
    render(<SolutionsSection />);
    await vi.waitFor(() => expect(screen.getByRole("tabpanel")).toHaveTextContent("Glass Processing"));
  });

  it("has an anchor for every industry and for the modules, and lists every module", () => {
    render(<SolutionsSection />);
    for (const s of INDUSTRY_SOLUTIONS) expect(document.getElementById(s.id)).toBeTruthy();
    expect(document.getElementById("modules")).toBeTruthy();
    expect(document.querySelectorAll(".mod-tile")).toHaveLength(FEN1_MODULES.length);
  });

  it("shows the workflow as plain text with arrows, not boxes", () => {
    render(<SolutionsSection />);
    const chain = document.querySelector(".sol-chain") as HTMLElement;
    expect(chain.textContent).toContain("CRM →");
    expect(chain.querySelector("button, li, [class*='rounded']")).toBeNull();
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
