"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Check } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import KineticHeading from "@/components/KineticHeading";
import { TextAreaField, TextField } from "@/components/Field";
import { FEN1_MODULES } from "@/data/modules";
import { cn } from "@/lib/utils";

const BUSINESS_TYPES = [
  "Aluminium Windows & Doors",
  "Glass Processing & DGU Manufacturing",
  "Glazing Contractors",
  "Aluminium Fabrication Job Shop",
  "Specialist Glazing Contractor",
  "Dealer / Distributor Network",
];

const STEPS = ["About you", "Your business", "The demo"];

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all duration-200",
        selected
          ? "border-[#1B4FD6] bg-[#1B4FD6] text-white font-semibold"
          : "border-[#B0C0DD] bg-[#FFFFFF] text-[#0B1530] hover:border-[#1B4FD6]"
      )}
    >
      {selected && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default function RequestDemoPage() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const submitted = status === "sent";
  const [step, setStep] = useState(0);
  const [other, setOther] = useState(false);
  const [modules, setModules] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    businessType: "",
    email: "",
    phone: "",
    currentSystem: "",
    message: "",
  });
  const set = (key: keyof typeof formData) => (v: string) => setFormData((f) => ({ ...f, [key]: v }));

  const last = step === STEPS.length - 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!last) {
      setStep(step + 1);
      return;
    }
    setStatus("sending");
    const ok = await submitEnquiry("demo", { ...formData, interestedModules: modules.join(", ") });
    setStatus(ok ? "sent" : "error");
  };

  const reset = () => {
    setStatus("idle");
    setStep(0);
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

      {/* Demo request: three short steps */}
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
                onClick={reset}
                className="mt-4 px-6 py-2.5 border border-[#1B4FD6] text-[#1B4FD6] text-sm font-semibold rounded-full hover:bg-[#FFFFFF] transition-colors"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Progress */}
              <div>
                <ol className="flex gap-2" aria-label="Progress">
                  {STEPS.map((label, i) => (
                    <li key={label} className="flex-1" aria-current={i === step ? "step" : undefined}>
                      <span className={cn("block h-1 rounded-full transition-colors duration-500", i <= step ? "bg-[#1B4FD6]" : "bg-[#D0DCF0]")} />
                      <span className={cn("mt-2 block text-xs font-semibold", i === step ? "text-[#0B1530]" : "text-[#7686A6]")}>
                        {i + 1}. {label}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div key={step} className="space-y-7 step-in">
                {step === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                    <TextField label="Full name" required value={formData.name} onChange={set("name")} />
                    <TextField label="Company" required value={formData.company} onChange={set("company")} />
                    <TextField label="Work email" type="email" required value={formData.email} onChange={set("email")} />
                    <TextField label="Phone / mobile" type="tel" required value={formData.phone} onChange={set("phone")} />
                  </div>
                )}

                {step === 1 && (
                  <>
                    <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold text-[#4A5B7A] mb-3">What kind of business are you?</legend>
                      <div className="flex flex-wrap gap-2.5">
                        {BUSINESS_TYPES.map((t) => (
                          <Chip
                            key={t}
                            selected={!other && formData.businessType === t}
                            onClick={() => {
                              setOther(false);
                              set("businessType")(t);
                            }}
                          >
                            {t}
                          </Chip>
                        ))}
                        <Chip
                          selected={other}
                          onClick={() => {
                            setOther(true);
                            set("businessType")("");
                          }}
                        >
                          Something else
                        </Chip>
                      </div>
                      {other && <TextField label="Describe your business" required value={formData.businessType} onChange={set("businessType")} />}
                    </fieldset>
                    <TextField label="Software you use today (optional)" value={formData.currentSystem} onChange={set("currentSystem")} />
                  </>
                )}

                {step === 2 && (
                  <>
                    <fieldset className="space-y-3">
                      <legend className="text-sm font-semibold text-[#4A5B7A] mb-3">Which modules would you like to see? (optional)</legend>
                      <div className="flex flex-wrap gap-2">
                        {FEN1_MODULES.map((m) => (
                          <Chip
                            key={m.id}
                            selected={modules.includes(m.name)}
                            onClick={() => setModules((cur) => (cur.includes(m.name) ? cur.filter((x) => x !== m.name) : [...cur, m.name]))}
                          >
                            <span className="capitalize">{m.name.toLowerCase()}</span>
                          </Chip>
                        ))}
                      </div>
                    </fieldset>
                    <TextAreaField label="Anything specific you want to see? (optional)" value={formData.message} onChange={set("message")} />
                  </>
                )}
              </div>

              {status === "error" && (
                <p role="alert" className="rounded-lg bg-[#FBEAE8] border border-[#E8B9B4] text-[#A85E55] text-sm px-4 py-3">
                  Your message could not be sent. Please try again in a moment.
                </p>
              )}

              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center gap-2 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#4A5B7A] hover:text-[#0B1530] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="ml-auto px-10 py-4 bg-[#1B4FD6] text-white font-semibold uppercase text-xs tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{last ? (status === "sending" ? "Sending..." : "Request demo") : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
