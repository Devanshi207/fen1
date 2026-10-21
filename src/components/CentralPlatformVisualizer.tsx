"use client";

import React, { useState } from "react";
import {
  Calculator,
  Target,
  Ruler,
  ShoppingBag,
  Boxes,
  Factory,
  CheckSquare,
  Truck,
  Building,
  CreditCard,
  Users,
  BarChart3,
  Layers,
  ArrowRight,
} from "lucide-react";
import { MODULES, ModuleInfo } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICONS_MAP: { [key: string]: React.ElementType } = {
  Calculator,
  Target,
  Ruler,
  ShoppingBag,
  Boxes,
  Factory,
  Truck,
  Building,
  CreditCard,
  Users,
  BarChart3,
  CheckSquare,
};

export default function CentralPlatformVisualizer() {
  const [selectedModule, setSelectedModule] = useState<ModuleInfo>(MODULES[0]);

  const ActiveIcon = ICONS_MAP[selectedModule.iconName] || Layers;

  return (
    <section className="py-20 bg-[#F7FAFF] text-[#4A5B7A] relative overflow-hidden border-b border-[#D0DCF0] font-sans">
      {/* Subtle background CAD grid */}
      <div className="absolute inset-0 bg-cad-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
            The Connected Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-light text-[#0B1530] tracking-tight">
            One Platform. Every Operation.
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5B7A]">
            Select any module to inspect real-time data flows across the enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Grid: Module Selector Matrix */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MODULES.map((mod) => {
              const isSelected = selectedModule.id === mod.id;
              const ModIcon = ICONS_MAP[mod.iconName] || Layers;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all duration-300 relative group flex flex-col justify-between h-28",
                    isSelected
                      ? "bg-[#FFFFFF] border-[#3B82F6] shadow-xs z-10"
                      : "bg-[#D9E7FA] border-[#D0DCF0] hover:border-[#3B82F6] hover:bg-[#FFFFFF]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center border transition-colors",
                      isSelected
                        ? "bg-[#1B4FD6] border-[#3B82F6] text-[#0B1530]"
                        : "bg-[#FFFFFF] border-[#D0DCF0] text-[#4A5B7A] group-hover:text-[#0B1530]"
                    )}>
                      <ModIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#C9DCF5] text-[#4A5B7A]">
                      {mod.category}
                    </span>
                  </div>
                  <div>
                    <div className={cn(
                      "text-xs leading-tight",
                      isSelected ? "text-[#0B1530] font-medium" : "text-[#0B1530]"
                    )}>
                      {mod.name}
                    </div>
                    <div className="text-[10px] text-[#7686A6] line-clamp-1 mt-0.5">
                      {mod.tagline}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Preview Card: Live Telemetry & Cross-Module Data Bus */}
          <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-8 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4FD6] flex items-center justify-center text-[#0B1530] shadow-xs">
                  <ActiveIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#1B4FD6]">
                    Category: {selectedModule.category}
                  </span>
                  <h3 className="text-xl font-light text-[#0B1530] tracking-tight">
                    {selectedModule.name}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-[#7686A6]">
                ID: {selectedModule.id.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-[#4A5B7A] mb-6 leading-relaxed">
              {selectedModule.description}
            </p>

            {/* Live Module KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedModule.kpis.map((kpi, i) => (
                <div key={i} className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] font-mono">
                  <span className="text-[10px] text-[#7686A6] uppercase block truncate">
                    {kpi.label}
                  </span>
                  <span className="text-sm font-normal text-[#0B1530] mt-1 block">
                    {kpi.value}
                  </span>
                  <span className="text-[10px] text-[#1B4FD6] block mt-0.5">
                    {kpi.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-[#4A5B7A] flex items-center gap-1.5">
                Auto-syncs with 17 other modules
              </div>
              <a
                href={`/modules/${selectedModule.slug}`}
                className="px-4 py-2 rounded-full bg-[#1B4FD6] text-[#0B1530] font-normal text-xs uppercase tracking-wide hover:bg-[#BFD3F0] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Deep-Dive Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
