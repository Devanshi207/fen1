"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const LEGAL = {
  privacy: {
    title: "Privacy Policy",
    points: [
      "When you use the enquiry or careers form we receive what you type: your name, company, work email, phone number, business details and message.",
      "We use it only to reply to your enquiry, to arrange a demonstration or to consider a job application. Enquiries are kept in our admin inbox until the team has dealt with them. We do not sell it.",
      "This site does not run advertising trackers.",
      "To see, correct or delete what you sent us, write to us through the Contact section.",
    ],
  },
  terms: {
    title: "Terms of Service",
    points: [
      "The information on this site describes FEN1 and is provided for general information. It is not a contract or a quotation.",
      "Scope, pricing and delivery for any FEN1 implementation are agreed in a separate written proposal.",
      "Names, images and text on this site belong to FEN1 Systems and may not be reused without permission.",
      "We may update this site and these terms from time to time.",
    ],
  },
  security: {
    title: "Enterprise Security",
    points: [
      "Enquiries sent through this site travel over an encrypted connection.",
      "FEN1 uses role-based permissions, so each person only sees the modules and records their role needs.",
      "For a security questionnaire or a review of how your data would be handled, contact us and we will go through it with your IT team.",
    ],
  },
} as const;

type LegalKey = keyof typeof LEGAL;

function LegalDialog({ id, onClose }: { id: LegalKey; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const doc = LEGAL[id];
  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#F6F7F5]/85" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={doc.title} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 border border-[#DCE2DF] shadow-[0_24px_48px_-28px_rgba(52,67,74,0.35)] text-[#34434A]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">{doc.title}</h2>
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className="shrink-0 [&>svg]:!transform-none active:!transform-none rounded-md border border-[#DCE2DF] p-1.5 text-[#5B6B73] transition-colors hover:border-[#A0602F] hover:text-[#A0602F]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-[#5B6B73] leading-relaxed list-disc pl-5">
          {doc.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Link href="#question" onClick={onClose} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#A0602F]">
          <span>Questions? Contact us</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function Footer() {
  const [legal, setLegal] = useState<LegalKey | null>(null);
  const close = () => setLegal(null);
  return (
    <footer className="bg-[#E9EDEB] text-[#5B6B73] border-t border-[#DCE2DF] relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-14 border-b border-[#DCE2DF]">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-6 space-y-4">
            <Link href="#home" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#A0602F] rounded-sm flex items-center justify-center shadow-xs">
                <div className="w-2.5 h-2.5 border border-[#DCE2DF] rotate-45" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#34434A]">
                FEN1
              </span>
            </Link>
            <p className="text-sm text-[#5B6B73] max-w-sm leading-relaxed">
              ERP for aluminium fabrication, glass processing and glazing contractors: one job record from enquiry to handover.
            </p>
          </div>

          {/* Column 2: Solutions */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#A0602F] tracking-wider block font-semibold">
              SOLUTIONS
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#windows-doors" className="hover:text-[#34434A] transition-colors">Windows & Doors</Link></li>
              <li><Link href="#glass" className="hover:text-[#34434A] transition-colors">Glass Processing & IGUs</Link></li>
              <li><Link href="#fabrication" className="hover:text-[#34434A] transition-colors">Aluminium Fabrication</Link></li>
              <li><Link href="#contractors" className="hover:text-[#34434A] transition-colors">Glazing Contractors</Link></li>
              <li><Link href="#dealers" className="hover:text-[#34434A] transition-colors">Dealer Networks</Link></li>
              <li><Link href="#modules" className="hover:text-[#34434A] transition-colors">All Modules</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#A0602F] tracking-wider block font-semibold">
              RESOURCES
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#training" className="hover:text-[#34434A] transition-colors">Training</Link></li>
              <li><Link href="#roles" className="hover:text-[#34434A] transition-colors">Role-Based Training</Link></li>
              <li><Link href="#about" className="hover:text-[#34434A] transition-colors">Platform Philosophy</Link></li>
              <li><Link href="#question" className="hover:text-[#34434A] transition-colors">Technical Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#A0602F] tracking-wider block font-semibold">
              COMPANY
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#about" className="hover:text-[#34434A] transition-colors">About FEN1</Link></li>
              <li><Link href="#careers" className="hover:text-[#34434A] transition-colors">Careers</Link></li>
              <li><Link href="#question" className="hover:text-[#34434A] transition-colors">Contact Us</Link></li>
              <li><Link href="#demo" className="hover:text-[#34434A] transition-colors">Request a Demo</Link></li>
              <li className="pt-2 text-[11px] font-mono uppercase text-[#A0602F]">LEGAL</li>
              <li><button type="button" onClick={() => setLegal("privacy")} className="text-xs hover:text-[#34434A] transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button type="button" onClick={() => setLegal("terms")} className="text-xs hover:text-[#34434A] transition-colors cursor-pointer">Terms of Service</button></li>
              <li><button type="button" onClick={() => setLegal("security")} className="text-xs hover:text-[#34434A] transition-colors cursor-pointer">Enterprise Security</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6B73]">
          <span>© {new Date().getFullYear()} FEN1 SYSTEMS. All rights reserved.</span>
        </div>
      </div>
      {legal && <LegalDialog id={legal} onClose={close} />}
    </footer>
  );
}
