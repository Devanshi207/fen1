"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Database,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataFlowStage {
  id: string;
  title: string;
  tag: string;
  metric: string;
  payload: Record<string, any>;
}

const DATA_FLOW_STAGES: DataFlowStage[] = [
  {
    id: "lead",
    title: "Lead Inception",
    tag: "CRM",
    metric: "Tender RFP Received",
    payload: {
      client: "Foster+Partners",
      project: "Sapphire Tower",
      estPanels: 4200,
      tenderType: "Unitized Glazing",
    },
  },
  {
    id: "customer",
    title: "Customer & GC",
    tag: "CRM",
    metric: "Tier-1 Contractor Verified",
    payload: {
      gc: "Multiplex Global",
      creditRating: "AAA",
      contractType: "Lump Sum",
      currency: "USD",
    },
  },
  {
    id: "estimate",
    title: "Engineering Takeoff",
    tag: "ESTIMATION",
    metric: "Dynamic BOM & Linear Nesting",
    payload: {
      extrusions: "14,200m 6063-T6",
      glass: "9,800m² DGU Low-E",
      margin: "26.4%",
      nestingYield: "96.2%",
    },
  },
  {
    id: "quotation",
    title: "Tender Quotation",
    tag: "SALES",
    metric: "Dynamic Bid Generated",
    payload: {
      bidAmount: "$4,840,200",
      version: "Rev-02",
      winProbability: "78%",
      discountAuth: "Approved",
    },
  },
  {
    id: "order",
    title: "Contract Locked",
    tag: "SALES",
    metric: "Advance Deposit Inwarded",
    payload: {
      poNumber: "PO-88219-MX",
      advanceDeposit: "$968,040 (20%)",
      status: "LOCKED",
    },
  },
  {
    id: "project",
    title: "Project Work Order",
    tag: "PROJECTS",
    metric: "4D Schedule Formulated",
    payload: {
      floors: 42,
      targetHandover: "Q4 2027",
      projectManager: "David Sterling",
      elevationCount: 4,
    },
  },
  {
    id: "bom",
    title: "Parametric BOM",
    tag: "ENGINEERING",
    metric: "Cut Lists & G-Code Exported",
    payload: {
      cutPieces: 18400,
      cncFiles: "SBZ151_SAPPHIRE.NC",
      scrapRate: "3.4%",
      tolerances: "±0.1mm",
    },
  },
  {
    id: "procurement",
    title: "Procurement RFQs",
    tag: "PURCHASE",
    metric: "Mill Billets & Glass Ordered",
    payload: {
      extruder: "Gulf Extrusions",
      glassCoater: "Saint-Gobain",
      poIssued: true,
      billetAlloy: "6063-T6",
    },
  },
  {
    id: "inventory",
    title: "Bar Allocation",
    tag: "WAREHOUSE",
    metric: "Off-Cuts Tagged & Reserved",
    payload: {
      reservedBars: 2180,
      offCutsReused: 340,
      warehouseLocation: "Rack-C4",
      aFramesAllocated: 14,
    },
  },
  {
    id: "production",
    title: "Digital Factory CNC",
    tag: "FACTORY",
    metric: "Double-Miter Saws & Glazing",
    payload: {
      sawLine: "Line-01 Elumatec",
      oeeRate: "92.4%",
      panelsBuilt: "320/week",
      crimpPullTest: "PASSED",
    },
  },
  {
    id: "logistics",
    title: "Stillage Dispatch",
    tag: "LOGISTICS",
    metric: "A-Frame Crane Delivery",
    payload: {
      stillageId: "ST-0442",
      vehicleGps: "Live En Route",
      craneSlot: "14:30",
      shockTiltSensor: "Normal",
    },
  },
  {
    id: "installation",
    title: "Site Panel Erection",
    tag: "SITE QA",
    metric: "Mobile QR Torque & Water Test",
    payload: {
      level: 24,
      bracketTorque: "95 Nm",
      aamaWaterTest: "PASSED",
      snagCount: 0,
    },
  },
  {
    id: "invoice",
    title: "Progressive Billing",
    tag: "FINANCE",
    metric: "Milestone Claim Invoiced",
    payload: {
      invoiceNo: "INV-2026-904",
      claimAmount: "$412,000",
      retention: "5%",
      eInvoiceTaxHash: "0x89f...21c",
    },
  },
  {
    id: "profitability",
    title: "Live Realized Margin",
    tag: "ANALYTICS",
    metric: "EBITDA Audited in Realtime",
    payload: {
      actualMargin: "27.1%",
      budgetVariance: "+0.7%",
      cashVelocity: "28 Days",
      executiveDashboard: "UPDATED",
    },
  },
];

