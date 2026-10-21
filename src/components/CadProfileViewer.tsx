"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILES = [
  {
    id: "mullion-150",
    name: "Heavy-Duty Mullion 150mm",
    system: "Schüco FWS 50 / Reynaers CW 50",
    depth: "150 mm",
    faceWidth: "50 mm",
    thermalBreak: "34 mm Polyamide PA66 GF25",
    momentOfInertiaIx: "428.4 cm⁴",
    momentOfInertiaIy: "38.2 cm⁴",
    maxWindLoad: "4.2 kPa",
    weightPerMeter: "4.82 kg/m",
    alloy: "EN AW-6063 T6",
  },
  {
    id: "window-frame-75",
    name: "Casement Frame 75mm",
    system: "Schüco AWS 75.SI+ Super Insulation",
    depth: "75 mm",
    faceWidth: "62 mm",
    thermalBreak: "40 mm Foam Insulated Polyamide",
    momentOfInertiaIx: "32.6 cm⁴",
    momentOfInertiaIy: "18.4 cm⁴",
    maxWindLoad: "3.2 kPa",
    weightPerMeter: "2.14 kg/m",
    alloy: "EN AW-6060 T66",
  },
  {
    id: "sliding-door-interlock",
    name: "Minimalist Interlock Stile",
    system: "Cortizo Cor Vision Plus / Reynaers Hi-Finity",
    depth: "115 mm",
    faceWidth: "25 mm (Ultra Slim)",
    thermalBreak: "28 mm Reinforced Polyamide",
    momentOfInertiaIx: "184.2 cm⁴",
    momentOfInertiaIy: "12.8 cm⁴",
    maxWindLoad: "3.6 kPa",
    weightPerMeter: "3.90 kg/m",
    alloy: "EN AW-6063 T6",
  },
];

