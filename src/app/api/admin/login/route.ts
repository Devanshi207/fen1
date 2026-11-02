import { NextResponse } from "next/server";
import { adminReady, checkPassword, clearFailures, createSession, recordFailure, sessionCookie, tooManyAttempts } from "@/lib/adminAuth";
import { readBody } from "@/lib/adminApi";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  if (!(await adminReady())) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (tooManyAttempts(ip)) return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });

  const body = (await readBody(request)) as { password?: unknown } | null;
  if (!(await checkPassword(body?.password))) {
    recordFailure(ip);
    await wait(600); // a wrong guess costs time
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }
  const token = await createSession();
  if (!token) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  clearFailures(ip);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", sessionCookie(token));
  return res;
}
