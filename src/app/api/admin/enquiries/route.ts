import { admit, json } from "@/lib/adminApi";
import { asEnquiry, newestFirst, type StoredEnquiry } from "@/lib/inbox";

export async function GET(request: Request) {
  const gate = admit(request);
  if ("response" in gate) return gate.response;
  const enquiries = (await gate.store.all("enquiries")).map(asEnquiry).filter((e): e is StoredEnquiry => e !== null).sort(newestFirst);
  return json({ enquiries });
}
