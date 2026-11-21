import KineticHeading from "@/components/KineticHeading";
import Link from "next/link";
import BauBanner from "@/components/BauBanner";
import BauBannerImage from "@/components/BauBannerImage";
import BauTicker from "@/components/BauTicker";
import HomeCompare from "./HomeCompare";
import HomeIntro from "./HomeIntro";

/** The home page: the hero (the headline, the BAU 2027 banner and video), what FEN1 is, and the table of what changes with one system. */
export default function HomeSection() {
  return (
    <section id="home" data-section="home">
      <div id="intro" className="hero-bg relative overflow-hidden flex items-center pt-6 pb-12 lg:pt-8 lg:pb-14">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 hero-split">
          <div className="max-w-3xl space-y-6 text-left" data-no-reveal>
            <KineticHeading text={"Engineering the business\n~behind every window"} className="text-3xl sm:text-4xl lg:text-[clamp(2rem,3vw,2.75rem)] text-[#1E2B45] tracking-tight leading-[1.08] [--k0:240ms]" />
            <p className="hero-seq text-base lg:text-lg text-[#55637A] max-w-xl leading-relaxed" style={{ ["--hs" as string]: "620ms" }}>
              FEN1 is a purpose-built ERP solution designed specifically for the window, door and façade industry.
            </p>
            <div className="hero-seq" style={{ ["--hs" as string]: "760ms" }}>
              <Link href="/book" className="inline-flex items-center justify-center rounded-lg bg-[#0067C0] px-6 py-3 text-base font-medium text-white">
                Book a slot
              </Link>
            </div>
            <BauBannerImage />
          </div>
          <BauBanner />
        </div>
      </div>

      <BauTicker />

      <HomeIntro />
      <HomeCompare />
    </section>
  );
}
