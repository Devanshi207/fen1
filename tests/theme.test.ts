import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/** Every source file the site's styling can live in. */
function sources(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) sources(path, out);
    else if (/\.(tsx?|css|svg)$/.test(name)) out.push(path);
  }
  return out;
}

const FILES = sources("src").map((path) => ({ path, text: readFileSync(path, "utf8") }));

/** The colourful light palette: whites and soft section tints, deep slate text, the blue-indigo-violet range, teal, green, amber. */
const ALLOWED = new Set(
  [
    "FFFFFF", "F3F7FF", "DCEBFF", "E9E7FF", "E0F5F4", "F5D8EC", // page, ice blue, soft blue, lavender, teal, pink
    "1E2B45", "55637A", "6F7C93", "7C8AA5", // text and quiet marks
    "DCE6F5", "C7D4EC", // blue-tinted borders
    "0078D4", "0067C0", "005A9E", "0878D1", // blues
    "4353D8", "7655D9", "B66CE0", "9333B8", // indigo, violet, lavender (and its readable text tone)
    "00A6A6", "007A7A", // teal (and its readable text tone)
    "27A66B", "1E7F52", // green (and its readable text tone)
    "F2A23A", "9A6511", // amber (and its readable text tone)
    "A85E55", "FBEAE8", "E8B9B4", // error
    "000000", // alpha masks only
  ].map((h) => h.toUpperCase())
);

describe("light colourful theme", () => {
  it("only uses colours from the palette (no leftover copper, beige or grey)", () => {
    const stray: string[] = [];
    for (const { path, text } of FILES) {
      for (const m of text.matchAll(/#([0-9A-Fa-f]{6})\b/g)) {
        if (!ALLOWED.has(m[1].toUpperCase())) stray.push(`${path}: #${m[1]}`);
      }
    }
    expect(stray).toEqual([]);
  });

  it("defines the brief's brand colours and soft backgrounds as tokens", () => {
    const css = readFileSync(join("src", "app", "globals.css"), "utf8").toLowerCase();
    for (const hex of ["#0078d4", "#005a9e", "#4353d8", "#7655d9", "#b66ce0", "#00a6a6", "#27a66b", "#f2a23a", "#f3f7ff", "#dcebff", "#e9e7ff", "#e0f5f4", "#f5d8ec"]) {
      expect(css).toContain(hex);
    }
  });

  it("never uses a dark background, dark mode, glass or glow", () => {
    const found: string[] = [];
    for (const { path, text } of FILES) {
      if (/prefers-color-scheme/.test(text)) found.push(`${path}: prefers-color-scheme`);
      if (/\bdark:/.test(text)) found.push(`${path}: dark: variant`);
      // (the workflow screens blur while another one is pointed at: that single rule is checked in roadmap.test)
      if (/backdrop-blur|backdrop-filter:\s*blur|mix-blend-mode/.test(text)) found.push(`${path}: glass or blend`);
      if (/(^|[^-])filter:\s*blur/.test(text.replace(/\.wf3-shots:has\(\.wf3-shot:hover\) \.wf3-shot \{[^}]*\}/g, ""))) found.push(`${path}: blur`);
      if (/text-shadow|drop-shadow|feGaussianBlur/.test(text)) found.push(`${path}: glow`);
      // the slate used for text must never be a background
      if (/bg-\[#1E2B45\]|background(-color)?:\s*(#1e2b45|var\(--ink\))/i.test(text)) found.push(`${path}: dark background`);
    }
    expect(found).toEqual([]);
  });

  it("uses gradients only in the brand colours, and never as orbs: no radial or conic gradients", () => {
    const found: string[] = [];
    for (const { path, text } of FILES) {
      if (/radial-gradient|conic-gradient/.test(text)) found.push(`${path}: radial or conic gradient`);
      for (const m of text.matchAll(/linear-gradient\([^;{}]*/g)) {
        for (const h of m[0].matchAll(/#([0-9A-Fa-f]{6})\b/g)) if (!ALLOWED.has(h[1].toUpperCase())) found.push(`${path}: ${h[0]}`);
      }
      for (const m of text.matchAll(/(?:from|via|to)-\[#([0-9A-Fa-f]{6})\]/g)) {
        if (!ALLOWED.has(m[1].toUpperCase())) found.push(`${path}: ${m[0]}`);
      }
    }
    expect(found).toEqual([]);
  });

  it("keeps the approved fonts", () => {
    const layout = readFileSync(join("src", "app", "layout.tsx"), "utf8");
    expect(layout).toMatch(/IBM_Plex_Sans/);
    expect(layout).toMatch(/\bInter\(/);
    expect(layout).toMatch(/IBM_Plex_Mono/);
  });
});
