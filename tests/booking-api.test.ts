// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GET as taken, POST as book } from "@/app/api/booking/route";
import { DELETE as deleteEnquiry } from "@/app/api/admin/enquiries/[id]/route";
import { COOKIE, createSession } from "@/lib/adminAuth";
import { SLOT_TIMES, bookableRange, isWeekday, slotId } from "@/lib/slots";
import { _fileStoreForTests, getStore } from "@/lib/store";

/** The first weekday that can be booked, and a slot on it. */
function firstDay() {
  let key = bookableRange().first;
  while (!isWeekday(key)) key = new Date(new Date(key + "T00:00:00Z").getTime() + 86400000).toISOString().slice(0, 10);
  return key;
}
const DAY = firstDay();
const SLOT = slotId(DAY, SLOT_TIMES[1]);

const person = (over: Record<string, unknown> = {}, slot: unknown = SLOT) => ({
  name: "Asha Rao",
  company: "Rao Glass",
  email: "asha@example.com",
  phone: "99999",
  message: "",
  details: { slot, industry: "Glass railing", companySize: "Prefer not to say", source: "Calendar booking" },
  website: "",
  ...over,
});
const post = (body: unknown) => book(new Request("http://localhost/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "fen1-book-"));
  vi.stubEnv("FEN1_DATA_FILE", join(dir, "data.json"));
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("ENQUIRY_WEBHOOK_URL", "");
  vi.stubEnv("ADMIN_PASSWORD", "correct horse battery staple");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("/api/booking", () => {
  it("keeps the slot for the first person and files a demo request that names the date and time", async () => {
    const res = await post(person());
    expect(res.status).toBe(200);
    const store = getStore()!;
    expect((await store.all("bookings")).map((b) => b.slot)).toEqual([SLOT]);
    const [saved] = await store.all("enquiries");
    expect(saved.kind).toBe("demo");
    expect(saved.details).toMatchObject({ slot: SLOT, preferredTime: `${SLOT_TIMES[1]} IST`, source: "Calendar booking", industry: "Glass railing" });
    expect(String((saved.details as Record<string, string>).preferredDay)).toMatch(/\d{4}$/);
  });

  it("gives a slot to one person only: the second gets 409 and nothing is filed for them", async () => {
    expect((await post(person())).status).toBe(200);
    const second = await post(person({ name: "Someone Else", email: "else@example.com" }));
    expect(second.status).toBe(409);
    expect(await getStore()!.all("enquiries")).toHaveLength(1);
  });

  it("gives the slot to exactly one of two people booking at the same moment", async () => {
    const results = await Promise.all([post(person({ name: "A One", email: "a@example.com" })), post(person({ name: "B Two", email: "b@example.com" }))]);
    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
    expect(await getStore()!.all("bookings")).toHaveLength(1);
  });

  it("lists the taken slots, and only the slots", async () => {
    await post(person());
    const body = await (await taken()).json();
    expect(body).toEqual({ taken: [SLOT] });
  });

  it("refuses a slot that is not bookable (a weekend, a time that is not offered, none at all) without holding anything", async () => {
    let sat = bookableRange().first;
    while (isWeekday(sat)) sat = new Date(new Date(sat + "T00:00:00Z").getTime() + 86400000).toISOString().slice(0, 10);
    for (const slot of [slotId(sat, "10:00"), `${DAY}T13:30`, "", null, "2020-01-06T10:00"]) {
      expect((await post(person({}, slot))).status).toBe(422);
    }
    expect(await getStore()!.all("bookings")).toEqual([]);
  });

  it("checks the visitor's details like any enquiry, and drops bot submissions quietly", async () => {
    expect((await post(person({ name: "" }))).status).toBe(422);
    expect((await post(person({ email: "nope" }))).status).toBe(422);
    expect((await post(person({ website: "http://spam.example" }))).status).toBe(200);
    expect(await getStore()!.all("bookings")).toEqual([]);
  });

  it("says so, and holds nothing, when there is nowhere to save to", async () => {
    vi.stubEnv("FEN1_DATA_FILE", "");
    vi.stubEnv("VERCEL", "1");
    expect((await post(person())).status).toBe(503);
    expect((await taken()).status).toBe(503);
  });

  it("gives the slot back when the admin deletes the booking", async () => {
    await post(person());
    const store = getStore()!;
    const [saved] = await store.all("enquiries");
    const token = await createSession();
    const res = await deleteEnquiry(new Request("http://localhost/x", { method: "DELETE", headers: { cookie: `${COOKIE}=${token}` } }), { params: Promise.resolve({ id: String(saved.id) }) });
    expect(res.status).toBe(200);
    expect(await store.all("bookings")).toEqual([]);
    expect((await post(person({ email: "next@example.com" }))).status).toBe(200);
  });
});

describe("the store's put-if-absent", () => {
  it("saves once and refuses the second try", async () => {
    const store = _fileStoreForTests(join(dir, "s.json"));
    expect(await store.putIfAbsent("bookings", "x", { a: 1 })).toBe(true);
    expect(await store.putIfAbsent("bookings", "x", { a: 2 })).toBe(false);
    expect(await store.get("bookings", "x")).toEqual({ a: 1 });
  });
});
