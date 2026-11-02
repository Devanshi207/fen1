import { CAREER_AREAS } from "@/data/enquiryForms";

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Apprenticeship", "Internship"] as const;

/** A job opening, as the admin enters it and the Careers section shows it. */
export interface Job {
  id: string;
  title: string;
  /** The kind of work (from the Careers areas, or typed) */
  area: string;
  location: string;
  type: string;
  /** One or two lines, shown in the list */
  summary: string;
  /** The full description, shown when the role is opened (blank lines separate paragraphs) */
  details: string;
  /** Open roles appear on the site; closed ones are kept in the admin only */
  open: boolean;
  createdAt: string;
  updatedAt: string;
}

export type JobInput = Pick<Job, "title" | "area" | "location" | "type" | "summary" | "details" | "open">;

const MAX = { title: 120, area: 80, location: 120, summary: 300, details: 4000 };

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export type JobResult = { ok: true; data: JobInput } | { ok: false; errors: Record<string, string> };

/** Checks what the admin form sends. The id and dates are never taken from the client. */
export function validateJob(input: unknown): JobResult {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const title = text(raw.title, MAX.title);
  const summary = text(raw.summary, MAX.summary);
  const type = text(raw.type, 40);
  if (!title) errors.title = "Please enter a job title";
  if (!summary) errors.summary = "Please add a one or two line summary";
  if (!(JOB_TYPES as readonly string[]).includes(type)) errors.type = "Please choose a type";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      title,
      summary,
      type,
      area: text(raw.area, MAX.area) || CAREER_AREAS[0],
      location: text(raw.location, MAX.location),
      details: text(raw.details, MAX.details),
      open: raw.open !== false,
    },
  };
}

/** Reads a saved record back as a Job (or null if it is not one). */
export function asJob(record: Record<string, unknown>): Job | null {
  if (typeof record.id !== "string" || typeof record.title !== "string") return null;
  return {
    id: record.id,
    title: record.title,
    area: typeof record.area === "string" ? record.area : "",
    location: typeof record.location === "string" ? record.location : "",
    type: typeof record.type === "string" ? record.type : "",
    summary: typeof record.summary === "string" ? record.summary : "",
    details: typeof record.details === "string" ? record.details : "",
    open: record.open !== false,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : "",
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : "",
  };
}

/** Newest first. */
export const byNewest = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);
