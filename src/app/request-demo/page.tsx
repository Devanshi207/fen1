"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import KineticHeading from "@/components/KineticHeading";
import { Blank, Pick, TextAreaField } from "@/components/Field";
import { GALLERY } from "@/data/gallery";

const BUSINESS_TYPES = [
  "Aluminium Windows & Doors",
  "Glass Processing & DGU Manufacturing",
  "Glazing Contractors",
  "Aluminium Fabrication Job Shop",
  "Specialist Glazing Contractor",
  "Dealer / Distributor Network",
];

const PHOTO = GALLERY[2];

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
  const set = (key: keyof typeof formData) => (v: string) => setFormData((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const ok = await submitEnquiry("demo", formData);
    setStatus(ok ? "sent" : "error");
  };

  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans grid lg:grid-cols-[5fr_6fr] min-h-dvh">
      {/* Left: photo and the pitch */}
      <section className="relative min-h-[22rem] lg:min-h-0 lg:sticky lg:top-0 lg:h-dvh overflow-hidden text-white">
        <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: PHOTO.position }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/85 via-[#0B1530]/45 to-[#0B1530]/20" />
        <div className="relative z-10 h-full flex flex-col justify-end gap-4 px-6 sm:px-10 pt-28 pb-10 lg:pb-14">
          <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#9CC3F7]">Live demonstration</span>
          <KineticHeading text={"SEE YOUR BUSINESS\nTHROUGH FEN1."} className="text-3xl sm:text-5xl font-bold tracking-tight" />
          <p className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed">
            Explore how your sales, estimation, projects, procurement, production, people, and finance can connect within one unified platform.
          </p>
        </div>
      </section>

      {/* Right: the form */}
      <section className="flex items-center px-6 sm:px-10 lg:px-14 xl:px-20 pt-10 pb-16 lg:pt-28">
        <div className="w-full max-w-xl mx-auto">
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <h1 className="text-xs font-bold uppercase tracking-widest text-[#1B4FD6]">Request a demo</h1>

              {/* The form reads as a sentence the visitor completes */}
              <p className="sentence text-xl sm:text-2xl leading-[2.3] sm:leading-[2.2] font-semibold text-[#0B1530]">
                Hello, I&apos;m{" "}
                <Blank label="Full name" placeholder="your name" required value={formData.name} onChange={set("name")} wide />{" "}
                from <Blank label="Company" placeholder="your company" required value={formData.company} onChange={set("company")} wide />. We are a{" "}
                <Pick
                  label="Business type"
                  options={BUSINESS_TYPES}
                  value={formData.businessType}
                  onChange={set("businessType")}
                  otherLabel="Describe your business"
                />{" "}
                business{" "}
                <span className="text-[#7686A6]">
                  using <Blank label="Current software" placeholder="current software" value={formData.currentSystem} onChange={set("currentSystem")} /> today
                </span>
                . I would like to see{" "}
                <Blank label="Modules you want to see" placeholder="which modules" value={formData.interestedModules} onChange={set("interestedModules")} wide />{" "}
                in a demo. You can reach me at{" "}
                <Blank label="Work email" type="email" placeholder="email" required value={formData.email} onChange={set("email")} wide /> or on{" "}
                <Blank label="Phone / mobile" type="tel" placeholder="phone" required value={formData.phone} onChange={set("phone")} />.
              </p>

              <TextAreaField label="Anything specific you want to see? (optional)" rows={2} value={formData.message} onChange={set("message")} />

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
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
