import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import SolutionsSection from "@/components/sections/SolutionsSection";
import ContactSection from "@/components/sections/ContactSection";
import KineticHeading from "@/components/KineticHeading";
import ModuleList from "@/components/ModuleList";
import { MODULE_ICONS } from "@/components/moduleIcons";
import { FEN1_MODULES } from "@/data/modules";

const css = (name: string) => readFileSync(join("src", "app", name), "utf8");

describe("hero", () => {
  it("carries the brief's headline and supporting text, in sentence case", () => {
    render(<Page />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAccessibleName("Engineering the business behind every window");
    expect(screen.getByText("FEN1 is an ERP product under Kyozon, built for aluminium windows, doors, façades, curtain walls and glass systems.")).toBeInTheDocument();
  });

  it("sets the second line of the headline in the solid brand blue, with no period and no gradient text", () => {
    render(<Page />);
    const accent = document.querySelector("h1 .kinetic-accent");
    expect(accent?.textContent).toBe("behind every window");
    const rule = /\.kinetic-accent \.kinetic-inner \{[^}]*\}/.exec(css("motion.css"))![0];
    expect(rule).toMatch(/color: var\(--accent\)/);
    expect(rule).not.toMatch(/gradient|background-clip|transparent/);
  });

  it("has no buttons: the header links reach every part of the page", () => {
    render(<Page />);
    const hero = document.getElementById("intro")!;
    expect(hero.querySelector("a, button")).toBeNull();
    expect(within(hero).queryByText(/request a demo|explore the platform/i)).toBeNull();
  });

  it("has a plain white background, and the photo has no border or outline", () => {
    expect(/\.hero-bg \{[^}]*\}/.exec(css("sections.css"))![0]).toBe(".hero-bg { background: #ffffff; }");
    expect(css("motion.css")).not.toMatch(/\.hero-media::before/);
    expect(/\.hero-frame \{[^}]*\}/.exec(css("globals.css"))![0]).not.toMatch(/border:|box-shadow/);
    expect(/\.sol-photo \{[^}]*\}/.exec(css("sections.css"))![0]).not.toMatch(/border:|box-shadow/);
  });
});

describe("KineticHeading accent", () => {
  it("strips the ~ marker from the text and the accessible name", () => {
    render(<KineticHeading text={"First line\n~Second line"} />);
    expect(screen.getByRole("heading")).toHaveAccessibleName("First line Second line");
    expect(document.querySelectorAll(".kinetic-accent")).toHaveLength(1);
    expect(document.body.textContent).not.toContain("~");
  });
});

describe("section identities", () => {
  it("keeps every part of the page in one neutral rhythm: white and a cool near-white in turn, with hairlines, and no tinted gradient", () => {
    render(<Page />);
    for (const id of ["drawing", "roadmap"]) expect(document.getElementById(id)).toBeTruthy();
    const sections = css("sections.css");
    expect(sections).toMatch(/#drawing, #solutions, #training, #contact \{ background: var\(--surface\); \}/);
    expect(sections).toMatch(/#roadmap, #about, #careers \{ background: #ffffff; \}/);
    expect(sections).not.toMatch(/linear-gradient|soft-lavender|soft-teal|soft-pink/);
    expect(css("globals.css")).toMatch(/--surface: #f5f7fa/);
  });

  it("does not make any section a gradient", () => {
    const sections = css("sections.css");
    for (const sel of [".page-sec", ".page-sec-alt"]) expect(new RegExp("\\" + sel + " \\{[^}]*gradient").test(sections)).toBe(false);
  });

  it("colours the workflow and the primary buttons in the one solid brand blue", () => {
    expect(/^\.wf2-fill \{[^}]*\}/m.exec(css("motion.css"))![0]).toMatch(/background: var\(--accent\)/);
    const button = /\[class~="bg-\[#0067C0\]"\] \{[^}]*\}/.exec(css("globals.css"))![0];
    expect(button).toMatch(/background-color: var\(--accent\)/);
    expect(button).not.toMatch(/gradient/);
  });

  it("gives every industry the same accent, not a colour each", async () => {
    const user = userEvent.setup();
    render(<SolutionsSection />);
    const fills = new Set<string>();
    for (const tab of screen.getAllByRole("tab").filter((t) => t.id.startsWith("sol-tab-"))) {
      await user.click(tab);
      fills.add((document.querySelector(".sol-body") as HTMLElement).style.getPropertyValue("--tone-fill"));
    }
    expect(fills.size).toBe(1);
  });
});

describe("module groups", () => {
  it("colours each module's icon by its group, with a legend that names the groups", () => {
    render(<ModuleList modules={FEN1_MODULES} icons={MODULE_ICONS} />);
    const legend = screen.getByRole("list", { name: "Module groups" });
    const groups = [...new Set(FEN1_MODULES.map((m) => m.category))];
    expect(within(legend).getAllByRole("listitem")).toHaveLength(groups.length);
    const tileGroups = [...document.querySelectorAll(".mod-tile")].map((t) => t.getAttribute("data-cat"));
    for (const g of groups) expect(tileGroups).toContain(g);
    for (const g of groups) expect(css("sections.css")).toContain(`[data-cat="${g}"]`);
  });
});

describe("contact section", () => {
  it("has no gradient call-to-action band: just the photo and the form, which carries the demo / question choice", () => {
    render(<ContactSection />);
    expect(document.querySelector(".cta-band, .cta-title, .cta-actions")).toBeNull();
    const contact = document.getElementById("contact")!;
    expect(within(contact).getByRole("radio", { name: "I'd like a demo" })).toBeInTheDocument();
    expect(within(contact).getByRole("radio", { name: "I have a question" })).toBeInTheDocument();
    expect(within(contact).queryByText(/See how FEN1 fits/)).toBeNull();
    expect(css("sections.css")).not.toMatch(/\.cta-/);
  });
});
