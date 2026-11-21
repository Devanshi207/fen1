import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { existsSync } from "node:fs";
import { join } from "node:path";
import HomeSection from "@/components/sections/HomeSection";
import SolutionsSection from "@/components/sections/SolutionsSection";
import TrainingSection from "@/components/sections/TrainingSection";
import AboutSection from "@/components/sections/AboutSection";
import CareersSection from "@/components/sections/CareersSection";
import { ABOUT_INSIDE, DIRECTOR, SOLUTIONS_INCLUDED, SOLUTION_MODULES, WHY_FEN1, type Note } from "@/data/erpContent";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { TRACKS } from "@/data/trainingContent";
import { CLOSING, PRINCIPLES, PROBLEMS } from "@/data/aboutContent";
import { ROADMAP_STAGES } from "@/data/roadmap";

const sentences = (text: string) => text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
const words = (text: string) => text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);

const GROUPS: [string, Note[]][] = [
  ["About: why FEN1", WHY_FEN1],
  ["About: the director", DIRECTOR.notes],
  ["About: underneath the modules", ABOUT_INSIDE],
  ["Solutions: included in every solution", SOLUTIONS_INCLUDED],
  ...Object.entries(SOLUTION_MODULES).map(([id, notes]): [string, Note[]] => [`Solutions: ${id}`, notes]),
];

/** Every piece of text a visitor reads about the ERP, with where it lives. */
function everyText(): [string, string][] {
  return [
    ...WHY_FEN1.map((n): [string, string] => [`why: ${n.name}`, n.text]),
    ...DIRECTOR.notes.map((n): [string, string] => [`about director: ${n.name}`, n.text]),
    ["about director intro", DIRECTOR.intro],
    ["about director quote", DIRECTOR.quote],
    ...ABOUT_INSIDE.map((n): [string, string] => [`about inside: ${n.name}`, n.text]),
    ...SOLUTIONS_INCLUDED.map((n): [string, string] => [`solutions included: ${n.name}`, n.text]),
    ...Object.entries(SOLUTION_MODULES).flatMap(([id, ns]) => ns.map((n): [string, string] => [`${id} module: ${n.name}`, n.text])),
    ...INDUSTRY_SOLUTIONS.flatMap((i): [string, string][] => [[`${i.id} challenge`, i.challenge], [`${i.id} summary`, i.solutionSummary], ...i.keyBenefits.map((b, k): [string, string] => [`${i.id} benefit ${k}`, b])]),
    ...TRACKS.map((t): [string, string] => [`training: ${t.title}`, t.text]),
    ...PROBLEMS.map((p): [string, string] => [`home problem: ${p.name}`, p.issue]),
    ...PRINCIPLES.map((p): [string, string] => [`home answer: ${p.title}`, p.text]),
    ["home closing", CLOSING.text],
    ...ROADMAP_STAGES.flatMap((s): [string, string][] => [[`workflow ${s.step} desc`, s.desc], [`workflow ${s.step} record`, s.record]]),
  ];
}

