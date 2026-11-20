import { NextResponse } from "next/server";
import { validateEnquiry, type Enquiry } from "@/lib/enquiry";
import { saveEnquiry } from "@/lib/inbox";
import { readResume } from "@/lib/resume";
import { getStore } from "@/lib/store";

/**
 * Receives an enquiry from the demo, question or careers form. It is saved to the admin inbox (when a store is
 * configured: see lib/store) and forwarded as JSON to ENQUIRY_WEBHOOK_URL (any service that accepts a JSON POST: a CRM,
 * Zapier/Make, a Slack or Teams incoming webhook, ...). It succeeds when at least one of the two took it. With neither
 * configured the route answers 503, so the form can tell the visitor the truth instead of pretending it was delivered.
 * A hidden "website" field that people never see is filled in only by bots; those are acknowledged and dropped.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof body === "object" && body !== null && typeof (body as { website?: unknown }).website === "string" && (body as { website: string }).website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = validateEnquiry(body);
  if (!result.ok) {
    return NextResponse.json({ error: "invalid", fields: result.errors }, { status: 422 });
  }

  const store = getStore();
  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!store && !webhook) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const data: Enquiry = result.data;
  // a resume comes with a job application only; it is kept in the store, and the webhook is told its file name
  const rawResume = (body as { resume?: unknown }).resume;
  const resume = data.kind === "careers" && rawResume !== undefined ? readResume(rawResume) : null;
  if (data.kind === "careers" && rawResume !== undefined && !resume) return NextResponse.json({ error: "invalid", fields: { resume: "Please attach a PDF or Word file under 700 KB" } }, { status: 422 });
  if (resume && !store) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const attempts: Promise<boolean>[] = [];
  if (store) {
    attempts.push(
      saveEnquiry(store, data, new Date(), resume).then(
        () => true,
        () => false
      )
    );
  }
  if (webhook) {
    attempts.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, details: resume ? { ...data.details, resume: resume.name } : data.details, receivedAt: new Date().toISOString() }),
      }).then(
        (r) => r.ok,
        () => false
      )
    );
  }
  const delivered = (await Promise.all(attempts)).some(Boolean);
  if (!delivered) return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
