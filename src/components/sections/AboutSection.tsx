import { ABOUT_INSIDE, DIRECTOR, WHY_FEN1 } from "@/data/erpContent";
import ModuleNotes from "./ModuleNotes";
import SectionHead from "./SectionHead";

/** About: the director's profile, the foundations underneath the modules, then why teams choose FEN1. */
export default function AboutSection() {
  return (
    <section id="about" data-section="about" className="page-sec sec-lavender">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title="Built around how fenestration work runs">
          FEN1 is a Kyozon ERP product made for the fenestration industry. One job record runs from the first enquiry to final handover.
        </SectionHead>

        <div className="about-director">
          <p className="sol-label tech">{DIRECTOR.eyebrow}</p>
          <h3 className="about-director-title">{DIRECTOR.title}</h3>
          <p className="about-director-intro">{DIRECTOR.intro}</p>
          <ModuleNotes notes={DIRECTOR.notes} cols={2} level={4} />
          <blockquote className="about-quote">{DIRECTOR.quote}</blockquote>
        </div>

        <div className="about-inside">
          <p className="sol-label tech">Underneath the modules</p>
          <ModuleNotes notes={ABOUT_INSIDE} cols={2} />
        </div>

        <div className="about-why">
          <p className="sol-label tech">Why FEN1</p>
          <ModuleNotes notes={WHY_FEN1} cols={4} />
        </div>
      </div>
    </section>
  );
}
