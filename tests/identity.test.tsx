import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Page from "@/app/(site)/page";
import KineticHeading from "@/components/KineticHeading";
import ModuleList from "@/components/ModuleList";
import { MODULE_ICONS } from "@/components/moduleIcons";
import { FEN1_MODULES } from "@/data/modules";

const css = (name: string) => readFileSync(join("src", "app", name), "utf8");

describe("hero", () => {
  it("carries the brief's headline and supporting text, in sentence case", () => {
    render(<Page />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAccessibleName("Engineering the business behind every window.");
    expect(screen.getByText("One connected operating platform for aluminium, glass, windows, doors and façade manufacturers.")).toBeInTheDocument();
  });

  it("sets the second line of the headline in the brand gradient", () => {
    render(<Page />);
    const accent = document.querySelector("h1 .kinetic-accent");
    expect(accent?.textContent).toBe("behind every window.");
    expect(/\.kinetic-accent \.kinetic-inner \{[^}]*\}/.exec(css("motion.css"))![0]).toMatch(/var\(--grad-brand\)/);
  });

  it("has no buttons: the header links reach every part of the page", () => {
    render(<Page />);
    const hero = document.getElementById("intro")!;
    expect(hero.querySelector("a, button")).toBeNull();
    expect(within(hero).queryByText(/request a demo|explore the platform/i)).toBeNull();
  });

  it("has a white-to-ice-blue background and a window-frame outline in the brand gradient behind the photo", () => {
    expect(/\.hero-bg \{[^}]*\}/.exec(css("sections.css"))![0]).toMatch(/#ffffff[^;]*var\(--ice\)/);
    expect(css("motion.css")).toMatch(/\.hero-media::before \{[^}]*var\(--grad-brand\)/);
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
  it("gives each part of the page its own tone", () => {
    render(<Page />);
    expect(document.querySelector("#drawing.sec-blue")).toBeTruthy(); // manufacturing: soft blue
    expect(document.querySelector("#roadmap.sec-teal")).toBeTruthy(); // workflow: blue and teal
    expect(document.querySelector("#about.sec-lavender")).toBeTruthy(); // platform: lavender and indigo
    expect(document.querySelector("#careers.sec-violet")).toBeTruthy();
    const sections = css("sections.css");
    expect(sections).toMatch(/\.sec-blue \{[^}]*var\(--soft-blue\)/);
    expect(sections).toMatch(/\.sec-teal \{[^}]*var\(--soft-teal\)/);
    expect(sections).toMatch(/\.sec-lavender \{[^}]*var\(--soft-lavender\)/);
  });

  it("does not make every section a gradient: Solutions, Training and the footer stay plain light", () => {
    const sections = css("sections.css");
    for (const sel of [".page-sec"]) expect(new RegExp("\\" + sel + " \{[^}]*gradient").test(sections)).toBe(false);
    expect(/\.page-sec-alt \{[^}]*\}/.exec(sections)![0]).not.toMatch(/gradient/);
  });

  it("colours the workflow in teal and blue, and the primary buttons in blue to indigo", () => {
    expect(/^\.wf2-fill \{[^}]*\}/m.exec(css("motion.css"))![0]).toMatch(/var\(--grad-teal-blue\)/);
    expect(/\[class~="bg-\[#0067C0\]"\] \{[^}]*\}/.exec(css("globals.css"))![0]).toMatch(/linear-gradient\(135deg, #0067c0[^)]*#4353d8/);
  });

  it("gives every industry its own colour", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const fills = new Set<string>();
    for (const tab of screen.getAllByRole("tab").filter((t) => t.id.startsWith("sol-tab-"))) {
      await user.click(tab);
      fills.add((document.querySelector(".sol-body") as HTMLElement).style.getPropertyValue("--tone-fill"));
    }
    expect(fills.size).toBe(5);
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
    render(<Page />);
    expect(document.querySelector(".cta-band, .cta-title, .cta-actions")).toBeNull();
    const contact = document.getElementById("contact")!;
    expect(within(contact).getByRole("radio", { name: "I'd like a demo" })).toBeInTheDocument();
    expect(within(contact).getByRole("radio", { name: "I have a question" })).toBeInTheDocument();
    expect(within(contact).queryByText(/See how FEN1 fits/)).toBeNull();
    expect(css("sections.css")).not.toMatch(/\.cta-/);
  });
});
