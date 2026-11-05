"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/85" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={doc.title} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 border border-[#DCE6F5] shadow-[0_24px_48px_-28px_rgba(52,67,74,0.35)] text-[#1E2B45]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">{doc.title}</h2>
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className="shrink-0 [&>svg]:!transform-none active:!transform-none rounded-md border border-[#DCE6F5] p-1.5 text-[#55637A] transition-colors hover:border-[#0067C0] hover:text-[#0067C0]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-[#55637A] leading-relaxed list-disc pl-5">
          {doc.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Link href="#question" onClick={onClose} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#0067C0]">
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
    <footer className="bg-[#F3F7FF] text-[#55637A] border-t border-[#DCE6F5] relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-14 border-b border-[#DCE6F5]">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-6 space-y-4">
            <Link href="#home" aria-label="FEN1, back to the top" className="inline-flex">
              <Image src="/brand/fen1-logo.png" alt="FEN1" width={900} height={294} sizes="140px" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-[#55637A] max-w-sm leading-relaxed">
              An ERP by Kyozon for the fenestration industry: one job record from enquiry to handover.
            </p>
          </div>

          {/* Column 2: Solutions */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#0067C0] tracking-wider block font-semibold">
              SOLUTIONS
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#windows-doors" className="hover:text-[#1E2B45] transition-colors">Windows & Doors</Link></li>
              <li><Link href="#glass-railing" className="hover:text-[#1E2B45] transition-colors">Glass Railing</Link></li>
              <li><Link href="#curtain-wall" className="hover:text-[#1E2B45] transition-colors">Curtain Wall</Link></li>
              <li><Link href="#modules" className="hover:text-[#1E2B45] transition-colors">All Modules</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#0067C0] tracking-wider block font-semibold">
              RESOURCES
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#training" className="hover:text-[#1E2B45] transition-colors">Training</Link></li>
              <li><Link href="#roles" className="hover:text-[#1E2B45] transition-colors">Role-Based Training</Link></li>
              <li><Link href="#about" className="hover:text-[#1E2B45] transition-colors">Platform Philosophy</Link></li>
              <li><Link href="#question" className="hover:text-[#1E2B45] transition-colors">Technical Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#0067C0] tracking-wider block font-semibold">
              COMPANY
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="#about" className="hover:text-[#1E2B45] transition-colors">About FEN1</Link></li>
              <li><Link href="#careers" className="hover:text-[#1E2B45] transition-colors">Careers</Link></li>
              <li><Link href="#question" className="hover:text-[#1E2B45] transition-colors">Contact Us</Link></li>
              <li><Link href="#demo" className="hover:text-[#1E2B45] transition-colors">Request a Demo</Link></li>
              <li className="pt-2 text-[11px] font-mono uppercase text-[#0067C0]">LEGAL</li>
              <li><button type="button" onClick={() => setLegal("privacy")} className="text-xs hover:text-[#1E2B45] transition-colors cursor-pointer">Privacy Policy</button></li>
              <li><button type="button" onClick={() => setLegal("terms")} className="text-xs hover:text-[#1E2B45] transition-colors cursor-pointer">Terms of Service</button></li>
              <li><button type="button" onClick={() => setLegal("security")} className="text-xs hover:text-[#1E2B45] transition-colors cursor-pointer">Enterprise Security</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#55637A]">
          <span>© {new Date().getFullYear()} FEN1 SYSTEMS. All rights reserved.</span>
        </div>
      </div>
      {legal && <LegalDialog id={legal} onClose={close} />}
    </footer>
  );
}
