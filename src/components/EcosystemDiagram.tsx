"use client";

import React, { useState } from "react";
import { FEN1_MODULES } from "@/data/modules";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { name: "BUSINESS", desc: "CRM, Estimation, Tasks & Projects" },
  { name: "OPERATIONS", desc: "Survey, Design, Production, QA & Maintenance" },
  { name: "SUPPLY CHAIN", desc: "Procurement, Store Vault & Dispatch" },
  { name: "FINANCE & ANALYTICS", desc: "Account, HR, Employee Portal & Analytics" },
];

export default function EcosystemDiagram() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>("estimation");

  const selectedModule =
    FEN1_MODULES.find((m) => m.id === selectedModuleId) || FEN1_MODULES[2];

  return (
    <section className="py-20 bg-[#E3EEFC] border-b border-[#D0DCF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block font-semibold">
            PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight">
            EVERY FUNCTION. CONNECTED.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed font-sans">
            FEN1 operates as one integrated platform. Select any module to view its exact operational submodules and data handovers.
          </p>
        </div>

        {/* 2-Column Split View: Clear List on Left, Active Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Col: Clean Category-Grouped Module List (High contrast, no dark unreadable badges) */}
          <div className="lg:col-span-7 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEN1_MODULES.map((mod) => {
                const isSelected = mod.id === selectedModuleId;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`p-4 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      isSelected
                        ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-sm -translate-y-0.5"
                        : "bg-[#FFFFFF] text-[#0B1530] border-[#D0DCF0] hover:border-[#B8D4FB] hover:bg-[#FFFFFF]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] font-bold ${isSelected ? "text-[#CFE4FF]" : "text-[#1B4FD6]"}`}>
                        MODULE {mod.number}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-2 py-0.5 rounded font-semibold ${
                          isSelected
                            ? "bg-[#383838] text-[#0B1530]"
                            : "bg-[#E3EEFC] text-[#4A5B7A]"
                        }`}
                      >
                        {mod.category.split(" ")[0]}
                      </span>
                    </div>
                    <span className={`font-bold text-xs mt-2 block tracking-tight ${isSelected ? "text-[#0B1530]" : "text-[#0B1530]"}`}>
                      {mod.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Col: Active Module Detail Card */}
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-7 shadow-sm space-y-6">
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#1B4FD6] text-[#0B1530] text-[10px] font-bold">
                    MODULE {selectedModule.number}
                  </span>
                  <span className="text-[10px] text-[#1B4FD6] uppercase font-bold">
                    {selectedModule.category}
                  </span>
                </div>
                <span className="text-[10px] text-[#4F7556] font-bold">ACTIVE WORKFLOW</span>
              </div>

              <div>
                <h3 className="text-2xl font-light text-[#0B1530] font-sans tracking-tight">
                  {selectedModule.name}
                </h3>
                <span className="text-xs font-mono uppercase text-[#1B4FD6] block mt-1 font-semibold">
                  {selectedModule.headline}
                </span>
                <p className="text-xs text-[#4A5B7A] mt-2 font-sans leading-relaxed">
                  {selectedModule.description}
                </p>
              </div>

              {/* Submodules */}
              <div className="space-y-2 pt-2 border-t border-[#D0DCF0]">
                <span className="text-[10px] text-[#0B1530] uppercase tracking-wider block font-bold">
                  CORE CAPABILITIES & SUBMODULES:
                </span>
                <div className="space-y-1.5 font-mono text-xs text-[#0B1530]">
                  {selectedModule.submodules.slice(0, 4).map((sub, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7556] shrink-0" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Flow */}
              <div className="p-3.5 bg-[#E3EEFC] rounded-xl border border-[#D0DCF0] space-y-1 text-xs">
                <span className="text-[10px] text-[#1B4FD6] uppercase block font-bold">
                  CONNECTED DATA FLOW:
                </span>
                <p className="text-[11px] text-[#0B1530] font-sans leading-snug">
                  {selectedModule.dataFlow}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/solutions#modules"
                  className="text-xs font-bold text-[#0B1530] hover:text-[#1B4FD6] flex items-center gap-1.5 transition-colors"
                >
                  <span>View {selectedModule.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1B4FD6]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
