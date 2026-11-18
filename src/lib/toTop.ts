import type { MouseEvent } from "react";

/**
 * A click handler for a link: when the link points at the page you are already on, it jumps straight to the top of the page
 * (instantly, not by scrolling the whole way up) instead of doing nothing. A link to another page, or a click with a modifier
 * key (open in a new tab), is left to the browser.
 */
export function toTopIfHere(href: string, pathname: string | null) {
  return (e: MouseEvent<HTMLElement>) => {
    if (href !== (pathname ?? "/") || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
}
