"use client";

import { useEffect, useState } from "react";
import { CAREERS_WORK } from "@/data/erpContent";
import ModuleNotes from "./ModuleNotes";
import OpenRoles, { loadOpenRoles, type OpenRole } from "./OpenRoles";
import SectionHead from "./SectionHead";

/**
 * Where people can come from, the kinds of work, and a form. The role areas follow what the trade itself hires for
 * (estimating, fabrication and production, glazing and installation, project management) plus the software side.
 * The open roles are the ones the admin has published (see /admin); with none published the page says so and offers to get in
 * touch when one fits. Nothing is listed that the admin has not added.
 */
const PATHS = [
  {
    title: "From the trade",
    text: "You have estimated, cut, assembled, glazed or installed. You know how a job really runs, and what goes wrong in a system built by people who have never seen a workshop or a site.",
    roles: "Estimators · Fabrication and production planners · Glaziers and installers · Site supervisors · Quality inspectors",
  },
  {
    title: "From software",
    text: "You build, roll out or support business software, and you want to work on a product used on real shop floors, not only in an office.",
    roles: "Product engineering · Implementation · Customer support · Training · Sales and partnerships",
  },
  {
    title: "Starting out",
    text: "A workshop apprenticeship, a glazing course or a first job: tell us where you are starting from. The industry has always grown its people from the ground up.",
    roles: "Apprentices · Trainees · Graduates",
  },
];

export default function CareersSection() {
  const [roles, setRoles] = useState<OpenRole[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let live = true;
    loadOpenRoles().then((list) => {
      if (!live) return;
      setRoles(list);
      setLoaded(true);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <section id="careers" data-section="careers" className="page-sec page-sec-alt sec-violet">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title="Work where software meets the shop floor">
          FEN1 is built for the people who make windows, glass and aluminium products. We want to hear from them, and from people who build good software.
        </SectionHead>

        <div className="paths">
          {PATHS.map((p) => (
            <div key={p.title} className="path">
              <h3 className="path-title">{p.title}</h3>
              <p className="path-text">{p.text}</p>
              <p className="path-roles">{p.roles}</p>
            </div>
          ))}
        </div>

        <div className="career-build">
          <p className="sol-label tech">What you would work on</p>
          <ModuleNotes notes={CAREERS_WORK} cols={2} />
        </div>

        <div className="career-openings">
          <OpenRoles roles={roles} />
          {loaded && roles.length === 0 && <p className="career-note">No openings right now. Please check back soon.</p>}
        </div>
      </div>
    </section>
  );
}
