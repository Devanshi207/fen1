import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * The admin login. One password (ADMIN_PASSWORD) opens a session: a cookie holding an expiry time and an HMAC signature of
 * it. The cookie is httpOnly (scripts cannot read it), SameSite=Strict (other sites cannot send it) and Secure in
 * production. Nothing is stored on the server, so there is no session table to keep. Failed attempts are slowed and
 * counted per address (best effort: serverless instances do not share memory).
 */
export const COOKIE = "fen1_admin";
export const SESSION_HOURS = 12;

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const secret = () => process.env.ADMIN_SESSION_SECRET || `fen1-admin:${process.env.ADMIN_PASSWORD ?? ""}`;
const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("base64url");
const digest = (value: string) => createHash("sha256").update(value).digest();

/** Compares in constant time, so the time taken does not hint at how much of a guess was right. */
export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  return timingSafeEqual(digest(input), digest(expected));
}

export function createSession(now = Date.now()): string {
  const expires = String(now + SESSION_HOURS * 3600 * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySession(token: string | undefined | null, now = Date.now()): boolean {
  if (!token || !adminConfigured()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  const a = Buffer.from(signature);
  const b = Buffer.from(sign(expires));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(expires) > now;
}

function cookieValue(header: string | null, name: string): string | undefined {
  for (const part of (header ?? "").split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export const isAdmin = (request: Request) => verifySession(cookieValue(request.headers.get("cookie"), COOKIE));

export function sessionCookie(token: string | null): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const base = `${COOKIE}=${token ?? ""}; Path=/; HttpOnly; SameSite=Strict${secure}`;
  return token ? `${base}; Max-Age=${SESSION_HOURS * 3600}` : `${base}; Max-Age=0`;
}

/* ---------- slowing down repeated wrong passwords ---------- */
const failures = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 8;

export function tooManyAttempts(ip: string, now = Date.now()): boolean {
  const f = failures.get(ip);
  if (!f) return false;
  if (now - f.first > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return f.count >= LIMIT;
}
export function recordFailure(ip: string, now = Date.now()) {
  const f = failures.get(ip);
  if (!f || now - f.first > WINDOW_MS) failures.set(ip, { count: 1, first: now });
  else f.count += 1;
}
export const clearFailures = (ip: string) => failures.delete(ip);
export const resetAttemptsForTests = () => failures.clear();
