"use client";

import React, { useState } from "react";
import { FEN1_ROLES } from "@/data/roles";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RoleBasedExplorer() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("ceo");

  const activeRole =
    FEN1_ROLES.find((r) => r.id === selectedRoleId) || FEN1_ROLES[0];

  return (
    <section className="py-20 bg-[#E3EEFC] border-b border-[#D0DCF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">
            ROLE-BASED WORKFLOWS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight">
            FEN1 ADAPTS TO EVERY ROLE.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed font-sans">
            Tailored workspaces for every stakeholder across engineering, factory floor, project delivery, and executive leadership.
          </p>
        </div>

        {/* Responsive Role Buttons (No horizontal scroll) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {FEN1_ROLES.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`px-4 py-2 rounded-full text-xs font-sans transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-xs font-semibold"
                    : "bg-[#FFFFFF] text-[#0B1530] border-[#D0DCF0] hover:border-[#B8D4FB] hover:bg-[#E3EEFC]"
                }`}
              >
                <span>{role.roleTitle.split("&")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Detailed Workspace Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans"
          >
            {/* Left Col: Role Profile & Key Responsibilities */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#E3EEFC] text-[#1B4FD6] font-sans text-[11px] font-semibold border border-[#D0DCF0]">
                    {activeRole.department.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-[#0B1530] tracking-tight">
                  {activeRole.roleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5B7A] leading-relaxed font-sans">
                  {activeRole.tagline}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-wider block font-semibold">
                  PRIMARY RESPONSIBILITIES:
                </span>
                <div className="space-y-2 text-xs font-sans text-[#0B1530]">
                  {activeRole.responsibilities.map((resp, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#4F7556] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Modules */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-sans uppercase text-[#0B1530] tracking-wider block font-semibold">
                  ACCESSIBLE MODULES:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-sans">
                  {activeRole.primaryModules.map((mod, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-3 py-1 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-[#0B1530] font-semibold"
                    >
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Simulated Dashboard & Live KPIs */}
            <div className="lg:col-span-6 bg-[#E3EEFC] border border-[#D0DCF0] rounded-xl p-6 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-2 text-[11px] text-[#4A5B7A]">
                <span className="font-semibold text-[#0B1530]">ROLE DASHBOARD PERSPECTIVE</span>
                <span className="text-[#1B4FD6] font-semibold">LIVE DATA VIEW</span>
              </div>

              <div className="p-3.5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-lg">
                <span className="text-[10px] text-[#4A5B7A] uppercase block font-semibold">WORKSPACE FOCUS</span>
                <p className="text-xs text-[#0B1530] mt-1 font-sans leading-relaxed">
                  {activeRole.dashboardFocus}
                </p>
              </div>

              {/* Sample KPI Cards */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#1B4FD6] uppercase block font-semibold">
                  OPERATIONAL BENCHMARKS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeRole.sampleKpis.map((kpi, kIdx) => (
                    <div
                      key={kIdx}
                      className="p-3 bg-[#FFFFFF] border border-[#D0DCF0] rounded-lg text-center space-y-1 shadow-xs"
                    >
                      <span className="text-[9px] text-[#4A5B7A] uppercase block truncate font-medium">
                        {kpi.label}
                      </span>
                      <span className="text-base font-bold text-[#0B1530] block">
                        {kpi.value}
                      </span>
                      <span className="text-[8px] text-[#1B4FD6] font-semibold block">
                        {kpi.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Quick Actions */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-[#0B1530] uppercase block font-semibold">
                  KEY ACTIONS:
                </span>
                {activeRole.keyActions.map((action, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-2.5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-lg flex items-center justify-between text-xs text-[#0B1530]"
                  >
                    <span>{action}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1B4FD6]" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
