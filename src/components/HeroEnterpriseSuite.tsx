"use client";

import React, { useState, useMemo } from "react";
import {
  Sliders,
  Calculator,
  Factory,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WindowSystem = "sliding-2t" | "sliding-3t" | "casement" | "curtain-wall";

interface SystemConfig {
  id: WindowSystem;
  name: string;
  category: string;
  defaultW: number;
  defaultH: number;
  profileSeries: string;
  kgPerMeter: number;
  baseHardwareCost: number;
  glassCostPerM2: number;
}

const SYSTEMS: SystemConfig[] = [
  {
    id: "sliding-2t",
    name: "2-Track Minimal Sliding",
    category: "Window & Door",
    defaultW: 2400,
    defaultH: 2100,
    profileSeries: "Cortizo Cor Vision / Reynaers CP 130",
    kgPerMeter: 3.42,
    baseHardwareCost: 180,
    glassCostPerM2: 65,
  },
  {
    id: "sliding-3t",
    name: "3-Track Architectural Door",
    category: "Heavy Duty Door",
    defaultW: 3200,
    defaultH: 2400,
    profileSeries: "Schüco ASE 60 / Alupure Heavy",
    kgPerMeter: 4.65,
    baseHardwareCost: 290,
    glassCostPerM2: 70,
  },
  {
    id: "casement",
    name: "Casement + Top Transom",
    category: "Architectural Window",
    defaultW: 1800,
    defaultH: 2100,
    profileSeries: "Schüco AWS 75.SI+ Super Insulated",
    kgPerMeter: 2.85,
    baseHardwareCost: 210,
    glassCostPerM2: 75,
  },
  {
    id: "curtain-wall",
    name: "Unitized Glazing Panel",
    category: "Commercial High-Rise",
    defaultW: 3600,
    defaultH: 3200,
    profileSeries: "Schüco FWS 50 / Reynaers CW 50",
    kgPerMeter: 5.20,
    baseHardwareCost: 420,
    glassCostPerM2: 95,
  },
];

const FINISHES = [
  { id: "black", name: "Matt Obsidian Black (20μm)", hex: "#0B1530", stroke: "#0B1530" },
  { id: "bronze", name: "Brushed Champagne Bronze", hex: "#2563EB", stroke: "#102F9E" },
  { id: "grey", name: "Anthracite Grey (RAL 7016)", hex: "#3F3F46", stroke: "#16264A" },
  { id: "silver", name: "Natural Anodized Aluminium", hex: "#C5D6F0", stroke: "#7686A6" },
];

const GLASS_TYPES = [
  { id: "dgu", name: "24mm DGU Low-E (6+12A+6)", factor: 1.0, uValue: "1.12 W/m²K", tint: "rgba(158, 132, 103, 0.08)" },
  { id: "lami", name: "13.52mm SGP Laminated", factor: 1.25, uValue: "1.35 W/m²K", tint: "rgba(82, 82, 91, 0.08)" },
  { id: "acoustic", name: "28mm Acoustic Triple IGU", factor: 1.45, uValue: "0.85 W/m²K", tint: "rgba(24, 24, 27, 0.06)" },
];

export default function HeroEnterpriseSuite() {
  const [selectedSystemId, setSelectedSystemId] = useState<WindowSystem>("sliding-2t");
  const [activeTab, setActiveTab] = useState<"designer" | "optimizer" | "bom">("designer");
  
  const currentSystem = SYSTEMS.find((s) => s.id === selectedSystemId) || SYSTEMS[0];
  
  const [width, setWidth] = useState(currentSystem.defaultW);
  const [height, setHeight] = useState(currentSystem.defaultH);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [selectedGlass, setSelectedGlass] = useState(GLASS_TYPES[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Sync dimensions when system changes
  const handleSystemChange = (sys: SystemConfig) => {
    setSelectedSystemId(sys.id);
    setWidth(sys.defaultW);
    setHeight(sys.defaultH);
  };

  // Parametric Math & 1D Billet Nesting
  const calculations = useMemo(() => {
    const widthM = width / 1000;
    const heightM = height / 1000;
    const totalAreaM2 = widthM * heightM;

    let linearProfileMeters = 0;
    let cutPieces: { name: string; length: number; miter: string; color: string }[] = [];

    if (selectedSystemId === "sliding-2t") {
      const sashWidth = (width / 2) + 25;
      linearProfileMeters = (widthM * 2) + (heightM * 2) + (sashWidth / 1000 * 4) + (heightM * 4);
      cutPieces = [
        { name: "Outer Track Top", length: width, miter: "90°/90°", color: "#0B1530" },
        { name: "Outer Track Bottom", length: width, miter: "90°/90°", color: "#0B1530" },
        { name: "Side Jamb Left", length: height, miter: "90°/90°", color: "#2563EB" },
        { name: "Side Jamb Right", length: height, miter: "90°/90°", color: "#2563EB" },
        { name: "Interlock Stile", length: height - 50, miter: "90°/90°", color: "#4A5B7A" },
        { name: "Lock Stile Left", length: height - 50, miter: "90°/90°", color: "#4A5B7A" },
      ];
    } else if (selectedSystemId === "sliding-3t") {
      linearProfileMeters = (widthM * 3 * 2) + (heightM * 2) + ((widthM / 3) * 6) + (heightM * 6);
      cutPieces = [
        { name: "3-Track Head Frame", length: width, miter: "90°/90°", color: "#0B1530" },
        { name: "3-Track Sill Rail", length: width, miter: "90°/90°", color: "#0B1530" },
        { name: "Heavy Jamb Left", length: height, miter: "90°/90°", color: "#2563EB" },
        { name: "Heavy Jamb Right", length: height, miter: "90°/90°", color: "#2563EB" },
        { name: "Mesh Sash Stile", length: height - 60, miter: "90°/90°", color: "#4A5B7A" },
      ];
    } else if (selectedSystemId === "casement") {
      linearProfileMeters = (widthM * 2) + (heightM * 2) + (widthM) + (heightM * 2 * 0.65);
      cutPieces = [
        { name: "Outer Frame Top", length: width, miter: "45°/45°", color: "#0B1530" },
        { name: "Outer Frame Bottom", length: width, miter: "45°/45°", color: "#0B1530" },
        { name: "Outer Frame Left", length: height, miter: "45°/45°", color: "#2563EB" },
        { name: "Outer Frame Right", length: height, miter: "45°/45°", color: "#2563EB" },
        { name: "Transom Bar", length: width - 80, miter: "90°/90°", color: "#4A5B7A" },
      ];
    } else {
      linearProfileMeters = (widthM * 2) + (heightM * 3) + (widthM * 2);
      cutPieces = [
        { name: "Mullion Die #6063", length: height, miter: "90°/90°", color: "#0B1530" },
        { name: "Mullion Die #6063", length: height, miter: "90°/90°", color: "#0B1530" },
        { name: "Transom Die #6063", length: width / 2, miter: "90°/90°", color: "#2563EB" },
        { name: "Pressure Plate", length: height, miter: "90°/90°", color: "#4A5B7A" },
      ];
    }

    const totalWeightKg = linearProfileMeters * currentSystem.kgPerMeter;
    const aluminiumCost = totalWeightKg * 4.8;
    const glassCost = totalAreaM2 * currentSystem.glassCostPerM2 * selectedGlass.factor;
    const gasketMeters = linearProfileMeters * 2;
    const gasketCost = gasketMeters * 1.2;
    const directCost = aluminiumCost + glassCost + currentSystem.baseHardwareCost + gasketCost;
    const marginPercent = 26.5;
    const finalPrice = directCost * (1 + marginPercent / 100);

    const standardBarMm = 6500;
    const totalCutLength = cutPieces.reduce((acc, p) => acc + p.length, 0);
    const barsRequired = Math.ceil((totalCutLength * 1.04) / standardBarMm);
    const totalBarLengthAvail = barsRequired * standardBarMm;
    const scrapLossMm = Math.max(80, totalBarLengthAvail - totalCutLength);
    const offCutReusableMm = scrapLossMm > 800 ? scrapLossMm - 80 : 0;
    const actualWasteMm = scrapLossMm - offCutReusableMm;
    const nestingYield = (((totalCutLength + offCutReusableMm) / totalBarLengthAvail) * 100).toFixed(1);

    return {
      totalAreaM2: totalAreaM2.toFixed(2),
      linearProfileMeters: linearProfileMeters.toFixed(1),
      totalWeightKg: totalWeightKg.toFixed(1),
      gasketMeters: gasketMeters.toFixed(1),
      aluminiumCost: Math.round(aluminiumCost),
      glassCost: Math.round(glassCost),
      hardwareCost: currentSystem.baseHardwareCost,
      directCost: Math.round(directCost),
      finalPrice: Math.round(finalPrice),
      cutPieces,
      barsRequired,
      nestingYield,
      offCutReusableMm,
      actualWasteMm,
    };
  }, [selectedSystemId, width, height, selectedGlass, currentSystem]);

  const triggerOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 400);
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl overflow-hidden shadow-xs relative text-[#0B1530]">
      {/* Subtle CAD Grid */}
      <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

      {/* Top Application Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3.5 bg-[#F7FAFF] border-b border-[#D0DCF0] relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2 h-2 rounded-full bg-[#1B4FD6]" />
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            <span className="w-2 h-2 rounded-full bg-[#C9DCF5]" />
          </div>
          <span className="text-xs font-mono text-[#4A5B7A] flex items-center gap-2">
            <span>FEN1 STUDIO</span>
            <span className="text-[#4A5B7A]">/</span>
            <span>PARAMETRIC CAD & 1D BILLET OPTIMIZER</span>
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#D9E7FA] p-1 rounded-full border border-[#D0DCF0]">
          <button
            onClick={() => setActiveTab("designer")}
            className={cn(
              "px-3.5 py-1 text-xs rounded-full transition-all flex items-center gap-1.5 font-normal",
              activeTab === "designer"
                ? "bg-[#FFFFFF] text-[#0B1530] border border-[#D0DCF0] shadow-xs"
                : "text-[#4A5B7A] hover:text-[#0B1530]"
            )}
          >
            <Sliders className="w-3 h-3 text-[#1B4FD6]" /> 2D Elevation
          </button>
          <button
            onClick={() => setActiveTab("optimizer")}
            className={cn(
              "px-3.5 py-1 text-xs rounded-full transition-all flex items-center gap-1.5 font-normal",
              activeTab === "optimizer"
                ? "bg-[#FFFFFF] text-[#0B1530] border border-[#D0DCF0] shadow-xs"
                : "text-[#4A5B7A] hover:text-[#0B1530]"
            )}
          >
            <Factory className="w-3 h-3 text-[#1B4FD6]" /> 1D Bar Nesting
          </button>
          <button
            onClick={() => setActiveTab("bom")}
            className={cn(
              "px-3.5 py-1 text-xs rounded-full transition-all flex items-center gap-1.5 font-normal",
              activeTab === "bom"
                ? "bg-[#FFFFFF] text-[#0B1530] border border-[#D0DCF0] shadow-xs"
                : "text-[#4A5B7A] hover:text-[#0B1530]"
            )}
          >
            <Calculator className="w-3 h-3 text-[#1B4FD6]" /> Live Costing & BOQ
          </button>
        </div>
      </div>

      {/* Main Studio Canvas Area */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Interactive Parametric Elevation Canvas */}
        <div className="lg:col-span-7 bg-[#F7FAFF] border border-[#D0DCF0] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          {/* System Selection Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {SYSTEMS.map((sys) => (
              <button
                key={sys.id}
                onClick={() => handleSystemChange(sys)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border shrink-0 font-normal",
                  selectedSystemId === sys.id
                    ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6] shadow-xs"
                    : "bg-[#FFFFFF] text-[#4A5B7A] border-[#D0DCF0] hover:text-[#0B1530]"
                )}
              >
                {sys.name}
              </button>
            ))}
          </div>

          {/* SVG CAD Elevation Box */}
          <div className="relative h-64 sm:h-72 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] p-4 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-cad-grid-dense opacity-20" />

            {/* Dynamic Scaled Elevation SVG */}
            <svg
              viewBox="0 0 500 300"
              className="w-full h-full max-w-[460px] relative z-10 transition-all duration-300"
            >
              {/* Elevation Rendering based on System */}
              {selectedSystemId === "sliding-2t" && (
                <g>
                  <rect x="50" y="30" width="400" height="230" fill="#E3EDFB" stroke={selectedFinish.stroke} strokeWidth="2" />
                  <rect x="58" y="38" width="200" height="214" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <rect x="242" y="38" width="200" height="214" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <line x1="250" y1="38" x2="250" y2="252" stroke="#2563EB" strokeWidth="2.5" />
                  <text x="145" y="145" fill="#0B1530" fontSize="10" fontWeight="normal" textAnchor="middle">SASH 01</text>
                  <text x="345" y="145" fill="#0B1530" fontSize="10" fontWeight="normal" textAnchor="middle">SASH 02</text>
                  <text x="145" y="162" fill="#2563EB" fontSize="9" textAnchor="middle">{selectedGlass.uValue}</text>
                  <text x="345" y="162" fill="#2563EB" fontSize="9" textAnchor="middle">{selectedGlass.uValue}</text>
                </g>
              )}

              {selectedSystemId === "sliding-3t" && (
                <g>
                  <rect x="40" y="30" width="420" height="230" fill="#E3EDFB" stroke={selectedFinish.stroke} strokeWidth="2" />
                  <rect x="48" y="38" width="138" height="214" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <rect x="181" y="38" width="138" height="214" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <rect x="314" y="38" width="138" height="214" fill="rgba(158, 132, 103, 0.08)" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="117" y="145" fill="#0B1530" fontSize="9" fontWeight="normal" textAnchor="middle">GLASS</text>
                  <text x="250" y="145" fill="#0B1530" fontSize="9" fontWeight="normal" textAnchor="middle">GLASS</text>
                  <text x="383" y="145" fill="#4A5B7A" fontSize="9" fontWeight="normal" textAnchor="middle">SS MESH</text>
                </g>
              )}

              {selectedSystemId === "casement" && (
                <g>
                  <rect x="60" y="30" width="380" height="230" fill="#E3EDFB" stroke={selectedFinish.stroke} strokeWidth="2" />
                  <rect x="68" y="38" width="364" height="60" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <text x="250" y="72" fill="#4A5B7A" fontSize="9" fontWeight="normal" textAnchor="middle">TOP FIXED VENTILATOR</text>
                  <rect x="68" y="106" width="178" height="146" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <rect x="254" y="106" width="178" height="146" fill={selectedGlass.tint} stroke={selectedFinish.stroke} strokeWidth="1.5" />
                  <polyline points="68,106 246,179 68,252" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="3,3" />
                  <polyline points="432,106 254,179 432,252" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="3,3" />
                </g>
              )}

              {selectedSystemId === "curtain-wall" && (
                <g>
                  <rect x="40" y="25" width="420" height="240" fill="#E3EDFB" stroke={selectedFinish.stroke} strokeWidth="2" />
                  <line x1="180" y1="25" x2="180" y2="265" stroke="#0B1530" strokeWidth="4" />
                  <line x1="320" y1="25" x2="320" y2="265" stroke="#0B1530" strokeWidth="4" />
                  <line x1="40" y1="140" x2="460" y2="140" stroke="#0B1530" strokeWidth="3" />
                  <rect x="46" y="31" width="128" height="104" fill={selectedGlass.tint} stroke="#2563EB" strokeWidth="1" />
                  <rect x="186" y="31" width="128" height="104" fill={selectedGlass.tint} stroke="#2563EB" strokeWidth="1" />
                  <rect x="326" y="31" width="128" height="104" fill={selectedGlass.tint} stroke="#2563EB" strokeWidth="1" />
                  <rect x="46" y="146" width="128" height="113" fill="#E3EDFB" stroke="#0B1530" strokeWidth="1" />
                  <rect x="186" y="146" width="128" height="113" fill="#E3EDFB" stroke="#0B1530" strokeWidth="1" />
                  <rect x="326" y="146" width="128" height="113" fill="#E3EDFB" stroke="#0B1530" strokeWidth="1" />
                  <text x="250" y="205" fill="#4A5B7A" fontSize="9" fontWeight="normal" textAnchor="middle">SPANDREL PANEL</text>
                </g>
              )}

              {/* Dynamic Dimension Callouts */}
              <line x1="50" y1="15" x2="450" y2="15" stroke="#2563EB" strokeWidth="0.8" />
              <line x1="50" y1="11" x2="50" y2="19" stroke="#2563EB" strokeWidth="0.8" />
              <line x1="450" y1="11" x2="450" y2="19" stroke="#2563EB" strokeWidth="0.8" />
              <text x="250" y="12" fill="#0B1530" fontSize="9" textAnchor="middle" fontFamily="monospace">
                WIDTH: {width} mm
              </text>

              <line x1="475" y1="30" x2="475" y2="260" stroke="#2563EB" strokeWidth="0.8" />
              <line x1="471" y1="30" x2="479" y2="30" stroke="#2563EB" strokeWidth="0.8" />
              <line x1="471" y1="260" x2="479" y2="260" stroke="#2563EB" strokeWidth="0.8" />
              <text x="475" y="150" fill="#0B1530" fontSize="9" transform="rotate(90, 480, 150)" fontFamily="monospace">
                HEIGHT: {height} mm
              </text>
            </svg>
          </div>

          {/* Interactive Sliders for Live Dimension Scaling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-xs">
            <div className="space-y-1.5 p-3 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0]">
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Width:</span>
                <span className="text-[#0B1530] font-medium">{width} mm</span>
              </div>
              <input
                type="range"
                min={1200}
                max={4200}
                step={50}
                value={width}
                onChange={(e) => {
                  setWidth(Number(e.target.value));
                  triggerOptimization();
                }}
                className="w-full accent-[#0B1530] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 p-3 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0]">
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Height:</span>
                <span className="text-[#0B1530] font-medium">{height} mm</span>
              </div>
              <input
                type="range"
                min={1200}
                max={3600}
                step={50}
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                  triggerOptimization();
                }}
                className="w-full accent-[#0B1530] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: 1D Bar Nesting & Live Telemetry Panel */}
        <div className="lg:col-span-5 bg-[#F7FAFF] border border-[#D0DCF0] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-4">
            {/* Finish & Glass Selectors */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#7686A6] uppercase block font-mono">
                Surface Finish & Glass Spec
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={selectedFinish.id}
                  onChange={(e) => setSelectedFinish(FINISHES.find((f) => f.id === e.target.value) || FINISHES[0])}
                  className="p-2 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] text-[#0B1530] text-[11px] outline-none"
                >
                  {FINISHES.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

                <select
                  value={selectedGlass.id}
                  onChange={(e) => setSelectedGlass(GLASS_TYPES.find((g) => g.id === e.target.value) || GLASS_TYPES[0])}
                  className="p-2 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] text-[#0B1530] text-[11px] outline-none"
                >
                  {GLASS_TYPES.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 1D Bar Linear Nesting Visualizer */}
            <div className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-normal text-[#0B1530] flex items-center gap-1.5">
                  <Factory className="w-3.5 h-3.5 text-[#1B4FD6]" />
                  1D Billet Linear Nesting (6500mm)
                </span>
                <span className="text-xs font-mono text-[#0B1530] bg-[#D9E7FA] px-2 py-0.5 rounded border border-[#D0DCF0]">
                  {calculations.nestingYield}% Yield
                </span>
              </div>

              {/* Graphic Extrusion Bar with Subtle Segment Colors */}
              <div className="w-full h-6 bg-[#D9E7FA] rounded-md p-0.5 border border-[#D0DCF0] flex items-center gap-0.5 overflow-hidden">
                {calculations.cutPieces.slice(0, 5).map((piece, i) => (
                  <div
                    key={i}
                    style={{ width: `${Math.max(12, (piece.length / 6500) * 100)}%` }}
                    className="h-full rounded-sm bg-[#1B4FD6] flex items-center justify-center text-[9px] font-mono text-[#0B1530] truncate px-1"
                    title={`${piece.name}: ${piece.length}mm`}
                  >
                    {piece.length}
                  </div>
                ))}
                {calculations.offCutReusableMm > 0 && (
                  <div
                    style={{ width: `${Math.max(10, (calculations.offCutReusableMm / 6500) * 100)}%` }}
                    className="h-full rounded-sm bg-[#3B82F6] flex items-center justify-center text-[8px] font-mono text-[#0B1530] truncate"
                    title={`Reusable Off-Cut: ${calculations.offCutReusableMm}mm`}
                  >
                    Off-Cut
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#7686A6]">
                <span>Bars: <strong className="text-[#0B1530] font-normal">{calculations.barsRequired} Billet(s)</strong></span>
                <span>Off-Cut: <strong className="text-[#1B4FD6] font-normal">{calculations.offCutReusableMm} mm</strong></span>
                <span>Kerf: <strong className="text-[#4A5B7A] font-normal">{calculations.actualWasteMm} mm</strong></span>
              </div>
            </div>

            {/* Instant Dynamic Costing & Margin HUD */}
            <div className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] space-y-2 shadow-xs">
              <div className="flex justify-between items-baseline border-b border-[#D0DCF0] pb-2">
                <div>
                  <span className="text-[10px] font-mono text-[#7686A6] uppercase block">Unit Price (Estimated)</span>
                  <span className="text-xl font-light text-[#0B1530] tracking-tight">
                    ${calculations.finalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#7686A6] uppercase block">Calculated Margin</span>
                  <span className="text-xs font-mono text-[#1B4FD6]">+26.5% EBITDA</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="p-1.5 bg-[#F7FAFF] rounded border border-[#D0DCF0]">
                  <span className="text-[#7686A6] block">Profile Wt:</span>
                  <span className="text-[#0B1530]">{calculations.totalWeightKg} kg</span>
                </div>
                <div className="p-1.5 bg-[#F7FAFF] rounded border border-[#D0DCF0]">
                  <span className="text-[#7686A6] block">Glass Area:</span>
                  <span className="text-[#0B1530]">{calculations.totalAreaM2} m²</span>
                </div>
                <div className="p-1.5 bg-[#F7FAFF] rounded border border-[#D0DCF0]">
                  <span className="text-[#7686A6] block">Gaskets:</span>
                  <span className="text-[#0B1530]">{calculations.gasketMeters} m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#D0DCF0] flex items-center justify-between text-xs font-mono">
            <span className="text-[#4A5B7A]">Direct CNC Saw Telemetry</span>
            <span className="text-[#0B1530] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4FD6]" /> G-Code Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
