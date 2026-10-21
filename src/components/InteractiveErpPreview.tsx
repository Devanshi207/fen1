"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Calculator,
  Scan,
  Compass,
  Building2,
  ShoppingCart,
  Boxes,
  Factory,
  ShieldCheck,
  Truck,
  CreditCard,
  Users,
  BarChart3,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import Link from "next/link";

const PREVIEW_MODULES = [
  {
    id: "crm",
    name: "CRM",
    number: "02",
    icon: Layers,
    title: "COMMERCIAL ENQUIRY & SALES PIPELINE",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Active Pipeline", val: "$4,280,000" },
      { label: "Open Enquiries", val: "38 Enquiries" },
      { label: "Avg Win Rate", val: "36.4%" },
    ],
    tableHeaders: ["Enquiry ID", "Client / Architect", "Typology Scope", "Estimated Value", "Stage", "Next Action"],
    tableRows: [
      ["ENQ-2026-084", "Foster & Partners", "Unitized Curtain Wall 4,200m²", "$1,450,000", "Technical Estimation", "Issue Tender BOM"],
      ["ENQ-2026-089", "Apex High-Rise Ltd", "Thermal Break Casement 340 units", "$680,000", "Negotiation", "Client Final Review"],
      ["ENQ-2026-092", "Zaha Hadid Studio", "Parametric Skylight & DGU", "$890,000", "Sales Order Awarded", "Release to Survey"],
    ],
  },
  {
    id: "estimation",
    name: "ESTIMATION",
    number: "03",
    icon: Calculator,
    title: "PARAMETRIC CAD TAKEOFF & DYNAMIC BOM",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Avg Takeoff Time", val: "< 2.5 Mins" },
      { label: "BOM Accuracy", val: "99.8%" },
      { label: "Active Tenders", val: "18 Open" },
    ],
    tableHeaders: ["Elevation ID", "System Series", "Dimensions (W×H)", "Glass Build-up", "Linear Weight", "Total Cost BOM"],
    tableRows: [
      ["EL-01-SLIDE", "FEN-100 Heavy 3-Track", "3200 × 2600 mm", "24mm Low-E DGU", "48.2 kg", "$1,480.00"],
      ["EL-02-CASE", "FEN-60 Thermal Break", "1800 × 1500 mm", "6mm Toughened Clear", "22.4 kg", "$540.00"],
      ["EL-03-CURTAIN", "FEN-150 Structural Mullion", "1500 × 3800 mm", "32mm Acoustic DGU", "84.6 kg", "$2,890.00"],
    ],
  },
  {
    id: "survey",
    name: "SURVEY",
    number: "04",
    icon: Scan,
    title: "SITE LASER MEASUREMENTS & SUBSTRATE QA",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Openings Verified", val: "420 Units" },
      { label: "Max Deviation", val: "+1.2 mm" },
      { label: "Digital Sign-Off", val: "100% Signed" },
    ],
    tableHeaders: ["Opening Tag", "Floor / Grid", "Laser Dimension (W×H)", "Plumb Tolerance", "Substrate Condition", "CAD Release"],
    tableRows: [
      ["OP-FL04-12", "Level 4 / Grid C-4", "2402 × 3001 mm", "+1.0 mm (Pass)", "Masonry Plumb", "Approved for CAD"],
      ["OP-FL04-13", "Level 4 / Grid C-5", "2398 × 3000 mm", "-2.0 mm (Pass)", "Steel Anchor Verified", "Approved for CAD"],
      ["OP-FL05-01", "Level 5 / Grid A-1", "1800 × 2400 mm", "+0.5 mm (Pass)", "Reinforced Concrete", "Approved for CAD"],
    ],
  },
  {
    id: "production",
    name: "PRODUCTION",
    number: "09",
    icon: Factory,
    title: "SHOP FLOOR SAW TELEMETRY & 1D LINEAR NESTING",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Linear Saw Scrap", val: "< 3.1%" },
      { label: "Daily Assembled Units", val: "94 Units" },
      { label: "CNC Saw Health (OEE)", val: "94.2%" },
    ],
    tableHeaders: ["Work Order", "Machine Bay", "Nested Bar Yield", "Linear Scrap %", "Glazing Cure Timer", "Batch Status"],
    tableRows: [
      ["WO-2026-440", "Elumatec SBZ 151 CNC", "97.4% (6.5m Bars)", "2.6% Scrap", "N/A (Cutting)", "In Progress"],
      ["WO-2026-441", "Emmegi Double-Miter", "96.8% (6.5m Bars)", "3.2% Scrap", "N/A (Cutting)", "Queued"],
      ["WO-2026-438", "Structural Glazing Bay 2", "100% Assembled", "0.0% Scrap", "4h 20m Curing Remaining", "QC Inspection"],
    ],
  },
  {
    id: "store",
    name: "STORE",
    number: "08",
    icon: Boxes,
    title: "WAREHOUSE RACKS, OFF-CUTS & GLASS STILLAGES",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Stock Accuracy", val: "99.9%" },
      { label: "Off-Cut Recovery", val: "92.4%" },
      { label: "A-Frames Tracked", val: "84 Stillages" },
    ],
    tableHeaders: ["Material Code", "Profile / Glass Type", "Rack / Slot Location", "Available Qty", "Project Allocation", "Off-Cut Vault"],
    tableRows: [
      ["EXT-6063-T6", "Mullion Die 150mm (RAL 7016)", "Rack A-04 (6.5m)", "240 Bars", "Reserved (Tower 2)", "18 Remnants (>2.2m)"],
      ["GLS-DGU-24", "24mm Low-E Glass Crates", "Stillage Staging B", "620 m²", "Reserved (Tower 2)", "0 Scraps"],
      ["HDW-SS-304", "Multi-Point Casement Locks", "Hardware Bin 12", "1,200 Sets", "Available Unrestricted", "N/A"],
    ],
  },
  {
    id: "project-management",
    name: "PROJECTS",
    number: "06",
    icon: Building2,
    title: "HIGH-RISE PANEL MATRIX & PROGRESSIVE BILLING",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Active Glazing Projects", val: "14 Projects" },
      { label: "Milestone Adherence", val: "98.2%" },
      { label: "Uncertified WIP", val: "$740,000" },
    ],
    tableHeaders: ["Project Code", "Tower / Building", "Total Panels", "Erected on Site", "Current Milestone", "Billing Status"],
    tableRows: [
      ["PRJ-2026-08", "Sapphire Financial Tower", "1,840 Panels", "1,420 Erected (77%)", "Level 28 Erection", "Claim #6 Submitted"],
      ["PRJ-2026-11", "Marina Bay Commercial", "920 Panels", "920 Erected (100%)", "Final Water Tightness Test", "Certified & Paid"],
      ["PRJ-2026-14", "Skyline Residential Suites", "640 Panels", "280 Erected (43%)", "Level 12 Bracket Torquing", "Claim #2 Approved"],
    ],
  },
  {
    id: "account",
    name: "ACCOUNT",
    number: "13",
    icon: CreditCard,
    title: "PROJECT COSTING, PROGRESSIVE CLAIMS & 3-WAY MATCH",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Gross Margin Tracking", val: "Real-Time" },
      { label: "Retention Receivables", val: "$480,000" },
      { label: "3-Way Invoice Match", val: "100% Automated" },
    ],
    tableHeaders: ["Invoice / Claim", "Project Account", "Claim Value", "Retention Held (5%)", "Certified Amount", "Settlement"],
    tableRows: [
      ["CLM-2026-042", "Sapphire Financial Tower", "$240,000.00", "$12,000.00", "$228,000.00", "Payment Due (14d)"],
      ["INV-2026-198", "Extrusion Mill Vendor PO", "$84,200.00", "$0.00", "$84,200.00", "Matched with GRN"],
      ["CLM-2026-039", "Skyline Residential", "$180,000.00", "$9,000.00", "$171,000.00", "Paid & Reconciled"],
    ],
  },
  {
    id: "analytics",
    name: "ANALYTICS",
    number: "17",
    icon: BarChart3,
    title: "EXECUTIVE BOARDROOM COCKPIT & LIVE METRICS",
    badge: "SAMPLE DATA",
    stats: [
      { label: "Enterprise EBITDA", val: "18.4%" },
      { label: "Total Plant OEE", val: "93.2%" },
      { label: "Avg Extrusion Scrap", val: "3.1%" },
    ],
    tableHeaders: ["Division / Plant", "Monthly Output", "Scrap Rate", "On-Time Delivery", "Direct Margin", "Health Index"],
    tableRows: [
      ["Glazing Line Plant A", "120 Panels / Shift", "2.8%", "99.1%", "24.2%", "Optimal"],
      ["Aluminium Window Line B", "85 Windows / Shift", "3.2%", "98.4%", "28.5%", "Optimal"],
      ["Glass Processing Furnace C", "1,800 m² / Day", "1.4%", "97.8%", "21.0%", "Optimal"],
    ],
  },
];

