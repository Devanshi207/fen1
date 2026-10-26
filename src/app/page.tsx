"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FinalCtaSection from "@/components/FinalCtaSection";
import PhotoShowcase from "@/components/PhotoShowcase";
import HeroDashboard from "@/components/HeroDashboard";
import StatsStrip from "@/components/StatsStrip";
import JourneyTimeline from "@/components/JourneyTimeline";
import HeroBackdrop from "@/components/HeroBackdrop";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col bg-[#F2F7FF] text-[#0B1530] font-sans">
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <HeroBackdrop />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[2.5rem] xl:text-[3.1rem] font-light text-[#0B1530] tracking-tight leading-[1.1]">
              THE OPERATING SYSTEM <br className="hidden sm:inline" />
              FOR GLASS, WINDOWS <br className="hidden sm:inline" />
              &amp; ALUMINIUM.
            </h1>
            <p data-reveal="up" data-delay="140" className="text-base lg:text-lg text-[#4A5B7A] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              From estimation to installation, FEN1 connects sales, engineering, procurement, production, projects, people, finance and analytics in one unified ERP platform.
            </p>
            <div data-reveal="up" data-delay="260" className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/solutions"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1B4FD6] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>EXPLORE FEN1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/request-demo"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFFFF] border border-[#D0DCF0] text-[#0B1530] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>REQUEST A DEMO</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6" data-reveal="zoom" data-delay="200">
            <HeroDashboard />
          </div>
        </div>
      </section>

      <StatsStrip />
      <JourneyTimeline />
      <PhotoShowcase />
      <FinalCtaSection />
    </div>
  );
}
