"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { JOB_TYPES, type Job } from "@/lib/jobs";
import { CAREER_AREAS } from "@/data/enquiryForms";
import { KIND_LABEL, type StoredEnquiry } from "@/lib/inbox";
import type { EnquiryKind } from "@/lib/enquiry";
import { enquiriesToCsv } from "@/lib/csv";

type Session = { configured: boolean; loggedIn: boolean; storage: "redis" | "file" | null };
type View = "enquiries" | "jobs";

async function api<T = unknown>(path: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }, cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as T;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: {} as T };
  }
}

const when = (iso: string) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "");

/** The admin page: sign in, then the enquiry inbox and the job openings. Everything it shows comes from /api/admin/*. */
export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("enquiries");

  const refresh = useCallback(async () => {
    const res = await api<Session>("/api/admin/session");
    setSession(res.ok ? res.data : { configured: false, loggedIn: false, storage: null });
  }, []);
  useEffect(() => {
    // the session is only known by asking the server, so it is read after mount
    queueMicrotask(refresh);
  }, [refresh]);

  const signOut = async () => {
    await api("/api/admin/logout", { method: "POST" });
    refresh();
  };

  if (!session) return <p className="adm-note">Loading...</p>;
  if (!session.configured) {
    return (
      <div className="adm-card">
        <h1 className="adm-h1">Admin is not set up</h1>
        <p className="adm-note">Add an ADMIN_PASSWORD environment variable (see .env.example), restart the site, and reload this page.</p>
      </div>
    );
  }
  if (!session.loggedIn) return <Login onDone={refresh} />;

  return (
    <div className="adm">
      <div className="adm-bar">
        <h1 className="adm-h1">Admin</h1>
        <div className="adm-tabs" role="tablist" aria-label="Admin sections">
          {(["enquiries", "jobs"] as View[]).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} className={view === v ? "is-active" : ""} onClick={() => setView(v)}>
              {v === "enquiries" ? "Enquiries" : "Job openings"}
            </button>
          ))}
        </div>
        <button type="button" className="adm-link" onClick={signOut}>
          Sign out
        </button>
      </div>

      {!session.storage && (
        <p role="alert" className="adm-warn">
          Nothing can be saved yet: no database is connected. Add an Upstash Redis database (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN) and redeploy. Until then new enquiries only reach the webhook, and job openings cannot be added.
        </p>
      )}
      {session.storage === "file" && <p className="adm-note">Saving to a local file (.data/fen1.json). This is for development; a deployed site needs the Redis database.</p>}

      {session.storage && (view === "enquiries" ? <Enquiries onExpired={refresh} /> : <Jobs onExpired={refresh} />)}
    </div>
  );
}

