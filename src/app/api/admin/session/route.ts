import { NextResponse } from "next/server";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { getStore } from "@/lib/store";

/** What the admin page needs to know before it shows anything: is admin set up, am I signed in, can things be saved. */
export async function GET(request: Request) {
  return NextResponse.json({ configured: adminConfigured(), loggedIn: isAdmin(request), storage: getStore()?.kind ?? null }, { headers: { "Cache-Control": "no-store" } });
}
