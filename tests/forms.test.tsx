import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestDemoPage from "@/components/sections/ContactSection";
import CareersSection from "@/components/sections/CareersSection";
import { resolveTopic, topicFromLocation, topicHref } from "@/lib/topic";
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

describe("The one enquiry form", () => {
  it("opens on a demo request, with the choice at the top of the form", () => {
    render(<RequestDemoPage />);
    expect(screen.getByRole("radiogroup", { name: /what would you like to do/i })).toBeInTheDocument();
    expect(demoRadio()).toBeChecked();
    expect(questionRadio()).not.toBeChecked();
    expect(screen.getByRole("heading", { level: 2, name: "Request a demo" })).toBeInTheDocument();
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
    expect(screen.getByRole("heading", { level: 2, name: "Ask a question" })).toBeInTheDocument();
    expect(screen.getByLabelText(/your question/i)).toBeRequired();
    expect(screen.getByRole("button", { name: /send question/i })).toBeInTheDocument();
    for (const gone of [/company size/i, /current software/i, /modules you want to see/i]) {
      expect(screen.queryByLabelText(gone)).not.toBeInTheDocument();
    }
  });

  it("opens on the question when the address asks for it (#question, or an old ?topic=question link)", async () => {
    window.history.replaceState(null, "", "/#question");
    const { unmount } = render(<RequestDemoPage />);
    await waitFor(() => expect(questionRadio()).toBeChecked());
    expect(screen.getByRole("heading", { level: 2, name: "Ask a question" })).toBeInTheDocument();
    unmount();
    window.history.replaceState(null, "", "/?topic=question");
    render(<RequestDemoPage />);
    await waitFor(() => expect(questionRadio()).toBeChecked());
  });

  it("follows a Request a demo or Ask a question link clicked while the page is open", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    expect(demoRadio()).toBeChecked();
    window.history.replaceState(null, "", "/#question");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await waitFor(() => expect(questionRadio()).toBeChecked());
    // and the visitor can still change it themselves
    await user.click(demoRadio());
    expect(demoRadio()).toBeChecked();
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

describe("Contact and demo are one form", () => {
  it("works out the choice from an old link: only ?topic=question is a question", () => {
    expect(resolveTopic("question")).toBe("question");
    expect(resolveTopic("demo")).toBe("demo");
    expect(resolveTopic("anything else")).toBe("demo");
    expect(resolveTopic(null)).toBe("demo");
  });

  it("reads the choice from the hash first, then from the old query", () => {
    expect(topicFromLocation("#question", "")).toBe("question");
    expect(topicFromLocation("#demo", "?topic=question")).toBe("demo");
    expect(topicFromLocation("", "?topic=question")).toBe("question");
    expect(topicFromLocation("#contact", "")).toBeNull();
  });

  it("links to each choice within the page", () => {
    expect(topicHref("demo")).toBe("#demo");
    expect(topicHref("question")).toBe("#question");
  });

  it("sends every old page address to its part of the one page, for good", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    for (const [source, destination] of [
      ["/contact", "/#question"],
      ["/request-demo", "/#demo"],
      ["/solutions", "/#solutions"],
      ["/about", "/#about"],
      ["/training", "/#training"],
      ["/careers", "/#careers"],
    ]) {
      expect(redirects).toContainEqual({ source, destination, permanent: true });
    }
  });
});

describe("Careers form", () => {
  it("asks for no company, and sends the details tagged as careers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<CareersSection />);
    expect(screen.queryByLabelText(/^company$/i)).toBeNull();
    await user.type(screen.getByLabelText(/full name/i), "Dev Patel");
    await user.type(screen.getByLabelText(/^email/i), "dev@example.com");
    await user.type(screen.getByLabelText(/phone/i), "12345");
    await user.type(screen.getByLabelText(/a few lines about you/i), "Ten years estimating aluminium windows.");
    await user.click(screen.getByRole("button", { name: /send my details/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.kind).toBe("careers");
    expect(body.name).toBe("Dev Patel");
    expect(body.details.area).toBeTruthy();
    expect(await screen.findByText("Thank you")).toBeInTheDocument();
  });

  it("does not advertise vacancies it does not have", () => {
    render(<CareersSection />);
    expect(screen.getByText(/No roles are listed here right now/)).toBeInTheDocument();
  });
});
