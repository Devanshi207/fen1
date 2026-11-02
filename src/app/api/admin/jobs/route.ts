import { admit, json, readBody } from "@/lib/adminApi";
import { asJob, byNewest, validateJob, type Job } from "@/lib/jobs";

export async function GET(request: Request) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const jobs = (await gate.store.all("jobs")).map(asJob).filter((j): j is Job => j !== null).sort(byNewest);
  return json({ jobs });
}

export async function POST(request: Request) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const result = validateJob(await readBody(request));
  if (!result.ok) return json({ error: "invalid", fields: result.errors }, 422);
  const now = new Date().toISOString();
  const job: Job = { ...result.data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  await gate.store.put("jobs", job.id, job as unknown as Record<string, unknown>);
  return json({ job }, 201);
}
