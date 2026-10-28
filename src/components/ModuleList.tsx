"use client";

import { useEffect, useRef, useState } from "react";
import type { FEN1Module } from "@/data/modules";

/**
 * The module directory as a big typographic list. Titles only. The row at the middle of the screen (or under the
 * pointer) lights up, slides across and fills with colour while the rest recede, and a counter on the side follows it.
 * Nothing in here is a link: the rows are for browsing, the detail lives in the industry solutions above.
 */
export default function ModuleList({ modules, icons }: { modules: FEN1Module[]; icons: Record<string, React.ComponentType<{ className?: string }>> }) {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const hovering = useRef(false);

  // Follow the scroll: whichever row crosses the middle band of the screen becomes the active one
  useEffect(() => {
    const root = list.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const rows = Array.from(root.children);
    const io = new IntersectionObserver(
      (entries) => {
        if (hovering.current) return;
        for (const e of entries) {
          if (e.isIntersecting) setActive(rows.indexOf(e.target));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [modules]);

  const index = Math.min(active, Math.max(modules.length - 1, 0));
  const current = modules[index];

  if (!current) {
    return <p className="py-16 text-center text-[#4A5B7A]">No modules match.</p>;
  }

  return (
    <div className="grid lg:grid-cols-[1fr_16rem] gap-10 items-start">
      <ol
        ref={list}
        className="mod-list"
        onMouseLeave={() => {
          hovering.current = false;
        }}
      >
        {modules.map((m, i) => {
          const Icon = icons[m.id];
          return (
            <li
              key={m.id}
              tabIndex={0}
              data-active={i === index}
              className="mod-row"
              onMouseEnter={() => {
                hovering.current = true;
                setActive(i);
              }}
              onFocus={() => setActive(i)}
            >
              <span className="mod-num">{m.number}</span>
              <h3 className="mod-title">{m.name}</h3>
              {Icon && <Icon className="mod-icon" />}
              <span className="mod-cat">{m.category}</span>
            </li>
          );
        })}
      </ol>

      <aside className="mod-side" aria-hidden="true">
        <span className="mod-side-num" key={current.id}>
          {current.number}
        </span>
        <span className="mod-side-total">/ {String(modules.length).padStart(2, "0")}</span>
        <span className="mod-side-cat">{current.category}</span>
      </aside>
    </div>
  );
}
