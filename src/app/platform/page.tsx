"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";

export default function PlatformPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530] font-sans">
      {/* Platform Hero */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#D0DCF0]">
        <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
              Enterprise Platform Architecture
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
              The Operating System Infrastructure.
            </h1>
            <p className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed">
              Event-driven architecture unifying CAD geometry, CNC machine telemetry, warehouse barcode tracking, and multi-currency accounting.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setDemoOpen(true)}
                className="px-6 py-3 bg-[#1B4FD6] text-[#0B1530] font-normal text-xs uppercase tracking-wider rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Launch Interactive Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Layered System Architecture Breakdown */}
      <section className="py-20 bg-[#D9E7FA] border-b border-[#D0DCF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
              Full-Stack Resilience
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#0B1530] tracking-tight">
              Five Interconnected Layers
            </h2>
          </div>

          <div className="space-y-3 font-mono">
            {/* Layer 1 */}
            <div className="p-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3B82F6] transition-colors shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#1B4FD6] block">LAYER 01: EDGE & CLIENT</span>
                <h3 className="text-base font-normal text-[#0B1530]">Mobile Field App & Factory Terminals</h3>
                <p className="text-xs text-[#4A5B7A] font-sans">
                  Offline-first sync for high-rise site installation, touch kiosks on shop floors, and dealer quotation tools.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F7FAFF] text-[#0B1530] border border-[#D0DCF0] shrink-0 self-start md:self-auto">
                PWA & Offline Sync
              </span>
            </div>

            {/* Layer 2 */}
            <div className="p-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3B82F6] transition-colors shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#1B4FD6] block">LAYER 02: PARAMETRIC CAD/CAM</span>
                <h3 className="text-base font-normal text-[#0B1530]">Direct DXF Ingestion & Structural Physics</h3>
                <p className="text-xs text-[#4A5B7A] font-sans">
                  Computes glass stress, thermal U-values, linear bar nesting, and double-miter saw G-code files.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F7FAFF] text-[#0B1530] border border-[#D0DCF0] shrink-0 self-start md:self-auto">
                &lt; 50ms Geometry Engine
              </span>
            </div>

            {/* Layer 3 */}
            <div className="p-5 bg-[#FFFFFF] border border-[#3B82F6] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#1B4FD6] block">LAYER 03: EVENT STREAM BUS</span>
                <h3 className="text-base font-normal text-[#0B1530]">Real-Time Enterprise Telemetry</h3>
                <p className="text-xs text-[#4A5B7A] font-sans">
                  When a panel is cut at a saw or scanned at a crane hoist, ledgers and stock balances update instantly.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#1B4FD6] text-[#0B1530] shrink-0 self-start md:self-auto">
                Real-Time Bus
              </span>
            </div>

            {/* Layer 4 */}
            <div className="p-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3B82F6] transition-colors shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#1B4FD6] block">LAYER 04: GOVERNANCE & FINANCE</span>
                <h3 className="text-base font-normal text-[#0B1530]">Progress Billing & Project EBITDA</h3>
                <p className="text-xs text-[#4A5B7A] font-sans">
                  IFRS 15 percentage-of-completion accounting, bank guarantee expiries, and material reconciliation.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F7FAFF] text-[#0B1530] border border-[#D0DCF0] shrink-0 self-start md:self-auto">
                ACID Ledger
              </span>
            </div>

            {/* Layer 5 */}
            <div className="p-5 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#3B82F6] transition-colors shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#1B4FD6] block">LAYER 05: IOT INDUSTRIAL GATEWAY</span>
                <h3 className="text-base font-normal text-[#0B1530]">CNC Machines & PLC Telemetry</h3>
                <p className="text-xs text-[#4A5B7A] font-sans">
                  Direct links to Elumatec, Emmegi, FOM Industrie, Schüco, Glaston, and Lisec machine controllers.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F7FAFF] text-[#0B1530] border border-[#D0DCF0] shrink-0 self-start md:self-auto">
                OPC-UA / MQTT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section id="security" className="py-20 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
                Enterprise Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-[#0B1530] tracking-tight">
                Security at architectural scale.
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5B7A] leading-relaxed">
                Proprietary extrusion die geometries, cost formulas, and multi-million dollar tender bids are protected with banking-grade encryption.
              </p>

              <div className="space-y-2 pt-1 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#0B1530]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4FD6]" />
                  <span>SOC 2 Type II Certified & ISO 27001 Audited</span>
                </div>
                <div className="flex items-center gap-2 text-[#0B1530]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4FD6]" />
                  <span>Granular Role-Based Access Control (RBAC)</span>
                </div>
                <div className="flex items-center gap-2 text-[#0B1530]">
                  <CheckCircle2 className="w-4 h-4 text-[#1B4FD6]" />
                  <span>AES-256 Data Encryption at Rest & TLS 1.3 in Transit</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-5 font-mono text-xs space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#D0DCF0]">
                <span className="text-[#0B1530] uppercase">Security & Audit</span>
                <span className="text-[#1B4FD6]">COMPLIANCE ACTIVE</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] flex justify-between">
                  <span className="text-[#4A5B7A]">Multi-Tenant Isolation:</span>
                  <span className="text-[#0B1530]">Row-Level Security</span>
                </div>
                <div className="p-2.5 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] flex justify-between">
                  <span className="text-[#4A5B7A]">Single Sign-On (SSO):</span>
                  <span className="text-[#0B1530]">SAML 2.0 / Okta / Azure</span>
                </div>
                <div className="p-2.5 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] flex justify-between">
                  <span className="text-[#4A5B7A]">Audit Trail:</span>
                  <span className="text-[#1B4FD6]">Immutable Ledger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InteractiveLiveDemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </div>
  );
}
