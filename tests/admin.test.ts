// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DEFAULT_PASSWORD, checkPassword, createSession, passwordProblem, resetAttemptsForTests, sessionCookie, usingDefaultPassword, verifySession } from "@/lib/adminAuth";
import { _fileStoreForTests, _redisStoreForTests, getStore } from "@/lib/store";
import { validateJob } from "@/lib/jobs";
import { csvCell, enquiriesToCsv } from "@/lib/csv";
import type { StoredEnquiry } from "@/lib/inbox";
import { POST as login } from "@/app/api/admin/login/route";
import { POST as logout } from "@/app/api/admin/logout/route";
import { POST as changePassword } from "@/app/api/admin/password/route";
import { GET as sessionInfo } from "@/app/api/admin/session/route";
import { GET as listJobs, POST as addJob } from "@/app/api/admin/jobs/route";
import { PATCH as patchJob, DELETE as deleteJob } from "@/app/api/admin/jobs/[id]/route";
import { GET as listEnquiries } from "@/app/api/admin/enquiries/route";
import { PATCH as patchEnquiry, DELETE as deleteEnquiry } from "@/app/api/admin/enquiries/[id]/route";
import { GET as publicJobs } from "@/app/api/jobs/route";
import { POST as submit } from "@/app/api/enquiry/route";

const PASSWORD = "correct horse battery staple";
let dir: string;

const request = (path: string, init: { method?: string; body?: unknown; cookie?: string; headers?: Record<string, string> } = {}) =>
  new Request(`http://localhost${path}`, {
    method: init.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(init.cookie ? { cookie: init.cookie } : {}), ...(init.headers ?? {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const cookieOf = (res: Response) => (res.headers.get("set-cookie") ?? "").split(";")[0];

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "fen1-"));
  vi.stubEnv("ADMIN_PASSWORD", PASSWORD);
  vi.stubEnv("FEN1_DATA_FILE", join(dir, "data.json"));
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("ENQUIRY_WEBHOOK_URL", "");
  resetAttemptsForTests();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  rmSync(dir, { recursive: true, force: true });
});

async function signIn(): Promise<string> {
  const res = await login(request("/api/admin/login", { method: "POST", body: { password: PASSWORD } }));
  expect(res.status).toBe(200);
  return cookieOf(res);
}

describe("admin session", () => {
  it("accepts only the right password", async () => {
    expect(await checkPassword(PASSWORD)).toBe(true);
    expect(await checkPassword("wrong")).toBe(false);
    expect(await checkPassword("")).toBe(false);
    expect(await checkPassword(undefined)).toBe(false);
  });

  it("refuses everything when there is no password, no secret and nowhere to keep one", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect(await createSession()).toBeNull();
    expect(await verifySession("1.x")).toBe(false);
  });

  it("signs a session that expires and cannot be forged or edited", async () => {
    const now = Date.now();
    const token = (await createSession(now))!;
    expect(await verifySession(token, now + 1000)).toBe(true);
    expect(await verifySession(token, now + 13 * 3600 * 1000)).toBe(false);
    const [exp, sig] = token.split(".");
    expect(await verifySession(`${Number(exp) + 99999999}.${sig}`, now)).toBe(false);
    expect(await verifySession(`${exp}.${sig.slice(0, -2)}xx`, now)).toBe(false);
    expect(await verifySession("nonsense", now)).toBe(false);
    expect(await verifySession(undefined)).toBe(false);
  });

  it("sets an httpOnly, same-site cookie, and clears it on sign out", () => {
    const set = sessionCookie("abc");
    expect(set).toMatch(/HttpOnly/);
    expect(set).toMatch(/SameSite=Strict/);
    expect(set).toMatch(/Max-Age=\d+/);
    expect(sessionCookie(null)).toMatch(/Max-Age=0/);
  });

  it("signs in with the password, reports it, and signs out", async () => {
    const cookie = await signIn();
    expect(cookie).toMatch(/^fen1_admin=/);
    const info = await (await sessionInfo(request("/api/admin/session", { cookie }))).json();
    expect(info).toMatchObject({ configured: true, loggedIn: true, storage: "file" });
    const out = await logout();
    expect(out.headers.get("set-cookie")).toMatch(/Max-Age=0/);
    const anon = await (await sessionInfo(request("/api/admin/session"))).json();
    expect(anon.loggedIn).toBe(false);
  });

  it("rejects a wrong password without setting a cookie", async () => {
    const res = await login(request("/api/admin/login", { method: "POST", body: { password: "nope" } }));
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("locks out an address after repeated wrong passwords", async () => {
    vi.useFakeTimers();
    const attempt = async () => {
      const p = login(request("/api/admin/login", { method: "POST", body: { password: "nope" }, headers: { "x-forwarded-for": "9.9.9.9" } }));
      let done = false;
      p.then(() => (done = true));
      while (!done) await vi.advanceTimersByTimeAsync(100); // the wait starts only after the password has been checked
      return p;
    };
    for (let i = 0; i < 8; i++) expect((await attempt()).status).toBe(401);
    const locked = await login(request("/api/admin/login", { method: "POST", body: { password: PASSWORD }, headers: { "x-forwarded-for": "9.9.9.9" } }));
    expect(locked.status).toBe(429);
    vi.useRealTimers();
  });

  it("says admin is not set up when there is no password", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect((await login(request("/api/admin/login", { method: "POST", body: { password: "x" } }))).status).toBe(503);
    expect((await listJobs(request("/api/admin/jobs"))).status).toBe(503);
  });
});

