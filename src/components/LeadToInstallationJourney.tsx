"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Calculator,
  Target,
  FileCheck,
  Ruler,
  ShoppingBag,
  Factory,
  CheckSquare,
  Truck,
  Building,
  CreditCard,
  BarChart3,
  Boxes,
  ShieldCheck,
} from "lucide-react";
import { INDUSTRIAL_STAGES } from "@/lib/data";
import { cn } from "@/lib/utils";

const STAGE_ICONS: { [key: string]: React.ElementType } = {
  LEAD: Target,
  ENQUIRY: Target,
  ESTIMATION: Calculator,
  "SALES ORDER": ShieldCheck,
  SURVEY: Ruler,
  DESIGN: Ruler,
  PROJECT: Building,
  STORE: Boxes,
  ACCOUNT: CreditCard,
  "FOLLOW-UPS": Target,
  DRAWING: Ruler,
  PURCHASE: ShoppingBag,
  "JOB WORK": Factory,
  QC: CheckSquare,
  HANDOVER: ShieldCheck,
  ESTIMATE: Calculator,
  QUOTATION: FileCheck,
  ORDER: ShieldCheck,
  ENGINEERING: Ruler,
  PROCUREMENT: ShoppingBag,
  INVENTORY: Boxes,
  PRODUCTION: Factory,
  QUALITY: CheckSquare,
  LOGISTICS: Truck,
  INSTALLATION: Building,
  PAYMENT: CreditCard,
  ANALYTICS: BarChart3,
};

export default function LeadToInstallationJourney() {
  const [selectedStage, setSelectedStage] = useState(INDUSTRIAL_STAGES[0]);

  const IconComponent = STAGE_ICONS[selectedStage.title] || Target;

  return (
    <section className="py-20 bg-[#EDF1E6] text-[#7686A6] relative overflow-hidden border-t border-b border-[#D5DFCB]">
      <div className="absolute inset-0 bg-cad-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-mono uppercase text-[#7686A6] tracking-widest block">
            End-to-End Operational Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#151718] tracking-tight">
            From First Lead to Final Installation
          </h2>
          <p className="text-sm sm:text-base text-[#7686A6] leading-relaxed font-sans">
            Every department operates on the exact same live dimensional data. No broken handoffs between estimation, engineering, factory machines, and site crane hoists.
          </p>
        </div>

        {/* Horizontal Scrollable Stages Bar */}
        <div className="relative mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex items-center gap-3 min-w-[1200px]">
            {INDUSTRIAL_STAGES.map((stage, idx) => {
              const isSelected = selectedStage.title === stage.title;
              const StepIcon = STAGE_ICONS[stage.title] || Target;
              return (
                <div key={stage.step} className="flex items-center">
                  <button
                    onClick={() => setSelectedStage(stage)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all duration-300 w-44 shrink-0 relative group",
                      isSelected
                        ? "bg-[#FFFFFF] border-[#151718] shadow-xs"
                        : "bg-[#FFFFFF] border-[#D5DFCB] hover:border-[#151718]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-[10px] font-mono",
                        isSelected ? "text-[#151718] font-medium" : "text-[#7686A6]"
                      )}>
                        {stage.step}
                      </span>
                      <StepIcon className={cn(
                        "w-4 h-4 transition-colors",
                        isSelected ? "text-[#151718]" : "text-[#7686A6] group-hover:text-[#151718]"
                      )} />
                    </div>
                    <div className={cn(
                      "text-xs uppercase tracking-wider font-mono",
                      isSelected ? "text-[#151718] font-medium" : "text-[#7686A6]"
                    )}>
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-[#7686A6] truncate mt-0.5 font-sans">
                      {stage.subtitle}
                    </div>
                  </button>

                  {idx < INDUSTRIAL_STAGES.length - 1 && (
                    <div className="px-1 text-[#DCE0D9]">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Interactive Deep-Dive Preview */}
        <div className="bg-[#FFFFFF] border border-[#D5DFCB] rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF1E6] border border-[#D5DFCB] text-xs font-mono text-[#7686A6]">
                <span>STAGE {selectedStage.step} OF 13</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-[#151718] tracking-tight">
                {selectedStage.title}: {selectedStage.subtitle}
              </h3>
              <p className="text-sm text-[#7686A6] leading-relaxed font-sans">
                {selectedStage.desc}
              </p>

              <div className="pt-2 space-y-2 text-xs font-mono text-[#151718]">
                <div className="flex items-center gap-2">
                  <span>Real-time bidirectional synchronization with ERP ledgers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Direct machine-readable G-Code & PDF documentation output</span>
                </div>
              </div>
            </div>

            {/* Right Mini Interface Preview Card */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D5DFCB] rounded-xl p-6 shadow-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5DFCB] mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-[#7686A6]" />
                  <span className="text-[#151718] uppercase font-medium">{selectedStage.title} CONTROL CONSOLE</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF1E6] text-[#151718] border border-[#D5DFCB]">
                  STATUS: LIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#D5DFCB] shadow-xs">
                  <span className="text-[10px] text-[#7686A6] uppercase block">Active Work Order</span>
                  <span className="text-[#151718] font-medium mt-1 block text-sm">WO-2026-F981</span>
                  <span className="text-[10px] text-[#7686A6]">Sapphire Tower Glazing</span>
                </div>
                <div className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#D5DFCB] shadow-xs">
                  <span className="text-[10px] text-[#7686A6] uppercase block">Throughput Yield</span>
                  <span className="text-[#151718] font-medium mt-1 block text-sm">99.4% Pass Rate</span>
                  <span className="text-[10px] text-[#7686A6]">0.6% Tolerance Var</span>
                </div>
              </div>

              <div className="p-4 bg-[#FFFFFF] rounded-lg border border-[#D5DFCB] space-y-2 text-xs shadow-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#7686A6]">Sub-process Execution</span>
                  <span className="text-[#151718] font-medium">100% Synced</span>
                </div>
                <div className="w-full bg-[#EDF1E6] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1B4FD6] h-full rounded-full w-4/5" />
                </div>
                <div className="flex justify-between text-[10px] text-[#7686A6]">
                  <span>Downstream: {selectedStage.title} → PRODUCTION</span>
                  <span>Latency: 18ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
