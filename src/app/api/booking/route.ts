import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/enquiry";
import { saveEnquiry } from "@/lib/inbox";
import { notifyBooking } from "@/lib/mail";
import { SLOT_ZONE, formatDate, isBookableSlot, parseSlot } from "@/lib/slots";
import { getStore } from "@/lib/store";

/**
 * Demo slots. GET lists the slots that are already taken (nothing about who took them). POST books one: the slot is reserved for
 * the visitor first (only one booking can ever hold a slot), then the request is saved to the admin inbox as a demo request that
 * names the date and time, forwarded to ENQUIRY_WEBHOOK_URL when there is one, and emailed to the team and to the visitor (see
 * lib/mail) when SMTP is set up. A slot somebody else took answers 409.
 */
export async function GET() {
  const store = getStore();
  if (!store) return NextResponse.json({ error: "not_configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const taken = (await store.all("bookings")).map((b) => b.slot).filter((s): s is string => typeof s === "string");
    return NextResponse.json({ taken }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const raw = (typeof body === "object" && body !== null ? body : {}) as { website?: unknown; details?: { slot?: unknown } };
  if (typeof raw.website === "string" && raw.website.trim()) return NextResponse.json({ ok: true });

  const result = validateEnquiry({ ...raw, kind: "demo" });
  if (!result.ok) return NextResponse.json({ error: "invalid", fields: result.errors }, { status: 422 });

  const slotId = raw.details?.slot;
  const slot = isBookableSlot(slotId) ? parseSlot(slotId) : null;
  if (!slot || typeof slotId !== "string") return NextResponse.json({ error: "invalid", fields: { slot: "Please choose a day and a time" } }, { status: 422 });

  const store = getStore();
  if (!store) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const reserved = await store.putIfAbsent("bookings", slotId, { slot: slotId, bookedAt: new Date().toISOString() }).catch(() => null);
  if (reserved === null) return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  if (!reserved) return NextResponse.json({ error: "slot_taken" }, { status: 409 });

  const data = {
    ...result.data,
    details: { ...result.data.details, slot: slotId, preferredDay: formatDate(slot.date), preferredTime: `${slot.time} ${SLOT_ZONE}`, source: result.data.details.source || "Calendar booking" },
  };
  try {
    const saved = await saveEnquiry(store, data);
    await store.put("bookings", slotId, { slot: slotId, bookedAt: new Date().toISOString(), enquiryId: saved.id });
  } catch {
    await store.del("bookings", slotId).catch(() => undefined); // never leave a slot held for a request that was lost
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, receivedAt: new Date().toISOString() }),
    }).catch(() => undefined); // the booking is already saved; the webhook is a copy
  }
  // the two emails (the team's copy and the visitor's confirmation); the booking stands whether or not they go out
  const mailed = await notifyBooking({
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    message: data.message,
    when: `${formatDate(slot.date)}, ${slot.time} ${SLOT_ZONE}`,
    industry: result.data.details.industry,
    companySize: result.data.details.companySize,
  }).catch(() => ({ admin: false, user: false }));
  return NextResponse.json({ ok: true, slot: slotId, emailed: mailed });
}
