import { admit, json, readBody } from "@/lib/adminApi";
import { asJob, validateJob, type Job } from "@/lib/jobs";

type Ctx = { params: Promise<{ id: string }> };

/** Either a full edit, or just { open: true | false } to close or reopen a role. */
export async function PATCH(request: Request, { params }: Ctx) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const { id } = await params;
  const existing = (await gate.store.get("jobs", id)) && asJob((await gate.store.get("jobs", id))!);
  if (!existing) return json({ error: "not_found" }, 404);

  const body = await readBody(request);
  const onlyOpen = typeof body === "object" && body !== null && Object.keys(body).length === 1 && typeof (body as { open?: unknown }).open === "boolean";
  let next: Job;
  if (onlyOpen) {
    next = { ...existing, open: (body as { open: boolean }).open, updatedAt: new Date().toISOString() };
  } else {
    const result = validateJob(body);
    if (!result.ok) return json({ error: "invalid", fields: result.errors }, 422);
    next = { ...existing, ...result.data, updatedAt: new Date().toISOString() };
  }
  await gate.store.put("jobs", id, next as unknown as Record<string, unknown>);
  return json({ job: next });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const { id } = await params;
  return (await gate.store.del("jobs", id)) ? json({ ok: true }) : json({ error: "not_found" }, 404);
}
