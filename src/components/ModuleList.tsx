"use client";

import { useState, useSyncExternalStore } from "react";
import type { FEN1Module } from "@/data/modules";

/**
 * The module directory as a grid of small tiles, titles only. A tile fills with colour from the bottom when it is
 * hovered or focused, its icon turns,. Nothing in here is a link.
 */
// The shape is picked from the address (?shape=hex | card | tab | rows) so each can be reviewed on its own link.
const subscribe = () => () => {};
const SHAPES = ["hex", "card", "tab", "rows"];
function useShape(): string {
  const s = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get("shape") ?? "", () => "");
  return SHAPES.includes(s) ? s : "circle";
}

export default function ModuleList({ modules, icons }: { modules: FEN1Module[]; icons: Record<string, React.ComponentType<{ className?: string }>> }) {
  const [active, setActive] = useState<string | null>(null);
  const shape = useShape();

  return (
    <ul className="mod-grid" data-shape={shape} onMouseLeave={() => setActive(null)}>
      {modules.map((m) => {
        const Icon = icons[m.id];
        return (
          <li
            key={m.id}
            tabIndex={0}
            className="mod-tile"
            data-active={active === m.id}
            onMouseEnter={() => setActive(m.id)}
            onFocus={() => setActive(m.id)}
            onBlur={() => setActive(null)}
          >
            <span className="mod-tile-num">{m.number}</span>
            {Icon && <Icon className="mod-tile-icon" />}
            <h3 className="mod-tile-title">{m.name}</h3>
          </li>
        );
      })}
    </ul>
  );
}
