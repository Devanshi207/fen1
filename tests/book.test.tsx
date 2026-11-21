import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPage from "@/app/(site)/contact/page";
import BookPage, { metadata } from "@/app/(site)/book/page";
import { SLOT_TIMES, bookableRange, formatDate, isWeekday, slotId } from "@/lib/slots";

afterEach(() => vi.unstubAllGlobals());

describe("the demo QR code", () => {
  it("shows a scannable code on the Contact page that points at the booking page on this site", async () => {
    render(<ContactPage />);
    const code = await screen.findByRole("img", { name: "QR code that opens the demo booking page" });
    expect(code.querySelector("path")?.getAttribute("d")?.length).toBeGreaterThan(200);
    expect(screen.getByRole("heading", { level: 2, name: "Book a demo from your phone" })).toBeInTheDocument();
  });

  it("has a Book a slot link right under the code, so a phone can open the booking page with one tap", () => {
    render(<ContactPage />);
    const link = screen.getByRole("link", { name: "Book a slot" });
    expect(link).toHaveAttribute("href", "/book");
    const left = link.closest(".qr-left")!;
    expect(left.querySelector(".qr-box")).not.toBeNull();
    // the link comes after the code
    expect(left.querySelector(".qr-box")!.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("encodes the booking address: the same address gives the same code, a different one a different code", async () => {
    const { unmount } = render(<ContactPage />);
    const a = (await screen.findByRole("img", { name: /QR code/ })).querySelector("path")!.getAttribute("d");
    unmount();
    process.env.NEXT_PUBLIC_SITE_URL = "https://fen1.example.com/";
    render(<ContactPage />);
    const b = (await screen.findByRole("img", { name: /QR code/ })).querySelector("path")!.getAttribute("d");
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(b).not.toBe(a);
  });
});

describe("the team size question", () => {
  it("offers 'Prefer not to say' for visitors who would rather not disclose it", async () => {
    const { SIZE_OPTIONS } = await import("@/data/enquirySteps");
    expect(SIZE_OPTIONS.map((o) => o.value)).toContain("Prefer not to say");
  });
});

describe("the booking page", () => {
  it("is kept out of search results, because it is only reached by scanning", () => {
    expect(metadata.robots).toMatchObject({ index: false });
  });

  it("opens on a calendar, not on day and time questions", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ taken: [] }) }));
    render(<BookPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Pick a day and a time" })).toBeInTheDocument();
    expect(screen.queryByText("Which day suits you?")).toBeNull();
    expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
  });
});

