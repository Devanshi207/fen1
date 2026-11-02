import type { StoredEnquiry } from "@/lib/inbox";
import { KIND_LABEL } from "@/lib/inbox";

/**
 * One CSV cell. Quotes are doubled, and a cell that starts with = + - @ is prefixed with an apostrophe, because a
 * spreadsheet would otherwise run it as a formula (a visitor controls what they type into the form).
 */
export function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** The enquiries as a CSV file's text, one row each, newest first as given. */
export function enquiriesToCsv(rows: StoredEnquiry[]): string {
  const header = ["Received", "Type", "Status", "Name", "Company", "Email", "Phone", "Message", "Details"];
  const lines = rows.map((r) =>
    [r.receivedAt, KIND_LABEL[r.kind], r.status, r.name, r.company, r.email, r.phone, r.message, Object.entries(r.details).map(([k, v]) => `${k}: ${v}`).join("; ")].map(csvCell).join(",")
  );
  return [header.map(csvCell).join(","), ...lines].join("\r\n");
}
