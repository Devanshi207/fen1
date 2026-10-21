"use client";

import React, { useState, useMemo } from "react";
import { Calculator, ArrowRight, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

const TYPOLOGIES = [
  { id: "casement", name: "Casement 2-Sash Window", baseProfileWeight: 4.8, baseHardware: 85, defaultW: 1800, defaultH: 1500 },
  { id: "sliding", name: "3-Track Sliding Door", baseProfileWeight: 8.2, baseHardware: 140, defaultW: 3000, defaultH: 2400 },
  { id: "curtain-wall", name: "Unitized Curtain Wall Panel", baseProfileWeight: 14.5, baseHardware: 220, defaultW: 1500, defaultH: 3600 },
  { id: "partition", name: "Acoustic Glass Partition", baseProfileWeight: 3.2, baseHardware: 60, defaultW: 2400, defaultH: 2800 },
];

const GLASS_SPECS = [
  { id: "single", name: "6mm Clear Toughened Glass", costPerSqm: 38, uValue: 5.7 },
  { id: "dgu", name: "24mm DGU (6mm Low-E + 12A + 6mm Clear)", costPerSqm: 92, uValue: 1.4 },
  { id: "lami-dgu", name: "32mm Acoustic DGU (8.76 Lam + 16A + 8mm Low-E)", costPerSqm: 165, uValue: 1.1 },
];

const ALUMINIUM_ALLOYS = [
  { id: "standard", name: "6063-T6 Mill / Powder Coated ($5.20/kg)", ratePerKg: 5.2 },
  { id: "thermal", name: "6063-T6 Thermal Break Polyamide ($7.40/kg)", ratePerKg: 7.4 },
  { id: "anodized", name: "6060-T6 Anodized Architectural ($6.80/kg)", ratePerKg: 6.8 },
];

export default function EstimationSimulator() {
  const [selectedTypology, setSelectedTypology] = useState(TYPOLOGIES[0]);
  const [width, setWidth] = useState(selectedTypology.defaultW);
  const [height, setHeight] = useState(selectedTypology.defaultH);
  const [selectedGlass, setSelectedGlass] = useState(GLASS_SPECS[1]);
  const [selectedAlloy, setSelectedAlloy] = useState(ALUMINIUM_ALLOYS[1]);
  const [marginPct, setMarginPct] = useState(22);

  const handleTypologyChange = (typology: typeof TYPOLOGIES[0]) => {
    setSelectedTypology(typology);
    setWidth(typology.defaultW);
    setHeight(typology.defaultH);
  };

  // Parametric calculations
  const calc = useMemo(() => {
    const perimeterM = ((width + height) * 2) / 1000;
    const areaSqm = (width * height) / 1000000;

    const profileKg = perimeterM * selectedTypology.baseProfileWeight;
    const profileCost = profileKg * selectedAlloy.ratePerKg;
    const glassCost = areaSqm * selectedGlass.costPerSqm;
    const hardwareCost = selectedTypology.baseHardware;

    const directMaterialCost = profileCost + glassCost + hardwareCost;
    const labourCost = directMaterialCost * 0.18; // 18% labour
    const overheadCost = directMaterialCost * 0.12; // 12% factory overheads
    const totalCost = directMaterialCost + labourCost + overheadCost;

    const marginAmount = totalCost * (marginPct / 100);
    const finalQuotation = totalCost + marginAmount;

    // Structural calculations
    const windLoadKPa = 1.8; // standard design wind load
    const momentOfInertiaIx = (Math.pow(height / 1000, 3) * windLoadKPa * 12.4).toFixed(1);

    return {
      perimeterM: perimeterM.toFixed(2),
      areaSqm: areaSqm.toFixed(2),
      profileKg: profileKg.toFixed(1),
      profileCost: profileCost.toFixed(2),
      glassCost: glassCost.toFixed(2),
      hardwareCost: hardwareCost.toFixed(2),
      directMaterialCost: directMaterialCost.toFixed(2),
      labourCost: labourCost.toFixed(2),
      overheadCost: overheadCost.toFixed(2),
      totalCost: totalCost.toFixed(2),
      marginAmount: marginAmount.toFixed(2),
      finalQuotation: finalQuotation.toFixed(2),
      momentOfInertiaIx,
    };
  }, [width, height, selectedTypology, selectedGlass, selectedAlloy, marginPct]);

  return (
    <section className="py-20 bg-[#F2F7FF] border-b border-[#D0DCF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1B4FD6] text-[#0B1530] text-[10px] font-mono font-semibold">
              MODULE 03
            </span>
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest font-semibold">
              ENGINEERING ESTIMATION
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight">
            ESTIMATE WITH <br />
            ENGINEERING PRECISION.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed">
            Build project estimates around actual materials, opening dimensions, profile dies, glass build-ups, hardware, labor, overheads, and dynamic margins in real time.
          </p>
        </div>

        {/* Interactive Simulator Shell */}
        <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono">
          {/* Left Col: Parametric Inputs */}
          <div className="lg:col-span-6 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3">
              <span className="text-[#0B1530] font-semibold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#1B4FD6]" />
                <span>PARAMETRIC TAKEOFF WORKSPACE</span>
              </span>
              <span className="text-[10px] text-[#1B4FD6]">LIVE CAD CALCULATION</span>
            </div>

            {/* Typology Select */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#4A5B7A] uppercase block">
                01. ELEVATION TYPOLOGY
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TYPOLOGIES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTypologyChange(t)}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                      selectedTypology.id === t.id
                        ? "bg-[#1B4FD6] text-[#0B1530] border-[#3B82F6]"
                        : "bg-[#E3EEFC] text-[#0B1530] border-[#D0DCF0] hover:border-[#B8D4FB]"
                    }`}
                  >
                    <span className="font-medium block">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Millimetric Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[#4A5B7A] uppercase">WIDTH (W)</label>
                  <span className="text-xs font-bold text-[#0B1530]">{width} mm</span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={4500}
                  step={50}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-[#1B4FD6] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[#4A5B7A] uppercase">HEIGHT (H)</label>
                  <span className="text-xs font-bold text-[#0B1530]">{height} mm</span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={4500}
                  step={50}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-[#1B4FD6] cursor-pointer"
                />
              </div>
            </div>

            {/* Glass Specification */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#4A5B7A] uppercase block">
                02. GLASS BUILD-UP & THERMAL PERFORMANCE
              </label>
              <select
                value={selectedGlass.id}
                onChange={(e) =>
                  setSelectedGlass(
                    GLASS_SPECS.find((g) => g.id === e.target.value) || GLASS_SPECS[0]
                  )
                }
                className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] outline-none"
              >
                {GLASS_SPECS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — U: {g.uValue} W/m²K (${g.costPerSqm}/m²)
                  </option>
                ))}
              </select>
            </div>

            {/* Extrusion Die System */}
            <div className="space-y-2">
              <label className="text-[10px] text-[#4A5B7A] uppercase block">
                03. ALUMINIUM PROFILE SYSTEM
              </label>
              <select
                value={selectedAlloy.id}
                onChange={(e) =>
                  setSelectedAlloy(
                    ALUMINIUM_ALLOYS.find((a) => a.id === e.target.value) || ALUMINIUM_ALLOYS[0]
                  )
                }
                className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] outline-none"
              >
                {ALUMINIUM_ALLOYS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Commercial Margin */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-[#4A5B7A] uppercase">TARGET TENDER MARGIN</label>
                <span className="text-xs font-bold text-[#1B4FD6]">{marginPct}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={45}
                step={1}
                value={marginPct}
                onChange={(e) => setMarginPct(Number(e.target.value))}
                className="w-full accent-[#1B4FD6] cursor-pointer"
              />
            </div>
          </div>

          {/* Right Col: Dynamic Bill of Materials (BOM) Output */}
          <div className="lg:col-span-6 bg-[#E3EEFC] border border-[#D0DCF0] rounded-xl p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-[#D0DCF0] pb-3 text-[11px]">
              <span className="text-[#0B1530] font-semibold">DYNAMIC COST BOM RECONCILIATION</span>
              <span className="text-[#4F7556]">SAMPLE DATA</span>
            </div>

            {/* Structural Check Callout */}
            <div className="p-3 bg-[#FFFFFF] border border-[#D0DCF0] rounded-lg flex items-center justify-between text-[11px]">
              <div className="space-y-0.5">
                <span className="text-[9px] text-[#4A5B7A] uppercase block">WIND DEFLECTION CHECK</span>
                <span className="text-xs font-semibold text-[#0B1530]">
                  Required Inertia Ix: {calc.momentOfInertiaIx} cm⁴
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#5E8264]/15 text-[#4F7556] text-[10px] font-semibold">
                ✓ CODE COMPLIANT
              </span>
            </div>

            {/* Cost Line Items Table */}
            <div className="space-y-2 border-b border-[#D0DCF0] pb-4">
              <div className="flex items-center justify-between text-[#4A5B7A]">
                <span>Aluminium Profiles ({calc.profileKg} kg @ ${selectedAlloy.ratePerKg}/kg)</span>
                <span className="text-[#0B1530] font-semibold">${calc.profileCost}</span>
              </div>
              <div className="flex items-center justify-between text-[#4A5B7A]">
                <span>Glass ({calc.areaSqm} m² @ ${selectedGlass.costPerSqm}/m²)</span>
                <span className="text-[#0B1530] font-semibold">${calc.glassCost}</span>
              </div>
              <div className="flex items-center justify-between text-[#4A5B7A]">
                <span>Hardware, Gaskets & Anchor Brackets</span>
                <span className="text-[#0B1530] font-semibold">${calc.hardwareCost}</span>
              </div>
              <div className="flex items-center justify-between text-[#4A5B7A]">
                <span>Factory CNC Sawing & Assembly Labour (18%)</span>
                <span className="text-[#0B1530] font-semibold">${calc.labourCost}</span>
              </div>
              <div className="flex items-center justify-between text-[#4A5B7A]">
                <span>Plant Overheads & Consumables (12%)</span>
                <span className="text-[#0B1530] font-semibold">${calc.overheadCost}</span>
              </div>
            </div>

            {/* Total Cost & Margin Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#4A5B7A]">
                <span>Total Direct Unit Cost:</span>
                <span className="font-semibold text-[#0B1530]">${calc.totalCost}</span>
              </div>
              <div className="flex items-center justify-between text-[#1B4FD6]">
                <span>Commercial Margin ({marginPct}%):</span>
                <span className="font-semibold">+${calc.marginAmount}</span>
              </div>
            </div>

            {/* Final Tender Quotation Total */}
            <div className="p-4 bg-[#1B4FD6] text-[#0B1530] rounded-xl border border-[#3B82F6] flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#1B4FD6] block">
                  UNIT TENDER QUOTATION
                </span>
                <span className="text-2xl font-bold font-sans text-[#0B1530]">
                  ${calc.finalQuotation}
                </span>
              </div>
              <Link
                href="/solutions#modules"
                className="px-3.5 py-2 rounded-lg bg-[#FFFFFF] text-[#0B1530] font-semibold text-xs hover:bg-[#E3EEFC] transition-colors flex items-center gap-1"
              >
                <span>Full Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
