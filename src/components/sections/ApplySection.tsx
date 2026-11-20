"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import StepWizard from "@/components/StepWizard";
import { careersWizard } from "@/lib/wizards";
import { loadOpenRoles, type OpenRole } from "./OpenRoles";

/**
 * The application page for one opening (/careers/apply?role=ID): the role at the top, then the form across the whole page.
 * The role is looked up among the openings the admin has published; one that has since been closed, or an unknown id, says so.
 */
export default function ApplySection() {
  const [state, setState] = useState<{ phase: "loading" } | { phase: "missing" } | { phase: "ready"; role: OpenRole }>({ phase: "loading" });

  useEffect(() => {
    let live = true;
    const id = new URLSearchParams(window.location.search).get("role");
    loadOpenRoles().then((list) => {
      if (!live) return;
      const role = list.find((r) => r.id === id);
      setState(role ? { phase: "ready", role } : { phase: "missing" });
    });
    return () => {
      live = false;
    };
  }, []);

  const role = state.phase === "ready" ? state.role : null;
  const wizard = useMemo(() => (role ? careersWizard(role.title) : null), [role]);
  const meta = role ? [role.area, role.location, role.type].filter(Boolean).join(" · ") : "";

  return (
    <section id="apply" data-section="apply" className="page-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/careers" className="apply-back">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All openings</span>
        </Link>

        {state.phase === "loading" && <p className="career-note">Loading the opening…</p>}

        {state.phase === "missing" && (
          <div className="sec-head">
            <h1 className="sec-title">This opening is no longer available</h1>
            <p className="sec-lede">It may have been filled or closed. See the openings that are open now.</p>
            <Link href="/careers" className="role-apply apply-missing-link">
              <span>See all openings</span>
            </Link>
          </div>
        )}

        {role && wizard && (
          <>
            <div className="sec-head apply-head">
              <h1 className="sec-title">Apply for {role.title}</h1>
              <p className="role-meta">{meta}</p>
              {role.summary && <p className="sec-lede">{role.summary}</p>}
            </div>
            <div className="apply-form">
              <StepWizard config={wizard} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
