"use client";

import { useEffect, useState } from "react";
import { currentChapter } from "@/lib/chapters";

interface Chapter {
  id: string;
  label: string;
}

/**
 * A slim rail of dots down the right edge, one per page chapter (`[data-chapter]`), like the timeline on the
 * Weglot page. The current chapter is highlighted and any dot jumps to its chapter. Desktop only.
 */
export default function ChapterRail() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"))
      .filter((el) => el.id)
      .map((el) => ({ id: el.id, label: el.dataset.chapter ?? el.id }));
    // Collecting the chapters needs the rendered page, so it can only happen after mount.
    queueMicrotask(() => setChapters(found));

    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      const tops = found.map((c) => {
        const r = document.getElementById(c.id)!.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      });
      setActive(currentChapter(tops, mid));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (chapters.length < 2) return null;

  return (
    <nav aria-label="Page chapters" className="chapter-rail">
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-label={c.label}
              aria-current={i === active ? "true" : undefined}
              className={i === active ? "is-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span className="chapter-label">{c.label}</span>
              <span className="chapter-dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
