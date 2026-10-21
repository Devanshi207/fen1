"use client";

import React from "react";
import { XCircle } from "lucide-react";
import FinalCtaSection from "@/components/FinalCtaSection";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

const PROBLEMS = [
  { n: "01", name: "Excel Spreadsheets", issue: "Enquiries, follow-ups and estimates live in files that only one person understands." },
  { n: "02", name: "WhatsApp & Paper Slips", issue: "Site measurements and snag photos get lost between the site and the design office." },
  { n: "03", name: "Standalone Machine Software", issue: "Operators re-type dimensions into saws, risking miscuts and wasted profile." },
  { n: "04", name: "Separate Accounting Tools", issue: "Finance cannot see job costs or billing status until the month ends." },
  { n: "05", name: "Manual Purchasing", issue: "Orders are placed without knowing which stock and off-cuts are already in the store." },
  { n: "06", name: "Untracked Production", issue: "There is no live view of which jobs are cut, assembled, glazed or ready to ship." },
];

const PRINCIPLES = [
  {
    label: "ENQUIRY TO DRAWINGS",
    title: "One record from the first call",
    text: "Enquiry, follow-ups, drawings, estimation and quotation stay in one record, and the survey and design teams pick up from it.",
  },
  {
    label: "STORE TO SHOP FLOOR",
    title: "Stock and machines connected",
    text: "Purchase, store and job work feed production, and machine integration sends cutting lists straight to the saws.",
  },
  {
    label: "QC TO HANDOVER",
    title: "Every job closed properly",
    text: "Quality checks, installation and handover are recorded on the same job, ready for billing and reports.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="pt-20 pb-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">
            ABOUT FEN1
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">
            AN ERP BUILT AROUND <br />
            GLASS, ALUMINIUM & WINDOWS.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5B7A] max-w-2xl mx-auto leading-relaxed font-sans">
            FEN1 runs the whole job in one system, from the first enquiry to final handover.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="py-20 bg-[#E3EEFC] border-y border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-sans uppercase text-[#A85E55] tracking-widest block font-semibold">
              WITHOUT ONE SYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#0B1530]">Disconnected Tools Drain Efficiency.</h2>
            <p className="text-sm text-[#4A5B7A] leading-relaxed font-sans">
              When sales, design, purchase, store, production and site teams use separate tools, data is re-entered, errors compound and margins leak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans text-xs">
            {PROBLEMS.map((item) => (
              <div key={item.n} className="p-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl space-y-3 shadow-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4A5B7A] font-semibold">{item.n}</span>
                  <XCircle className="w-4 h-4 text-[#A85E55]" />
                </div>
                <h3 className="text-base font-semibold text-[#0B1530] font-sans">{item.name}</h3>
                <p className="text-xs text-[#4A5B7A] font-sans leading-relaxed">{item.issue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The FEN1 answer */}
      <section id="philosophy" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">
              THE FEN1 WAY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight">ONE CONNECTED SYSTEM.</h2>
            <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed font-sans">
              FEN1 follows the way the work actually flows, so every team starts from the previous team&apos;s data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {PRINCIPLES.map((p) => (
              <div key={p.label} className="p-8 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl space-y-4 shadow-xs">
                <span className="text-xs font-sans text-[#1B4FD6] font-semibold block uppercase tracking-wider">{p.label}</span>
                <h3 className="text-xl font-semibold text-[#0B1530]">{p.title}</h3>
                <p className="text-xs sm:text-sm text-[#4A5B7A] leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <span className="text-xs font-sans uppercase text-[#4A5B7A] tracking-widest block font-semibold">BUILT FOR</span>
            <div className="flex flex-wrap gap-2.5">
              {INDUSTRY_SOLUTIONS.map((s) => (
                <span key={s.id} className="rounded-full bg-[#FFFFFF] border border-[#D0DCF0] px-5 py-2.5 text-xs font-semibold text-[#0B1530]">
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </div>
  );
}
