import type { Answers, DetailField, WizardConfig } from "@/components/StepWizard";
import { TOPICS, type Topic } from "@/data/enquiryForms";
import {
  BUSINESS_OPTIONS,
  INTEREST_OPTIONS,
  INTEREST_QUESTION,
  MEETING_DAY_OPTIONS,
  MEETING_TIME_OPTIONS,
  NOT_SURE,
  SIZE_OPTIONS,
  TOPIC_OPTIONS,
} from "@/data/enquirySteps";
import { SLOT_ZONE, formatDate, slotId } from "@/lib/slots";
import { topicFromLocation } from "@/lib/topic";

const first = (a: Answers, key: string) => a[key]?.[0] ?? "";
const topicOf = (a: Answers): Topic => TOPIC_OPTIONS.find((o) => o.value === first(a, "topic"))?.topic ?? "demo";

/** The contact enquiry: demo, meeting or question, what the business does, its size, what it wants to see or ask about (a meeting also asks for a day and a time), who to reply to. */
export const CONTACT_WIZARD: WizardConfig = {
  steps: [
    { key: "topic", question: "What would you like to do?", options: TOPIC_OPTIONS },
    { key: "business", question: "What do you make or install?", options: BUSINESS_OPTIONS, other: "What do you make or install?", otherLabel: "Something else" },
    { key: "interest", question: (a) => INTEREST_QUESTION[topicOf(a)], help: "Pick as many as you like.", options: INTEREST_OPTIONS, multi: true, exclusive: NOT_SURE },
    // a meeting also asks when: the team confirms the exact time
    { key: "day", question: "Which day suits you?", options: MEETING_DAY_OPTIONS, show: (a) => topicOf(a) === "meeting" },
    { key: "time", question: "What time of day?", help: "We will confirm the exact time by email or phone.", options: MEETING_TIME_OPTIONS, show: (a) => topicOf(a) === "meeting" },
  ],
  fields: [
    { key: "name", label: "Your name", type: "text", auto: "name", missing: "Please enter your name" },
    { key: "company", label: "Company", type: "text", auto: "organization", missing: "Please enter your company" },
    { key: "email", label: "Work email", type: "email", auto: "email", missing: "Please enter your email" },
    { key: "phone", label: "Phone", type: "tel", auto: "tel", missing: "Please enter your phone number" },
    { key: "message", label: "Anything else you want us to know?", type: "area" },
  ],
  kind: (a) => TOPICS[topicOf(a)].kind,
  submitLabel: (a) => TOPICS[topicOf(a)].submit,
  done: (a) => ({ title: TOPICS[topicOf(a)].doneTitle, text: TOPICS[topicOf(a)].doneText }),
  payload: (a, d) => ({
    name: d.name ?? "",
    company: d.company ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    message: d.message ?? "",
    industry: first(a, "business"),
    companySize: first(a, "size"),
    interestedModules: (a.interest ?? []).join(", "),
    ...(topicOf(a) === "meeting" ? { preferredDay: first(a, "day"), preferredTime: first(a, "time") } : {}),
  }),
  // a link to #demo, #meeting or #question (footer, old addresses) opens the form with that choice made, on the second question
  link: (open, currentStep) => {
    const asked = (next: Topic | null) => {
      if (!next || currentStep() > 1) return;
      open({ topic: [TOPIC_OPTIONS.find((o) => o.topic === next)!.value] }, 1);
    };
    asked(topicFromLocation(window.location.hash, window.location.search));
    const onHash = () => asked(topicFromLocation(window.location.hash, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  },
};

/**
 * What comes after the calendar on the booking page: what they make or install, their team size and who to reply to. The slot
 * they chose is sent with it to /api/booking, which keeps that slot for them (nobody else can take it) and files a demo request.
 */
export function bookWizard(slot: { date: string; time: string }, onConflict: () => void): WizardConfig {
  const when = `${formatDate(slot.date)}, ${slot.time} ${SLOT_ZONE}`;
  return {
    intro: `Your slot: ${when}`,
    steps: [
      { key: "business", question: "What do you make or install?", options: BUSINESS_OPTIONS, other: "What do you make or install?", otherLabel: "Something else" },
      { key: "size", question: "How big is your team?", options: SIZE_OPTIONS },
    ],
    fields: CONTACT_WIZARD.fields,
    endpoint: "/api/booking",
    onConflict,
    kind: () => "demo",
    submitLabel: () => "Book this slot",
    done: () => ({ title: "Your slot is booked", text: `Your demo slot is saved: ${when}. The team has your details and will be in touch to confirm.` }),
    payload: (a, d) => ({
      name: d.name ?? "",
      company: d.company ?? "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      message: d.message ?? "",
      industry: first(a, "business"),
      companySize: first(a, "size"),
      slot: slotId(slot.date, slot.time),
      source: "Calendar booking",
    }),
  };
}

/** The application form: who they are, how to reach them, and what they work with today (software and ERP). */
function careerFields(): DetailField[] {
  return [
    { key: "name", label: "Full name", type: "text", auto: "name", placeholder: "Enter your name", missing: "Please enter your name" },
    { key: "email", label: "Email address", type: "email", auto: "email", placeholder: "Enter your email", missing: "Please enter your email" },
    { key: "phone", label: "Mobile number", type: "tel", auto: "tel", placeholder: "Enter your mobile number", missing: "Please enter your mobile number" },
    { key: "experience", label: "Years of experience", type: "text", placeholder: "e.g. 3 years" },
    { key: "software", label: "Software you use today", type: "text", placeholder: "e.g. Excel, Tally, AutoCAD" },
    { key: "erp", label: "ERP you use or have used", type: "text", placeholder: "ERP name and modules" },
    { key: "operations", label: "Your present operations", type: "area", placeholder: "What your business or role covers today, for example windows, doors, curtain wall, glass railing, dealers" },
    { key: "message", label: "Tell us about yourself", type: "area", placeholder: "A brief introduction..." },
    { key: "resume", label: "Your resume", type: "file", missing: "Please attach your resume" },
  ];
}

/**
 * The application for a listed role (its own page, /careers/apply): the form above, saying which role it is for.
 * No questions to click through. Sent as a "careers" enquiry; no company is asked for.
 */
export function careersWizard(roleTitle: string): WizardConfig {
  return {
    intro: `Applying for: ${roleTitle}`,
    steps: [],
    title: "Your details",
    fields: careerFields(),
    kind: () => "careers",
    submitLabel: () => "Send my application",
    done: () => ({ title: "Application sent", text: "We have your details and your resume. If your profile fits the role, we will get in touch." }),
    payload: (_a, d) => ({
      name: d.name ?? "",
      company: "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      message: d.message ?? "",
      role: roleTitle,
      experience: d.experience ?? "",
      software: d.software ?? "",
      erp: d.erp ?? "",
      operations: d.operations ?? "",
    }),
  };
}
