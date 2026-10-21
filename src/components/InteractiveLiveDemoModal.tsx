"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calculator,
  Target,
  Factory,
  Boxes,
  BarChart3,
  Download,
  Sliders,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export default function InteractiveLiveDemoModal({ isOpen, onClose, initialTab = "estimation" }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Estimation Configurator State
  const [width, setWidth] = useState(2400);
  const [height, setHeight] = useState(3100);
  const [profileSystem, setProfileSystem] = useState("Schüco AWS 75.SI+");
  const [glassType, setGlassType] = useState("DGU Low-E 8-16Ar-8");
  const [margin, setMargin] = useState(24);
  const [quotationExported, setQuotationExported] = useState(false);

  // CRM Kanban State
  const [crmDeals, setCrmDeals] = useState([
    { id: "d1", title: "Sapphire Tower Glazing", client: "Foster+Partners", stage: "Estimation", value: 4850000 },
    { id: "d2", title: "Meridian Airport Terminal", client: "Skidmore Owings", stage: "Negotiation", value: 8920000 },
    { id: "d3", title: "Horizon Luxury Villas (42 Units)", client: "Emaar Properties", stage: "Site Survey", value: 1240000 },
    { id: "d4", title: "Apex Tech Campus Curtain Wall", client: "Gensler Architects", stage: "Won", value: 6400000 },
  ]);

  // Production Telemetry State
  const [sawStatus] = useState("RUNNING");
  const [currentPiece] = useState("MULLION-F24-L-3100mm");

  // Dynamic calculations for window/glazing
  const perimeterMeters = ((width + height) * 2) / 1000;
  const areaSqMeters = (width * height) / 1000000;
  const extrusionCost = perimeterMeters * 65;
  const glassCost = areaSqMeters * 95;
  const hardwareCost = 185;
  const laborCost = perimeterMeters * 22 + areaSqMeters * 18;
  const directCost = extrusionCost + glassCost + hardwareCost + laborCost;
  const finalPrice = directCost / (1 - margin / 100);
  const calculatedMarginDollars = finalPrice - directCost;

  const handleExportQuote = () => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#0B1530", "#2563EB", "#E3EDFB"],
    });
    setQuotationExported(true);
    setTimeout(() => setQuotationExported(false), 4000);
  };

  const advanceDeal = (id: string) => {
    const stages = ["New Lead", "Site Survey", "Estimation", "Negotiation", "Won"];
    setCrmDeals((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextIdx = (stages.indexOf(d.stage) + 1) % stages.length;
          return { ...d, stage: stages[nextIdx] };
        }
        return d;
      })
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.96, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 15 }}
          className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden relative text-[#0B1530]"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#D0DCF0] bg-[#F7FAFF]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1B4FD6] flex items-center justify-center text-[#0B1530] shadow-xs">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[#0B1530]">
                    Fen1 Enterprise Sandbox
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D9E7FA] border border-[#D0DCF0] text-[#4A5B7A] font-mono uppercase">
                    Interactive
                  </span>
                </div>
                <p className="text-xs text-[#7686A6] font-mono">
                  Live calculation, CNC cut lists, Kanban CRM, and factory telemetry.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-[#FFFFFF] border border-[#D0DCF0] text-[#4A5B7A] hover:text-[#0B1530] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Module Selector Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 py-2.5 bg-[#D9E7FA] border-b border-[#D0DCF0] overflow-x-auto text-xs font-mono">
            <button
              onClick={() => setActiveTab("estimation")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === "estimation"
                  ? "bg-[#FFFFFF] text-[#0B1530] shadow-xs border border-[#D0DCF0] font-medium"
                  : "text-[#4A5B7A] hover:text-[#0B1530]"
              )}
            >
              <Calculator className="w-3.5 h-3.5 text-[#1B4FD6]" /> Estimation Configurator
            </button>
            <button
              onClick={() => setActiveTab("crm")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === "crm"
                  ? "bg-[#FFFFFF] text-[#0B1530] shadow-xs border border-[#D0DCF0] font-medium"
                  : "text-[#4A5B7A] hover:text-[#0B1530]"
              )}
            >
              <Target className="w-3.5 h-3.5 text-[#1B4FD6]" /> CRM Pipeline
            </button>
            <button
              onClick={() => setActiveTab("factory")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === "factory"
                  ? "bg-[#FFFFFF] text-[#0B1530] shadow-xs border border-[#D0DCF0] font-medium"
                  : "text-[#4A5B7A] hover:text-[#0B1530]"
              )}
            >
              <Factory className="w-3.5 h-3.5 text-[#1B4FD6]" /> Factory Telemetry
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === "inventory"
                  ? "bg-[#FFFFFF] text-[#0B1530] shadow-xs border border-[#D0DCF0] font-medium"
                  : "text-[#4A5B7A] hover:text-[#0B1530]"
              )}
            >
              <Boxes className="w-3.5 h-3.5 text-[#1B4FD6]" /> Warehouse
            </button>
            <button
              onClick={() => setActiveTab("bi")}
              className={cn(
                "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === "bi"
                  ? "bg-[#FFFFFF] text-[#0B1530] shadow-xs border border-[#D0DCF0] font-medium"
                  : "text-[#4A5B7A] hover:text-[#0B1530]"
              )}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#1B4FD6]" /> Executive BI
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-[#F7FAFF] bg-cad-grid">
            {/* TAB 1: ESTIMATION CONFIGURATOR */}
            {activeTab === "estimation" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Form: Parametric Sliders */}
                <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3">
                    <span className="text-[#0B1530] font-medium text-xs">Parametric Unit Specification</span>
                    <span className="text-[#1B4FD6]">ACTIVE</span>
                  </div>

                  {/* Width Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#4A5B7A]">Unit Width (mm):</span>
                      <span className="text-[#0B1530] font-medium">{width} mm</span>
                    </div>
                    <input
                      type="range"
                      min={800}
                      max={3600}
                      step={50}
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full accent-[#0B1530] cursor-pointer"
                    />
                  </div>

                  {/* Height Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#4A5B7A]">Unit Height (mm):</span>
                      <span className="text-[#0B1530] font-medium">{height} mm</span>
                    </div>
                    <input
                      type="range"
                      min={1200}
                      max={4500}
                      step={50}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-[#0B1530] cursor-pointer"
                    />
                  </div>

                  {/* Profile Dropdown */}
                  <div className="space-y-1">
                    <span className="text-[#7686A6] block text-[11px] uppercase">Aluminium Profile System</span>
                    <select
                      value={profileSystem}
                      onChange={(e) => setProfileSystem(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] outline-none font-sans"
                    >
                      <option>Schüco AWS 75.SI+ Super Insulation</option>
                      <option>Reynaers MasterLine 8 High Performance</option>
                      <option>Cortizo Cor Vision Plus Minimalist</option>
                      <option>Schüco FWS 50 Unitized Curtain Wall</option>
                    </select>
                  </div>

                  {/* Glass Spec */}
                  <div className="space-y-1">
                    <span className="text-[#7686A6] block text-[11px] uppercase">Glass Specification</span>
                    <select
                      value={glassType}
                      onChange={(e) => setGlassType(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] outline-none font-sans"
                    >
                      <option>DGU Low-E 8-16Ar-8 (U: 1.1 W/m²K)</option>
                      <option>Triple Glazed Argon 6-12Ar-6-12Ar-6 (U: 0.6 W/m²K)</option>
                      <option>Acoustic Laminated SGP 10.89 + 16Ar + 8.89</option>
                      <option>Ceramic Frit Solar Control 10mm Toughened</option>
                    </select>
                  </div>

                  {/* Margin Slider */}
                  <div className="space-y-1.5 pt-2 border-t border-[#D0DCF0]">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#4A5B7A]">Target Gross Margin (%):</span>
                      <span className="text-[#1B4FD6] font-medium">{margin}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={45}
                      step={1}
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full accent-[#0B1530] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right: Live Dynamic BOM Breakdown */}
                <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3 mb-4">
                      <span className="text-[#0B1530] font-medium text-xs">Dynamic Cost Sheet</span>
                      <span className="text-[10px] text-[#7686A6] uppercase">AUTO-CALCULATED</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2 rounded-lg bg-[#F7FAFF]">
                        <span className="text-[#4A5B7A]">Extrusions ({perimeterMeters.toFixed(2)} linear m):</span>
                        <span className="text-[#0B1530]">{formatCurrency(extrusionCost)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-[#F7FAFF]">
                        <span className="text-[#4A5B7A]">Glass Area ({areaSqMeters.toFixed(2)} m²):</span>
                        <span className="text-[#0B1530]">{formatCurrency(glassCost)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-[#F7FAFF]">
                        <span className="text-[#4A5B7A]">Hardware & Gaskets:</span>
                        <span className="text-[#0B1530]">{formatCurrency(hardwareCost)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-[#F7FAFF]">
                        <span className="text-[#4A5B7A]">Fabrication Labor:</span>
                        <span className="text-[#0B1530]">{formatCurrency(laborCost)}</span>
                      </div>

                      <div className="flex justify-between p-2.5 rounded-lg bg-[#D9E7FA] border border-[#D0DCF0] text-xs font-medium text-[#0B1530] mt-3">
                        <span>Direct Manufacturing Cost:</span>
                        <span>{formatCurrency(directCost)}</span>
                      </div>

                      <div className="flex justify-between p-2.5 rounded-lg bg-[#D9E7FA] border border-[#D0DCF0] text-xs text-[#1B4FD6] font-medium">
                        <span>Gross Profit Margin ({margin}%):</span>
                        <span>+{formatCurrency(calculatedMarginDollars)}</span>
                      </div>
                    </div>

                    {/* Final Commercial Quotation Box */}
                    <div className="mt-4 p-4 rounded-xl bg-[#F7FAFF] border border-[#D0DCF0] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#7686A6] uppercase block">Final Tender Price</span>
                        <span className="text-xl font-normal text-[#0B1530]">
                          {formatCurrency(finalPrice)}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#4A5B7A] text-right">
                        U-Value: 1.12 W/m²K<br />
                        Linear Scrap: 3.2%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleExportQuote}
                      className="w-full py-3 bg-[#1B4FD6] text-[#0B1530] font-normal uppercase rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center justify-center gap-2 text-xs shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{quotationExported ? "Tender PDF Generated & Synced" : "Export Engineering Quotation & BOM"}</span>
                    </button>
                    {quotationExported && (
                      <div className="text-center text-[#1B4FD6] text-[11px]">
                        ✓ Cut-list dispatched to CNC Saw & PO generated
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CRM KANBAN PIPELINE */}
            {activeTab === "crm" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#FFFFFF] p-3.5 rounded-xl border border-[#D0DCF0] shadow-xs">
                  <span className="text-[#0B1530] font-medium">Active Commercial Tender Pipeline ($21.4M Total)</span>
                  <span className="text-[11px] text-[#1B4FD6]">Click any card to advance stage</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["Site Survey", "Estimation", "Negotiation", "Won"].map((colStage) => {
                    const dealsInStage = crmDeals.filter((d) => d.stage === colStage);
                    return (
                      <div key={colStage} className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-3.5 space-y-3 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#D0DCF0]">
                          <span className="font-normal text-[#0B1530] text-xs uppercase">{colStage}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D9E7FA] text-[#0B1530]">
                            {dealsInStage.length}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {dealsInStage.map((deal) => (
                            <div
                              key={deal.id}
                              onClick={() => advanceDeal(deal.id)}
                              className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] hover:border-[#3B82F6] cursor-pointer transition-all space-y-1.5 group shadow-xs"
                            >
                              <div className="font-medium text-[#0B1530] text-xs group-hover:text-[#1B4FD6] transition-colors">
                                {deal.title}
                              </div>
                              <div className="text-[10px] text-[#7686A6] font-sans">{deal.client}</div>
                              <div className="flex items-center justify-between pt-1 text-xs">
                                <span className="font-normal text-[#0B1530]">{formatCurrency(deal.value)}</span>
                                <span className="text-[9px] text-[#7686A6]">Advance →</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: FACTORY TELEMETRY */}
            {activeTab === "factory" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3">
                    <span className="text-[#0B1530] font-medium text-xs">Line 01: Elumatec SBZ 151 5-Axis CNC Center</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#D9E7FA] text-[#0B1530] text-[10px] border border-[#D0DCF0]">
                      {sawStatus} • 94.2% OEE
                    </span>
                  </div>

                  <div className="p-4 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#4A5B7A]">Current Milling Cycle:</span>
                      <span className="text-[#0B1530] font-medium">{currentPiece}</span>
                    </div>
                    <div className="w-full bg-[#D9E7FA] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1B4FD6] h-full rounded-full w-3/4" />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#7686A6]">
                      <span>Cut Length: 3100.0 mm (Tol: ±0.1mm)</span>
                      <span>Spindle Speed: 18,000 RPM</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0]">
                      <span className="text-[#7686A6] block uppercase text-[9px]">Shift Output</span>
                      <span className="text-sm font-medium text-[#0B1530]">184 Bars</span>
                    </div>
                    <div className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0]">
                      <span className="text-[#7686A6] block uppercase text-[9px]">Linear Scrap</span>
                      <span className="text-sm font-medium text-[#1B4FD6]">3.4%</span>
                    </div>
                    <div className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0]">
                      <span className="text-[#7686A6] block uppercase text-[9px]">Cycle Time</span>
                      <span className="text-sm font-medium text-[#0B1530]">42s / profile</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-5 space-y-3 shadow-xs">
                  <span className="text-[#0B1530] font-medium text-xs block border-b border-[#D0DCF0] pb-3">
                    Connected Machine Network
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] flex items-center justify-between">
                      <span className="text-[#0B1530]">Emmegi Satellite XT</span>
                      <span className="text-[#1B4FD6]">ONLINE</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] flex items-center justify-between">
                      <span className="text-[#0B1530]">Glaston FC Furnace</span>
                      <span className="text-[#1B4FD6]">680°C OPTIMAL</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] flex items-center justify-between">
                      <span className="text-[#0B1530]">Lisec Auto Glazing</span>
                      <span className="text-[#1B4FD6]">ONLINE</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] flex items-center justify-between">
                      <span className="text-[#0B1530]">Double Corner Crimper</span>
                      <span className="text-[#7686A6]">STANDBY</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INVENTORY CONTROL */}
            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-5 space-y-4 shadow-xs">
                  <span className="text-[#0B1530] font-medium text-xs block border-b border-[#D0DCF0] pb-3">
                    Profile Rack Optimizer (6.5m Bars)
                  </span>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#0B1530]">Rack A-12: Frame Profile</span>
                        <span className="text-[#1B4FD6]">142 Bars (Free: 38)</span>
                      </div>
                      <div className="w-full bg-[#D9E7FA] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1B4FD6] h-full w-[72%]" />
                      </div>
                    </div>
                    <div className="p-3 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#0B1530]">Rack B-04: Unitized Mullion</span>
                        <span className="text-[#1B4FD6]">88 Bars (Free: 12)</span>
                      </div>
                      <div className="w-full bg-[#D9E7FA] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1B4FD6] h-full w-[86%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl p-5 space-y-4 shadow-xs">
                  <span className="text-[#0B1530] font-medium text-xs block border-b border-[#D0DCF0] pb-3">
                    Off-Cut Recovery Engine
                  </span>
                  <div className="p-4 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#4A5B7A]">Off-Cuts Tagged (&gt; 500mm):</span>
                      <span className="text-[#1B4FD6]">428 pieces in stock</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A5B7A]">Linear Nesting Priority:</span>
                      <span className="text-[#0B1530]">Automatic First-Pick</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4A5B7A]">Annual Scrap Avoidance:</span>
                      <span className="text-[#1B4FD6]">+$324,500</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: EXECUTIVE BI */}
            {activeTab === "bi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl shadow-xs">
                    <span className="text-[10px] text-[#7686A6] uppercase block">Q3 Group Revenue</span>
                    <span className="text-lg font-normal text-[#0B1530] mt-1 block">$18.42M</span>
                    <span className="text-[10px] text-[#1B4FD6]">+14.2% YoY</span>
                  </div>
                  <div className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl shadow-xs">
                    <span className="text-[10px] text-[#7686A6] uppercase block">Blended Gross Margin</span>
                    <span className="text-lg font-normal text-[#1B4FD6] mt-1 block">28.4%</span>
                    <span className="text-[10px] text-[#1B4FD6]">+3.1% Target Beat</span>
                  </div>
                  <div className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl shadow-xs">
                    <span className="text-[10px] text-[#7686A6] uppercase block">Active Glazing Projects</span>
                    <span className="text-lg font-normal text-[#0B1530] mt-1 block">34 Projects</span>
                    <span className="text-[10px] text-[#4A5B7A]">100% on schedule</span>
                  </div>
                  <div className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl shadow-xs">
                    <span className="text-[10px] text-[#7686A6] uppercase block">Overall OEE Rate</span>
                    <span className="text-lg font-normal text-[#1B4FD6] mt-1 block">91.4%</span>
                    <span className="text-[10px] text-[#1B4FD6]">+12.8%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
