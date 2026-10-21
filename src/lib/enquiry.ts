export type EnquiryKind = "contact" | "demo";

export interface Enquiry {
  kind: EnquiryKind;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  /** Extra form fields (industry, company size, modules of interest, ...), passed through as text. */
  details: Record<string, string>;
}

export type EnquiryResult =
  | { ok: true; data: Enquiry }
  | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { short: 200, message: 4000 };

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Validates an enquiry coming from either form. Used by the API route and the forms. */
export function validateEnquiry(input: unknown): EnquiryResult {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const kind = raw.kind === "demo" ? "demo" : raw.kind === "contact" ? "contact" : null;
  if (!kind) errors.kind = "Unknown form";

  const name = text(raw.name, MAX.short);
  const company = text(raw.company, MAX.short);
  const email = text(raw.email, MAX.short);
  const phone = text(raw.phone, 50);
  const message = text(raw.message, MAX.message);

  if (!name) errors.name = "Please enter your name";
  if (!company) errors.company = "Please enter your company";
  if (!email) errors.email = "Please enter your email";
  else if (!EMAIL.test(email)) errors.email = "Please enter a valid email";

  const details: Record<string, string> = {};
  const rawDetails = raw.details;
  if (typeof rawDetails === "object" && rawDetails !== null) {
    for (const [k, v] of Object.entries(rawDetails as Record<string, unknown>).slice(0, 20)) {
      const value = text(v, MAX.short);
      if (value) details[k.slice(0, 60)] = value;
    }
  }

  if (Object.keys(errors).length > 0 || !kind) return { ok: false, errors };
  return { ok: true, data: { kind, name, company, email, phone, message, details } };
}
