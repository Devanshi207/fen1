"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FinalCtaSection from "@/components/FinalCtaSection";
import ProjectSlabs from "@/components/ProjectSlabs";
import HeroGallery from "@/components/HeroGallery";
import StatsStrip from "@/components/StatsStrip";
import RoadmapScene from "@/components/RoadmapScene";
import HeroBackdrop from "@/components/HeroBackdrop";
import KineticHeading from "@/components/KineticHeading";
import ChapterRail from "@/components/ChapterRail";
import WordBand from "@/components/WordBand";

export default function HomePage() {
  return (
    <div className="snap-page w-full flex flex-col bg-[#F2F7FF] text-[#0B1530] font-sans">
      <ChapterRail />
      <section id="intro" data-chapter="Intro" data-snap className="relative overflow-hidden flex items-center min-h-[80svh] pt-28 pb-8 lg:pt-24">
        <HeroBackdrop />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            <KineticHeading text={"THE OPERATING SYSTEM\nFOR GLASS, WINDOWS\n& ALUMINIUM."} className="text-4xl sm:text-5xl lg:text-[clamp(2rem,2.9vw,3rem)] font-light text-[#0B1530] tracking-tight leading-[1.1]" />
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
            <HeroGallery />
          </div>
        </div>
      </section>

      <StatsStrip />
      <WordBand />
      <RoadmapScene />
      <ProjectSlabs />
      <FinalCtaSection />
    </div>
  );
}
