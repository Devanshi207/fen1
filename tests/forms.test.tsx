import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestDemoPage from "@/components/sections/ContactSection";
import CareersSection from "@/components/sections/CareersSection";
import { resolveTopic, topicFromLocation, topicHref } from "@/lib/topic";
import nextConfig from "../next.config";

type User = ReturnType<typeof userEvent.setup>;

const radio = (name: string | RegExp) => screen.getByRole("radio", { name });
const question = (name: string | RegExp) => screen.findByRole("heading", { level: 2, name });

/** Clicks an answer and waits for the next question, which appears a moment after the click. */
async function answer(user: User, option: string | RegExp, next: string | RegExp) {
  await user.click(radio(option));
  await question(next);
}

/** Walks the four option questions of a demo request, up to the last one (who to reply to). */
async function reachDetails(user: User, topic: "demo" | "question" = "demo") {
  await answer(user, topic === "demo" ? "I'd like a demo" : "I have a question", "What do you make or install?");
  await answer(user, "Glass railing", "How big is your team?");
  await answer(user, "50 to 200 people", topic === "demo" ? "What would you like to see?" : "What is your question about?");
  await user.click(screen.getByRole("checkbox", { name: "Estimation and quotes" }));
  await user.click(screen.getByRole("checkbox", { name: "Production and quality" }));
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await question("Where can we reach you?");
}

async function fillDetails(user: User) {
  await user.type(screen.getByLabelText(/your name/i), "Asha Rao");
  await user.type(screen.getByLabelText(/^company$/i), "Rao Glazing");
  await user.type(screen.getByLabelText(/work email/i), "asha@raoglazing.com");
  await user.type(screen.getByLabelText(/^phone$/i), "12345");
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

describe("The enquiry, one question at a time", () => {
  it("opens on the first of five questions, answered by clicking, with nothing to type", () => {
    render(<RequestDemoPage />);
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What would you like to do?" })).toBeInTheDocument();
    expect(radio("I'd like a demo")).toBeInTheDocument();
    expect(radio("I have a question")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("moves to the next question by itself when a single answer is clicked, and Back keeps the answer", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I have a question", "What do you make or install?");
    expect(screen.getByText("Question 2 of 5")).toBeInTheDocument();
    for (const o of ["Aluminium and uPVC windows and doors", "Glass railing", "Curtain wall", "More than one of these", "Something else"]) expect(radio(new RegExp(o))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    await question("What would you like to do?");
    expect(radio("I have a question")).toBeChecked();
  });

  it("lets the last option question take several answers, with 'Not sure yet' standing alone, and needs one before Continue", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I'd like a demo", "What do you make or install?");
    await answer(user, "Curtain wall", "How big is your team?");
    await answer(user, "20 to 50 people", "What would you like to see?");
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    await user.click(screen.getByRole("checkbox", { name: "Site survey and design" }));
    await user.click(screen.getByRole("checkbox", { name: "Purchase and store" }));
    expect(screen.getByRole("checkbox", { name: "Site survey and design" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Purchase and store" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Not sure yet" }));
    expect(screen.getByRole("checkbox", { name: "Not sure yet" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Site survey and design" })).not.toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Production and quality" }));
    expect(screen.getByRole("checkbox", { name: "Not sure yet" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  });

  it("asks what the question is about instead of what to see when the visitor has a question", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I have a question", "What do you make or install?");
    await answer(user, "Glass railing", "How big is your team?");
    await answer(user, "Under 20 people", "What is your question about?");
  });

  it("opens on the second question with the choice made when the address asks for it (#question, #demo, or an old ?topic=question link)", async () => {
    window.history.replaceState(null, "", "/#question");
    const { unmount } = render(<RequestDemoPage />);
    await question("What do you make or install?");
    await userEvent.setup().click(screen.getByRole("button", { name: "Back" }));
    await question("What would you like to do?");
    expect(radio("I have a question")).toBeChecked();
    unmount();

    window.history.replaceState(null, "", "/#demo");
    const second = render(<RequestDemoPage />);
    await question("What do you make or install?");
    second.unmount();

    window.history.replaceState(null, "", "/?topic=question");
    render(<RequestDemoPage />);
    await question("What do you make or install?");
  });

  it("follows a Request a demo or Ask a question link clicked while the form is still on its first question", async () => {
    render(<RequestDemoPage />);
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
    window.history.replaceState(null, "", "/#demo");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await question("What do you make or install?");
  });

  it("does not jump the visitor back when they are already further on", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user);
    window.history.replaceState(null, "", "/#question");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    expect(screen.getByRole("heading", { level: 2, name: "Where can we reach you?" })).toBeInTheDocument();
  });
});

describe("Sending an enquiry", () => {
  it("asks name, company, email and phone on the last question, with a note, says nothing is 'optional', and checks them", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user);
    expect(screen.getByText("Question 5 of 5")).toBeInTheDocument();
    expect(screen.queryByText(/optional/i)).toBeNull();
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));
    expect(screen.getByText("Please enter your name")).toBeInTheDocument();
    expect(screen.getByText("Please enter your company")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email")).toBeInTheDocument();
    expect(screen.getByText("Please enter your phone number")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/work email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  it("sends a demo request tagged as a demo, with the clicked answers, and then says it was sent", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user);
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(body.kind).toBe("demo");
    expect(body.name).toBe("Asha Rao");
    expect(body.company).toBe("Rao Glazing");
    expect(body.email).toBe("asha@raoglazing.com");
    expect(body.website).toBe("");
    expect(body.details).toMatchObject({ industry: "Glass railing", companySize: "50 to 200 people", interestedModules: "Estimation and quotes, Production and quality" });
    expect(await screen.findByRole("heading", { level: 2, name: "Demo request sent" })).toBeInTheDocument();
    expect(screen.getByText(/Thank you, Asha/)).toBeInTheDocument();
  });

  it("sends a question tagged as a contact enquiry, with the note as the message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user, "question");
    await fillDetails(user);
    await user.type(screen.getByLabelText(/anything else/i), "Do you integrate with CNC saws?");
    await user.click(screen.getByRole("button", { name: /send question/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(body.kind).toBe("contact");
    expect(body.message).toBe("Do you integrate with CNC saws?");
    expect(await screen.findByRole("heading", { level: 2, name: "Question sent" })).toBeInTheDocument();
  });

  it("tells the visitor when the enquiry could not be sent, and keeps what they typed and chose", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user);
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be sent/i);
    expect(screen.getByLabelText(/your name/i)).toHaveValue("Asha Rao");
    await user.click(screen.getByRole("button", { name: "Back" }));
    await question("What would you like to see?");
    expect(screen.getByRole("checkbox", { name: "Estimation and quotes" })).toBeChecked();
  });

  it("can start again after sending", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user);
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));
    await user.click(await screen.findByRole("button", { name: "Start again" }));
    await question("What would you like to do?");
    expect(radio("I'd like a demo")).not.toBeChecked();
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

