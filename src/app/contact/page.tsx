"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import { Blank, Pick, TextAreaField } from "@/components/Field";

const INDUSTRIES = [
  "Aluminium Window & Door Manufacturer",
  "Architectural Glass & IGU Processor",
  "Glazing Contractor",
  "Aluminium Fabricator & Job Shop",
  "Fenestration Dealer / Distributor Network",
];
const SIZES = ["Under 20 Employees", "20-50 Employees", "50-200 Employees", "200-500 Employees", "500+ Enterprise"];

export default function ContactPage() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const submitted = status === "sent";
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    industry: INDUSTRIES[0],
    companySize: SIZES[2],
    currentSoftware: "",
    interestedModules: "",
    message: "",
  });

  const set = (key: keyof typeof formData) => (v: string) => setFormData((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const ok = await submitEnquiry("contact", formData);
    setStatus(ok ? "sent" : "error");
  };

  return (
    <div className="w-full min-h-dvh bg-[#F2F7FF] text-[#0B1530] font-sans pt-12 pb-24">
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

            {/* Direct email, shown only when one is configured (NEXT_PUBLIC_CONTACT_EMAIL) */}
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-[#FFFFFF] border border-[#D0DCF0] rounded-xl flex items-center gap-3 shadow-xs">
                  <Mail className="w-4 h-4 text-[#1B4FD6]" />
                  <div>
                    <span className="text-[10px] text-[#4A5B7A] uppercase block">Email</span>
                    <span className="text-xs text-[#0B1530] font-semibold">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Consultation Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-[#1B4FD6] text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1530]">Enquiry received</h3>
                <p className="text-sm text-[#4A5B7A] max-w-md mx-auto">Our team will review your enquiry and get in touch with you shortly.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2.5 border border-[#1B4FD6] text-[#1B4FD6] text-sm font-semibold rounded-full hover:bg-[#FFFFFF] transition-colors"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <h1 className="text-xs font-bold uppercase tracking-widest text-[#1B4FD6]">Contact us</h1>

                {/* The form reads as a sentence the visitor completes */}
                <p className="sentence text-xl sm:text-2xl leading-[2.3] sm:leading-[2.2] font-semibold text-[#0B1530]">
                  Hi FEN1 team, I&apos;m <Blank label="Full name" placeholder="your name" required value={formData.name} onChange={set("name")} wide /> at{" "}
                  <Blank label="Company name" placeholder="your company" required value={formData.company} onChange={set("company")} wide />. We are a{" "}
                  <Pick label="Industry segment" options={INDUSTRIES} value={formData.industry} onChange={set("industry")} otherLabel="Describe your business" /> with{" "}
                  <Pick label="Company size" options={SIZES} allowOther={false} value={formData.companySize} onChange={set("companySize")} />
                  <span className="text-[#7686A6]">
                    , working in <Blank label="Current ERP / software" placeholder="current software" value={formData.currentSoftware} onChange={set("currentSoftware")} /> today
                  </span>
                  . We are looking at <Blank label="Modules you are interested in" placeholder="which modules" value={formData.interestedModules} onChange={set("interestedModules")} wide />.
                  Write to me at <Blank label="Work email" type="email" placeholder="email" required value={formData.email} onChange={set("email")} wide /> or call{" "}
                  <Blank label="Phone / mobile" type="tel" placeholder="phone" required value={formData.phone} onChange={set("phone")} />.
                </p>

                <TextAreaField label="Project requirements / goals (optional)" rows={3} value={formData.message} onChange={set("message")} />

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
                  <span>{status === "sending" ? "Sending..." : "Submit enquiry"}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
