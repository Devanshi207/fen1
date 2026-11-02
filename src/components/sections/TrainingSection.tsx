import { TRACKS } from "@/data/trainingContent";
import SectionHead from "./SectionHead";

/** Role-based training: one short block per team, with the topics as a plain list. */
export default function TrainingSection() {
  return (
    <section id="training" data-section="training" className="page-sec">
      <span id="roles" className="sec-anchor" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Training" title="Training by role">
          Each team is trained on the modules it works in, following the same workflow from enquiry to handover.
        </SectionHead>
        <div className="train-grid">
          {TRACKS.map((t) => (
            <div key={t.num} className="train-item">
              <p className="tech train-n">{t.num}</p>
              <h3 className="train-title">{t.title}</h3>
              <p className="train-team">{t.team}</p>
              <p className="train-topics">{t.topics.join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
