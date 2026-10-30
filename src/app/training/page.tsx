"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import KineticHeading from "@/components/KineticHeading";
import { TRACKS } from "@/data/trainingContent";
import { useHorizontalLayout } from "@/lib/horizontal";
import HorizontalTraining from "@/components/horizontal/HorizontalTraining";

export default function TrainingPage() {
  // Layout under review: ?layout=horizontal shows this page as a sideways journey (see lib/horizontal)
  const horizontal = useHorizontalLayout();
  if (horizontal) return <HorizontalTraining />;

  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="pt-20 pb-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">TRAINING</span>
          <KineticHeading text={"TRAINING FOR EVERY TEAM."} className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight" />
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
                  <div>
                    <h2 className="text-xl font-semibold text-[#0B1530] tracking-tight font-sans">{track.title}</h2>
                    <span className="text-xs text-[#4A5B7A] block mt-1">{track.team}</span>
                  </div>
                  <div className="p-3 bg-[#E3EEFC] rounded-xl text-xs text-[#0B1530] space-y-1 font-sans">
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
    </div>
  );
}