export default function CadProfileViewer() {
  const [selectedProfile, setSelectedProfile] = useState(PROFILES[0]);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showThermalBreak, setShowThermalBreak] = useState(true);

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-8 font-mono relative overflow-hidden shadow-xs">
      <div className="absolute inset-0 bg-cad-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D0DCF0] pb-5 mb-6 relative z-10">
        <div>
          <span className="text-[10px] uppercase text-[#1B4FD6] tracking-widest block mb-1">
            Parametric Die CAD Cross-Section
          </span>
          <h3 className="text-xl font-light text-[#0B1530] tracking-tight">
            Direct DXF Extrusion Synchronization
          </h3>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfile(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border font-normal",
                selectedProfile.id === p.id
                  ? "bg-[#1B4FD6] border-[#3B82F6] text-[#0B1530] shadow-xs"
                  : "bg-[#F7FAFF] border-[#D0DCF0] text-[#4A5B7A] hover:text-[#0B1530]"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* CAD Canvas Visualization Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* SVG Drawing Canvas */}
        <div className="lg:col-span-7 bg-[#F7FAFF] border border-[#D0DCF0] rounded-xl p-6 h-[340px] flex items-center justify-center relative overflow-hidden shadow-xs">
          <div className="absolute inset-0 bg-cad-grid-dense opacity-30" />

          {/* Render Vector CAD Cross-Section */}
          <svg
            viewBox="0 0 500 300"
            className="w-full h-full max-w-[440px] relative z-10 stroke-[#0B1530] fill-none"
          >
            {/* Outer Profile Aluminium Wall */}
            <path
              d="M 60,60 L 440,60 L 440,90 L 380,90 L 380,120 L 440,120 L 440,240 L 340,240 L 340,210 L 300,210 L 300,240 L 60,240 L 60,180 L 120,180 L 120,120 L 60,120 Z"
              strokeWidth="2"
              fill="rgba(158, 132, 103, 0.08)"
            />

            {/* Inner Screw Port Bosses & Gasket Channels */}
            <circle cx="250" cy="150" r="14" strokeWidth="1.5" stroke="rgba(82, 82, 91, 0.5)" />
            <circle cx="250" cy="150" r="8" strokeWidth="1.5" stroke="#2563EB" />
            <rect x="360" y="80" width="16" height="12" strokeWidth="1.5" stroke="#4A5B7A" />
            <rect x="124" y="140" width="16" height="20" strokeWidth="1.5" stroke="#4A5B7A" />

            {/* Polyamide Thermal Break Strut */}
            {showThermalBreak && (
              <g>
                <rect
                  x="200"
                  y="62"
                  width="40"
                  height="26"
                  fill="rgba(158, 132, 103, 0.15)"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                <rect
                  x="200"
                  y="212"
                  width="40"
                  height="26"
                  fill="rgba(158, 132, 103, 0.15)"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                <text x="188" y="52" fill="#2563EB" fontSize="9" fontFamily="monospace">
                  PA66 STRUT (34mm)
                </text>
              </g>
            )}

            {/* Dimension Callout Lines */}
            {showDimensions && (
              <g stroke="#2563EB" strokeWidth="1">
                {/* Horizontal Width */}
                <line x1="60" y1="35" x2="440" y2="35" />
                <line x1="60" y1="30" x2="60" y2="40" />
                <line x1="440" y1="30" x2="440" y2="40" />
                <text x="220" y="28" fill="#0B1530" fontSize="10" fontFamily="monospace">
                  W: {selectedProfile.depth}
                </text>

                {/* Vertical Height */}
                <line x1="470" y1="60" x2="470" y2="240" />
                <line x1="465" y1="60" x2="475" y2="60" />
                <line x1="465" y1="240" x2="475" y2="240" />
                <text x="450" y="155" fill="#0B1530" fontSize="10" fontFamily="monospace" transform="rotate(90, 480, 150)">
                  H: {selectedProfile.faceWidth}
                </text>
              </g>
            )}
          </svg>

          {/* Toggle Controls */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={cn(
                "px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                showDimensions ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6]" : "bg-[#FFFFFF] text-[#4A5B7A] border-[#D0DCF0]"
              )}
            >
              Dimensions
            </button>
            <button
              onClick={() => setShowThermalBreak(!showThermalBreak)}
              className={cn(
                "px-2.5 py-1 text-[10px] rounded-md border transition-colors",
                showThermalBreak ? "bg-[#3B82F6] text-[#0B1530] border-[#B8D4FB]" : "bg-[#FFFFFF] text-[#4A5B7A] border-[#D0DCF0]"
              )}
            >
              Thermal Break
            </button>
          </div>
        </div>

        {/* Structural Physics & Engineering Attributes */}
        <div className="lg:col-span-5 space-y-3 text-xs">
          <div className="p-4 bg-[#F7FAFF] rounded-xl border border-[#D0DCF0] space-y-2.5 shadow-xs">
            <span className="text-[10px] text-[#7686A6] uppercase tracking-wider block">
              Structural Physics & Load Ratings
            </span>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">System:</span>
                <span className="text-[#0B1530] font-normal">{selectedProfile.system}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Moment of Inertia (Ix):</span>
                <span className="text-[#1B4FD6] font-normal">{selectedProfile.momentOfInertiaIx}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Moment of Inertia (Iy):</span>
                <span className="text-[#1B4FD6] font-normal">{selectedProfile.momentOfInertiaIy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Max Wind Pressure:</span>
                <span className="text-[#0B1530] font-normal">{selectedProfile.maxWindLoad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Linear Mass:</span>
                <span className="text-[#0B1530] font-normal">{selectedProfile.weightPerMeter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B7A]">Alloy Grade:</span>
                <span className="text-[#0B1530] font-normal">{selectedProfile.alloy}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#D9E7FA] rounded-lg border border-[#D0DCF0] flex items-center gap-2 text-[#0B1530] text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-[#1B4FD6] shrink-0" />
            <span>Auto-generates CNC Saw G-Code & Barcode Labels</span>
          </div>
        </div>
      </div>
    </div>
  );
}
