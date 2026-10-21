"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section className="cta-light relative py-24 text-[#0B1530] overflow-hidden">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
            YOUR OPERATION. <br />
            ONE CONNECTED SYSTEM.
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] max-w-2xl mx-auto leading-relaxed font-sans">
            Explore how FEN1 can connect the workflows behind your glass, windows, aluminium or window business - from the first architectural enquiry to final project handover.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/solutions"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1B4FD6] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>EXPLORE FEN1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/request-demo"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent border border-[#1B4FD6]/40 text-[#1B4FD6] font-semibold text-xs uppercase tracking-wider hover:bg-[#FFFFFF]/70 transition-colors flex items-center justify-center gap-2"
          >
            <span>REQUEST A DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
