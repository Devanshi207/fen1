import { PROBLEMS, PRINCIPLES } from "@/data/aboutContent";
import SectionHead from "./SectionHead";

/** About, kept short: what goes wrong without one system, and the three ideas FEN1 is built on. */
export default function AboutSection() {
  return (
    <section id="about" data-section="about" className="page-sec page-sec-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="About FEN1" title="AN ERP BUILT AROUND GLASS, ALUMINIUM & WINDOWS.">
          FEN1 runs the whole job in one system, from the first enquiry to final handover.
        </SectionHead>

        <div className="about-cols">
          <div>
            <p className="sol-label tech">Without one system</p>
            <ul className="about-list">
              {PROBLEMS.map((p) => (
                <li key={p.n}>
                  <span className="tech about-n">{p.n}</span>
                  <span>
                    <strong>{p.name}</strong>
                    <span className="about-sub">{p.issue}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="sol-label tech">The FEN1 way</p>
            <ul className="about-list">
              {PRINCIPLES.map((p, i) => (
                <li key={p.label}>
                  <span className="tech about-n">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <strong>{p.title}</strong>
                    <span className="about-sub">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
