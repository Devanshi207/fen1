"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import KineticHeading from "@/components/KineticHeading";
import { ChoiceField, TextAreaField, TextField } from "@/components/Field";

const BUSINESS_TYPES = [
  "Aluminium Windows & Doors",
  "Glass Processing & DGU Manufacturing",
  "Glazing Contractors",
  "Aluminium Fabrication Job Shop",
  "Specialist Glazing Contractor",
  "Dealer / Distributor Network",
];

export default function RequestDemoPage() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const submitted = status === "sent";
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    businessType: BUSINESS_TYPES[0],
    email: "",
    phone: "",
    currentSystem: "",
    interestedModules: "",
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
      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-[#1B4FD6] text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1530]">Demo request confirmed</h3>
              <p className="text-sm text-[#4A5B7A] max-w-md mx-auto">
                We have received your request and will be in touch to arrange a demonstration for your technical and management team.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 px-6 py-2.5 border border-[#1B4FD6] text-[#1B4FD6] text-sm font-semibold rounded-full hover:bg-[#FFFFFF] transition-colors"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                <TextField label="Full name" required value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />
                <TextField label="Company" required value={formData.company} onChange={(v) => setFormData({ ...formData, company: v })} />
                <TextField label="Work email" type="email" required value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                <TextField label="Phone / mobile" type="tel" required value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
              </div>

              <ChoiceField
                label="Business type"
                options={BUSINESS_TYPES}
                value={formData.businessType}
                otherLabel="Describe your business"
                onChange={(v) => setFormData({ ...formData, businessType: v })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                <TextField label="Current software" value={formData.currentSystem} onChange={(v) => setFormData({ ...formData, currentSystem: v })} />
                <TextField label="Modules you are interested in" value={formData.interestedModules} onChange={(v) => setFormData({ ...formData, interestedModules: v })} />
              </div>

              <TextAreaField label="What would you like to see in the demo?" value={formData.message} onChange={(v) => setFormData({ ...formData, message: v })} />

              {status === "error" && (
                <p role="alert" className="rounded-lg bg-[#FBEAE8] border border-[#E8B9B4] text-[#A85E55] text-sm px-4 py-3">
                  Your message could not be sent. Please try again in a moment.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto px-10 py-4 bg-[#1B4FD6] text-white font-semibold uppercase text-xs tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{status === "sending" ? "Sending..." : "Request demo"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
