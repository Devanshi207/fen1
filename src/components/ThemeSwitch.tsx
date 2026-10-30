"use client";

import { useEffect } from "react";

const THEMES = ["ember", "night", "forest"];
const MOTIONS = ["cascade", "zoom", "soft"];

/**
 * Review aid for alternate looks. ?theme=ember|night|forest and ?motion=cascade|zoom|soft set data attributes on <html>
 * (see themes.css); ?theme=default / ?motion=default clears them. The choice is kept for the browser tab so it survives
 * moving between pages. With no parameter and nothing stored, the site is exactly the default design.
 */
export default function ThemeSwitch() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const apply = (key: "theme" | "motion", allowed: string[]) => {
      let value = params.get(key);
      try {
        if (value) sessionStorage.setItem(`fen1-${key}`, value);
        else value = sessionStorage.getItem(`fen1-${key}`);
      } catch {
        // storage unavailable: the URL parameter still applies for this page view
      }
      if (value && allowed.includes(value)) document.documentElement.dataset[key] = value;
      else delete document.documentElement.dataset[key];
    };
    apply("theme", THEMES);
    apply("motion", MOTIONS);
  }, []);
  return null;
}
