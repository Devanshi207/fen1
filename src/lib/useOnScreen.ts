"use client";

import { useEffect, useRef, useState } from "react";
import { revealOnce, type InViewOptions } from "@/lib/inview";

/** True once the element has scrolled into view. One IntersectionObserver, no polling. */
export function useOnScreen<T extends HTMLElement>(options?: InViewOptions) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return revealOnce([el], () => setSeen(true), options);
    // the options are read once, when the element mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, seen] as const;
}