describe("changing the password from the website", () => {
  const STARTING = DEFAULT_PASSWORD;
  const NEW = "a better password 42";
  const post = (body: unknown, cookie?: string) => changePassword(request("/api/admin/password", { method: "POST", body, cookie }));
  const signInWith = async (password: string) => login(request("/api/admin/login", { method: "POST", body: { password } }));

  beforeEach(() => vi.stubEnv("ADMIN_PASSWORD", ""));

  it("starts with 123456 when nothing is set, and says so once signed in", async () => {
    expect(STARTING).toBe("123456");
    expect(await usingDefaultPassword()).toBe(true);
    const res = await signInWith(STARTING);
    expect(res.status).toBe(200);
    const info = await (await sessionInfo(request("/api/admin/session", { cookie: cookieOf(res) }))).json();
    expect(info).toMatchObject({ loggedIn: true, defaultPassword: true });
    const anon = await (await sessionInfo(request("/api/admin/session"))).json();
    expect(anon.defaultPassword).toBe(false); // not told to anyone who is not signed in
  });

  it("signs the cookie with a random secret from the database, so the starting password does not make it forgeable", async () => {
    const cookie = cookieOf(await signInWith(STARTING));
    expect(cookie).toMatch(/^fen1_admin=\d+\./);
    const forged = `fen1_admin=${Date.now() + 1e7}.${Buffer.from("fen1-admin:123456").toString("base64url")}`;
    expect((await listJobs(request("/api/admin/jobs", { cookie: forged }))).status).toBe(401);
    expect((await listJobs(request("/api/admin/jobs", { cookie }))).status).toBe(200);
  });

  it("needs the current password, and a new one that is long enough and different", async () => {
    const cookie = cookieOf(await signInWith(STARTING));
    expect((await post({ next: NEW }, undefined)).status).toBe(401);
    expect((await post({ current: "wrong", next: NEW }, cookie)).status).toBe(403);
    expect((await post({ current: STARTING, next: "short" }, cookie)).status).toBe(422);
    expect((await post({ current: STARTING, next: STARTING }, cookie)).status).toBe(422);
    expect(passwordProblem("long enough pw", "something else")).toBeNull();
    expect(await checkPassword(STARTING)).toBe(true); // nothing changed
  });

  it("saves only a salted hash, switches to the new password, and keeps this browser signed in", async () => {
    const cookie = cookieOf(await signInWith(STARTING));
    const res = await post({ current: STARTING, next: NEW }, cookie);
    expect(res.status).toBe(200);
    expect(JSON.stringify(await _fileStoreForTests(join(dir, "data.json")).all("settings"))).not.toContain(NEW);
    expect(await usingDefaultPassword()).toBe(false);
    expect(await checkPassword(NEW)).toBe(true);
    expect(await checkPassword(STARTING)).toBe(false);
    expect((await signInWith(STARTING)).status).toBe(401);
    expect((await signInWith(NEW)).status).toBe(200);
    const fresh = cookieOf(res);
    expect((await listJobs(request("/api/admin/jobs", { cookie: fresh }))).status).toBe(200);
  });

  it("signs out every other browser", async () => {
    const other = cookieOf(await signInWith(STARTING));
    const mine = cookieOf(await signInWith(STARTING));
    await post({ current: STARTING, next: NEW }, mine);
    expect((await listJobs(request("/api/admin/jobs", { cookie: other }))).status).toBe(401);
  });

  it("uses ADMIN_PASSWORD as the starting password when it is set, until the password is changed", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "from the environment");
    expect(await usingDefaultPassword()).toBe(false);
    expect(await checkPassword("from the environment")).toBe(true);
    expect(await checkPassword(STARTING)).toBe(false);
    const cookie = cookieOf(await signInWith("from the environment"));
    await post({ current: "from the environment", next: NEW }, cookie);
    expect(await checkPassword("from the environment")).toBe(false);
    expect(await checkPassword(NEW)).toBe(true);
  });

  it("cannot save without a database", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "a secret from the environment");
    const cookie = cookieOf(await signInWith(STARTING));
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect((await post({ current: STARTING, next: NEW }, cookie)).status).toBe(503);
  });
});

