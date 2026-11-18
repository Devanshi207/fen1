import type { Answers, DetailField, WizardConfig } from "@/components/StepWizard";
import { CAREER_AREAS, TOPICS, type Topic } from "@/data/enquiryForms";
import {
  BUSINESS_OPTIONS,
  EXPERIENCE_OPTIONS,
  INTEREST_OPTIONS,
  INTEREST_QUESTION,
  MEETING_DAY_OPTIONS,
  MEETING_TIME_OPTIONS,
  NOT_SURE,
  NOW_OPTIONS,
  SIZE_OPTIONS,
  START_OPTIONS,
  TOPIC_OPTIONS,
} from "@/data/enquirySteps";
import { topicFromLocation } from "@/lib/topic";

const first = (a: Answers, key: string) => a[key]?.[0] ?? "";
const topicOf = (a: Answers): Topic => TOPIC_OPTIONS.find((o) => o.value === first(a, "topic"))?.topic ?? "demo";

/** The contact enquiry: demo, meeting or question, what the business does, its size, what it wants to see or ask about (a meeting also asks for a day and a time), who to reply to. */
export const CONTACT_WIZARD: WizardConfig = {
  steps: [
    { key: "topic", question: "What would you like to do?", options: TOPIC_OPTIONS },
    { key: "business", question: "What do you make or install?", options: BUSINESS_OPTIONS },
    { key: "size", question: "How big is your team?", options: SIZE_OPTIONS },
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
 * The demo slot a visitor books after scanning the QR code on the Contact page: a day, a time, what they make or install, their
 * team size and who to reply to. It is sent as a demo request; the team confirms the exact time, so nothing is booked on a calendar.
 */
export const BOOK_WIZARD: WizardConfig = {
  intro: "Book a FEN1 demo",
  steps: [
    { key: "day", question: "Which day suits you?", options: MEETING_DAY_OPTIONS },
    { key: "time", question: "What time of day?", help: "We will confirm the exact time by email or phone.", options: MEETING_TIME_OPTIONS },
    { key: "business", question: "What do you make or install?", options: BUSINESS_OPTIONS },
    { key: "size", question: "How big is your team?", options: SIZE_OPTIONS },
  ],
  fields: CONTACT_WIZARD.fields,
  kind: () => "demo",
  submitLabel: () => "Book my demo slot",
  done: () => ({ title: "Demo slot requested", text: "We have your preferred day and time. The team will confirm the exact slot by email or phone." }),
  payload: (a, d) => ({
    name: d.name ?? "",
    company: d.company ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    message: d.message ?? "",
    industry: first(a, "business"),
    companySize: first(a, "size"),
    preferredDay: first(a, "day"),
    preferredTime: first(a, "time"),
    source: "QR code",
  }),
};

const CAREER_FIELDS: DetailField[] = [
  { key: "name", label: "Your name", type: "text", auto: "name", missing: "Please enter your name" },
  { key: "email", label: "Email", type: "email", auto: "email", missing: "Please enter your email" },
  { key: "phone", label: "Phone", type: "tel", auto: "tel", missing: "Please enter your phone number" },
  { key: "location", label: "Where are you based?", type: "text", auto: "address-level2", missing: "Please enter where you are based" },
];

/**
 * The job application: where the person could help (left out when they are applying for a listed role, which already says),
 * their experience, what they do now, when they could start, and who to reply to. Sent as a "careers" enquiry; no company is asked for.
 */
export function careersWizard(roleTitle?: string): WizardConfig {
  return {
    intro: roleTitle ? `Applying for: ${roleTitle}` : undefined,
    steps: [
      ...(roleTitle ? [] : [{ key: "area", question: "Where could you help?", options: CAREER_AREAS.map((value) => ({ value })), other: "Which area?" }]),
      { key: "experience", question: "How much experience do you have?", options: EXPERIENCE_OPTIONS },
      { key: "now", question: "What do you do now?", options: NOW_OPTIONS, other: "What do you do?" },
      { key: "start", question: "When could you start?", options: START_OPTIONS },
    ],
    fields: CAREER_FIELDS,
    kind: () => "careers",
    submitLabel: () => "Send my application",
    done: () => ({ title: "Application sent", text: "We have your details. If there is a role that fits, we will get in touch." }),
    payload: (a, d) => ({
      name: d.name ?? "",
      company: "",
      email: d.email ?? "",
      phone: d.phone ?? "",
      message: "",
      ...(roleTitle ? { role: roleTitle } : { area: first(a, "area") }),
      experience: first(a, "experience"),
      currentWork: first(a, "now"),
      canStart: first(a, "start"),
      location: d.location ?? "",
    }),
  };
}
