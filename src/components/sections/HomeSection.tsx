import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroGallery from "@/components/HeroGallery";
import StatsStrip from "@/components/StatsStrip";
import HeroBackdrop from "@/components/HeroBackdrop";
import KineticHeading from "@/components/KineticHeading";
import WordBand from "@/components/WordBand";
import WindowDrawing from "@/components/WindowDrawing";
import Workflow from "@/components/Workflow";
import ProjectSlabs from "@/components/ProjectSlabs";

/** The top of the page: the hero, the figures, the drawing animation, the workflow and the industry photography. */
export default function HomeSection() {
  return (
    <section id="home" data-section="home">
      <div id="intro" className="relative overflow-hidden flex items-center min-h-[80svh] pt-28 pb-8 lg:pt-24">
        <HeroBackdrop />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left" data-no-reveal>
            <p className="hero-seq hero-eyebrow tech" style={{ ["--hs" as string]: "120ms" }}>
              ERP for glass, aluminium &amp; windows
            </p>
            <KineticHeading text={"THE OPERATING SYSTEM\nFOR GLASS, WINDOWS\n& ALUMINIUM."} className="text-4xl sm:text-5xl lg:text-[clamp(2rem,2.9vw,3rem)] font-light text-[#34434A] tracking-tight leading-[1.1] [--k0:240ms]" />
            <p className="hero-seq text-base lg:text-lg text-[#5B6B73] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed" style={{ ["--hs" as string]: "620ms" }}>
              From estimation to installation, FEN1 connects sales, engineering, procurement, production, projects, people, finance and analytics in one unified ERP platform.
            </p>
            <div className="hero-seq flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2" style={{ ["--hs" as string]: "740ms" }}>
              <Link href="#solutions" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#A0602F] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <span>EXPLORE FEN1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FFFFFF] border border-[#DCE2DF] text-[#34434A] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <span>REQUEST A DEMO</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6" data-no-reveal>
            <div className="hero-media" style={{ ["--hs" as string]: "860ms" }}>
              <HeroGallery />
              <i className="hero-tick tl" aria-hidden="true" />
              <i className="hero-tick tr" aria-hidden="true" />
              <i className="hero-tick bl" aria-hidden="true" />
              <i className="hero-tick br" aria-hidden="true" />
            </div>
            <div className="hero-dim tech" style={{ ["--hs" as string]: "860ms" }} aria-hidden="true">
              <i />
              <span>Project photography</span>
              <i />
            </div>
          </div>
        </div>
      </div>

      <StatsStrip />
      <WordBand />
      <WindowDrawing />
      <Workflow />
      <ProjectSlabs />
    </section>
  );
}
