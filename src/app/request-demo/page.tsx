"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import KineticHeading from "@/components/KineticHeading";

export default function RequestDemoPage() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const submitted = status === "sent";
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    businessType: "Aluminium Windows & Doors",
    email: "",
    phone: "",
    currentSystem: "Spreadsheets / Legacy CAD",
    interestedModules: "Estimation, Production & Projects",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const ok = await submitEnquiry("demo", formData);
    setStatus(ok ? "sent" : "error");
  };

  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans">
      {/* Header */}
      <section className="pt-20 pb-16 border-b border-[#D0DCF0] bg-[#F2F7FF] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block font-semibold">
            LIVE DEMONSTRATION
          </span>
          <KineticHeading text={"SEE YOUR BUSINESS\nTHROUGH FEN1."} className="text-3xl sm:text-5xl font-light text-[#0B1530] tracking-tight" />
          <p className="text-sm sm:text-base text-[#4A5B7A] max-w-2xl mx-auto leading-relaxed">
            Explore how your sales, estimation, projects, procurement, production, people, and finance can connect within one unified platform.
          </p>
        </div>
      </section>

      {/* Demo Form Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-8 sm:p-10 shadow-sm font-mono text-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4 font-sans">
                <div className="w-12 h-12 bg-[#1B4FD6] text-[#0B1530] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-[#4F7556]" />
                </div>
                <h3 className="text-2xl font-light text-[#0B1530]">
                  Demo Request Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5B7A] max-w-md mx-auto">
                  We have received your request and will be in touch to arrange a demonstration for your technical and management team.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2.5 bg-[#E3EEFC] text-[#0B1530] text-xs font-mono rounded-full hover:bg-[#C9DCF5] transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Company</label>
                    <input
                      required
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Work Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Phone / Mobile</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] outline-none font-sans"
                    >
                      <option>Aluminium Windows & Doors</option>
                      <option>Glass Processing & DGU Manufacturing</option>
                      <option>Glazing Contractors</option>
                      <option>Aluminium Fabrication Job Shop</option>
                      <option>Specialist Glazing Contractor</option>
                      <option>Dealer / Distributor Network</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Current Software Stack</label>
                    <input
                      type="text"
                      value={formData.currentSystem}
                      onChange={(e) => setFormData({ ...formData, currentSystem: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#4A5B7A] block">Interested Modules</label>
                  <input
                    type="text"
                    value={formData.interestedModules}
                    onChange={(e) => setFormData({ ...formData, interestedModules: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#4A5B7A] block">Specific Demonstration Topics / Questions</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                  />
                </div>
                {status === "error" && (
                  <p role="alert" className="rounded-lg bg-[#FBEAE8] border border-[#E8B9B4] text-[#A85E55] text-xs font-sans px-4 py-3">
                    Your message could not be sent. Please try again in a moment.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3.5 bg-[#1B4FD6] text-[#0B1530] font-semibold uppercase text-xs rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4 text-[#1B4FD6]" />
                  <span>REQUEST DEMO →</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
