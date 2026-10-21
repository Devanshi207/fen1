import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry";

/**
 * Receives an enquiry from the contact or demo form and forwards it as JSON to ENQUIRY_WEBHOOK_URL
 * (any service that accepts a JSON POST: a CRM, Zapier/Make, a Slack or Teams incoming webhook, ...).
 * Without that variable the route answers 503, so the form can tell the visitor the truth instead of
 * pretending the message was delivered.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validateEnquiry(body);
  if (!result.ok) {
    return NextResponse.json({ error: "invalid", fields: result.errors }, { status: 422 });
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...result.data, receivedAt: new Date().toISOString() }),
    });
    if (!upstream.ok) return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
