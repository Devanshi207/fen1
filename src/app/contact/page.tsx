"use client";

import { Mail } from "lucide-react";
import EnquiryForm, { type FieldSpec } from "@/components/EnquiryForm";

const INDUSTRIES = [
  "Aluminium Window & Door Manufacturer",
  "Architectural Glass & IGU Processor",
  "Glazing Contractor",
  "Aluminium Fabricator & Job Shop",
  "Fenestration Dealer / Distributor Network",
];
const SIZES = ["Under 20 Employees", "20-50 Employees", "50-200 Employees", "200-500 Employees", "500+ Enterprise"];

const FIELDS: FieldSpec[] = [
  { key: "name", label: "Full name", required: true, half: true },
  { key: "company", label: "Company name", required: true, half: true },
  { key: "email", label: "Work email", type: "email", required: true, half: true },
  { key: "phone", label: "Phone / mobile", type: "tel", required: true, half: true },
  { key: "industry", label: "Industry segment", type: "choice", options: INDUSTRIES, allowOther: true, otherLabel: "Describe your business", half: true },
  { key: "companySize", label: "Company size", type: "choice", options: SIZES, half: true },
  { key: "currentSoftware", label: "Current ERP / software", half: true },
  { key: "interestedModules", label: "Modules you are interested in", half: true },
  { key: "message", label: "Project requirements / goals", type: "area" },
];

const INITIAL = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: INDUSTRIES[0],
  companySize: SIZES[2],
  currentSoftware: "",
  interestedModules: "",
  message: "",
};

export default function ContactPage() {
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
          <div className="lg:col-span-7 space-y-4 max-w-xl">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Contact us</h1>
            <EnquiryForm
              kind="contact"
              fields={FIELDS}
              initial={INITIAL}
              submitLabel="Submit enquiry"
              doneTitle="Enquiry received"
              doneText="Our team will review your enquiry and get in touch with you shortly."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