export default function OneDataFlowAnimation() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % DATA_FLOW_STAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStage = DATA_FLOW_STAGES[activeStep];

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#D5DFCB] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs text-[#151718]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-cad-grid opacity-20 pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D0DCF0]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest">
              The Fen1 Continuous Bus
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-light text-[#0B1530] tracking-tight">
            One Single Data Entry. Zero Retyping.
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5B7A] mt-1 max-w-2xl font-sans">
            Watch an architectural lead cascade effortlessly across all 14 enterprise stages without duplicate entry or spreadsheet exports.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start md:self-center bg-[#D9E7FA] border border-[#D0DCF0] p-1.5 rounded-full font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F7FAFF] text-[#0B1530] transition-colors shadow-xs cursor-pointer"
            title={isPlaying ? "Pause Stream" : "Play Stream"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#0B1530]" /> : <Play className="w-3.5 h-3.5 text-[#0B1530]" />}
          </button>
          <button
            onClick={() => setActiveStep(0)}
            className="p-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F7FAFF] text-[#4A5B7A] hover:text-[#0B1530] transition-colors shadow-xs cursor-pointer"
            title="Restart Stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-[#0B1530] px-2">
            Stage {activeStep + 1} / {DATA_FLOW_STAGES.length}
          </span>
        </div>
      </div>

      {/* Horizontal Stage Progress Timeline */}
      <div className="relative z-10 mb-8 overflow-x-auto pb-4">
        <div className="flex items-center gap-2 min-w-[980px]">
          {DATA_FLOW_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={cn(
                  "flex-1 p-2.5 rounded-xl border text-left transition-all duration-300 relative group font-mono cursor-pointer",
                  isCurrent
                    ? "bg-[#F7FAFF] border-[#3B82F6] shadow-xs z-10"
                    : isCompleted
                    ? "bg-[#FFFFFF] border-[#D0DCF0] hover:border-[#3B82F6]"
                    : "bg-[#FFFFFF]/60 border-[#D0DCF0]/60 opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className={isCurrent ? "text-[#0B1530] font-medium" : "text-[#7686A6]"}>
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-[#D9E7FA] text-[#4A5B7A]">
                    {stage.tag}
                  </span>
                </div>
                <div className={cn(
                  "text-[11px] truncate",
                  isCurrent ? "text-[#0B1530] font-medium" : "text-[#4A5B7A]"
                )}>
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Data Ingestion Payload Simulator HUD */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F7FAFF] border border-[#D0DCF0] rounded-xl p-6">
        {/* Left Side: Active Stage Deep-Dive */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#D9E7FA] text-[#0B1530] font-mono text-xs uppercase">
                {currentStage.tag} MODULE
              </span>
              <h4 className="text-base font-normal text-[#0B1530] tracking-tight">
                {currentStage.title}
              </h4>
            </div>
            <span className="text-xs font-mono text-[#7686A6]">
              LATENCY: 42ms
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D0DCF0] space-y-2 font-mono shadow-xs">
            <div className="text-xs text-[#7686A6] uppercase">Active Action Triggered:</div>
            <div className="text-sm text-[#0B1530] font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#1B4FD6]" />
              {currentStage.metric}
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="text-[#7686A6] uppercase text-[10px]">Synchronized Data Payload:</div>
            <pre className="p-3 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl text-[#0B1530] overflow-x-auto text-[11px] leading-relaxed shadow-xs">
              <code>{JSON.stringify(currentStage.payload, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Right Side: Downstream Automatic Cascade Telemetry */}
        <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-xl bg-[#FFFFFF] border border-[#D0DCF0] shadow-xs font-mono">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#D0DCF0] mb-3">
              <span className="text-xs uppercase text-[#0B1530] flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#1B4FD6]" /> Real-time System Ingestion
              </span>
              <span className="text-[10px] text-[#1B4FD6] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> NO MANUAL ENTRY
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0]">
                <span className="text-[#4A5B7A]">Database Transaction State</span>
                <span className="text-[#0B1530] font-medium">COMMITTED • 100% ACID</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0]">
                <span className="text-[#4A5B7A]">Audit Log Signature</span>
                <span className="text-[#0B1530]">SHA256: 8f92a1...49c</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0]">
                <span className="text-[#4A5B7A]">CNC Saw & Inventory Sync</span>
                <span className="text-[#1B4FD6] font-medium">INSTANT BROADCAST</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#D0DCF0] flex items-center justify-between">
            <span className="text-xs text-[#4A5B7A]">
              Next automatic cascade:
            </span>
            <span className="text-xs text-[#0B1530] flex items-center gap-1">
              {DATA_FLOW_STAGES[(activeStep + 1) % DATA_FLOW_STAGES.length].title}
              <ArrowRight className="w-3.5 h-3.5 text-[#1B4FD6]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