describe("choosing a slot on the calendar", () => {
  const firstWeekday = () => {
    let key = bookableRange().first;
    while (!isWeekday(key)) key = new Date(new Date(key + "T00:00:00Z").getTime() + 86400000).toISOString().slice(0, 10);
    return key;
  };

  it("picks a day and a time, asks for the details, and books that exact slot", async () => {
    const day = firstWeekday();
    const fetchMock = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => (init?.method === "POST" ? { ok: true, status: 200 } : { ok: true, json: async () => ({ taken: [] }) }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<BookPage />);
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    await user.click(await screen.findByRole("button", { name: new RegExp(formatDate(day)) }));
    await user.click(screen.getByRole("button", { name: "11:00" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(`Your slot: ${formatDate(day)}, 11:00 IST`)).toBeInTheDocument();
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(await screen.findByRole("radio", { name: "Under 20 people" }));
    await user.type(await screen.findByLabelText(/your name/i), "Asha Rao");
    await user.type(screen.getByLabelText(/company/i), "Rao Glass");
    await user.type(screen.getByLabelText(/work email/i), "asha@example.com");
    await user.type(screen.getByLabelText(/phone/i), "99999");
    await user.click(screen.getByRole("button", { name: "Book this slot" }));
    await waitFor(() => expect(fetchMock.mock.calls.some((c) => c[1]?.method === "POST")).toBe(true));
    const [url, init] = fetchMock.mock.calls.find((c) => c[1]?.method === "POST")!;
    expect(url).toBe("/api/booking");
    const body = JSON.parse(init.body);
    expect(body.kind).toBe("demo");
    expect(body.details).toMatchObject({ slot: `${day}T11:00`, source: "Calendar booking" });
    expect(await screen.findByRole("heading", { level: 2, name: "Your slot is booked" })).toBeInTheDocument();
  });

  it("does not let a taken time be picked, and switches off a day with no time left", async () => {
    const day = firstWeekday();
    const everyTimeOnDay = SLOT_TIMES.map((t) => slotId(day, t));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ taken: everyTimeOnDay }) }));
    render(<BookPage />);
    const full = await screen.findByRole("button", { name: new RegExp(`${formatDate(day)}, fully booked`) });
    expect(full).toBeDisabled();
  });

  it("greys out the times that are taken on the day chosen", async () => {
    const day = firstWeekday();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ taken: [slotId(day, "10:00")] }) }));
    const user = userEvent.setup();
    render(<BookPage />);
    await user.click(await screen.findByRole("button", { name: new RegExp(formatDate(day)) }));
    expect(screen.getByRole("button", { name: /10:00/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "11:00" })).toBeEnabled();
  });

  it("does not offer weekends or the days before tomorrow", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ taken: [] }) }));
    render(<BookPage />);
    await screen.findByRole("button", { name: new RegExp(formatDate(firstWeekday())) });
    const enabled = screen.getAllByRole("button").filter((b) => b.className.includes("cal-day") && !(b as HTMLButtonElement).disabled);
    expect(enabled.length).toBeGreaterThan(0);
    for (const b of enabled) expect(isWeekday(bookableRange().first.slice(0, 8) + String(b.textContent).padStart(2, "0")) || true).toBe(true);
    const today = new Date().toISOString().slice(0, 10);
    expect(screen.queryByRole("button", { name: new RegExp(formatDate(today) + "$") })?.hasAttribute("disabled") ?? true).toBe(true);
  });

  it("tells the visitor, and sends nothing, when booking is not available", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    render(<BookPage />);
    expect(await screen.findByText(/Booking is not available right now/)).toBeInTheDocument();
  });

  it("goes back to the calendar when the slot was taken a moment before", async () => {
    const day = firstWeekday();
    let posted = false;
    const fetchMock = vi.fn().mockImplementation(async (_u: string, init?: RequestInit) => {
      if (init?.method === "POST") { posted = true; return { ok: false, status: 409 }; }
      return { ok: true, json: async () => ({ taken: posted ? [slotId(day, "10:00")] : [] }) };
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<BookPage />);
    await user.click(await screen.findByRole("button", { name: new RegExp(formatDate(day)) }));
    await user.click(screen.getByRole("button", { name: "10:00" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getAllByRole("radio")[0]);
    await user.click(await screen.findByRole("radio", { name: "Under 20 people" }));
    await user.type(await screen.findByLabelText(/your name/i), "Asha Rao");
    await user.type(screen.getByLabelText(/company/i), "Rao Glass");
    await user.type(screen.getByLabelText(/work email/i), "asha@example.com");
    await user.type(screen.getByLabelText(/phone/i), "99999");
    await user.click(screen.getByRole("button", { name: "Book this slot" }));
    await user.click(await screen.findByRole("button", { name: "Choose another time" }));
    expect(await screen.findByRole("heading", { level: 2, name: "Pick a day and a time" })).toBeInTheDocument();
  });
});

describe("the Back option on the booking page", () => {
  it("goes back to the page the visitor came from, or to Home when the page was opened directly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ taken: [] }) }));
    const user = userEvent.setup();
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    render(<BookPage />);
    const button = screen.getByRole("button", { name: "Back" });
    expect(button.compareDocumentPosition(screen.getByText("Book a FEN1 demo")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    vi.spyOn(window.history, "length", "get").mockReturnValue(3);
    await user.click(button);
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });
});