export default function InteractiveErpPreview() {
  const [activeModId, setActiveModId] = useState<string>("production");

  const mod =
    PREVIEW_MODULES.find((m) => m.id === activeModId) || PREVIEW_MODULES[3];

  return (
    <section className="py-20 bg-[#F2F7FF] border-b border-[#D0DCF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-sans uppercase text-[#1B4FD6] tracking-widest block font-semibold">
            SIMULATED INTERFACES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight">
            SEE FEN1 IN ACTION.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed font-sans">
            Preview simulated dashboards, KPI benchmarks, and table structures across core operational modules.
          </p>
        </div>

        {/* Module Selector (Flex-wrap, no horizontal scroll) */}
        <div className="flex flex-wrap items-center gap-2">
          {PREVIEW_MODULES.map((m) => {
            const isSelected = m.id === activeModId;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModId(m.id)}
                className={`px-4 py-2 rounded-full text-xs font-sans transition-all border cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-xs font-semibold"
                    : "bg-[#FFFFFF] text-[#0B1530] border-[#D0DCF0] hover:border-[#B8D4FB] hover:bg-[#E3EEFC]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#CFE4FF]" : "text-[#1B4FD6]"}`} />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Simulated ERP Window Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] shadow-sm overflow-hidden font-sans"
          >
            {/* Window Top Controls */}
            <div className="bg-[#E3EEFC] border-b border-[#D0DCF0] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#0B1530]">
                  FEN1 - Module {mod.number}: {mod.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="px-2.5 py-0.5 rounded bg-[#FFFFFF] border border-[#D0DCF0] text-[#1B4FD6] font-semibold uppercase">
                  {mod.badge}
                </span>
              </div>
            </div>

            {/* Simulated Dashboard Body */}
            <div className="p-6 sm:p-8 space-y-6 font-sans">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mod.stats.map((st, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 bg-[#E3EEFC] border border-[#D0DCF0] rounded-xl text-center space-y-1"
                  >
                    <span className="text-[10px] text-[#4A5B7A] uppercase block font-semibold">{st.label}</span>
                    <span className="text-xl font-bold font-sans text-[#0B1530] block">{st.val}</span>
                    <span className="text-[9px] text-[#1B4FD6] font-semibold">SAMPLE METRIC</span>
                  </div>
                ))}
              </div>

              {/* Simulated Data Table */}
              <div className="border border-[#D0DCF0] rounded-xl overflow-hidden bg-[#FFFFFF]">
                <div className="p-3 bg-[#E3EEFC] border-b border-[#D0DCF0] flex items-center justify-between text-xs text-[#4A5B7A]">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-[#0B1530]" />
                    <span className="text-[#0B1530] font-semibold">Master Records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-[#0B1530]" />
                    <span>View: Standard Grid</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#D0DCF0] bg-[#FFFFFF] text-[11px] text-[#4A5B7A]">
                        {mod.tableHeaders.map((head, hIdx) => (
                          <th key={hIdx} className="p-3 font-semibold uppercase text-[#0B1530]">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D0DCF0]">
                      {mod.tableRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#E3EEFC]/60 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-[#0B1530]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Footer CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
                <span className="text-[#4A5B7A] font-sans">
                  Simulated interface preview. Actual ERP incorporates 100% configurable custom profile dies and formulas.
                </span>
                <Link
                  href="/solutions#modules"
                  className="px-5 py-2.5 rounded-full bg-[#1B4FD6] text-[#0B1530] font-semibold text-xs hover:bg-[#BFD3F0] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Explore {mod.name} Module</span>
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
