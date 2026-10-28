"use client";

import React from "react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { FEN1_MODULES } from "@/data/modules";
import {
  CheckCircle2,
  CheckSquare,
  Layers,
  Calculator,
  Scan,
  Compass,
  Building2,
  ShoppingCart,
  Boxes,
  Factory,
  Wrench,
  ShieldCheck,
  Truck,
  CreditCard,
  Users,
  UserCheck,
  Settings,
  BarChart3,
} from "lucide-react";
import FinalCtaSection from "@/components/FinalCtaSection";
import KineticHeading from "@/components/KineticHeading";
import ModuleList from "@/components/ModuleList";

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "task-management": CheckSquare,
  crm: Layers,
  estimation: Calculator,
  survey: Scan,
  design: Compass,
  "project-management": Building2,
  "purchase-management": ShoppingCart,
  store: Boxes,
  production: Factory,
  maintenance: Wrench,
  "quality-control": ShieldCheck,
  logistics: Truck,
  account: CreditCard,
  hr: Users,
  ess: UserCheck,
  "admin-settings": Settings,
  "reports-analytics": BarChart3,
};

export default function SolutionsPage() {
  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="pt-20 pb-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">SOLUTIONS</span>
          <KineticHeading text={"ENGINEERED FOR YOUR\nEXACT OPERATIONS."} className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight" />
          <p className="text-sm sm:text-base text-[#4A5B7A] max-w-2xl mx-auto leading-relaxed font-sans">
            FEN1 is built for glass processing plants, aluminium window fabricators, glazing contractors and dealer networks, with every module you need in one system.
          </p>
        </div>
      </section>

      {/* Industry verticals */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <span className="text-xs font-sans uppercase text-[#4A5B7A] tracking-widest block font-semibold">INDUSTRY VERTICALS</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRY_SOLUTIONS.map((sol) => (
              <div
                key={sol.id}
                id={sol.id}
                className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] hover:border-[#3B82F6] transition-all flex flex-col justify-between space-y-5 shadow-xs scroll-mt-24 font-sans"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#1B4FD6] font-semibold text-[11px] uppercase tracking-wider">VERTICAL {sol.number}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#E3EEFC] text-[#4A5B7A] font-semibold">SPECIALIZATION</span>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-[#0B1530] tracking-tight font-sans">{sol.title}</h2>
                    <span className="text-xs text-[#1B4FD6] block mt-0.5 font-semibold">{sol.subtitle}</span>
                  </div>

                  <p className="text-xs text-[#4A5B7A] leading-relaxed font-sans">{sol.challenge}</p>

                  <div className="p-3 bg-[#E3EEFC] rounded-xl space-y-1 text-xs font-sans">
                    <span className="text-[10px] uppercase text-[#4F7556] block font-semibold">FEN1 SOLUTION:</span>
                    <p className="text-[#0B1530] text-xs leading-snug">{sol.solutionSummary}</p>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs text-[#0B1530] font-sans">
                    {sol.keyBenefits.slice(0, 2).map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7556] shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules (previously the Products page) */}
      <section id="modules" className="scroll-mt-20">
        <div className="pt-16 pb-2 border-t border-[#D0DCF0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1B4FD6]">Modules</h2>
          </div>
        </div>

        <div className="pt-6 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ModuleList modules={FEN1_MODULES} icons={ICONS_MAP} />
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </div>
  );
}
