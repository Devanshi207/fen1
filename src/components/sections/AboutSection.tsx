import { ABOUT_INSIDE, ABOUT_INTRO, DIRECTOR, WHY_CLOSING, WHY_FEN1 } from "@/data/erpContent";
import ModuleNotes from "./ModuleNotes";
import SectionHead from "./SectionHead";

/** About: the director's profile, the foundations underneath the modules, then why teams choose FEN1. */
export default function AboutSection() {
  return (
    <section id="about" data-section="about" className="page-sec sec-lavender">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title="Built for Fenestration. Designed for Better Business." more={ABOUT_INTRO}>
          FEN1 is a purpose-built ERP solution designed specifically for the window, door and façade industry.
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
          <h3 className="sol-label tech">Why Choose FEN1?</h3>
          <ModuleNotes notes={WHY_FEN1} cols={4} />
          <p className="why-closing">
            <strong>{WHY_CLOSING.title}</strong>
            <span>{WHY_CLOSING.text}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
