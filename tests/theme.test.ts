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

/** The light industrial palette, the copper accent, and the two status colours (with their pale tints). */
const ALLOWED = new Set(
  [
    "F6F7F5", "FFFFFF", "E9EDEB", // page, white, secondary surface
    "34434A", "5B6B73", "788991", // text
    "DCE2DF", "CDD5D1", // borders
    "B87545", "A0602F", "824C27", "EFE4DA", // accent: marks, text and buttons, hover, pale tint
    "A85E55", "FBEAE8", "E8B9B4", // error
    "4F7556", // success
    "000000", // alpha masks only
  ].map((h) => h.toUpperCase())
);

describe("light theme", () => {
  it("only uses colours from the light palette", () => {
    const stray: string[] = [];
    for (const { path, text } of FILES) {
      for (const m of text.matchAll(/#([0-9A-Fa-f]{6})\b/g)) {
        if (!ALLOWED.has(m[1].toUpperCase())) stray.push(`${path}: #${m[1]}`);
      }
    }
    expect(stray).toEqual([]);
  });

  it("has no dark mode, glass or glow", () => {
    const found: string[] = [];
    for (const { path, text } of FILES) {
      if (/prefers-color-scheme/.test(text)) found.push(`${path}: prefers-color-scheme`);
      if (/\bdark:/.test(text)) found.push(`${path}: dark: variant`);
      if (/backdrop-blur|backdrop-filter:\s*blur|filter:\s*blur|mix-blend-mode/.test(text)) found.push(`${path}: blur or blend`);
      if (/text-shadow|drop-shadow|feGaussianBlur/.test(text)) found.push(`${path}: glow`);
    }
    expect(found).toEqual([]);
  });

  it("keeps every gradient to page-coloured fades or neutral hairlines", () => {
    const found: string[] = [];
    for (const { path, text } of FILES) {
      for (const m of text.matchAll(/(?:linear|radial|conic)-gradient\([^;{}]*/g)) {
        // allowed: fades into the page colour (246 247 245 / F6F7F5), the blueprint grid's hairlines, and alpha masks
        if (!/246, ?247, ?245|F6F7F5|52, ?67, ?74|#000|var\(--bg\)/i.test(m[0])) found.push(`${path}: ${m[0].slice(0, 60)}`);
      }
      for (const m of text.matchAll(/(?:from|via|to)-\[#([0-9A-Fa-f]{6})\]/g)) {
        if (m[1].toUpperCase() !== "F6F7F5") found.push(`${path}: ${m[0]}`);
      }
    }
    expect(found).toEqual([]);
  });

  it("sets the brief's three type families", () => {
    const layout = readFileSync(join("src", "app", "layout.tsx"), "utf8");
    expect(layout).toMatch(/IBM_Plex_Sans/);
    expect(layout).toMatch(/\bInter\(/);
    expect(layout).toMatch(/IBM_Plex_Mono/);
  });
});
