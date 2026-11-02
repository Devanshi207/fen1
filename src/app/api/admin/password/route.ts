import { checkPassword, clearFailures, createSession, passwordProblem, recordFailure, savePassword, sessionCookie, tooManyAttempts } from "@/lib/adminAuth";
import { admit, json, readBody } from "@/lib/adminApi";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Change the admin password from the website: needs the current one, and signs every other browser out. */
export async function POST(request: Request) {
  const gate = await admit(request);
  if ("response" in gate) return gate.response;
  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (tooManyAttempts(ip)) return json({ error: "too_many_attempts" }, 429);

  const body = (await readBody(request)) as { current?: unknown; next?: unknown } | null;
  if (!(await checkPassword(body?.current))) {
    recordFailure(ip);
    await wait(600);
    return json({ error: "wrong_current" }, 403);
  }
  const problem = passwordProblem(body?.next, body?.current);
  if (problem) return json({ error: "weak", message: problem }, 422);
  if (!(await savePassword(body!.next as string))) return json({ error: "no_storage" }, 503);

  clearFailures(ip);
  const res = json({ ok: true });
  const token = await createSession();
  if (token) res.headers.set("Set-Cookie", sessionCookie(token)); // this browser stays signed in
  return res;
}