describe("admin routes need a signed-in session", () => {
  it("answers 401 without the cookie, for every admin route", async () => {
    const checks = [
      await listJobs(request("/api/admin/jobs")),
      await addJob(request("/api/admin/jobs", { method: "POST", body: {} })),
      await patchJob(request("/api/admin/jobs/x", { method: "PATCH", body: { open: false } }), ctx("x")),
      await deleteJob(request("/api/admin/jobs/x", { method: "DELETE" }), ctx("x")),
      await listEnquiries(request("/api/admin/enquiries")),
      await patchEnquiry(request("/api/admin/enquiries/x", { method: "PATCH", body: { status: "handled" } }), ctx("x")),
      await deleteEnquiry(request("/api/admin/enquiries/x", { method: "DELETE" }), ctx("x")),
    ];
    for (const res of checks) expect(res.status).toBe(401);
  });

  it("answers 401 for a forged cookie", async () => {
    const res = await listJobs(request("/api/admin/jobs", { cookie: "fen1_admin=9999999999999.forged" }));
    expect(res.status).toBe(401);
  });

  it("says so when the site has nowhere to save (deployed without a database)", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "a secret from the environment");
    const cookie = await signIn();
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect(getStore()).toBeNull();
    const res = await listJobs(request("/api/admin/jobs", { cookie }));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("no_storage");
  });
});

describe("job openings: the admin adds them, the website shows the open ones", () => {
  const job = { title: "Estimator, aluminium systems", area: "Estimating, production or site experience", location: "Pune", type: "Full-time", summary: "Price window and door packages from drawings.", details: "Paragraph one.\n\nParagraph two.", open: true };

  it("validates a job", () => {
    expect(validateJob({}).ok).toBe(false);
    const bad = validateJob({ title: "x", summary: "", type: "Whenever" });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors).sort()).toEqual(["summary", "type"]);
    const good = validateJob({ ...job, title: `  ${job.title}  `, id: "client-chosen", createdAt: "2000-01-01" });
    expect(good.ok).toBe(true);
    if (good.ok) {
      expect(good.data.title).toBe(job.title);
      expect(good.data).not.toHaveProperty("id");
      expect(good.data).not.toHaveProperty("createdAt");
    }
  });

  it("adds, lists, edits, closes, reopens and deletes a job", async () => {
    const cookie = await signIn();
    const bad = await addJob(request("/api/admin/jobs", { method: "POST", body: { title: "" }, cookie }));
    expect(bad.status).toBe(422);

    const created = await addJob(request("/api/admin/jobs", { method: "POST", body: job, cookie }));
    expect(created.status).toBe(201);
    const { job: saved } = await created.json();
    expect(saved.id).toBeTruthy();

    expect((await (await listJobs(request("/api/admin/jobs", { cookie }))).json()).jobs).toHaveLength(1);

    const edited = await patchJob(request(`/api/admin/jobs/${saved.id}`, { method: "PATCH", body: { ...job, title: "Senior estimator" }, cookie }), ctx(saved.id));
    expect((await edited.json()).job.title).toBe("Senior estimator");

    const closed = await patchJob(request(`/api/admin/jobs/${saved.id}`, { method: "PATCH", body: { open: false }, cookie }), ctx(saved.id));
    expect((await closed.json()).job).toMatchObject({ open: false, title: "Senior estimator" });
    const reopened = await patchJob(request(`/api/admin/jobs/${saved.id}`, { method: "PATCH", body: { open: true }, cookie }), ctx(saved.id));
    expect((await reopened.json()).job.open).toBe(true);

    expect((await patchJob(request("/api/admin/jobs/missing", { method: "PATCH", body: { open: false }, cookie }), ctx("missing"))).status).toBe(404);
    expect((await deleteJob(request(`/api/admin/jobs/${saved.id}`, { method: "DELETE", cookie }), ctx(saved.id))).status).toBe(200);
    expect((await deleteJob(request(`/api/admin/jobs/${saved.id}`, { method: "DELETE", cookie }), ctx(saved.id))).status).toBe(404);
  });

  it("shows only open jobs on the public endpoint, and only the fields the page needs", async () => {
    const cookie = await signIn();
    const make = async (title: string, open: boolean) => (await (await addJob(request("/api/admin/jobs", { method: "POST", body: { ...job, title, open }, cookie }))).json()).job;
    await make("Open role", true);
    await make("Closed role", false);
    const res = await publicJobs();
    const { jobs } = await res.json();
    expect(jobs.map((j: { title: string }) => j.title)).toEqual(["Open role"]);
    expect(Object.keys(jobs[0]).sort()).toEqual(["area", "details", "id", "location", "summary", "title", "type"]);
    expect(res.headers.get("cache-control")).toMatch(/s-maxage/);
  });

  it("shows an empty list, not an error, when nothing is saved or there is no store", async () => {
    expect((await (await publicJobs()).json()).jobs).toEqual([]);
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect((await (await publicJobs()).json()).jobs).toEqual([]);
  });
});

