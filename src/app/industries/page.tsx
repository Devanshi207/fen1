"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { INDUSTRIES_DATA } from "@/lib/data";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";

export default function IndustriesPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="relative pt-12 pb-12 overflow-hidden border-b border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-2xl space-y-2">
          <span className="text-xs uppercase text-[#1B4FD6] tracking-widest font-mono block">
            Specialized Verticals
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">
            Industry Solutions
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5B7A]">
            Engineered specifically for architectural glass, aluminium fabrication, and window manufacturing.
          </p>
        </div>
      </section>

      {/* Industry Verticals Grid */}
      <section className="py-12 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDUSTRIES_DATA.map((ind, idx) => (
              <div
                key={ind.id}
                id={ind.slug}
                className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#3B82F6] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#1B4FD6]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D9E7FA] text-[#4A5B7A]">
                      SPECIALIZED
                    </span>
                  </div>

                  <h2 className="text-xl font-normal text-[#0B1530] tracking-tight">
                    {ind.title}
                  </h2>

                  <p className="text-xs text-[#4A5B7A] leading-relaxed">
                    {ind.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-2 text-xs">
                    {ind.fen1Solution.slice(0, 2).map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#0B1530]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4FD6] shrink-0" />
                        <span className="truncate">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D0DCF0] flex items-center justify-between">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    {ind.metrics.slice(0, 2).map((m, i) => (
                      <span key={i} className="text-[#4A5B7A]">
                        <span className="text-[#0B1530] font-medium">{m.value}</span> {m.label}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="px-3.5 py-1.5 bg-[#1B4FD6] text-[#0B1530] font-normal text-xs uppercase tracking-wide rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Simulate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InteractiveLiveDemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </div>
  );
}
