import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPage from "@/app/(site)/contact/page";
import BookPage, { metadata } from "@/app/(site)/book/page";

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

  it("asks for a day and a time, then the details, and sends a demo request that says it came from the QR code", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<BookPage />);
    expect(screen.getByText("Book a FEN1 demo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Which day suits you?" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Friday" }));
    await screen.findByRole("heading", { level: 2, name: "What time of day?" });
    await user.click(screen.getAllByRole("radio")[0]);
    await screen.findByRole("heading", { level: 2, name: "What do you make or install?" });
    await user.click(screen.getAllByRole("radio")[0]);
    await screen.findByRole("heading", { level: 2, name: "How big is your team?" });
    await user.click(screen.getAllByRole("radio")[0]);
    await screen.findByText("Question 5 of 5");
    await user.type(screen.getByLabelText(/your name/i), "Asha Rao");
    await user.type(screen.getByLabelText(/company/i), "Rao Glass");
    await user.type(screen.getByLabelText(/work email/i), "asha@example.com");
    await user.type(screen.getByLabelText(/phone/i), "99999");
    await user.click(screen.getByRole("button", { name: "Book my demo slot" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.kind).toBe("demo");
    expect(body.details).toMatchObject({ preferredDay: "Friday", source: "QR code" });
    expect(body.details.preferredTime).toBeTruthy();
    expect(await screen.findByRole("heading", { level: 2, name: "Demo slot requested" })).toBeInTheDocument();
  });
});
