"use client";

import Image from "next/image";
import { useRef } from "react";

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=75`;

const PHOTOS = [
  {
    src: U("photo-1745015446589-7ee6f702d8c1"),
    alt: "Glass-clad building exterior",
    tag: "01",
    title: "Architectural Glass",
    note: "Toughened, laminated and insulated glass",
    cls: "lg:col-span-5 lg:row-span-2 min-h-[380px] lg:min-h-0",
    pos: "object-[50%_30%]",
  },
  {
    src: U("photo-1727001496055-ba712f0c7f82"),
    alt: "Large production hall with machining lines",
    tag: "02",
    title: "Factory Floor",
    note: "CNC saws, nesting and live production status",
    cls: "lg:col-span-7 min-h-[260px]",
    pos: "object-center",
  },
  {
    src: U("photo-1759367973838-2ad5eabd1f28"),
    alt: "Slim metal-framed glass panels",
    tag: "03",
    title: "Windows & Doors",
    note: "Slim aluminium systems, priced to the millimetre",
    cls: "lg:col-span-4 min-h-[260px]",
    pos: "object-center",
  },
  {
    src: U("photo-1712319160624-8498ace8debe"),
    alt: "Sky seen through a glass roof structure",
    tag: "04",
    title: "Glass & IGUs",
    note: "Processing, tempering and dispatch",
    cls: "lg:col-span-3 min-h-[260px]",
    pos: "object-center",
  },
];

export default function PhotoShowcase() {
  const wrap = useRef<HTMLDivElement>(null);

  // Pointer parallax: each photo drifts a few pixels against the cursor
  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--px", x.toFixed(3));
    el.style.setProperty("--py", y.toFixed(3));
  };
  const onLeave = () => {
    wrap.current?.style.setProperty("--px", "0");
    wrap.current?.style.setProperty("--py", "0");
  };

  return (
    <section className="photo-showcase relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#1B4FD6]">
            Built for the fenestration industry
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
            FROM GLASS SHEET TO FINISHED WINDOW.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed">
            Every glass sheet, aluminium profile and site install runs through one connected system.
          </p>
        </div>

        <div
          ref={wrap}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="photo-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 gap-4 lg:gap-5 lg:h-[640px]"
        >
          {PHOTOS.map((p, i) => (
            <figure
              key={p.title}
              className={`photo-card group relative overflow-hidden rounded-[28px] ${p.cls}`}
              style={{ ["--i" as string]: i }}
            >
              <div className="photo-inner absolute -inset-5">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className={`object-cover ${p.pos}`}
                  priority={i === 0}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
              <figcaption className="photo-caption absolute left-4 bottom-4 sm:left-5 sm:bottom-5 w-fit max-w-[calc(100%-2rem)] rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#1B4FD6]">{p.tag}</span>
                <span className="min-w-0 pr-1">
                  <span className="block text-sm font-semibold text-[#0B1530] leading-tight">{p.title}</span>
                  <span className="block text-[11px] text-[#4A5B7A] leading-snug mt-0.5">{p.note}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-[#7686A6] tracking-wide">Photography via Unsplash</p>
      </div>
    </section>
  );
}
