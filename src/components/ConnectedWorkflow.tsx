"use client";

import React, { useState } from "react";
import { FEN1_LIFECYCLE_WORKFLOW } from "@/data/workflows";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ConnectedWorkflow() {
  const [activeStepId, setActiveStepId] = useState<string>("estimation");

  const currentStep =
    FEN1_LIFECYCLE_WORKFLOW.find((s) => s.id === activeStepId) ||
    FEN1_LIFECYCLE_WORKFLOW[2];

  return (
    <section className="py-16 bg-[#F2F7FF] border-b border-[#D0DCF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block font-bold">
            CONTINUOUS LIFECYCLE
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-[#0B1530] tracking-tight">
            ONE BUSINESS. ONE CONNECTED SYSTEM.
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5B7A] leading-relaxed font-sans">
            Connect every stage of your operations without disconnected tools or manual re-entry.
          </p>
        </div>

        {/* 16-Step Grid: Clean, Light, No abbreviations/tags, No black background */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs">
          {FEN1_LIFECYCLE_WORKFLOW.map((step) => {
            const isActive = step.id === activeStepId;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between min-h-[68px] ${
                  isActive
                    ? "bg-[#E3EEFC] text-[#0B1530] border-[#3B82F6] shadow-xs ring-1 ring-[#3B82F6]"
                    : "bg-[#FFFFFF] text-[#0B1530] border-[#D0DCF0] hover:border-[#B8D4FB] hover:bg-[#E3EEFC]"
                }`}
              >
                <span className={`text-[10px] font-bold ${isActive ? "text-[#1B4FD6]" : "text-[#4A5B7A]"}`}>
                  {step.stepNumber}
                </span>
                <span className="text-xs font-bold block mt-1 tracking-tight text-[#0B1530]">
                  {step.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Clean Detail Card (Light, High-Contrast, No Black Boxes) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left: Step Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E3EEFC] text-[#1B4FD6] font-bold border border-[#D0DCF0]">
                  STEP {currentStep.stepNumber}
                </span>
                <span className="text-[#0B1530] font-bold">
                  {currentStep.name}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#4A5B7A] leading-relaxed font-sans">
                {currentStep.description}
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase text-[#1B4FD6] tracking-wider block font-bold">
                  DELIVERABLES:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {currentStep.keyOutputs.map((output, oIdx) => (
                    <div
                      key={oIdx}
                      className="px-2.5 py-1 bg-[#E3EEFC] rounded-md border border-[#D0DCF0] flex items-center gap-1.5 text-[#0B1530]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7556] shrink-0" />
                      <span>{output}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Module Link */}
            <div className="lg:col-span-5 bg-[#E3EEFC] border border-[#D0DCF0] rounded-xl p-5 space-y-3 font-mono text-xs">
              <span className="text-[10px] text-[#1B4FD6] uppercase block font-bold">
                OPERATIONAL MODULE:
              </span>
              <h4 className="text-base font-bold text-[#0B1530] font-sans">
                {currentStep.moduleName}
              </h4>
              <p className="text-xs text-[#4A5B7A] font-sans">
                Fully synchronized with inventory, machine cutting queues, and project accounts.
              </p>
              <div className="pt-2">
                <Link
                  href="/solutions#modules"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0B1530] hover:text-[#1B4FD6] font-bold transition-colors"
                >
                  <span>Explore {currentStep.moduleName} Module</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#1B4FD6]" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
