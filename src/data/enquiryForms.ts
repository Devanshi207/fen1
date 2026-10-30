import type { FieldSpec } from "@/components/EnquiryForm";
import type { EnquiryKind } from "@/lib/enquiry";

/** What the visitor wants from the one enquiry page: a demo, or to ask the team a question. */
export type Topic = "demo" | "question";

export const TOPIC_ORDER: Topic[] = ["demo", "question"];

export const INDUSTRIES = [
  "Aluminium Window & Door Manufacturer",
  "Architectural Glass & IGU Processor",
  "Glazing Contractor",
  "Aluminium Fabricator & Job Shop",
  "Fenestration Dealer / Distributor Network",
];
export const SIZES = ["Under 20 Employees", "20-50 Employees", "50-200 Employees", "200-500 Employees", "500+ Enterprise"];

interface TopicCopy {
  /** The tag stored with the enquiry, so the team can tell the two apart */
  kind: EnquiryKind;
  /** The label on the choice at the top of the form */
  label: string;
  heading: string;
  submit: string;
  doneTitle: string;
  doneText: string;
  messageLabel: string;
  /** The pitch beside the form (the photo panel on the page, the opening screen in the sideways layout) */
  pitch: {
    kicker: string;
    heading: string;
    /** the heading as one plain sentence, for the sideways layout */
    line: string;
    body: string;
  };
}

export const TOPICS: Record<Topic, TopicCopy> = {
  demo: {
    kind: "demo",
    label: "I'd like a demo",
    heading: "Request a demo",
    submit: "Request demo",
    doneTitle: "Demo request confirmed",
    doneText: "We have received your request and will be in touch to arrange a demonstration for your technical and management team.",
    messageLabel: "Anything specific you want to see?",
    pitch: {
      kicker: "Live demonstration",
      heading: "SEE YOUR BUSINESS\nTHROUGH FEN1.",
      line: "See your business through FEN1",
      body: "Explore how your sales, estimation, projects, procurement, production, people, and finance can connect within one unified platform.",
    },
  },
  question: {
    kind: "contact",
    label: "I have a question",
    heading: "Ask a question",
    submit: "Send question",
    doneTitle: "Question received",
    doneText: "Our team will review your question and get in touch with you shortly.",
    messageLabel: "Your question",
    pitch: {
      kicker: "Get in touch",
      heading: "A TECHNICAL CONVERSATION,\nNOT A SALES PITCH.",
      line: "A technical conversation, not a sales pitch",
      body: "During our initial consultation, we analyze your current estimation workflows, extrusion billet scrap rates, and machine software links to demonstrate measurable operational improvements.",
    },
  },
};

/**
 * The one form. A question needs only who you are, your business and the question; a demo also asks the few things that
 * help the team prepare (company size, your current software, the modules you want to see). The keys are the same in both,
 * so what a visitor has already typed stays when they change their mind.
 */
export function fieldsFor(topic: Topic): FieldSpec[] {
  const demo = topic === "demo";
  const fields: FieldSpec[] = [
    { key: "name", label: "Full name", required: true, half: true },
    { key: "company", label: "Company", required: true, half: true },
    { key: "email", label: "Work email", type: "email", required: true, half: true },
    { key: "phone", label: "Phone / mobile", type: "tel", required: true, half: true },
    { key: "industry", label: "Industry segment", type: "choice", options: INDUSTRIES, allowOther: true, otherLabel: "Describe your business", half: demo },
  ];
  if (demo) {
    fields.push(
      { key: "companySize", label: "Company size", type: "choice", options: SIZES, half: true },
      { key: "currentSoftware", label: "Current software", half: true },
      { key: "interestedModules", label: "Modules you want to see", half: true }
    );
  }
  // a question without the question would be pointless; for a demo the notes are optional
  fields.push({ key: "message", label: TOPICS[topic].messageLabel, type: "area", required: !demo });
  return fields;
}

export const ENQUIRY_INITIAL = {
  name: "",
  company: "",
  email: "",
  phone: "",
  industry: INDUSTRIES[0],
  companySize: SIZES[2],
  currentSoftware: "",
  interestedModules: "",
  message: "",
};
