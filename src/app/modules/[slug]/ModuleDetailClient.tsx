"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { ModuleInfo, MODULES } from "@/lib/data";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";
import CadProfileViewer from "@/components/CadProfileViewer";

export default function ModuleDetailClient({ module }: { module: ModuleInfo }) {
  const [demoOpen, setDemoOpen] = useState(false);

  const nextModules = MODULES.filter((m) => m.id !== module.id).slice(0, 3);

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530]">
      {/* Module Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#D0DCF0]">
        <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono mb-6 text-[#7686A6]">
            <Link href="/" className="hover:text-[#0B1530]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/modules" className="hover:text-[#0B1530]">Modules</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0B1530] font-medium">{module.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
                {module.category} OS Module
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
                {module.name}
              </h1>

              <p className="text-base sm:text-lg text-[#1B4FD6] font-mono">
                {module.tagline}
              </p>

              <p className="text-sm sm:text-base text-[#4A5B7A] font-sans leading-relaxed">
                {module.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setDemoOpen(true)}
                  className="px-6 py-3 bg-[#1B4FD6] text-[#0B1530] font-normal text-xs uppercase tracking-wider rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Test in Live Sandbox</span>
                </button>
                <Link
                  href="/demo"
                  className="px-6 py-3 bg-[#FFFFFF] border border-[#D0DCF0] text-[#0B1530] font-normal text-xs uppercase tracking-wider rounded-full hover:bg-[#D9E7FA] transition-colors shadow-xs"
                >
                  Request Technical Consultation
                </Link>
              </div>
            </div>

            {/* Right KPI Card */}
            <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 font-mono shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D0DCF0]">
                <span className="text-[#0B1530] text-xs uppercase">Operational Impact Metrics</span>
                <span className="text-[#1B4FD6] text-[10px]">AUDITED ROI</span>
              </div>

              <div className="space-y-2.5">
                {module.kpis.map((kpi, i) => (
                  <div key={i} className="p-3 bg-[#F7FAFF] rounded-xl border border-[#D0DCF0] flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[10px] text-[#7686A6] uppercase block">{kpi.label}</span>
                      <span className="text-base font-medium text-[#0B1530] mt-0.5 block">{kpi.value}</span>
                    </div>
                    <span className="text-xs font-mono text-[#1B4FD6] px-2.5 py-1 rounded-full bg-[#FFFFFF] border border-[#D0DCF0]">
                      {kpi.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Stages Pipeline */}
      <section className="py-20 bg-[#D9E7FA] border-b border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest">
              Execution Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#0B1530] tracking-tight">
              {module.name} Workflow Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {module.workflowStages.map((stage, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex items-start gap-4 hover:border-[#3B82F6] transition-colors shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1B4FD6] flex items-center justify-center text-[#0B1530] shrink-0 text-xs">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#0B1530] mb-1">{stage}</h4>
                  <p className="text-[11px] text-[#4A5B7A] font-sans">
                    Automated sub-process linked to Fen1 data bus with zero manual handoffs.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Core Features */}
      <section className="py-20 bg-[#F7FAFF] border-b border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest">
              Industrial Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#0B1530] tracking-tight">
              Deep Industry Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {module.features.map((feat, i) => (
              <div
                key={i}
                className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex items-center gap-3 text-[#0B1530] shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1B4FD6] shrink-0" />
                <span className="text-sm font-sans text-[#0B1530]">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industrial Machine & Hardware Compatibility */}
      <section className="py-16 bg-[#D9E7FA] border-b border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase text-[#1B4FD6] block mb-1">
                Equipment & Protocol Support
              </span>
              <h3 className="text-xl font-light text-[#0B1530]">
                Compatible Machinery & Standards
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {module.industrialHardware.map((hw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#D0DCF0] text-xs font-mono text-[#0B1530] shadow-xs"
                >
                  {hw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Optional CAD Viewer on Engineering/Estimation */}
      {(module.id === "engineering" || module.id === "estimation") && (
        <section className="py-20 bg-[#F7FAFF] border-b border-[#D0DCF0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h3 className="text-2xl font-light text-[#0B1530]">
                Parametric CAD Profile Cross-Section
              </h3>
            </div>
            <CadProfileViewer />
          </div>
        </section>
      )}

      {/* Connected Next Modules */}
      <section className="py-20 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-light text-[#0B1530]">
              Connected Downstream Modules
            </h3>
            <Link href="/modules" className="text-xs font-mono text-[#0B1530] hover:text-[#1B4FD6] flex items-center gap-1 transition-colors">
              View All 18 Modules <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nextModules.map((nextMod) => (
              <Link
                key={nextMod.id}
                href={`/modules/${nextMod.slug}`}
                className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D0DCF0] hover:border-[#3B82F6] transition-all group block font-mono shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase text-[#7686A6]">{nextMod.category}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7686A6] group-hover:text-[#0B1530] group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-sm text-[#0B1530] group-hover:text-[#1B4FD6] transition-colors">
                  {nextMod.name}
                </h4>
                <p className="text-[11px] text-[#4A5B7A] font-sans line-clamp-1 mt-1">
                  {nextMod.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <InteractiveLiveDemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        initialTab={module.id === "crm" ? "crm" : module.id === "production" ? "factory" : module.id === "inventory" ? "inventory" : "estimation"}
      />
    </div>
  );
}
