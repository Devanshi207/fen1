"use client";

import { useEffect, useRef } from "react";
import { INDUSTRIAL_STAGES } from "@/lib/data";

export default function JourneyTimeline() {
  const box = useRef<HTMLDivElement>(null);

  // Scroll-driven progress line + lit nodes
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const probe = window.innerHeight * 0.55;
      const p = Math.min(Math.max((probe - r.top) / r.height, 0), 1);
      el.style.setProperty("--p", p.toFixed(4));
      el.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
        n.classList.toggle("on", n.getBoundingClientRect().top < probe);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = window.setInterval(update, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section-pad">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16 lg:mb-20 space-y-4">
          <span data-reveal="up" className="inline-block text-[11px] uppercase tracking-widest font-semibold text-[#1B4FD6]">
            Lead to installation
          </span>
          <h2 data-reveal="up" data-delay="80" className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
            FROM FIRST ENQUIRY TO FINAL HANDOVER.
          </h2>
          <p data-reveal="up" data-delay="160" className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed">
            {INDUSTRIAL_STAGES.length} connected stages. Each one hands clean data to the next.
          </p>
        </div>

        <div ref={box} className="journey relative">
          <div
            className="journey-line absolute top-0 bottom-0 left-[19px] lg:left-1/2 w-px -translate-x-1/2"
            aria-hidden="true"
          >
            <span className="journey-fill" />
          </div>
          <ol className="space-y-8 lg:space-y-12">
            {INDUSTRIAL_STAGES.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <li key={s.step} className="relative grid lg:grid-cols-2 lg:gap-24 pl-14 lg:pl-0">
                  <span
                    data-node
                    className="journey-node absolute left-[19px] lg:left-1/2 top-6 -translate-x-1/2 grid place-items-center w-10 h-10 rounded-full text-[11px] font-semibold"
                  >
                    {s.step}
                  </span>
                  <div
                    data-reveal={left ? "left" : "right"}
                    className={`journey-card rounded-3xl p-6 sm:p-7 ${
                      left ? "lg:col-start-1 lg:mr-6" : "lg:col-start-2 lg:ml-6"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-[#1B4FD6]">{s.title}</div>
                    <div className="font-display text-xl sm:text-2xl text-[#0B1530] mt-1.5 leading-snug">{s.subtitle}</div>
                    <p className="mt-2.5 text-sm text-[#4A5B7A] leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
