import HeroGallery from "@/components/HeroGallery";
import KineticHeading from "@/components/KineticHeading";
import WindowDrawing from "@/components/WindowDrawing";
import Link from "next/link";
import HomeCompare from "./HomeCompare";

/** The home page: the hero with one enquiry button, the drawing animation, and the table of what changes with one system. */
export default function HomeSection() {
  return (
    <section id="home" data-section="home">
      <div id="intro" className="hero-bg relative overflow-hidden flex items-center pt-6 pb-12 lg:pt-8 lg:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6 text-left" data-no-reveal>
            <KineticHeading text={"Engineering the business\n~behind every window"} className="text-4xl sm:text-5xl lg:text-[clamp(2.5rem,4vw,3.75rem)] text-[#1E2B45] tracking-tight leading-[1.08] [--k0:240ms]" />
            <p className="hero-seq text-base lg:text-lg text-[#55637A] max-w-xl leading-relaxed" style={{ ["--hs" as string]: "620ms" }}>
              FEN1 is an ERP product under Kyozon, built for aluminium windows, doors, façades, curtain walls and glass systems.
            </p>
            <div className="hero-seq" style={{ ["--hs" as string]: "760ms" }}>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-[#0067C0] px-6 py-3 text-base font-medium text-white">
                Make an enquiry
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6" data-no-reveal>
            <div className="hero-media" style={{ ["--hs" as string]: "860ms" }}>
              <HeroGallery />
            </div>
          </div>
        </div>
      </div>

      <WindowDrawing />
      <HomeCompare />
    </section>
  );
}
