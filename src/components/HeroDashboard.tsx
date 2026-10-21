"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Layers, Factory, Truck, BarChart3, Users, CheckCircle2 } from "lucide-react";
import { FEN1_MODULES } from "@/data/modules";

const RAIL = [
  { id: "crm", Icon: Layers },
  { id: "estimation", Icon: Calculator },
  { id: "production", Icon: Factory },
  { id: "logistics", Icon: Truck },
  { id: "hr", Icon: Users },
  { id: "reports-analytics", Icon: BarChart3 },
] as const;

const BARS = [38, 62, 48, 80, 58, 92, 70, 86, 64, 98];

const EVENTS = ["Quotation sent", "Stock inward checked", "Cutting list sent to saw"];

export default function HeroDashboard() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  // Auto-demo: the cockpit cycles through departments
  useEffect(() => {
    const t = window.setInterval(() => setActive((a) => (a + 1) % RAIL.length), 3200);
    return () => window.clearInterval(t);
  }, []);

  const mod = FEN1_MODULES.find((m) => m.id === RAIL[active].id) ?? FEN1_MODULES[0];

  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    wrap.current?.style.setProperty("--px", "0");
    wrap.current?.style.setProperty("--py", "0");
  };

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="hero-dash relative mx-auto w-full max-w-[620px] py-8 lg:py-10"
      role="img"
      aria-label="Illustration of the FEN1 operations cockpit with sample data"
    >
      {/* floating workflow events */}
      <div className="hero-chip chip-a absolute -left-2 sm:-left-8 -top-3 z-20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#1B4FD6]" />
        <span className="text-sm font-semibold text-[#0B1530]">{EVENTS[0]}</span>
      </div>
      <div className="hero-chip chip-b absolute -right-2 sm:-right-6 bottom-24 z-20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#1B4FD6]" />
        <span className="text-sm font-semibold text-[#0B1530]">{EVENTS[1]}</span>
      </div>
      <div className="hero-chip chip-c absolute left-4 sm:left-10 -bottom-1 z-20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#1B4FD6]" />
        <span className="text-sm font-semibold text-[#0B1530]">{EVENTS[2]}</span>
      </div>

      {/* app window */}
      <div className="hero-window relative rounded-[28px] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#D0DCF0]/70">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D0DCF0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D0DCF0]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D0DCF0]" />
          <span className="ml-3 text-[11px] font-semibold text-[#4A5B7A] tracking-wide">FEN1 Operations cockpit</span>
          <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-[#7686A6]">Sample data</span>
        </div>
        <div className="flex">
          <div className="flex flex-col gap-2 p-3 border-r border-[#D0DCF0]/70">
            {RAIL.map(({ id, Icon }, i) => (
              <button
                key={id}
                onClick={() => setActive(i)}
                aria-label={FEN1_MODULES.find((m) => m.id === id)?.name ?? id}
                aria-pressed={i === active}
                className={`relative grid place-items-center w-10 h-10 rounded-xl transition-colors ${
                  i === active ? "text-[#1B4FD6]" : "text-[#7686A6] hover:text-[#0B1530]"
                }`}
              >
                {i === active && (
                  <motion.span
                    layoutId="railActive"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm border border-[#D0DCF0]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative w-[18px] h-[18px]" />
              </button>
            ))}
          </div>
          <div className="flex-1 p-5 sm:p-6 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="text-[10px] uppercase tracking-widest font-semibold text-[#1B4FD6]">{mod.category}</div>
                <div className="text-lg sm:text-xl font-semibold text-[#0B1530] mt-1 leading-tight">{mod.name}</div>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5">
                  {mod.sampleKpis.slice(0, 3).map((k) => (
                    <div key={k.label} className="rounded-2xl bg-white/70 border border-white px-3 py-3">
                      <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#4A5B7A] font-semibold leading-snug line-clamp-2 min-h-[2.2em]">
                        {k.label}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-[#0B1530] mt-1.5">{k.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex items-end gap-1.5 h-24" aria-hidden="true">
              {BARS.map((h, i) => (
                <span
                  key={i}
                  className="dash-bar flex-1 rounded-t-lg bg-gradient-to-t from-[#1B4FD6] to-[#5CC8FF]"
                  style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {mod.workflow.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-white/70 border border-white text-[10px] font-semibold text-[#4A5B7A]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
