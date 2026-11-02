import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { getStore } from "@/lib/store";

/**
 * The admin login. One password opens a session: a cookie holding an expiry time and an HMAC signature of it. The cookie is
 * httpOnly (scripts cannot read it), SameSite=Strict (other sites cannot send it) and Secure in production. There is no
 * session table. Failed attempts are slowed and counted per address (best effort: serverless instances do not share memory).
 *
 * Which password is right:
 *  - once it has been changed from the Account tab, the saved one (a salted scrypt hash in the database, never the password);
 *  - until then, ADMIN_PASSWORD if it is set, otherwise the starting password DEFAULT_PASSWORD.
 * The cookie is signed with ADMIN_SESSION_SECRET if set, otherwise a random secret kept in the database. Changing the password
 * makes a new secret, which signs every other browser out. Without a database a secret can only come from the environment.
 */
export const COOKIE = "fen1_admin";
export const SESSION_HOURS = 12;
/** The password before anybody has set one. Change it from the Account tab straight away. */
export const DEFAULT_PASSWORD = "123456";
export const MIN_PASSWORD = 8;

type Credential = { salt: string; hash: string; changedAt: string };

const envPassword = () => process.env.ADMIN_PASSWORD || "";
const digest = (value: string) => createHash("sha256").update(value).digest();
const hashOf = (password: string, salt: string) => new Promise<Buffer>((resolve, reject) => scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key))));
const sign = (value: string, key: string) => createHmac("sha256", key).update(value).digest("base64url");

async function savedCredential(): Promise<Credential | null> {
  const found = (await getStore()?.get("settings", "credential").catch(() => null)) as Credential | null | undefined;
  return found && typeof found.hash === "string" && typeof found.salt === "string" ? found : null;
}

/** True while the password is still the one the site started with (nothing saved, nothing set in the environment). */
export async function usingDefaultPassword(): Promise<boolean> {
  return !envPassword() && !(await savedCredential());
}

/** The key the cookie is signed with, or null when there is none (no secret set and nowhere to keep one). */
async function secret(create: boolean): Promise<string | null> {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  const store = getStore();
  if (store) {
    const saved = (await store.get("settings", "secret").catch(() => null)) as { value?: string } | null;
    if (saved?.value) return saved.value;
    if (create) {
      const value = randomBytes(32).toString("base64url");
      await store.put("settings", "secret", { value });
      return value;
    }
  }
  return envPassword() ? `fen1-admin:${envPassword()}` : null;
}

/** Whether a session can be started at all: there is a secret to sign with, or a database to keep one in. */
export async function adminReady(): Promise<boolean> {
  return Boolean(process.env.ADMIN_SESSION_SECRET || envPassword() || getStore());
}

/** Compares in constant time, so the time taken does not hint at how much of a guess was right. */
export async function checkPassword(input: unknown): Promise<boolean> {
  if (typeof input !== "string" || !input) return false;
  const saved = await savedCredential();
  if (saved) {
    const key = await hashOf(input, saved.salt);
    const want = Buffer.from(saved.hash, "base64url");
    return key.length === want.length && timingSafeEqual(key, want);
  }
  return timingSafeEqual(digest(input), digest(envPassword() || DEFAULT_PASSWORD));
}

/** Why a new password is not acceptable, or null if it is fine. */
export function passwordProblem(next: unknown, current: unknown): string | null {
  if (typeof next !== "string" || next.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (next.length > 200) return "That password is too long.";
  if (next === DEFAULT_PASSWORD || next === current) return "Choose a password different from the current one.";
  return null;
}

/** Saves a new password and a new signing secret (every other browser is signed out). Needs a database. */
export async function savePassword(next: string): Promise<boolean> {
  const store = getStore();
  if (!store) return false;
  const salt = randomBytes(16).toString("base64url");
  const hash = (await hashOf(next, salt)).toString("base64url");
  await store.put("settings", "credential", { salt, hash, changedAt: new Date().toISOString() });
  if (!process.env.ADMIN_SESSION_SECRET) await store.put("settings", "secret", { value: randomBytes(32).toString("base64url") });
  return true;
}

export async function createSession(now = Date.now()): Promise<string | null> {
  const key = await secret(true);
  if (!key) return null;
  const expires = String(now + SESSION_HOURS * 3600 * 1000);
  return `${expires}.${sign(expires, key)}`;
}

export async function verifySession(token: string | undefined | null, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires)) return false;
  const key = await secret(false);
  if (!key) return false;
  const a = Buffer.from(signature);
  const b = Buffer.from(sign(expires, key));
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
