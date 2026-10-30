import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestDemoPage from "@/app/request-demo/page";
import { resolveTopic, topicHref } from "@/lib/topic";
import nextConfig from "../next.config";

type User = ReturnType<typeof userEvent.setup>;

const demoRadio = () => screen.getByRole("radio", { name: "I'd like a demo" });
const questionRadio = () => screen.getByRole("radio", { name: "I have a question" });

async function fillRequired(user: User) {
  await user.type(screen.getByLabelText(/full name/i), "Asha Rao");
  await user.type(screen.getByLabelText(/^company$/i), "Rao Glazing");
  await user.type(screen.getByLabelText(/work email/i), "asha@raoglazing.com");
  await user.type(screen.getByLabelText(/phone/i), "12345");
}

function sentBody(fetchMock: ReturnType<typeof vi.fn>) {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/enquiry");
  return JSON.parse(init.body);
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, "", "/");
});

describe("The one enquiry page", () => {
  it("opens on a demo request, with the choice at the top of the form", () => {
    render(<RequestDemoPage />);
    expect(screen.getByRole("radiogroup", { name: /what would you like to do/i })).toBeInTheDocument();
    expect(demoRadio()).toBeChecked();
    expect(questionRadio()).not.toBeChecked();
    expect(screen.getByRole("heading", { level: 1, name: "Request a demo" })).toBeInTheDocument();
    expect(screen.getByLabelText(/company size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current software/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/modules you want to see/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/anything specific you want to see/i)).not.toBeRequired();
  });

  it("changes to a shorter question form when the visitor has a question", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await user.click(questionRadio());

    expect(questionRadio()).toBeChecked();
    expect(screen.getByRole("heading", { level: 1, name: "Ask a question" })).toBeInTheDocument();
    expect(screen.getByLabelText(/your question/i)).toBeRequired();
    expect(screen.getByRole("button", { name: /send question/i })).toBeInTheDocument();
    for (const gone of [/company size/i, /current software/i, /modules you want to see/i]) {
      expect(screen.queryByLabelText(gone)).not.toBeInTheDocument();
    }
  });

  it("opens on the question when the link asks for it (this is where the old /contact links go)", () => {
    window.history.replaceState(null, "", "/request-demo?topic=question");
    render(<RequestDemoPage />);
    expect(questionRadio()).toBeChecked();
    expect(screen.getByRole("heading", { level: 1, name: "Ask a question" })).toBeInTheDocument();
  });

  it("keeps the address in step with the choice, so a refresh or a shared link keeps it", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await user.click(questionRadio());
    expect(window.location.search).toBe("?topic=question");
    await user.click(demoRadio());
    expect(window.location.search).toBe("");
  });

  it("keeps what the visitor typed when they change their mind", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await user.type(screen.getByLabelText(/full name/i), "Asha Rao");
    await user.type(screen.getByLabelText(/current software/i), "SAP");

    await user.click(questionRadio());
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Asha Rao");

    await user.click(demoRadio());
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Asha Rao");
    expect(screen.getByLabelText(/current software/i)).toHaveValue("SAP");
  });
});

describe("Sending an enquiry", () => {
  it("sends a demo request tagged as a demo, with the demo questions", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await fillRequired(user);
    await user.type(screen.getByLabelText(/current software/i), "SAP");
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(body.kind).toBe("demo");
    expect(body.name).toBe("Asha Rao");
    expect(body.details).toMatchObject({ currentSoftware: "SAP", companySize: "50-200 Employees" });
    expect(await screen.findByRole("heading", { level: 3, name: "Demo request confirmed" })).toBeInTheDocument();
  });

  it("sends a question tagged as a contact enquiry, and only the fields the visitor was shown", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    // typed on the demo form, then the visitor decides to ask a question instead
    await user.type(screen.getByLabelText(/current software/i), "SAP");
    await user.click(questionRadio());
    await fillRequired(user);
    await user.type(screen.getByLabelText(/your question/i), "Do you integrate with CNC saws?");
    await user.click(screen.getByRole("button", { name: /send question/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(body.kind).toBe("contact");
    expect(body.message).toBe("Do you integrate with CNC saws?");
    // the demo-only answers (and their defaults) are not sent for a question
    expect(Object.keys(body.details)).toEqual(["industry"]);
    expect(await screen.findByRole("heading", { level: 3, name: "Question received" })).toBeInTheDocument();
  });

  it("tells the visitor when the enquiry could not be sent, and keeps what they typed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be sent/i);
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Asha Rao");
  });
});

describe("Contact and demo are one page", () => {
  it("works out the choice from the link: only ?topic=question is a question", () => {
    expect(resolveTopic("question")).toBe("question");
    expect(resolveTopic("demo")).toBe("demo");
    expect(resolveTopic("anything else")).toBe("demo");
    expect(resolveTopic(null)).toBe("demo");
  });

  it("links to each choice of the one page", () => {
    expect(topicHref("demo")).toBe("/request-demo");
    expect(topicHref("question")).toBe("/request-demo?topic=question");
  });

  it("sends the old /contact address to the question form for good", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toContainEqual({ source: "/contact", destination: "/request-demo?topic=question", permanent: true });
  });
});
