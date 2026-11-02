import { NextResponse } from "next/server";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { getStore, type Store } from "@/lib/store";

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Every admin route starts here. Returns the response to send when the request must not go on (admin not set up, not
 * signed in, or nowhere to save to), or the store to use when it may.
 */
export function admit(request: Request): { response: Response } | { store: Store } {
  if (!adminConfigured()) return { response: json({ error: "not_configured" }, 503) };
  if (!isAdmin(request)) return { response: json({ error: "unauthorized" }, 401) };
  const store = getStore();
  if (!store) return { response: json({ error: "no_storage" }, 503) };
  return { store };
}

export async function readBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
