"use client";

import { useState } from "react";
import type { FEN1Module } from "@/data/modules";

/**
 * The module directory as a grid of small tiles, titles only. A tile fills with colour from the bottom when it is
 * hovered or focused, its icon turns, and the neighbours step back. Nothing in here is a link.
 */
export default function ModuleList({ modules, icons }: { modules: FEN1Module[]; icons: Record<string, React.ComponentType<{ className?: string }>> }) {
  const [active, setActive] = useState<string | null>(null);

  if (modules.length === 0) {
    return <p className="py-16 text-center text-[#4A5B7A]">No modules match.</p>;
  }

  return (
    <ul className="mod-grid" onMouseLeave={() => setActive(null)}>
      {modules.map((m) => {
        const Icon = icons[m.id];
        return (
          <li
            key={m.id}
            tabIndex={0}
            className="mod-tile"
            data-active={active === m.id}
            data-dim={active !== null && active !== m.id}
            onMouseEnter={() => setActive(m.id)}
            onFocus={() => setActive(m.id)}
            onBlur={() => setActive(null)}
          >
            <span className="mod-tile-num">{m.number}</span>
            {Icon && <Icon className="mod-tile-icon" />}
            <h3 className="mod-tile-title">{m.name}</h3>
            <span className="mod-tile-cat">{m.category}</span>
          </li>
        );
      })}
    </ul>
  );
}
