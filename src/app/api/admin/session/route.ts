import { NextResponse } from "next/server";
import { adminReady, isAdmin, usingDefaultPassword } from "@/lib/adminAuth";
import { getStore } from "@/lib/store";

/** What the admin page needs to know before it shows anything: is admin set up, am I signed in, can things be saved. */
export async function GET(request: Request) {
  const loggedIn = await isAdmin(request);
  return NextResponse.json(
    { configured: await adminReady(), loggedIn, storage: getStore()?.kind ?? null, defaultPassword: loggedIn ? await usingDefaultPassword() : false },
    { headers: { "Cache-Control": "no-store" } }
  );
}
