"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** A job opening as the public endpoint returns it (see /api/jobs). */
export interface OpenRole {
  id: string;
  title: string;
  area: string;
  location: string;
  type: string;
  summary: string;
  details: string;
}

/** Fetches the open roles the admin has published. Resolves to an empty list if there are none or the request fails. */
export async function loadOpenRoles(): Promise<OpenRole[]> {
  try {
    // always ask: the admin may have changed the list since this browser last looked
    const res = await fetch("/api/jobs", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { jobs?: OpenRole[] };
    return Array.isArray(data.jobs) ? data.jobs : [];
  } catch {
    return [];
  }
}

/**
 * The job openings, as plain rows: title, where and what kind, a one-line summary, the full description opened in place,
 * and an Apply button that fills in the form below. Renders nothing at all until there is at least one open role.
 */
export default function OpenRoles({ roles, onApply }: { roles: OpenRole[]; onApply: (role: OpenRole) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  // a role the admin has since closed no longer keeps its details open
  const shown = roles.some((r) => r.id === open) ? open : null;
  if (roles.length === 0) return null;

  return (
    <div id="openings" className="roles">
      <p className="sol-label tech">Open roles</p>
      <ul className="roles-list">
        {roles.map((r) => {
          const expanded = shown === r.id;
          const meta = [r.area, r.location, r.type].filter(Boolean).join(" · ");
          return (
            <li key={r.id} className="role">
              <div className="role-head">
                <div>
                  <h3 className="role-title">{r.title}</h3>
                  <p className="role-meta">{meta}</p>
                  <p className="role-summary">{r.summary}</p>
                </div>
                <div className="role-actions">
                  {r.details && (
                    <button type="button" className="role-toggle" aria-expanded={expanded} aria-controls={`role-${r.id}`} onClick={() => setOpen(expanded ? null : r.id)}>
                      {expanded ? "Hide details" : "Read more"}
                    </button>
                  )}
                  <button type="button" className="role-apply" onClick={() => onApply(r)}>
                    <span>Apply</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {expanded && (
                <div id={`role-${r.id}`} className="role-details">
                  {r.details.split(/\n{2,}/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
