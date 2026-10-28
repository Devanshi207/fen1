"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollWords from "@/components/ScrollWords";

export default function FinalCtaSection() {
  return (
    <section id="contact-cta" data-chapter="Contact" data-snap className="cta-light finale relative text-[#0B1530] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        <ScrollWords className="finale-statement" text={"YOUR OPERATION.\nONE CONNECTED SYSTEM."} />
        <p data-reveal="up" className="text-sm sm:text-base lg:text-lg text-[#4A5B7A] max-w-2xl mx-auto leading-relaxed font-sans">
          Explore how FEN1 can connect the workflows behind your glass, aluminium or window business - from the first architectural enquiry to final project handover.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/solutions"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#1B4FD6] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>EXPLORE FEN1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/request-demo"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-transparent border border-[#1B4FD6]/40 text-[#1B4FD6] font-semibold text-xs uppercase tracking-wider hover:bg-[#FFFFFF]/70 transition-colors flex items-center justify-center gap-2"
          >
            <span>REQUEST A DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
