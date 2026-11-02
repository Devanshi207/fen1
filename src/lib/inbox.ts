import type { Enquiry, EnquiryKind } from "@/lib/enquiry";
import type { Store } from "@/lib/store";

export type EnquiryStatus = "new" | "handled";

/** An enquiry as saved: what the visitor sent, plus when it arrived and whether the team has dealt with it. */
export interface StoredEnquiry extends Enquiry {
  id: string;
  receivedAt: string;
  status: EnquiryStatus;
}

/** What each kind of enquiry is called in the admin. */
export const KIND_LABEL: Record<EnquiryKind, string> = {
  demo: "Demo request",
  contact: "Question",
  careers: "Job application",
};

export async function saveEnquiry(store: Store, data: Enquiry, now = new Date()): Promise<StoredEnquiry> {
  const saved: StoredEnquiry = { ...data, id: crypto.randomUUID(), receivedAt: now.toISOString(), status: "new" };
  await store.put("enquiries", saved.id, saved as unknown as Record<string, unknown>);
  return saved;
}

export function asEnquiry(record: Record<string, unknown>): StoredEnquiry | null {
  const kind = record.kind;
  if (typeof record.id !== "string" || (kind !== "demo" && kind !== "contact" && kind !== "careers")) return null;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const details: Record<string, string> = {};
  if (typeof record.details === "object" && record.details !== null) {
    for (const [k, v] of Object.entries(record.details as Record<string, unknown>)) if (typeof v === "string") details[k] = v;
  }
  return {
    id: record.id,
    kind,
    name: str(record.name),
    company: str(record.company),
    email: str(record.email),
    phone: str(record.phone),
    message: str(record.message),
    details,
    receivedAt: str(record.receivedAt),
    status: record.status === "handled" ? "handled" : "new",
  };
}

export const newestFirst = (a: StoredEnquiry, b: StoredEnquiry) => b.receivedAt.localeCompare(a.receivedAt);
