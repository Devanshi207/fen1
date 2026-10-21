"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import FinalCtaSection from "@/components/FinalCtaSection";

const TRACKS = [
  {
    num: "01",
    title: "Sales & Estimation",
    team: "Sales, estimators and management",
    topics: ["Enquiry & follow-ups", "Drawing review", "Estimation & takeoff", "Quotation"],
    desc: "Capture enquiries, track follow-ups and turn drawings into accurate quotations.",
  },
  {
    num: "02",
    title: "Survey & Design",
    team: "Site surveyors and design engineers",
    topics: ["Site survey on mobile", "Shop drawings", "Bills of material", "Cutting lists"],
    desc: "Record site measurements and produce approved drawings and cutting lists.",
  },
  {
    num: "03",
    title: "Purchase & Store",
    team: "Purchase and store teams",
    topics: ["Material purchase", "Store inward & checking", "Bar and off-cut stock", "Job work tracking"],
    desc: "Order material, receive it into the store and keep stock and outside work under control.",
  },
  {
    num: "04",
    title: "Production & QC",
    team: "Production managers, machine operators and QC",
    topics: ["Work orders", "Machine integration", "Assembly & glazing progress", "Quality checks"],
    desc: "Run the shop floor from work order to quality check with live progress.",
  },
  {
    num: "05",
    title: "Installation & Handover",
    team: "Site teams and project managers",
    topics: ["Dispatch & logistics", "Installation updates", "Snag tracking", "Handover records"],
    desc: "Deliver, install and hand over each job with a full record on site.",
  },
  {
    num: "06",
    title: "Accounts & Reports",
    team: "Accounts and management",
    topics: ["Job costing", "Billing", "Margin reports", "Role permissions"],
    desc: "Follow every job's cost and billing and review results in reports.",
  },
];

export default function TrainingPage() {
  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="pt-20 pb-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">TRAINING</span>
          <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">TRAINING FOR EVERY TEAM.</h1>
          <p className="text-sm sm:text-base text-[#4A5B7A] max-w-2xl mx-auto leading-relaxed font-sans">
            Role-based training that follows the FEN1 roadmap, from enquiry to handover.
          </p>
        </div>
      </section>

      {/* Tracks */}
      <section id="roles" className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRACKS.map((track) => (
              <div
                key={track.num}
                className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] hover:border-[#3B82F6] transition-all flex flex-col justify-between space-y-5 shadow-xs font-sans"
              >
                <div className="space-y-4">
                  <span className="text-[#1B4FD6] font-semibold text-[11px] uppercase tracking-wider block">TRACK {track.num}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-[#0B1530] tracking-tight font-sans">{track.title}</h2>
                    <span className="text-xs text-[#4A5B7A] block mt-1">{track.team}</span>
                  </div>
                  <p className="text-xs text-[#4A5B7A] leading-relaxed font-sans">{track.desc}</p>
                  <div className="p-3 bg-[#E3EEFC] rounded-xl text-xs text-[#0B1530] space-y-1 font-sans">
                    <span className="text-[10px] text-[#4A5B7A] uppercase block font-semibold">WHAT IT COVERS:</span>
                    {track.topics.map((t) => (
                      <div key={t} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-[#4F7556] shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </div>
  );
}
