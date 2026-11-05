import type { EnquiryKind } from "@/lib/enquiry";

/** What the visitor wants from the one enquiry page: a demo, or to ask the team a question. */
export type Topic = "demo" | "question";

interface TopicCopy {
  /** The tag stored with the enquiry, so the team can tell the two apart */
  kind: EnquiryKind;
  /** The label on the send button of the last question */
  submit: string;
  doneTitle: string;
  doneText: string;
}

export const TOPICS: Record<Topic, TopicCopy> = {
  demo: {
    kind: "demo",
    submit: "Request demo",
    doneTitle: "Demo request sent",
    doneText: "We have received your request and will be in touch to arrange a demonstration for your team.",
  },
  question: {
    kind: "contact",
    submit: "Send question",
    doneTitle: "Question sent",
    doneText: "Our team will review your question and get in touch with you shortly.",
  },
};

/** The kinds of work people can say they could help with on the job application (and the areas the admin tags roles with). Areas, not advertised vacancies. */
export const CAREER_AREAS = [
  "Product & engineering",
  "Implementation & rollout",
  "Customer support",
  "Training",
  "Estimating, production or site experience",
  "Sales & partnerships",
  "Starting out (apprenticeship or first role)",
];
