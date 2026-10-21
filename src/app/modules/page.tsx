"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
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
  ArrowRight,
  Search,
  Sliders,
  Layers,
} from "lucide-react";
import { MODULES, MODULE_CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";

const ICON_MAP: { [key: string]: React.ElementType } = {
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

export default function ModulesExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  const filteredModules = MODULES.filter((mod) => {
    const matchesCategory = selectedCategory === "all" || mod.category === selectedCategory;
    const matchesSearch =
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530]">
      {/* Header */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-[#D0DCF0]">
        <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
              The Fen1 Modular Matrix
            </span>
            <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">
              Connected Operational Modules
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5B7A] font-sans leading-relaxed max-w-2xl mx-auto">
              Engineered specifically for architectural glass processors, aluminium fabricators, and glazing contractors.
            </p>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="mt-8 max-w-3xl mx-auto space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7686A6] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search modules (e.g. cut list, CNC saw, wind load, BIM, off-cuts)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FFFFFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none text-xs font-mono shadow-xs"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-3.5 py-1 rounded-full text-xs font-mono transition-all border",
                  selectedCategory === "all"
                    ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-xs"
                    : "bg-[#FFFFFF] border-[#D0DCF0] text-[#4A5B7A] hover:text-[#0B1530]"
                )}
              >
                All ({MODULES.length})
              </button>
              {MODULE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1 rounded-full text-xs font-mono transition-all border capitalize",
                    selectedCategory === cat.id
                      ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-xs"
                      : "bg-[#FFFFFF] border-[#D0DCF0] text-[#4A5B7A] hover:text-[#0B1530]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-12 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredModules.map((mod) => {
              const ModIcon = ICON_MAP[mod.iconName] || Layers;
              return (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D0DCF0] hover:border-[#3B82F6] transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-[#D9E7FA] border border-[#D0DCF0] flex items-center justify-center text-[#4A5B7A] group-hover:bg-[#1B4FD6] group-hover:text-[#0B1530] group-hover:border-[#3B82F6] transition-all shadow-xs">
                        <ModIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#D9E7FA] text-[#4A5B7A]">
                        {mod.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-normal text-[#0B1530] tracking-tight">
                        {mod.name}
                      </h3>
                      <p className="text-[11px] text-[#4A5B7A] font-sans line-clamp-2 mt-0.5">
                        {mod.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#D0DCF0] flex items-center justify-between">
                    <button
                      onClick={() => setDemoOpen(true)}
                      className="text-xs font-mono text-[#4A5B7A] hover:text-[#0B1530] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3 text-[#1B4FD6]" /> Simulate
                    </button>
                    <Link
                      href={`/modules/${mod.slug}`}
                      className="text-xs font-mono text-[#0B1530] flex items-center gap-1 hover:text-[#1B4FD6] transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
