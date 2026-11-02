"use client";

import EnquiryForm from "@/components/EnquiryForm";
import { CAREER_FIELDS, CAREER_INITIAL } from "@/data/enquiryForms";
import SectionHead from "./SectionHead";

/**
 * Where people can come from, the kinds of work, and a form. The role areas follow what the trade itself hires for
 * (estimating, fabrication and production, glazing and installation, project management) plus the software side.
 * No vacancies are advertised, because none are listed: the page says so and offers to get in touch when one fits.
 */
const PATHS = [
  {
    title: "From the trade",
    text: "You have estimated, cut, assembled, glazed or installed. You know how a job really runs, and what a system gets wrong when it has never seen a workshop or a site.",
    roles: "Estimators · Fabrication and production planners · Glaziers and installers · Site supervisors · Quality inspectors",
  },
  {
    title: "From software",
    text: "You build, roll out or support business software and want to work on a product used on real shop floors, not just in an office.",
    roles: "Product engineering · Implementation · Customer support · Training · Sales and partnerships",
  },
  {
    title: "Starting out",
    text: "A workshop apprenticeship, a glazing course or a first job: tell us where you are. The industry has always grown its people from the bottom up.",
    roles: "Apprentices · Trainees · Graduates",
  },
];

const STEPS = ["Tell us about yourself below", "We read it and get back to you if there is a fit", "A conversation about the work, not a quiz"];

export default function CareersSection() {
  return (
    <section id="careers" data-section="careers" className="page-sec page-sec-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Careers" title="WORK WHERE SOFTWARE MEETS THE SHOP FLOOR.">
          FEN1 is built for the people who make windows, glass and aluminium work. We want to hear from them, and from people who build good software.
        </SectionHead>

        <div className="paths">
          {PATHS.map((p, i) => (
            <div key={p.title} className="path">
              <p className="tech path-n">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="path-title">{p.title}</h3>
              <p className="path-text">{p.text}</p>
              <p className="path-roles tech">{p.roles}</p>
            </div>
          ))}
        </div>

        <div className="career-apply">
          <div className="career-side">
            <p className="sol-label tech">How it works</p>
            <ol className="career-steps">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <span className="tech about-n">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="career-note">No roles are listed here right now. Send your details and we will get in touch when one fits.</p>
          </div>
          <div className="career-form">
            <EnquiryForm
              kind="careers"
              fields={CAREER_FIELDS}
              initial={CAREER_INITIAL}
              submitLabel="Send my details"
              doneTitle="Thank you"
              doneText="We have your details. If there is a role that fits, we will get in touch."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
