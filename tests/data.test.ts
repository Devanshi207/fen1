import { describe, expect, it } from "vitest";
import { FEN1_MODULES } from "@/data/modules";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { ROADMAP_STAGES } from "@/data/roadmap";

describe("roadmap", () => {
  it("follows the ERP process from enquiry to handover", () => {
    expect(ROADMAP_STAGES.map((s) => s.title)).toEqual([
      "Enquiry",
      "CRM",
      "Estimation",
      "Survey",
      "Design",
      "Project management",
      "Purchase",
      "Store",
      "Production",
      "Quality control",
      "Logistics",
      "Installation",
      "Handover",
    ]);
  });

  it("numbers every step in sequence", () => {
    ROADMAP_STAGES.forEach((s, i) => expect(s.step).toBe(String(i + 1).padStart(2, "0")));
  });

  it("names, for every step, a real FEN1 module and the record it leaves", () => {
    const names = FEN1_MODULES.map((m) => m.name.toLowerCase());
    for (const s of ROADMAP_STAGES) {
      expect(s.record.length).toBeGreaterThan(0);
      const wanted = s.module.toLowerCase().replace(" & ", " & ");
      expect(names.some((n) => n === wanted)).toBe(true);
    }
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
    }
  });
});

describe("HRMS module", () => {
  it("is named HRMS and nothing still calls it HR & Attendance", () => {
    expect(FEN1_MODULES.some((m) => m.name === "HRMS")).toBe(true);
    expect(JSON.stringify(FEN1_MODULES)).not.toMatch(/HR & ATTENDANCE/i);
  });

  it("is referenced by the modules it connects to using the new name", () => {
    const hrms = FEN1_MODULES.find((m) => m.name === "HRMS");
    expect(hrms).toBeDefined();
    const referrers = FEN1_MODULES.filter((m) => m.connectedModules.includes("HRMS"));
    expect(referrers.length).toBeGreaterThan(0);
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

describe("claims", () => {
  const shown = JSON.stringify([FEN1_MODULES, INDUSTRY_SOLUTIONS, ROADMAP_STAGES]);

  it("carries no placeholder KPIs or sample data", () => {
    expect(shown).not.toMatch(/SAMPLE DATA|sampleKpis/);
  });

  it("states no performance percentages or named machine-vendor integrations it cannot back up", () => {
    expect(JSON.stringify(INDUSTRY_SOLUTIONS)).not.toMatch(/\d+(\.\d+)?\s?%/);
    expect(shown).not.toMatch(/Elumatec|Emmegi|Sch\u00fco|\bFOM\b/);
  });

  it("avoids stock marketing phrases", () => {
    expect(shown).not.toMatch(/seamless|end-to-end|cutting-edge|revolution|empower|unlock|next-generation|world-class|state-of-the-art|unified/i);
  });
});
