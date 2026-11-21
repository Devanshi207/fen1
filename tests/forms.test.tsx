import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestDemoPage from "@/components/sections/ContactSection";
import ApplySection from "@/components/sections/ApplySection";
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
  await answer(user, "Glass railing", topic === "demo" ? "What would you like to see?" : "What is your question about?");
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
  it("opens on the first of four questions, answered by clicking, with nothing to type", () => {
    render(<RequestDemoPage />);
    expect(screen.getByText("Question 1 of 4")).toBeInTheDocument();
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
    expect(screen.getByText("Question 2 of 4")).toBeInTheDocument();
    for (const o of ["Aluminium and uPVC windows and doors", "Glass railing", "Curtain wall", "More than one of these", "Something else"]) expect(radio(new RegExp(o))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    await question("What would you like to do?");
    expect(radio("I have a question")).toBeChecked();
  });

  it("lets the last option question take several answers, with 'Not sure yet' standing alone, and needs one before Continue", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I'd like a demo", "What do you make or install?");
    await answer(user, "Curtain wall", "What would you like to see?");
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

  it("lets the visitor write what else they make or install, under 'Something else', and sends what they wrote", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I have a question", "What do you make or install?");
    await user.click(radio("Something else"));
    const box = screen.getByLabelText("What do you make or install?", { selector: "input" });
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    await user.type(box, "Shopfronts and glass partitions");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await question("What is your question about?");
    await user.click(screen.getByRole("checkbox", { name: "Estimation and quotes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await question("Where can we reach you?");
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: /send question/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).details).toMatchObject({ industry: "Other: Shopfronts and glass partitions" });
  });

  it("asks what the question is about instead of what to see when the visitor has a question", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I have a question", "What do you make or install?");
    await answer(user, "Glass railing", "What is your question about?");
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
    expect(screen.getByText("Question 1 of 4")).toBeInTheDocument();
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
    expect(screen.getByText("Question 4 of 4")).toBeInTheDocument();
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
    expect(body.details).toMatchObject({ industry: "Glass railing", interestedModules: "Estimation and quotes, Production and quality" });
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

describe("Booking a meeting", () => {
  /** Walks a meeting request up to its last question: the topic, the business, the size, what to talk about, a day and a time. */
  async function reachMeetingDetails(user: User) {
    await answer(user, "I'd like a meeting", "What do you make or install?");
    await answer(user, "Curtain wall", "What would you like to talk about?");
    await user.click(screen.getByRole("checkbox", { name: "Estimation and quotes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await answer(user, "Wednesday or Thursday", "What time of day?");
    await answer(user, "Afternoon", "Where can we reach you?");
  }

  it("is a third choice on the first question", () => {
    render(<RequestDemoPage />);
    expect(radio("I'd like a meeting")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("asks for a day and a time, so it is six questions where a demo is four", async () => {
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await answer(user, "I'd like a meeting", "What do you make or install?");
    expect(screen.getByText("Question 2 of 6")).toBeInTheDocument();
  });

  it("sends the request tagged as a meeting, with the day and time asked for, and says the team will confirm it", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachMeetingDetails(user);
    expect(screen.getByText("Question 6 of 6")).toBeInTheDocument();
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: /^request meeting$/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(body.kind).toBe("meeting");
    expect(body.details).toMatchObject({ industry: "Curtain wall", preferredDay: "Wednesday or Thursday", preferredTime: "Afternoon", interestedModules: "Estimation and quotes" });
    expect(await screen.findByRole("heading", { level: 2, name: "Meeting request sent" })).toBeInTheDocument();
    expect(screen.getByText(/will confirm a time/)).toBeInTheDocument();
  });

  it("does not ask a demo or a question for a day and a time, and sends no meeting details with them", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<RequestDemoPage />);
    await reachDetails(user);
    expect(screen.getByText("Question 4 of 4")).toBeInTheDocument();
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: /^request demo$/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(sentBody(fetchMock).details).not.toHaveProperty("preferredDay");
  });

  it("opens on the second question with the meeting chosen when the address is #meeting", async () => {
    window.history.replaceState(null, "", "/#meeting");
    render(<RequestDemoPage />);
    await question("What do you make or install?");
    expect(screen.getByText("Question 2 of 6")).toBeInTheDocument();
  });

  it("is a kind of enquiry the server accepts and the admin names", async () => {
    const { validateEnquiry } = await import("@/lib/enquiry");
    const { KIND_LABEL } = await import("@/lib/inbox");
    expect(validateEnquiry({ kind: "meeting", name: "A", company: "B", email: "a@b.co", phone: "", message: "", details: { preferredDay: "Friday" } }).ok).toBe(true);
    expect(KIND_LABEL.meeting).toBe("Meeting request");
    expect(topicHref("meeting")).toBe("#meeting");
    expect(topicFromLocation("#meeting", "")).toBe("meeting");
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

  it("sends the old addresses of removed pages to the right page, for good, and leaves the real pages alone", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    for (const [source, destination] of [
      ["/products", "/solutions"],
      ["/products/:slug", "/solutions"],
      ["/request-demo", "/contact#demo"],
    ]) {
      expect(redirects).toContainEqual({ source, destination, permanent: true });
    }
    for (const real of ["/", "/solutions", "/about", "/training", "/careers", "/contact"]) expect(redirects.some((r) => r.source === real)).toBe(false);
  });
});

const ROLE = { id: "r1", title: "Estimator", area: "Estimating, production or site experience", location: "Pune", type: "Full-time", summary: "Price window and door jobs.", details: "" };

/** Opens the apply page for the one published role. */
async function applyForRole(user: User, fetchMock: ReturnType<typeof vi.fn>) {
  window.history.replaceState(null, "", "/careers/apply?role=r1");
  vi.stubGlobal("fetch", fetchMock);
  render(<ApplySection />);
  await screen.findByLabelText(/full name/i);
  void user;
}

describe("Job application", () => {
  it("has no form on the Careers page, only the openings: the form is on each opening's apply page", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [ROLE] }) }));
    render(<CareersSection />);
    expect(await screen.findByRole("heading", { name: "Estimator" })).toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
    expect(screen.queryByText("Submit Your Profile")).toBeNull();
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("the apply page has the form for the role: details and a resume, no company, nothing called optional", async () => {
    const user = userEvent.setup();
    await applyForRole(user, vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [ROLE] }) }));
    expect(screen.getByText("Applying for: Estimator")).toBeInTheDocument();
    expect(screen.queryByLabelText(/^company$/i)).toBeNull();
    expect(screen.queryByText(/optional/i)).toBeNull();
    for (const label of [/full name/i, /email address/i, /mobile number/i, /software you use today/i, /erp you use or have used/i, /your resume/i]) expect(screen.getByLabelText(label)).toBeInTheDocument();
    expect(screen.queryByLabelText(/area of interest/i)).toBeNull();
  });

  it("checks every detail and the resume, then sends the application with the file, tagged as careers", async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => (url === "/api/jobs" ? { ok: true, json: async () => ({ jobs: [ROLE] }) } : { ok: true }));
    const user = userEvent.setup({ applyAccept: false });
    await applyForRole(user, fetchMock);
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    for (const m of ["Please enter your name", "Please enter your email", "Please enter your mobile number", "Please attach your resume"]) expect(screen.getByText(m)).toBeInTheDocument();

    await user.upload(screen.getByLabelText(/your resume/i), new File(["x"], "cv.exe", { type: "application/octet-stream" }));
    await user.click(screen.getByRole("button", { name: /send my application/i }));
    expect(screen.getByText("Please attach a PDF or Word file")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), "Dev Patel");
    await user.type(screen.getByLabelText(/email address/i), "dev@example.com");
    await user.type(screen.getByLabelText(/mobile number/i), "12345");
    await user.type(screen.getByLabelText(/years of experience/i), "8 years");
    await user.type(screen.getByLabelText(/software you use today/i), "Excel and AutoCAD");
    await user.type(screen.getByLabelText(/erp you use or have used/i), "SAP Business One, sales and stock");
    await user.type(screen.getByLabelText(/your present operations/i), "Aluminium windows and doors, 40 staff");
    await user.type(screen.getByLabelText(/tell us about yourself/i), "Production planner");
    await user.upload(screen.getByLabelText(/your resume/i), new File(["hello"], "Dev Patel CV.pdf", { type: "application/pdf" }));
    await user.click(screen.getByRole("button", { name: /send my application/i }));

    await waitFor(() => expect(fetchMock.mock.calls.some((c) => c[0] === "/api/enquiry")).toBe(true));
    const sent = fetchMock.mock.calls.filter((c) => c[0] === "/api/enquiry");
    expect(sent).toHaveLength(1);
    const body = JSON.parse(sent[0][1].body);
    expect(body.kind).toBe("careers");
    expect(body.name).toBe("Dev Patel");
    expect(body.company).toBe("");
    expect(body.message).toBe("Production planner");
    expect(body.details).toMatchObject({ role: "Estimator", experience: "8 years", software: "Excel and AutoCAD", erp: "SAP Business One, sales and stock", operations: "Aluminium windows and doors, 40 staff" });
    expect(body.resume).toEqual({ name: "Dev Patel CV.pdf", data: btoa("hello") });
    expect(await screen.findByRole("heading", { level: 2, name: "Application sent" })).toBeInTheDocument();
  });

  it("lists no openings, and says nothing about vacancies, when the admin has published none", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ jobs: [] }) }));
    render(<CareersSection />);
    expect(screen.queryByText("Open roles")).toBeNull();
    expect(screen.queryByText(/not currently open positions/)).toBeNull();
    expect(document.querySelector("form")).toBeNull();
  });
});

describe("Applying for a listed role", () => {
  it("has no questions: it says which role it is for and sends the role with the details", async () => {
    const { careersWizard } = await import("@/lib/wizards");
    const forRole = careersWizard("Estimator");
    expect(forRole.steps).toEqual([]);
    expect(forRole.intro).toBe("Applying for: Estimator");
    const details = { name: "A", email: "a@b.co", phone: "1" };
    expect(forRole.payload({}, details)).toMatchObject({ role: "Estimator" });
  });
});