describe("enquiries: saved to the inbox, viewed and handled by the admin", () => {
  const body = (kind: string, extra: Record<string, unknown> = {}) => ({ kind, name: "Asha Rao", company: "Rao Glazing", email: "asha@raoglazing.com", phone: "12345", message: "Hello", details: {}, ...extra });
  const send = (b: unknown) => submit(request("/api/enquiry", { method: "POST", body: b }));

  it("saves a demo request, a question and a job application, and lists them newest first by type", async () => {
    const cookie = await signIn();
    expect((await send(body("demo", { details: { industry: "Glazing Contractor" } }))).status).toBe(200);
    expect((await send(body("contact", { name: "Dev" }))).status).toBe(200);
    expect((await send(body("careers", { company: "", name: "Meera", details: { role: "Estimator", area: "Estimating" } }))).status).toBe(200);
    const { enquiries } = await (await listEnquiries(request("/api/admin/enquiries", { cookie }))).json();
    expect(enquiries).toHaveLength(3);
    expect(enquiries.map((e: StoredEnquiry) => e.kind).sort()).toEqual(["careers", "contact", "demo"]);
    expect(enquiries.every((e: StoredEnquiry) => e.status === "new" && e.id && e.receivedAt)).toBe(true);
    const job = enquiries.find((e: StoredEnquiry) => e.kind === "careers");
    expect(job.details.role).toBe("Estimator");
    expect(job.company).toBe("");
  });

  it("marks an enquiry handled, back to waiting, and deletes it", async () => {
    const cookie = await signIn();
    await send(body("demo"));
    const [e] = (await (await listEnquiries(request("/api/admin/enquiries", { cookie }))).json()).enquiries;
    const handled = await patchEnquiry(request(`/api/admin/enquiries/${e.id}`, { method: "PATCH", body: { status: "handled" }, cookie }), ctx(e.id));
    expect((await handled.json()).enquiry.status).toBe("handled");
    expect((await patchEnquiry(request(`/api/admin/enquiries/${e.id}`, { method: "PATCH", body: { status: "bogus" }, cookie }), ctx(e.id))).status).toBe(422);
    expect((await patchEnquiry(request("/api/admin/enquiries/none", { method: "PATCH", body: { status: "new" }, cookie }), ctx("none"))).status).toBe(404);
    expect((await deleteEnquiry(request(`/api/admin/enquiries/${e.id}`, { method: "DELETE", cookie }), ctx(e.id))).status).toBe(200);
    expect((await (await listEnquiries(request("/api/admin/enquiries", { cookie }))).json()).enquiries).toHaveLength(0);
  });

  it("drops a submission that fills the hidden spam-trap field, without saving it", async () => {
    const cookie = await signIn();
    const res = await send(body("demo", { website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect((await (await listEnquiries(request("/api/admin/enquiries", { cookie }))).json()).enquiries).toHaveLength(0);
  });

  it("still validates: a careers application needs a name and email but no company", async () => {
    expect((await send(body("careers", { company: "" }))).status).toBe(200);
    expect((await send(body("demo", { company: "" }))).status).toBe(422);
    expect((await send(body("careers", { email: "not-an-email" }))).status).toBe(422);
  });

  it("succeeds if either the store or the webhook takes the enquiry, and fails only if both fail", async () => {
    vi.stubEnv("ENQUIRY_WEBHOOK_URL", "https://hooks.example.test/x");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect((await send(body("demo"))).status).toBe(200); // saved even though the webhook refused
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect((await send(body("demo"))).status).toBe(502); // no store and the webhook refused
  });
});

describe("storage", () => {
  it("keeps records separately in the file store, and survives overlapping writes", async () => {
    const store = _fileStoreForTests(join(dir, "s.json"));
    await Promise.all(Array.from({ length: 20 }, (_, i) => store.put("enquiries", `e${i}`, { id: `e${i}`, n: i })));
    expect(await store.all("enquiries")).toHaveLength(20);
    expect(await store.get("enquiries", "e3")).toEqual({ id: "e3", n: 3 });
    expect(await store.del("enquiries", "e3")).toBe(true);
    expect(await store.del("enquiries", "e3")).toBe(false);
    expect(await store.all("jobs")).toEqual([]);
  });

  it("talks to Upstash Redis over its REST API with the token, one hash field per record", async () => {
    const hashes = new Map<string, Map<string, string>>();
    const calls: { auth: string | null; cmd: unknown[] }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init: RequestInit) => {
        const cmd = JSON.parse(String(init.body)) as string[];
        calls.push({ auth: (init.headers as Record<string, string>).Authorization, cmd });
        const [op, key, field, value] = cmd;
        const h = hashes.get(key) ?? new Map<string, string>();
        hashes.set(key, h);
        let result: unknown = null;
        if (op === "HSET") {
          h.set(field, value);
          result = 1;
        }
        if (op === "HGET") result = h.get(field) ?? null;
        if (op === "HDEL") result = h.delete(field) ? 1 : 0;
        if (op === "HGETALL") result = [...h.entries()].flat();
        return new Response(JSON.stringify({ result }), { status: 200 });
      })
    );
    const store = _redisStoreForTests("https://example.upstash.io", "TOKEN");
    await store.put("jobs", "a", { id: "a", title: "One" });
    await store.put("jobs", "b", { id: "b", title: "Two" });
    expect((await store.all("jobs")).map((j) => j.title).sort()).toEqual(["One", "Two"]);
    expect(await store.get("jobs", "a")).toEqual({ id: "a", title: "One" });
    expect(await store.del("jobs", "a")).toBe(true);
    expect(await store.get("jobs", "a")).toBeNull();
    expect(calls.every((c) => c.auth === "Bearer TOKEN")).toBe(true);
    expect(calls[0].cmd.slice(0, 3)).toEqual(["HSET", "fen1:jobs", "a"]);
  });

  it("reports a failing database instead of pretending", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: "WRONGPASS" }), { status: 401 })));
    const store = _redisStoreForTests("https://example.upstash.io", "BAD");
    await expect(store.all("jobs")).rejects.toThrow(/failed/);
  });

  it("picks Redis when its variables are set (Upstash or the KV names), the file otherwise, nothing on Vercel", () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://x.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
    expect(getStore()?.kind).toBe("redis");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("KV_REST_API_URL", "https://y.upstash.io");
    vi.stubEnv("KV_REST_API_TOKEN", "t");
    expect(getStore()?.kind).toBe("redis");
    vi.stubEnv("KV_REST_API_URL", "");
    expect(getStore()?.kind).toBe("file");
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect(getStore()).toBeNull();
  });
});

describe("CSV export", () => {
  it("quotes cells and neutralises spreadsheet formulas typed into the form", () => {
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("=HYPERLINK(\"http://evil\")")).toBe('"\'=HYPERLINK(""http://evil"")"');
    expect(csvCell("+1 555")).toBe("\"'+1 555\"");
    expect(csvCell("normal")).toBe('"normal"');
  });

  it("writes a header and a row per enquiry with its type, status and details", () => {
    const csv = enquiriesToCsv([{ id: "1", kind: "careers", name: "Meera", company: "", email: "m@x.com", phone: "1", message: "Hi", details: { role: "Estimator" }, receivedAt: "2026-01-02T03:04:05.000Z", status: "new" }]);
    const [head, row] = csv.split("\r\n");
    expect(head).toContain('"Type"');
    expect(row).toContain('"Job application"');
    expect(row).toContain('"role: Estimator"');
  });
});