/** Walks the job application's option questions (no role chosen): area, experience, what they do now, when they could start. */
async function reachApplicantDetails(user: User) {
  await answer(user, "Training", "How much experience do you have?");
  await answer(user, "3 to 7 years", "What do you do now?");
  await answer(user, "Working in the trade", "When could you start?");
  await answer(user, "Within a month", "Where can we reach you?");
}

describe("Job application", () => {
  it("is five short questions answered by clicking, with no company asked for and nothing called optional", async () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [] }) }));
    const user = userEvent.setup();
    render(<CareersSection />);
    const within1 = (name: RegExp | string) => screen.getByRole("heading", { level: 2, name });
    expect(within1("Where could you help?")).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 5")).toBeInTheDocument();
    await reachApplicantDetails(user);
    expect(screen.getByText("Question 5 of 5")).toBeInTheDocument();
    expect(screen.queryByLabelText(/^company$/i)).toBeNull();
    expect(screen.queryByText(/optional/i)).toBeNull();
    for (const label of [/your name/i, /^email$/i, /^phone$/i, /where are you based/i]) expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it("checks every detail, then sends the application tagged as careers, with the clicked answers", async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => (url === "/api/jobs" ? { ok: true, json: async () => ({ jobs: [] }) } : { ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<CareersSection />);
    await reachApplicantDetails(user);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    for (const m of ["Please enter your name", "Please enter your email", "Please enter your phone number", "Please enter where you are based"]) expect(screen.getByText(m)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/your name/i), "Dev Patel");
    await user.type(screen.getByLabelText(/^email$/i), "dev@example.com");
    await user.type(screen.getByLabelText(/^phone$/i), "12345");
    await user.type(screen.getByLabelText(/where are you based/i), "Pune");
    await user.click(screen.getByRole("button", { name: /send my application/i }));

    await waitFor(() => expect(fetchMock.mock.calls.some((c) => c[0] === "/api/enquiry")).toBe(true));
    const sent = fetchMock.mock.calls.filter((c) => c[0] === "/api/enquiry");
    expect(sent).toHaveLength(1);
    const body = JSON.parse(sent[0][1].body);
    expect(body.website).toBe("");
    expect(body.kind).toBe("careers");
    expect(body.name).toBe("Dev Patel");
    expect(body.company).toBe("");
    expect(body.details).toMatchObject({ area: "Training", experience: "3 to 7 years", currentWork: "Working in the trade", canStart: "Within a month", location: "Pune" });
    expect(await screen.findByRole("heading", { level: 2, name: "Application sent" })).toBeInTheDocument();
  });

  it("does not advertise vacancies it does not have", () => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [] }) }));
    render(<CareersSection />);
    expect(screen.getByText(/No roles are listed here right now/)).toBeInTheDocument();
  });
});

describe("Applying for a listed role", () => {
  it("leaves out the 'where could you help' question, says which role it is for, and sends the role instead of an area", async () => {
    const { careersWizard } = await import("@/lib/wizards");
    const general = careersWizard();
    const forRole = careersWizard("Estimator");
    expect(general.steps.map((s) => s.key)).toEqual(["area", "experience", "now", "start"]);
    expect(forRole.steps.map((s) => s.key)).toEqual(["experience", "now", "start"]);
    expect(forRole.intro).toBe("Applying for: Estimator");
    const details = { name: "A", email: "a@b.co", phone: "1", location: "X" };
    expect(forRole.payload({}, details)).toMatchObject({ role: "Estimator" });
    expect(forRole.payload({}, details)).not.toHaveProperty("area");
    expect(general.payload({ area: ["Training"] }, details)).toMatchObject({ area: "Training" });
    expect(general.payload({}, details)).not.toHaveProperty("role");
  });
});
