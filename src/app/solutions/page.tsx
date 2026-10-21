"use client";

import React, { useState } from "react";
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
  Search,
} from "lucide-react";
import FinalCtaSection from "@/components/FinalCtaSection";

const CATEGORIES = ["ALL MODULES", "BUSINESS", "OPERATIONS", "SUPPLY CHAIN", "FINANCE & PEOPLE", "ANALYTICS", "SYSTEM"];

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
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL MODULES");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const q = searchQuery.toLowerCase();
  const filteredModules = FEN1_MODULES.filter((mod) => {
    const matchesCat = selectedCategory === "ALL MODULES" || mod.category === selectedCategory;
    const matchesSearch =
      mod.name.toLowerCase().includes(q) ||
      mod.headline.toLowerCase().includes(q) ||
      mod.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="pt-20 pb-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">SOLUTIONS</span>
          <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">
            ENGINEERED FOR YOUR <br />
            EXACT OPERATIONS.
          </h1>
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
        <div className="py-8 bg-[#E3EEFC] border-y border-[#D0DCF0] sticky top-16 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs ${
                    selectedCategory === cat
                      ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-xs font-semibold"
                      : "bg-[#FFFFFF] text-[#0B1530] border-[#D0DCF0] hover:border-[#B8D4FB]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-[#4A5B7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D0DCF0] text-xs text-[#0B1530] placeholder:text-[#4A5B7A] outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((mod) => {
                const Icon = ICONS_MAP[mod.id] || Calculator;
                return (
                  <div
                    key={mod.id}
                    className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] hover:border-[#3B82F6] transition-all flex flex-col justify-between space-y-5 shadow-xs group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1B4FD6] font-semibold">{mod.number}</span>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#E3EEFC] text-[#4A5B7A]">{mod.category}</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] flex items-center justify-center text-[#0B1530]">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-[#0B1530] tracking-tight font-sans">{mod.name}</h3>
                        <span className="text-xs uppercase text-[#1B4FD6] block mt-1 font-semibold tracking-wide font-sans">{mod.headline}</span>
                      </div>

                      <p className="text-xs text-[#4A5B7A] leading-relaxed font-sans">{mod.description}</p>

                      <div className="space-y-1.5 pt-2 border-t border-[#D0DCF0]/60">
                        <span className="text-[10px] uppercase text-[#4A5B7A] font-semibold tracking-wider block font-sans">KEY SUBMODULES:</span>
                        <div className="space-y-1 text-xs text-[#0B1530] font-sans">
                          {mod.submodules.slice(0, 3).map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-[#4F7556] shrink-0" />
                              <span className="truncate">{sub}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </div>
  );
}
