"use client";

import React, { useState } from "react";
import {
  Sliders,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";
import confetti from "canvas-confetti";

export default function DemoPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    industry: "Aluminium Window & Door Manufacturer",
    companySize: "50 - 250 Employees",
    currentSystem: "Excel + LogiKal",
    modules: ["Estimation", "Production", "Inventory", "Project Management"],
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#0B1530", "#2563EB", "#E3EDFB"],
    });
    setSubmitted(true);
  };

  const toggleModule = (modName: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(modName)
        ? prev.modules.filter((m) => m !== modName)
        : [...prev.modules, modName],
    }));
  };

  return (
    <div className="w-full bg-[#F7FAFF] text-[#0B1530]">
      {/* Header */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#D0DCF0]">
        <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
              Custom Enterprise Demonstration
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#0B1530] tracking-tight">
              See your business through Fen1.
            </h1>
            <p className="text-sm sm:text-base text-[#4A5B7A] font-sans leading-relaxed">
              We configure a live simulation loaded with your specific profile systems, glass databases, and machinery workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-20 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Col: Instant Self-Guided Tour & Value Props */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl space-y-4 shadow-xs font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#0B1530] font-medium uppercase text-xs">Self-Guided Sandbox</span>
                </div>
                <p className="text-[#4A5B7A] font-sans">
                  Don&apos;t want to wait? Test our live parametric window takeoff, CNC saw telemetry stream, and CRM pipeline immediately in your browser.
                </p>
                <button
                  onClick={() => setDemoOpen(true)}
                  className="w-full py-3 bg-[#1B4FD6] text-[#0B1530] font-normal uppercase rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Launch Live Simulator Now</span>
                </button>
              </div>

              <div className="p-6 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl space-y-3 font-mono text-xs shadow-xs">
                <span className="text-[10px] text-[#7686A6] uppercase tracking-widest block">
                  What Happens in Your Custom Demo:
                </span>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 text-[#0B1530]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4FD6] shrink-0 mt-0.5" />
                    <span>Live takeoff using your own architectural DWG / PDF drawings</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[#0B1530]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4FD6] shrink-0 mt-0.5" />
                    <span>Demonstration of CNC machine code generation for your exact saw models</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[#0B1530]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4FD6] shrink-0 mt-0.5" />
                    <span>Scrap reduction & linear nesting audit showing expected annual ROI</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[#0B1530]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4FD6] shrink-0 mt-0.5" />
                    <span>Multi-plant and mobile site installation walkthrough</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: High-Conversion Demo Request Form */}
            <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-10 font-mono text-xs shadow-xs">
              {submitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-12 h-12 bg-[#1B4FD6] rounded-full flex items-center justify-center text-[#0B1530] mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-normal text-[#0B1530]">Demo Scheduled Successfully</h3>
                  <p className="text-xs text-[#4A5B7A] font-sans max-w-md mx-auto">
                    Our technical solutions architect has received your specifications and will send a personalized calendar invitation with live mockups.
                  </p>
                  <button
                    onClick={() => setDemoOpen(true)}
                    className="px-6 py-2.5 bg-[#1B4FD6] text-[#0B1530] font-normal uppercase rounded-full hover:bg-[#BFD3F0] transition-colors cursor-pointer"
                  >
                    Open Live Interactive Simulator
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D0DCF0]">
                    <span className="text-[#0B1530] font-medium uppercase">Personalized Demo Request</span>
                    <span className="text-[#1B4FD6] text-[10px]">STEP 1 OF 1</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#7686A6] uppercase text-[10px] block">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Marcus Vance"
                        className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[#7686A6] uppercase text-[10px] block">Company Name</label>
                      <input
                        required
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Vance Architectural Glass"
                        className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#7686A6] uppercase text-[10px] block">Corporate Email</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="m.vance@vanceglass.com"
                        className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[#7686A6] uppercase text-[10px] block">Phone / Mobile</label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 349-2910"
                        className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#7686A6] uppercase text-[10px] block">Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] outline-none font-sans"
                      >
                        <option>Aluminium Window & Door Manufacturer</option>
                        <option>Architectural Glass Processing & Toughening</option>
                        <option>Glazing Contractor</option>
                        <option>Aluminium Fabricator & Job Shop</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[#7686A6] uppercase text-[10px] block">Company Size</label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] outline-none font-sans"
                      >
                        <option>10 - 50 Employees</option>
                        <option>50 - 250 Employees</option>
                        <option>250 - 1,000 Employees</option>
                        <option>1,000+ Enterprise Multi-Plant</option>
                      </select>
                    </div>
                  </div>

                  {/* Modules of Interest Multi-Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[#7686A6] uppercase text-[10px] block">
                      Interested Modules:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Estimation & Takeoff",
                        "CRM & Tenders",
                        "Engineering & CAD",
                        "Production & CNC",
                        "Inventory Control",
                        "Glazing Projects",
                        "Site Installation",
                        "Finance & Billing",
                        "Executive BI",
                      ].map((modName) => {
                        const isSelected = formData.modules.includes(modName);
                        return (
                          <button
                            type="button"
                            key={modName}
                            onClick={() => toggleModule(modName)}
                            className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#1B4FD6] border-[#3B82F6] text-[#0B1530]"
                                : "bg-[#F7FAFF] border-[#D0DCF0] text-[#4A5B7A] hover:text-[#0B1530]"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {modName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1B4FD6] text-[#0B1530] font-normal uppercase rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-3 text-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request a Fen1 Demo</span>
                  </button>
                </form>
              )}
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
