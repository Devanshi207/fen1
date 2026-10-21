// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateEnquiry } from "@/lib/enquiry";
import { POST } from "@/app/api/enquiry/route";

const valid = {
  kind: "contact",
  name: "Asha Rao",
  company: "Rao Glazing",
  email: "asha@raoglazing.com",
  phone: "+91 98765 43210",
  message: "We want a walkthrough.",
  details: { industry: "Glazing Contractor" },
};

function request(body: unknown, raw = false) {
  return new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("validateEnquiry", () => {
  it("accepts a complete enquiry", () => {
    const r = validateEnquiry(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.details.industry).toBe("Glazing Contractor");
  });

  it("requires name, company and a valid email", () => {
    const r = validateEnquiry({ ...valid, name: " ", company: "", email: "not-an-email" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["company", "email", "name"]);
  });

  it("rejects an unknown form type and non-object input", () => {
    expect(validateEnquiry({ ...valid, kind: "spam" }).ok).toBe(false);
    expect(validateEnquiry(null).ok).toBe(false);
    expect(validateEnquiry("hello").ok).toBe(false);
  });

  it("trims and limits long text", () => {
    const r = validateEnquiry({ ...valid, name: "  A  ", message: "x".repeat(10000) });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.name).toBe("A");
      expect(r.data.message).toHaveLength(4000);
    }
  });
});

describe("POST /api/enquiry", () => {
  const original = process.env.ENQUIRY_WEBHOOK_URL;
  beforeEach(() => {
    delete process.env.ENQUIRY_WEBHOOK_URL;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    if (original === undefined) delete process.env.ENQUIRY_WEBHOOK_URL;
    else process.env.ENQUIRY_WEBHOOK_URL = original;
  });

  it("returns 400 for a body that is not JSON", async () => {
    const res = await POST(request("{oops", true));
    expect(res.status).toBe(400);
  });

  it("returns 422 with field errors for invalid input", async () => {
    const res = await POST(request({ ...valid, email: "" }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.email).toBeTruthy();
  });

  it("returns 503 instead of faking success when no webhook is configured", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
  });

  it("forwards a valid enquiry to the webhook and confirms", async () => {
    process.env.ENQUIRY_WEBHOOK_URL = "https://hooks.example.test/enquiry";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const res = await POST(request(valid));

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://hooks.example.test/enquiry");
    expect(JSON.parse(init.body)).toMatchObject({ name: "Asha Rao", kind: "contact" });
  });

  it("returns 502 when the webhook rejects the enquiry", async () => {
    process.env.ENQUIRY_WEBHOOK_URL = "https://hooks.example.test/enquiry";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect((await POST(request(valid))).status).toBe(502);
  });

  it("returns 502 when the webhook cannot be reached", async () => {
    process.env.ENQUIRY_WEBHOOK_URL = "https://hooks.example.test/enquiry";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect((await POST(request(valid))).status).toBe(502);
  });
});
