import type { EnquiryKind } from "@/lib/enquiry";

export type SubmitState = "idle" | "sending" | "sent" | "error";

/** Posts a form to /api/enquiry. Resolves true only when the server confirms delivery. */
export async function submitEnquiry(
  kind: EnquiryKind,
  fields: { name: string; company: string; email: string; phone: string; message: string } & Record<string, string>
): Promise<boolean> {
  const { name, company, email, phone, message, ...details } = fields;
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, name, company, email, phone, message, details }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
