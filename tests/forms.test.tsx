import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPage from "@/app/contact/page";
import RequestDemoPage from "@/app/request-demo/page";

async function fillAndSubmit(submitName: RegExp) {
  const user = userEvent.setup();
  const textboxes = screen.getAllByRole("textbox");
  // The first four required fields are name, company, email, phone on both forms (order differs slightly), so fill by type.
  for (const box of textboxes) {
    const el = box as HTMLInputElement;
    if (el.type === "email") await user.type(el, "asha@raoglazing.com");
    else if (el.type === "tel") await user.type(el, "12345");
    else if (el.tagName === "INPUT" && el.required && !el.value) await user.type(el, "Rao");
  }
  const tel = document.querySelector('input[type="tel"]') as HTMLInputElement | null;
  if (tel && !tel.value) await user.type(tel, "12345");
  await user.click(screen.getByRole("button", { name: submitName }));
}

afterEach(() => vi.unstubAllGlobals());

describe.each([
  ["Contact form", ContactPage, /submit/i, "contact"],
  ["Demo request form", RequestDemoPage, /request|submit|schedule/i, "demo"],
] as const)("%s", (_name, Page, submitName, kind) => {
  it("shows a confirmation only after the server accepts the enquiry", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<Page />);

    await fillAndSubmit(submitName);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/enquiry");
    expect(JSON.parse(init.body).kind).toBe(kind);
    expect(await screen.findByRole("heading", { level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("tells the visitor when the enquiry could not be sent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<Page />);

    await fillAndSubmit(submitName);

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be sent/i);
    // The form stays on screen so nothing the visitor typed is lost.
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
  });
});

describe("Business type on the demo form", () => {
  it("lets the visitor type their own when the list has no match", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);

    expect(screen.queryByLabelText("Describe your business")).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Business type"), "Other (type your own)");
    await user.type(screen.getByLabelText("Describe your business"), "Skylight maker");

    await fillAndSubmit(/request demo/i);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).details.businessType).toBe("Skylight maker");
  });
});
