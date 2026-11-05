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

/** The light palette: whites and the cool near-white, deep slate text, the brand blue and its darker step, and the two status colours. */
const ALLOWED = new Set(
  [
    "FFFFFF", "F5F7FA", "DCEBFF", // page, cool near-white, soft blue for selection
    "1E2B45", "55637A", "6F7C93", "7C8AA5", // text and quiet marks
    "DCE6F5", "C7D4EC", // blue-tinted borders still used by a few components
    "0078D4", "0067C0", "005A9E", "0878D1", // the brand blue and its steps
    "27A66B", "1E7F52", // green (and its readable text tone)
    "F2A23A", "9A6511", // amber (and its readable text tone)
    "A85E55", "FBEAE8", "E8B9B4", // error
    "000000", // alpha masks only
    "F3F7FF", // the ice tint a few components still reference
  ].map((h) => h.toUpperCase())
);

describe("light theme with one accent", () => {
  it("only uses colours from the palette (no leftover copper, beige or grey)", () => {
    const stray: string[] = [];
    for (const { path, text } of FILES) {
      for (const m of text.matchAll(/#([0-9A-Fa-f]{6})\b/g)) {
        if (!ALLOWED.has(m[1].toUpperCase())) stray.push(`${path}: #${m[1]}`);
      }
    }
    expect(stray).toEqual([]);
  });

  it("defines the brand blue, the status colours and the two light surfaces as tokens", () => {
    const css = readFileSync(join("src", "app", "globals.css"), "utf8").toLowerCase();
    for (const hex of ["#0078d4", "#005a9e", "#0067c0", "#27a66b", "#f2a23a", "#f5f7fa", "#dcebff"]) {
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

  it("uses no hue gradients at all: no gradient tokens, no gradient text, no radial or conic gradients", () => {
    const found: string[] = [];
    for (const { path, text } of FILES) {
      if (/radial-gradient|conic-gradient/.test(text)) found.push(`${path}: radial or conic gradient`);
      if (/--grad-/.test(text)) found.push(`${path}: gradient token`);
      if (/background-clip:\s*text/.test(text)) found.push(`${path}: gradient text`);
      for (const m of text.matchAll(/linear-gradient\([^;{}]*/g)) {
        // a gradient may only be a neutral mask (grid lines fading out) or one colour twice, used to draw a solid line:
        // no hex colours, and never two different colour tokens
        const tokens = new Set(m[0].match(/var\(--[\w-]+\)/g) ?? []);
        if (/#[0-9A-Fa-f]{6}\b/.test(m[0]) || tokens.size > 1) found.push(`${path}: ${m[0].slice(0, 50)}`);
      }
      for (const m of text.matchAll(/(?:from|via|to)-\[#([0-9A-Fa-f]{6})\]/g)) found.push(`${path}: ${m[0]}`);
    }
    expect(found).toEqual([]);
  });

  it("keeps labels in sentence case and weights at 400 to 500: no uppercase labels, no heavy weights", () => {
    const found: string[] = [];
    for (const { path, text } of FILES) {
      if (!/\.(css|tsx)$/.test(path) || /admin/.test(path)) continue;
      const code = text.replace(/\/\*[\s\S]*?\*\//g, "");
      if (/text-transform:\s*uppercase|\buppercase\b/.test(code)) found.push(`${path}: uppercase`);
      if (/font-weight:\s*(600|700|800|900)/.test(code)) found.push(`${path}: heavy weight`);
    }
    expect(found).toEqual([]);
  });

  it("keeps the approved fonts", () => {
    const layout = readFileSync(join("src", "app", "layout.tsx"), "utf8");
    expect(layout).toMatch(/IBM_Plex_Sans/);
    expect(layout).toMatch(/\bInter\(/);
    expect(layout).not.toMatch(/IBM_Plex_Mono/); // no typewriter font: labels use Inter
  });
});
