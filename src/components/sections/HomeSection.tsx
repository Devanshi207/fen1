import HeroGallery from "@/components/HeroGallery";
import KineticHeading from "@/components/KineticHeading";
import WindowDrawing from "@/components/WindowDrawing";
import Workflow from "@/components/Workflow";

/** The top of the page: the hero, the drawing animation and the workflow. */
export default function HomeSection() {
  return (
    <section id="home" data-section="home">
      <div id="intro" className="relative overflow-hidden flex items-center min-h-[80svh] pt-28 pb-12 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left" data-no-reveal>
            <p className="hero-seq hero-eyebrow tech" style={{ ["--hs" as string]: "120ms" }}>
              ERP for fenestration and glazing
            </p>
            <KineticHeading text={"One system for aluminium,\nglass and glazing work,\nfrom enquiry to handover."} className="text-4xl sm:text-5xl lg:text-[clamp(2rem,3vw,3.1rem)] text-[#34434A] tracking-tight leading-[1.12] [--k0:240ms]" />
            <p className="hero-seq text-base lg:text-lg text-[#5B6B73] max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ ["--hs" as string]: "620ms" }}>
              FEN1 connects estimation, bills of material, purchasing, production planning, quality inspection and site installation, so each team starts from what the one before it recorded.
            </p>
          </div>
          <div className="lg:col-span-6" data-no-reveal>
            <div className="hero-media" style={{ ["--hs" as string]: "860ms" }}>
              <HeroGallery />
            </div>
          </div>
        </div>
      </div>

      <WindowDrawing />
      <Workflow />
    </section>
  );
}
