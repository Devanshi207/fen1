"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import { INTEGRATIONS_LIST } from "@/lib/data";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";

export default function IntegrationsPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530]">
      {/* Header */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-[#D0DCF0]">
        <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
              Machinery & Enterprise Bridges
            </span>
            <h1 className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight">
              Machinery & Enterprise Integrations
            </h1>
            <p className="text-sm sm:text-base text-[#4A5B7A] font-sans leading-relaxed">
              Fen1 connects directly to double-miter saws, 4-axis machining centers, BIM Revit models, laser survey scanners, and financial ledgers.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Directory Grid */}
      <section className="py-16 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTEGRATIONS_LIST.map((integ, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl hover:border-[#3B82F6] transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#D9E7FA] text-[#4A5B7A]">
                      {integ.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-normal text-[#0B1530] group-hover:text-[#1B4FD6] transition-colors">
                      {integ.name}
                    </h3>
                    <p className="text-xs text-[#4A5B7A] font-sans mt-1.5 leading-relaxed">
                      {integ.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-[#D0DCF0] flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#7686A6]">Protocol:</span>
                  <span className="text-[#0B1530]">Live Webhook / OPC</span>
                </div>
              </div>
            ))}
          </div>

          {/* Custom API & OPC-UA Gateway Section */}
          <div className="mt-12 p-6 sm:p-8 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center lg:text-left">
              <span className="text-xs font-mono uppercase text-[#1B4FD6]">
                Custom Machine Protocols?
              </span>
              <h3 className="text-lg font-light text-[#0B1530]">
                Developer REST API & Edge IoT Connector SDK
              </h3>
              <p className="text-xs text-[#4A5B7A] font-sans max-w-2xl">
                Need to stream telemetry to bespoke factory PLCs or in-house engineering tools? Fen1 offers high-throughput WebSocket & REST endpoints.
              </p>
            </div>
            <Link
              href="/resources#api"
              className="px-6 py-2.5 bg-[#1B4FD6] text-[#0B1530] font-normal text-xs uppercase tracking-wider rounded-full hover:bg-[#BFD3F0] transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <span>Explore Developer Docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
