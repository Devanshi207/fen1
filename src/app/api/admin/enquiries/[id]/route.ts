import { admit, json, readBody } from "@/lib/adminApi";
import { asEnquiry } from "@/lib/inbox";

type Ctx = { params: Promise<{ id: string }> };

/** Marks an enquiry as handled, or as new again. */
export async function PATCH(request: Request, { params }: Ctx) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const { id } = await params;
  const record = await gate.store.get("enquiries", id);
  const existing = record && asEnquiry(record);
  if (!existing) return json({ error: "not_found" }, 404);
  const status = (await readBody(request) as { status?: unknown } | null)?.status;
  if (status !== "new" && status !== "handled") return json({ error: "invalid" }, 422);
  const next = { ...existing, status };
  await gate.store.put("enquiries", id, next as unknown as Record<string, unknown>);
  return json({ enquiry: next });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const { id } = await params;
  return (await gate.store.del("enquiries", id)) ? json({ ok: true }) : json({ error: "not_found" }, 404);
}
