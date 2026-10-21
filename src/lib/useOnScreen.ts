"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has scrolled into view (scroll + interval check; robust where IntersectionObserver is throttled). */
export function useOnScreen<T extends HTMLElement>(offset = 0.9) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (seen) return;
    const check = () => {
      const el = ref.current;
      if (el && el.getBoundingClientRect().top < window.innerHeight * offset) setSeen(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    const t = window.setInterval(check, 300);
    return () => {
      window.removeEventListener("scroll", check);
      window.clearInterval(t);
    };
  }, [seen, offset]);

  return [ref, seen] as const;
}
