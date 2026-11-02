import { NextResponse } from "next/server";
import { asJob, byNewest } from "@/lib/jobs";
import { getStore } from "@/lib/store";

/**
 * The open job openings, for the Careers section. Public, so it returns only open roles and only the fields the page shows.
 * If nothing is saved yet, or the store cannot be reached, it answers with an empty list and the page says no roles are listed.
 */
export async function GET() {
  const headers = { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" };
  const store = getStore();
  if (!store) return NextResponse.json({ jobs: [] }, { headers });
  try {
    const jobs = (await store.all("jobs"))
      .map(asJob)
      .filter((j): j is NonNullable<typeof j> => j !== null && j.open)
      .sort(byNewest)
      .map(({ id, title, area, location, type, summary, details }) => ({ id, title, area, location, type, summary, details }));
    return NextResponse.json({ jobs }, { headers });
  } catch {
    return NextResponse.json({ jobs: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
