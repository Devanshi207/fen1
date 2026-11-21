// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sent: Record<string, unknown>[] = [];
let failFor: string | null = null;
vi.mock("nodemailer", () => ({
  default: {
    createTransport: () => ({
      sendMail: async (m: Record<string, unknown>) => {
        if (failFor && m.to === failFor) throw new Error("mailbox unavailable");
        sent.push(m);
      },
    }),
  },
}));

import { POST as book } from "@/app/api/booking/route";
import { adminBookingMail, mailConfig, notifyBooking, userBookingMail } from "@/lib/mail";
import { SLOT_TIMES, bookableRange, isWeekday, slotId } from "@/lib/slots";

const BOOKING = { name: "Asha Rao", company: "Rao Glass", email: "asha@example.com", phone: "99999", message: "Railings for a hotel", when: "Tuesday 24 November 2026, 11:00 IST", industry: "Glass railing", companySize: "20 to 50 people" };

function slot() {
  let key = bookableRange().first;
  while (!isWeekday(key)) key = new Date(new Date(key + "T00:00:00Z").getTime() + 86400000).toISOString().slice(0, 10);
  return slotId(key, SLOT_TIMES[0]);
}
const post = (body: unknown) => book(new Request("http://localhost/api/booking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }));
const visitor = (s: string, over: Record<string, unknown> = {}) => ({ name: "Asha Rao", company: "Rao Glass", email: "asha@example.com", phone: "99999", message: "", details: { slot: s, industry: "Glass railing" }, website: "", ...over });

beforeEach(() => {
  sent.length = 0;
  failFor = null;
  vi.stubEnv("FEN1_DATA_FILE", join(mkdtempSync(join(tmpdir(), "fen1-mail-")), "data.json"));
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("ENQUIRY_WEBHOOK_URL", "");
  vi.stubEnv("SMTP_HOST", "smtp.example.com");
  vi.stubEnv("SMTP_PORT", "465");
  vi.stubEnv("SMTP_USER", "info@kyozon.in");
  vi.stubEnv("SMTP_PASS", "app-password");
  vi.stubEnv("MAIL_FROM", "");
  vi.stubEnv("ADMIN_NOTIFY_EMAIL", "");
});
afterEach(() => vi.unstubAllEnvs());

describe("mail settings", () => {
  it("is off until the host, the user and the password are all set", () => {
    expect(mailConfig()).toMatchObject({ host: "smtp.example.com", port: 465, from: "info@kyozon.in", adminTo: "info@kyozon.in" });
    vi.stubEnv("SMTP_PASS", "");
    expect(mailConfig()).toBeNull();
  });

  it("sends the team's copy to ADMIN_NOTIFY_EMAIL when it is set", () => {
    vi.stubEnv("ADMIN_NOTIFY_EMAIL", "sales@kyozon.in");
    expect(mailConfig()!.adminTo).toBe("sales@kyozon.in");
  });
});

describe("the two booking emails", () => {
  it("tell the team who booked which slot, with every detail, and reply to the visitor", () => {
    const m = adminBookingMail(BOOKING, "info@kyozon.in");
    expect(m.to).toBe("info@kyozon.in");
    expect(m.replyTo).toBe("asha@example.com");
    expect(m.subject).toContain("Tuesday 24 November 2026, 11:00 IST");
    for (const part of ["Asha Rao", "Rao Glass", "asha@example.com", "99999", "Glass railing", "20 to 50 people", "Railings for a hotel"]) expect(m.text).toContain(part);
  });

  it("confirm the slot to the visitor, by first name, and say how to change it", () => {
    const m = userBookingMail(BOOKING, "info@kyozon.in");
    expect(m.to).toBe("asha@example.com");
    expect(m.subject).toContain("11:00 IST");
    expect(m.text).toContain("Hello Asha,");
    expect(m.text).toContain("Tuesday 24 November 2026, 11:00 IST");
    expect(m.text).toContain("info@kyozon.in");
  });

  it("cannot be bent by what a visitor types: markup is escaped and line breaks cannot add headers", () => {
    const m = adminBookingMail({ ...BOOKING, name: "Eve\r\nBcc: spy@example.com", message: "<script>alert(1)</script>" }, "info@kyozon.in");
    expect(m.subject).not.toMatch(/[\r\n]/);
    expect(m.html).not.toContain("<script>");
    expect(m.html).toContain("&lt;script&gt;");
  });
});

describe("booking and email together", () => {
  it("emails the team and the visitor once the slot is booked", async () => {
    const res = await post(visitor(slot()));
    expect(res.status).toBe(200);
    expect((await res.json()).emailed).toEqual({ admin: true, user: true });
    expect(sent.map((m) => m.to).sort()).toEqual(["asha@example.com", "info@kyozon.in"]);
  });

  it("still books the slot when one mail cannot be delivered, and says which", async () => {
    failFor = "asha@example.com";
    const res = await post(visitor(slot()));
    expect(res.status).toBe(200);
    expect((await res.json()).emailed).toEqual({ admin: true, user: false });
  });

  it("books the slot and sends nothing when email is not set up", async () => {
    vi.stubEnv("SMTP_HOST", "");
    const res = await post(visitor(slot()));
    expect(res.status).toBe(200);
    expect(sent).toEqual([]);
    expect(await notifyBooking(BOOKING)).toEqual({ admin: false, user: false });
  });

  it("sends no email for a slot somebody else already holds", async () => {
    const s = slot();
    await post(visitor(s));
    sent.length = 0;
    const second = await post(visitor(s, { email: "other@example.com" }));
    expect(second.status).toBe(409);
    expect(sent).toEqual([]);
  });
});
