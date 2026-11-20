import { admit, json } from "@/lib/adminApi";
import { resumeType } from "@/lib/resume";

type Ctx = { params: Promise<{ id: string }> };

/** The resume that came with a job application, for the signed-in admin only. */
export async function GET(request: Request, { params }: Ctx) {
  const gate = await admit(request);
  if ("response" in gate) return gate.response;
  const { id } = await params;
  const record = await gate.store.get("resumes", id);
  if (!record || typeof record.name !== "string" || typeof record.data !== "string") return json({ error: "not_found" }, 404);
  const bytes = Buffer.from(record.data, "base64");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": resumeType(record.name),
      "Content-Disposition": `attachment; filename="${record.name.replace(/[^\w. -]/g, "_")}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
