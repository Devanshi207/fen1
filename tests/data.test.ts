import { describe, expect, it } from "vitest";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { ROADMAP_STAGES } from "@/data/roadmap";

describe("roadmap", () => {
  it("follows the ERP process from enquiry to handover", () => {
    expect(ROADMAP_STAGES.map((s) => s.title)).toEqual([
      "ENQUIRY",
      "FOLLOW-UPS",
      "DRAWING",
      "ESTIMATION",
      "SURVEY",
      "DESIGN",
      "PURCHASE",
      "STORE",
      "JOB WORK",
      "PRODUCTION",
      "QC",
      "INSTALLATION",
      "HANDOVER",
    ]);
  });

  it("numbers every step in sequence", () => {
    ROADMAP_STAGES.forEach((s, i) => expect(s.step).toBe(String(i + 1).padStart(2, "0")));
  });

  it("gives every step a subtitle and description", () => {
    for (const s of ROADMAP_STAGES) {
      expect(s.subtitle.length).toBeGreaterThan(0);
      expect(s.desc.length).toBeGreaterThan(0);
    }
  });
});

describe("modules", () => {
  it("has unique ids, slugs and numbers", () => {
    for (const key of ["id", "slug", "number"] as const) {
      const values = FEN1_MODULES.map((m) => m[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("belongs to one of the known groups", () => {
    const groups = ["BUSINESS", "OPERATIONS", "SUPPLY CHAIN", "FINANCE & PEOPLE", "ANALYTICS", "SYSTEM"];
    for (const m of FEN1_MODULES) expect(groups).toContain(m.category);
  });

  it("has the fields the pages render", () => {
    for (const m of FEN1_MODULES) {
      expect(m.name).toBeTruthy();
      expect(m.headline).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.submodules.length).toBeGreaterThan(0);
      expect(m.sampleKpis.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("industry solutions", () => {
  it("has unique ids and sequential numbering", () => {
    expect(new Set(INDUSTRY_SOLUTIONS.map((s) => s.id)).size).toBe(INDUSTRY_SOLUTIONS.length);
    INDUSTRY_SOLUTIONS.forEach((s, i) => expect(s.number).toBe(String(i + 1).padStart(2, "0")));
  });
});

describe("content wording", () => {
  // The site is for glass, aluminium and windows, with global (not region-specific) terminology.
  const all = JSON.stringify([FEN1_MODULES, INDUSTRY_SOLUTIONS, ROADMAP_STAGES]);

  it.each([
    ["façade", /fa[cç]ade/i],
    ["GST", /\bGST\b/],
    ["indent", /\bindents?\b/i],
    ["RA bill", /\bRA\b/],
  ])("does not use the word %s", (_label, pattern) => {
    expect(all).not.toMatch(pattern);
  });
});
