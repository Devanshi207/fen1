import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/adminAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", sessionCookie(null));
  return res;
}
