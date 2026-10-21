"use client";

import React, { useState } from "react";
import {
  ChevronDown,
} from "lucide-react";
import { FAQS_DATA } from "@/lib/data";
import { formatCurrency, cn } from "@/lib/utils";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";

export default function ResourcesPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [demoOpen, setDemoOpen] = useState(false);

  // ROI Scrap Calculator State
  const [annualExtrusionSpend, setAnnualExtrusionSpend] = useState(2500000);
  const [currentScrapPercent, setCurrentScrapPercent] = useState(14);
  const [tenderCountPerYear, setTenderCountPerYear] = useState(80);

  // Dynamic calculations
  const targetScrapPercent = 3.4;
  const scrapReductionDelta = Math.max(0, currentScrapPercent - targetScrapPercent);
  const annualScrapDollarSavings = (annualExtrusionSpend * (scrapReductionDelta / 100));
  const timeSavedHoursPerYear = tenderCountPerYear * 18;

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="relative pt-12 pb-12 overflow-hidden border-b border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-2xl space-y-2">
          <span className="text-xs uppercase text-[#1B4FD6] tracking-widest font-mono block">
            Tools & Answers
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">
            Scrap ROI & FAQs
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5B7A]">
            Calculate your annual material scrap savings and review enterprise answers.
          </p>
        </div>
      </section>

      {/* ROI & Scrap Reduction Calculator */}
      <section id="roi" className="py-12 bg-[#D9E7FA] border-b border-[#D0DCF0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Inputs */}
              <div className="lg:col-span-6 space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#4A5B7A]">Annual Extrusion Spend:</span>
                    <span className="text-[#0B1530] font-medium">{formatCurrency(annualExtrusionSpend)}</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={15000000}
                    step={100000}
                    value={annualExtrusionSpend}
                    onChange={(e) => setAnnualExtrusionSpend(Number(e.target.value))}
                    className="w-full accent-[#0B1530] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#4A5B7A]">Current Scrap (%):</span>
                    <span className="text-[#0B1530] font-medium">{currentScrapPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={25}
                    step={0.5}
                    value={currentScrapPercent}
                    onChange={(e) => setCurrentScrapPercent(Number(e.target.value))}
                    className="w-full accent-[#1B4FD6] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#4A5B7A]">Annual Tenders:</span>
                    <span className="text-[#0B1530] font-medium">{tenderCountPerYear} Bids</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={5}
                    value={tenderCountPerYear}
                    onChange={(e) => setTenderCountPerYear(Number(e.target.value))}
                    className="w-full accent-[#0B1530] cursor-pointer"
                  />
                </div>
              </div>

              {/* Outputs */}
              <div className="lg:col-span-6 bg-[#F7FAFF] border border-[#D0DCF0] rounded-xl p-4 space-y-3 font-mono">
                <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0]">
                  <span className="text-[10px] text-[#7686A6] uppercase block">Material Saved Annually</span>
                  <span className="text-xl sm:text-2xl font-light text-[#0B1530] block mt-0.5">
                    {formatCurrency(annualScrapDollarSavings)} <span className="text-xs text-[#7686A6]">/ yr</span>
                  </span>
                  <span className="text-[11px] text-[#4A5B7A] block font-sans mt-0.5">
                    Scrap reduced to {targetScrapPercent}% with 1D nesting.
                  </span>
                </div>

                <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0]">
                  <span className="text-[10px] text-[#7686A6] uppercase block">Engineering Time Saved</span>
                  <span className="text-lg font-light text-[#0B1530] block mt-0.5">
                    {timeSavedHoursPerYear.toLocaleString()} Hours <span className="text-xs text-[#7686A6]">/ yr</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise FAQs */}
      <section id="faq" className="py-12 bg-[#F7FAFF]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-1">
            <span className="text-xs uppercase text-[#1B4FD6] tracking-widest font-mono">
              Q&A
            </span>
            <h2 className="text-2xl font-light text-[#0B1530] tracking-tight">
              Enterprise FAQs
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            {FAQS_DATA.slice(0, 4).map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-[#0B1530] hover:text-[#1B4FD6] transition-colors cursor-pointer"
                  >
                    <span className="font-normal text-xs sm:text-sm">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 shrink-0 transition-transform duration-200",
                        isOpen ? "rotate-180 text-[#0B1530]" : "text-[#7686A6]"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-0 text-[#4A5B7A] text-xs leading-relaxed border-t border-[#D0DCF0] font-sans">
                      {faq.a}
                    </div>
                  )}
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