/* ---------------------------------------------------------------- sign in */
function Login({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    setBusy(false);
    if (res.ok) return onDone();
    setError(res.status === 429 ? "Too many attempts. Please wait a few minutes." : "That password is not right.");
  };
  return (
    <form onSubmit={submit} className="adm-card adm-login">
      <h1 className="adm-h1">Admin sign in</h1>
      <label className="adm-label" htmlFor="adm-pass">
        Password
      </label>
      <input id="adm-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="adm-input" />
      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="adm-btn">
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------- enquiries */
const KINDS: (EnquiryKind | "all")[] = ["all", "demo", "contact", "careers"];

function Enquiries({ onExpired }: { onExpired: () => void }) {
  const [rows, setRows] = useState<StoredEnquiry[] | null>(null);
  const [kind, setKind] = useState<EnquiryKind | "all">("all");
  const [status, setStatus] = useState<"all" | "new" | "handled">("new");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await api<{ enquiries: StoredEnquiry[] }>("/api/admin/enquiries");
    if (res.status === 401) return onExpired();
    if (!res.ok) return setError("The enquiries could not be loaded.");
    setError("");
    setRows(res.data.enquiries);
  }, [onExpired]);
  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (kind === "all" || r.kind === kind) &&
        (status === "all" || r.status === status) &&
        (!q || [r.name, r.company, r.email, r.message, ...Object.values(r.details)].join(" ").toLowerCase().includes(q))
    );
  }, [rows, kind, status, query]);

  const count = (k: EnquiryKind) => (rows ?? []).filter((r) => r.kind === k && r.status === "new").length;

  const setHandled = async (r: StoredEnquiry, next: "new" | "handled") => {
    const res = await api(`/api/admin/enquiries/${r.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    if (res.status === 401) return onExpired();
    if (res.ok) setRows((cur) => (cur ?? []).map((x) => (x.id === r.id ? { ...x, status: next } : x)));
  };
  const remove = async (r: StoredEnquiry) => {
    if (!window.confirm(`Delete the enquiry from ${r.name}? This cannot be undone.`)) return;
    const res = await api(`/api/admin/enquiries/${r.id}`, { method: "DELETE" });
    if (res.status === 401) return onExpired();
    if (res.ok) setRows((cur) => (cur ?? []).filter((x) => x.id !== r.id));
  };
  const download = () => {
    const blob = new Blob([enquiriesToCsv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fen1-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section aria-label="Enquiries">
      <dl className="adm-counts">
        {(["demo", "contact", "careers"] as EnquiryKind[]).map((k) => (
          <div key={k}>
            <dt>{KIND_LABEL[k]}s waiting</dt>
            <dd>{rows ? count(k) : "-"}</dd>
          </div>
        ))}
      </dl>

      <div className="adm-filters">
        <label>
          <span className="adm-label">Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as EnquiryKind | "all")} className="adm-input">
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k === "all" ? "All types" : KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="adm-label">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | "new" | "handled")} className="adm-input">
            <option value="new">Waiting</option>
            <option value="handled">Handled</option>
            <option value="all">All</option>
          </select>
        </label>
        <label className="adm-grow">
          <span className="adm-label">Search</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, company, email or message" className="adm-input" />
        </label>
        <button type="button" className="adm-btn adm-btn-quiet" onClick={download} disabled={shown.length === 0}>
          Export CSV
        </button>
      </div>

      {error && (
        <p role="alert" className="adm-error">
          {error}
        </p>
      )}
      {rows && shown.length === 0 && <p className="adm-note">{rows.length === 0 ? "No enquiries have been received yet." : "Nothing matches these filters."}</p>}

      <ul className="adm-list">
        {shown.map((r) => {
          const expanded = open === r.id;
          return (
            <li key={r.id} className={`adm-row ${r.status === "new" ? "is-new" : ""}`}>
              <button type="button" className="adm-row-head" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : r.id)}>
                <span className="adm-kind">{KIND_LABEL[r.kind]}</span>
                <span className="adm-who">
                  <strong>{r.name}</strong>
                  {r.company && <span> · {r.company}</span>}
                </span>
                <span className="adm-when">{when(r.receivedAt)}</span>
                <span className="adm-state">{r.status === "new" ? "Waiting" : "Handled"}</span>
              </button>
              {expanded && (
                <div className="adm-detail">
                  <p>
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    {r.phone && <span> · {r.phone}</span>}
                  </p>
                  {r.message && <p className="adm-message">{r.message}</p>}
                  {Object.keys(r.details).length > 0 && (
                    <dl className="adm-kv">
                      {Object.entries(r.details).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className="adm-actions">
                    <a className="adm-btn" href={`mailto:${r.email}?subject=${encodeURIComponent("Re: your FEN1 enquiry")}`}>
                      Reply by email
                    </a>
                    {r.status === "new" ? (
                      <button type="button" className="adm-btn adm-btn-quiet" onClick={() => setHandled(r, "handled")}>
                        Mark as handled
                      </button>
                    ) : (
                      <button type="button" className="adm-btn adm-btn-quiet" onClick={() => setHandled(r, "new")}>
                        Mark as waiting
                      </button>
                    )}
                    <button type="button" className="adm-link adm-danger" onClick={() => remove(r)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ jobs */
const EMPTY = { title: "", area: CAREER_AREAS[0], location: "", type: "Full-time", summary: "", details: "", open: true };

function Jobs({ onExpired }: { onExpired: () => void }) {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await api<{ jobs: Job[] }>("/api/admin/jobs");
    if (res.status === 401) return onExpired();
    if (res.ok) setJobs(res.data.jobs);
  }, [onExpired]);
  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage("");
    const res = await api<{ fields?: Record<string, string> }>(editing ? `/api/admin/jobs/${editing}` : "/api/admin/jobs", { method: editing ? "PATCH" : "POST", body: JSON.stringify(form) });
    setBusy(false);
    if (res.status === 401) return onExpired();
    if (res.status === 422) return setErrors(res.data.fields ?? {});
    if (!res.ok) return setMessage("The job could not be saved. Please try again.");
    setMessage(editing ? "Job updated." : "Job added. It is on the website now if it is marked open.");
    setForm(EMPTY);
    setEditing(null);
    load();
  };
  const edit = (j: Job) => {
    setEditing(j.id);
    setForm({ title: j.title, area: j.area, location: j.location, type: j.type, summary: j.summary, details: j.details, open: j.open });
    setErrors({});
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggle = async (j: Job) => {
    const res = await api(`/api/admin/jobs/${j.id}`, { method: "PATCH", body: JSON.stringify({ open: !j.open }) });
    if (res.status === 401) return onExpired();
    if (res.ok) setJobs((cur) => (cur ?? []).map((x) => (x.id === j.id ? { ...x, open: !j.open } : x)));
  };
  const remove = async (j: Job) => {
    if (!window.confirm(`Delete "${j.title}"? This cannot be undone. To keep it but hide it, close it instead.`)) return;
    const res = await api(`/api/admin/jobs/${j.id}`, { method: "DELETE" });
    if (res.status === 401) return onExpired();
    if (res.ok) setJobs((cur) => (cur ?? []).filter((x) => x.id !== j.id));
  };

  const field = (name: keyof typeof EMPTY, label: string, input: React.ReactNode) => (
    <div className="adm-field">
      <label className="adm-label" htmlFor={`job-${name}`}>
        {label}
      </label>
      {input}
      {errors[name] && (
        <p role="alert" className="adm-error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <section aria-label="Job openings" className="adm-jobs">
      <form onSubmit={save} className="adm-card">
        <h2 className="adm-h2">{editing ? "Edit job" : "Add a job"}</h2>
        <div className="adm-grid">
          {field("title", "Job title", <input id="job-title" value={form.title} onChange={(e) => set("title", e.target.value)} className="adm-input" maxLength={120} />)}
          {field(
            "type",
            "Type",
            <select id="job-type" value={form.type} onChange={(e) => set("type", e.target.value)} className="adm-input">
              {JOB_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
          {field(
            "area",
            "Kind of work",
            <select id="job-area" value={form.area} onChange={(e) => set("area", e.target.value)} className="adm-input">
              {[...new Set([form.area, ...CAREER_AREAS])].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          )}
          {field("location", "Location", <input id="job-location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, or Remote" className="adm-input" maxLength={120} />)}
        </div>
        {field("summary", "Summary (one or two lines, shown in the list)", <textarea id="job-summary" rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} className="adm-input" maxLength={300} />)}
        {field("details", "Full description (optional; leave a blank line between paragraphs)", <textarea id="job-details" rows={7} value={form.details} onChange={(e) => set("details", e.target.value)} className="adm-input" maxLength={4000} />)}
        <label className="adm-check">
          <input type="checkbox" checked={form.open} onChange={(e) => set("open", e.target.checked)} />
          <span>Open for applications (shown on the website)</span>
        </label>
        {message && (
          <p role="status" className="adm-ok">
            {message}
          </p>
        )}
        <div className="adm-actions">
          <button type="submit" disabled={busy} className="adm-btn">
            {busy ? "Saving..." : editing ? "Save changes" : "Add job"}
          </button>
          {editing && (
            <button
              type="button"
              className="adm-btn adm-btn-quiet"
              onClick={() => {
                setEditing(null);
                setForm(EMPTY);
                setErrors({});
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="adm-h2">All jobs</h2>
      {jobs && jobs.length === 0 && <p className="adm-note">No jobs yet. The Careers section on the website says no roles are listed until you add one.</p>}
      <ul className="adm-list">
        {(jobs ?? []).map((j) => (
          <li key={j.id} className="adm-row">
            <div className="adm-job">
              <div>
                <p className="adm-who">
                  <strong>{j.title}</strong>
                </p>
                <p className="adm-note">{[j.area, j.location, j.type].filter(Boolean).join(" · ")}</p>
              </div>
              <span className="adm-state">{j.open ? "Open, on the website" : "Closed, hidden"}</span>
              <div className="adm-actions">
                <button type="button" className="adm-btn adm-btn-quiet" onClick={() => edit(j)}>
                  Edit
                </button>
                <button type="button" className="adm-btn adm-btn-quiet" onClick={() => toggle(j)}>
                  {j.open ? "Close" : "Reopen"}
                </button>
                <button type="button" className="adm-link adm-danger" onClick={() => remove(j)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