describe("the notes on the pages", () => {
  it.each(GROUPS)("%s: every note is a name and two or three sentences", (_page, notes) => {
    expect(notes.length).toBeGreaterThan(0);
    for (const n of notes) {
      expect(n.name.trim().length).toBeGreaterThan(2);
      const count = sentences(n.text).length;
      expect(count, n.name).toBeGreaterThanOrEqual(2);
      expect(count, n.name).toBeLessThanOrEqual(3);
      expect(n.name.endsWith("."), `${n.name} ends with a period`).toBe(false);
    }
  });

  it("training gives every role two or three sentences on what it does, and no second list of the same topics", () => {
    for (const t of TRACKS) {
      const count = sentences(t.text).length;
      expect(count, t.title).toBeGreaterThanOrEqual(2);
      expect(count, t.title).toBeLessThanOrEqual(3);
      expect(t, t.title).not.toHaveProperty("topics");
    }
  });

  it("keeps the four reasons in Why FEN1 on the About page: speed, simplicity, performance and industry expertise", () => {
    expect(WHY_FEN1.map((n) => n.name)).toEqual(["Speed", "Simplicity", "Performance", "Industry Expertise"]);
  });

  it("never says the same thing twice: no sentence repeats, and no run of seven words is shared by two different blocks, on any page", () => {
    const texts = everyText();
    const sentenceSeen = new Map<string, string>();
    const sentenceDupes: string[] = [];
    for (const [where, text] of texts) {
      for (const s of sentences(text)) {
        const key = words(s).join(" ");
        if (key.split(" ").length < 4) continue;
        if (sentenceSeen.has(key)) sentenceDupes.push(`${where} repeats ${sentenceSeen.get(key)}`);
        else sentenceSeen.set(key, where);
      }
    }
    expect(sentenceDupes).toEqual([]);

    const shingles = new Map<string, Set<string>>();
    for (const [where, text] of texts) {
      const w = words(text);
      for (let i = 0; i + 7 <= w.length; i++) {
        const key = w.slice(i, i + 7).join(" ");
        if (!shingles.has(key)) shingles.set(key, new Set());
        shingles.get(key)!.add(where);
      }
    }
    const shared = [...shingles.entries()].filter(([, where]) => where.size > 1).map(([phrase, where]) => `"${phrase}" in ${[...where].join(" and ")}`);
    expect(shared).toEqual([]);
  });

  it("uses the site's wording and makes no claim it cannot back: no tax-system acronyms, no hype, and no figure except the director's years", () => {
    const rest = JSON.stringify([SOLUTION_MODULES, SOLUTIONS_INCLUDED, ABOUT_INSIDE, TRACKS.map((t) => t.text), PRINCIPLES, PROBLEMS, CLOSING]);
    const everything = JSON.stringify([rest, DIRECTOR]);
    expect(everything).not.toMatch(/\bGST\b|\bHSN\b|\bSAC\b|accorr/i);
    expect(everything).not.toMatch(/cutting-edge|revolution|empower|unlock|next-generation|world-class|state-of-the-art|unified|powerful|best-in-class|leading/i);
    expect(everything).not.toMatch(/\d+(\.\d+)?\s?%|\b\d{2,}\+/);
    const noBrand = (t: string) => t.replace(/fen1/gi, "");
    // the only figures: the director's "over 25 years", and the problems' own numbering 01 to 06
    expect([...noBrand(JSON.stringify([SOLUTION_MODULES, SOLUTIONS_INCLUDED, ABOUT_INSIDE, TRACKS.map((t) => t.text), PRINCIPLES, CLOSING, WHY_FEN1])).matchAll(/\d+/g)].map((m) => m[0])).toEqual([]);
    expect([...noBrand(JSON.stringify(DIRECTOR)).matchAll(/\d+/g)].map((m) => m[0])).toEqual(["25"]);
  });

  it("gives the director no name and no photo, because none was supplied", () => {
    expect(JSON.stringify(DIRECTOR)).not.toMatch(/\bMr\.?\b|\bDr\.?\b|\bShri\b/);
  });

  it("names every industry's modules, for every industry on the Solutions page", () => {
    for (const i of INDUSTRY_SOLUTIONS) expect(SOLUTION_MODULES[i.id]?.length, i.id).toBeGreaterThanOrEqual(3);
  });
});

