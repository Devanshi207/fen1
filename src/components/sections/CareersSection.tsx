"use client";

import { useEffect, useState } from "react";
import { CAREERS_HEAD, CAREERS_WHO, CAREER_INTEREST_AREAS } from "@/data/careersContent";
import OpenRoles, { loadOpenRoles, type OpenRole } from "./OpenRoles";
import SectionHead from "./SectionHead";

/**
 * Careers: the invitation, the areas where the team likes to meet people, who should get in touch, any openings the admin has
 * published (see /admin; none are listed unless it has added them). Apply on an opening goes to its own page with the
 * form (/careers/apply).
 */
export default function CareersSection() {
  const [roles, setRoles] = useState<OpenRole[]>([]);

  useEffect(() => {
    let live = true;
    loadOpenRoles().then((list) => live && setRoles(list));
    return () => {
      live = false;
    };
  }, []);

  return (
    <section id="careers" data-section="careers" className="page-sec page-sec-alt sec-violet">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead title={CAREERS_HEAD.title} more={CAREERS_HEAD.more}>
          {CAREERS_HEAD.lead}
        </SectionHead>

        <div className="career-lists">
          <div className="career-list">
            <h3 className="career-list-title">
              <span className="tech about-n">01</span>
              Areas Where We Love to Meet Talent
            </h3>
            <ul>
              {CAREER_INTEREST_AREAS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="career-list">
            <h3 className="career-list-title">
              <span className="tech about-n">02</span>
              Who Should Connect With Us?
            </h3>
            <ul>
              {CAREERS_WHO.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>

        {roles.length > 0 && (
          <div className="career-openings">
            <OpenRoles roles={roles} />
          </div>
        )}
      </div>
    </section>
  );
}
