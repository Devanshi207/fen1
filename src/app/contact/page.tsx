"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    industry: "Aluminium Window & Door Manufacturer",
    companySize: "50-200 Employees",
    currentSoftware: "",
    interestedModules: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F2F7FF] text-[#0B1530] font-sans pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Col: Contact Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-light text-[#0B1530] tracking-tight">
                A Technical Conversation, Not a Sales Pitch.
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5B7A] leading-relaxed">
                During our initial consultation, we analyze your current estimation workflows, extrusion billet scrap rates, and machine software links to demonstrate measurable operational improvements.
              </p>
            </div>

            {/* Information Cards */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex items-center gap-3 shadow-xs">
                <Mail className="w-4 h-4 text-[#1B4FD6]" />
                <div>
                  <span className="text-[10px] text-[#4A5B7A] uppercase block">Direct Technical Inquiries</span>
                  <span className="text-xs text-[#0B1530] font-semibold">solutions@fen1.io</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Consultation Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-8 sm:p-10 shadow-sm font-mono text-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4 font-sans">
                <div className="w-12 h-12 bg-[#1B4FD6] text-[#0B1530] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-[#4F7556]" />
                </div>
                <h3 className="text-2xl font-light text-[#0B1530]">
                  Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5B7A] max-w-md mx-auto font-sans">
                  Our team will review your inquiry and get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#E3EEFC] text-[#0B1530] text-xs font-mono rounded-full hover:bg-[#C9DCF5] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="pb-3 border-b border-[#D0DCF0]">
                  <h1 className="text-2xl sm:text-3xl font-light text-[#0B1530] font-sans tracking-tight">
                    CONTACT US
                  </h1>
                </div>

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
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Company Name</label>
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
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Industry Segment</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] outline-none font-sans"
                    >
                      <option>Aluminium Window & Door Manufacturer</option>
                      <option>Architectural Glass & IGU Processor</option>
                      <option>Glazing Contractor</option>
                      <option>Aluminium Fabricator & Job Shop</option>
                      <option>Fenestration Dealer / Distributor Network</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Company Size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] outline-none font-sans"
                    >
                      <option>Under 20 Employees</option>
                      <option>20-50 Employees</option>
                      <option>50-200 Employees</option>
                      <option>200-500 Employees</option>
                      <option>500+ Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-[#4A5B7A] block">Current ERP / Software</label>
                    <input
                      type="text"
                      value={formData.currentSoftware}
                      onChange={(e) => setFormData({ ...formData, currentSoftware: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                    />
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#4A5B7A] block">Project Requirements / Goals</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-xs text-[#0B1530] focus:border-[#3B82F6] outline-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1B4FD6] text-[#0B1530] font-semibold uppercase text-xs rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2 font-sans tracking-wider"
                >
                  <Send className="w-4 h-4 text-[#1B4FD6]" />
                  <span>SUBMIT INQUIRY →</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
