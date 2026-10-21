"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const NODES = [
  { id: "crm", name: "CRM", icon: Layers, x: 12, y: 18 },
  { id: "estimation", name: "ESTIMATION", icon: Calculator, x: 32, y: 12 },
  { id: "survey", name: "SURVEY", icon: Scan, x: 52, y: 12 },
  { id: "design", name: "DESIGN", icon: Compass, x: 72, y: 18 },
  { id: "projects", name: "PROJECTS", icon: Building2, x: 88, y: 34 },
  { id: "purchase", name: "PROCUREMENT", icon: ShoppingCart, x: 88, y: 62 },
  { id: "store", name: "STORE", icon: Boxes, x: 74, y: 84 },
  { id: "production", name: "PRODUCTION", icon: Factory, x: 50, y: 88 },
  { id: "quality", name: "QUALITY", icon: ShieldCheck, x: 26, y: 84 },
  { id: "logistics", name: "LOGISTICS", icon: Truck, x: 12, y: 64 },
  { id: "account", name: "ACCOUNT", icon: CreditCard, x: 12, y: 40 },
  { id: "hr", name: "HR", icon: Users, x: 26, y: 48 },
  { id: "analytics", name: "ANALYTICS", icon: BarChart3, x: 74, y: 48 },
];

export default function HeroArchitecturalVisual() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 rounded-2xl bg-[#FFFFFF] border border-[#D0DCF0] p-6 sm:p-8 shadow-sm overflow-hidden font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-4 mb-6 text-xs text-[#4A5B7A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5E8264]" />
          <span className="text-[#0B1530] font-semibold">FEN1 / ARCHITECTURAL ENGINE</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className={activeStep >= 0 ? "text-[#1B4FD6]" : "text-[#4A5B7A]"}>01. GEOMETRY</span>
          <span>→</span>
          <span className={activeStep >= 1 ? "text-[#1B4FD6]" : "text-[#4A5B7A]"}>02. PHYSICS & DIES</span>
          <span>→</span>
          <span className={activeStep >= 2 ? "text-[#1B4FD6]" : "text-[#4A5B7A]"}>03. DATA TELEMETRY</span>
          <span>→</span>
          <span className={activeStep >= 3 ? "text-[#1B4FD6]" : "text-[#4A5B7A]"}>04. ERP NETWORK</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-[#E3EEFC] rounded-xl border border-[#D0DCF0] overflow-hidden flex items-center justify-center">
        {/* Subtle Architectural Grid Background */}
        <div className="absolute inset-0 bg-cad-grid opacity-60" />

        {/* Center Elevation SVG */}
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full absolute inset-0 transition-all duration-700 pointer-events-none"
        >
          <defs>
            <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Grid Substrate lines */}
          <line x1="100" y1="50" x2="700" y2="50" stroke="#C5D6F0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="100" y1="250" x2="700" y2="250" stroke="#C5D6F0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="100" y1="450" x2="700" y2="450" stroke="#C5D6F0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="200" y1="30" x2="200" y2="470" stroke="#C5D6F0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="400" y1="30" x2="400" y2="470" stroke="#C5D6F0" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="600" y1="30" x2="600" y2="470" stroke="#C5D6F0" strokeWidth="1" strokeDasharray="4 4" />

          {/* Unitized Glazing Panels */}
          {/* Panel 1 */}
          <rect x="220" y="80" width="160" height="150" fill="url(#glassReflect)" stroke="#0B1530" strokeWidth="2.5" />
          <rect x="230" y="90" width="140" height="130" fill="transparent" stroke="#2563EB" strokeWidth="1" />

          {/* Panel 2 */}
          <rect x="420" y="80" width="160" height="150" fill="url(#glassReflect)" stroke="#0B1530" strokeWidth="2.5" />
          <rect x="430" y="90" width="140" height="130" fill="transparent" stroke="#2563EB" strokeWidth="1" />

          {/* Panel 3 (Bottom) */}
          <rect x="220" y="270" width="160" height="150" fill="url(#glassReflect)" stroke="#0B1530" strokeWidth="2.5" />
          <rect x="230" y="280" width="140" height="130" fill="transparent" stroke="#2563EB" strokeWidth="1" />

          {/* Panel 4 (Bottom) */}
          <rect x="420" y="270" width="160" height="150" fill="url(#glassReflect)" stroke="#0B1530" strokeWidth="2.5" />
          <rect x="430" y="280" width="140" height="130" fill="transparent" stroke="#2563EB" strokeWidth="1" />

          {/* Structural Mullion & Transom Lines */}
          <line x1="400" y1="60" x2="400" y2="440" stroke="#0B1530" strokeWidth="4" />
          <line x1="200" y1="250" x2="600" y2="250" stroke="#0B1530" strokeWidth="4" />

          {/* Technical Dimension Callouts */}
          <g className="text-[10px] font-mono fill-[#4A5B7A]">
            <text x="220" y="70">W: 1600 mm</text>
            <text x="500" y="70">W: 1600 mm</text>
            <text x="130" y="160">H: 1500 mm</text>
            <text x="130" y="350">H: 1500 mm</text>
            <text x="405" y="240" fill="#2563EB" fontSize="9">MULLION: DIE-6063-T6 / Ix: 184.2 cm⁴</text>
          </g>

          {/* Digital Network Connecting Lines */}
          <g stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity={activeStep >= 2 ? 0.7 : 0.2}>
            <line x1="400" y1="250" x2="160" y2="120" />
            <line x1="400" y1="250" x2="640" y2="120" />
            <line x1="400" y1="250" x2="160" y2="380" />
            <line x1="400" y1="250" x2="640" y2="380" />
            <line x1="400" y1="250" x2="400" y2="60" />
            <line x1="400" y1="250" x2="400" y2="440" />
          </g>
        </svg>

        {/* Center FEN1 Core Hub */}
        <div className="relative z-20 flex flex-col items-center justify-center p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#3B82F6] shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#1B4FD6] rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 border border-[#B8D4FB] rotate-45" />
            </div>
            <span className="text-sm font-bold text-[#0B1530] tracking-tight">FEN1 OS</span>
          </div>
          <span className="text-[9px] text-[#1B4FD6] uppercase mt-1">CONNECTED CORE</span>
        </div>

        {/* Orbiting ERP Data Nodes */}
        {NODES.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.id}
              style={{ top: `${node.y}%`, left: `${node.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D0DCF0] shadow-xs text-[10px] text-[#0B1530] hover:border-[#B8D4FB] transition-colors"
            >
              <Icon className="w-3 h-3 text-[#1B4FD6]" />
              <span className="font-medium hidden sm:inline">{node.name}</span>
            </div>
          );
        })}
      </div>

      {/* Footer telemetry status */}
      <div className="mt-4 pt-3 border-t border-[#D0DCF0] flex flex-wrap items-center justify-between text-xs text-[#4A5B7A] gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-[#1B4FD6]">LIVE TELEMETRY:</span>
          <span>Parametric CAD Engine Active</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Linear Scrap: &lt; 3.2%</span>
          <span>BOM Accuracy: 99.9%</span>
          <span>CNC Sync: Real-Time</span>
        </div>
      </div>
    </div>
  );
}