describe("each thing is said on one page only", () => {
  it("Home: the hero and the table: no Workflow, no overview list, no summary of the table", () => {
    render(<HomeSection />);
    expect(document.getElementById("intro")).toBeTruthy();
    expect(document.getElementById("drawing")).toBeNull();
    expect(document.getElementById("compare")).toBeTruthy();
    expect(document.getElementById("roadmap")).toBeNull();
    expect(document.getElementById("covers")).toBeNull();
    expect(document.querySelector(".notes")).toBeNull();
    const hero = document.getElementById("intro")!;
    expect(hero.querySelectorAll("a, button")).toHaveLength(1);
    expect(within(hero).getByRole("link", { name: "Make an enquiry" })).toHaveAttribute("href", "/contact");
  });

  it("Solutions: what every solution includes above the tabs, each industry's own modules inside its panel, and nothing else about the modules", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    const strip = document.querySelector(".sol-common")!;
    expect(strip).toHaveTextContent("Included in every solution");
    expect([...strip.querySelectorAll(".note-name")].map((e) => e.textContent)).toEqual(SOLUTIONS_INCLUDED.map((n) => n.name));
    expect(strip.compareDocumentPosition(screen.getAllByRole("tab")[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("tabpanel").contains(strip)).toBe(false);
    const notes = () => [...document.querySelectorAll(".sol-mods .note-name")].map((e) => e.textContent);
    expect(notes()).toEqual(SOLUTION_MODULES["windows-doors"].map((n) => n.name));
    await user.click(screen.getAllByRole("tab")[1]);
    expect(notes()).toEqual(SOLUTION_MODULES["glass-railing"].map((n) => n.name));
    await user.click(screen.getAllByRole("tab")[2]);
    expect(notes()).toEqual(SOLUTION_MODULES["curtain-wall"].map((n) => n.name));
    expect(screen.getByText("Modules it uses")).toBeInTheDocument();
    expect(document.querySelectorAll(".sol-mods h4").length).toBe(SOLUTION_MODULES["curtain-wall"].length);
    expect(document.querySelectorAll(".sol-common .note")).toHaveLength(SOLUTIONS_INCLUDED.length);
  });


  it("Training gives each role its sentences, once", () => {
    render(<TrainingSection />);
    expect(document.querySelectorAll(".train-text")).toHaveLength(TRACKS.length);
    expect(document.querySelector(".train-topics")).toBeNull();
    for (const t of TRACKS) expect(screen.getByText(t.text)).toBeInTheDocument();
  });

  it("About has Why FEN1 (four reasons), the director's profile and the foundations, and no table; there is no Why FEN1 page", async () => {
    render(<AboutSection />);
    const why = document.querySelector(".about-why")!;
    expect(why).toHaveTextContent("Why Choose FEN1?");
    for (const n of WHY_FEN1) expect(within(why as HTMLElement).getByRole("heading", { level: 3, name: n.name })).toBeInTheDocument();
    expect(why.querySelectorAll(".note")).toHaveLength(WHY_FEN1.length);
    expect(existsSync(join("src", "app", "(site)", "why-fen1"))).toBe(false);
    const redirects = (await (await import("../next.config")).default.redirects?.()) ?? [];
    expect(redirects).toContainEqual({ source: "/why-fen1", destination: "/about", permanent: true });
    const director = document.querySelector(".about-director")!;
    expect(director).toHaveTextContent("Meet our director");
    expect(director).toHaveTextContent("over 25 years");
    expect(director).toHaveTextContent("Surat Diamond Bourse");
    expect(director.querySelectorAll(".note")).toHaveLength(DIRECTOR.notes.length);
    expect(director.querySelector("blockquote")).toHaveTextContent(DIRECTOR.quote);
    expect(screen.getByText("Underneath the modules")).toBeInTheDocument();
    expect(document.querySelectorAll(".about-inside .note")).toHaveLength(ABOUT_INSIDE.length);
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("Careers has the invitation, the areas and who should connect, and no form on the page: the form is on the apply page", () => {
    render(<CareersSection />);
    expect(screen.getByRole("heading", { level: 2, name: "Build the Future of Fenestration With Us." })).toBeInTheDocument();
    const lists = [...document.querySelectorAll(".career-list")];
    expect(lists).toHaveLength(2);
    expect(lists[0].querySelectorAll("li")).toHaveLength(6);
    expect(lists[1].querySelectorAll("li")).toHaveLength(5);
    expect(screen.queryByText(/not currently open positions/)).toBeNull();
    expect(screen.queryByText(/immediate opening/)).toBeNull();
    expect(document.querySelector(".career-apply")).toBeNull();
    expect(document.querySelector("form")).toBeNull();
    expect(screen.queryByText("Submit Your Profile")).toBeNull();
  });
});
