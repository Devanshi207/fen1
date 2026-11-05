import type { Topic } from "@/data/enquiryForms";

/** One answer the visitor can click: the value that is sent, and a short line under it. */
export interface StepOption {
  value: string;
  hint?: string;
}

/** The questions of the enquiry, asked one at a time. The last step is the only one that needs typing. */
export const TOPIC_OPTIONS: (StepOption & { topic: Topic })[] = [
  { topic: "demo", value: "I'd like a demo", hint: "We walk you through FEN1 for your business." },
  { topic: "question", value: "I have a question", hint: "Ask the team anything about FEN1." },
];

export const BUSINESS_OPTIONS: StepOption[] = [
  { value: "Aluminium and uPVC windows and doors" },
  { value: "Glass railing" },
  { value: "Curtain wall", hint: "Unitised, semi-unitised or stick-built" },
  { value: "More than one of these" },
  { value: "Something else" },
];

export const SIZE_OPTIONS: StepOption[] = [
  { value: "Under 20 people" },
  { value: "20 to 50 people" },
  { value: "50 to 200 people" },
  { value: "200 to 500 people" },
  { value: "More than 500 people" },
];

/** What the visitor wants to see (demo) or ask about (question). They can pick several; "Not sure yet" stands alone. */
export const INTEREST_OPTIONS: StepOption[] = [
  { value: "Estimation and quotes" },
  { value: "Site survey and design" },
  { value: "Purchase and store" },
  { value: "Production and quality" },
  { value: "Delivery and installation" },
  { value: "Not sure yet" },
];
export const NOT_SURE = "Not sure yet";

export const INTEREST_QUESTION: Record<Topic, string> = {
  demo: "What would you like to see?",
  question: "What is your question about?",
};

/** The job application: where the person could help (the same areas the admin tags roles with), then a few more clicks. */
export const EXPERIENCE_OPTIONS: StepOption[] = [
  { value: "Just starting out" },
  { value: "1 to 3 years" },
  { value: "3 to 7 years" },
  { value: "7 to 15 years" },
  { value: "More than 15 years" },
];

export const NOW_OPTIONS: StepOption[] = [{ value: "Working in the trade" }, { value: "Working in software" }, { value: "Studying or training" }, { value: "Between jobs" }, { value: "Something else" }];

export const START_OPTIONS: StepOption[] = [{ value: "Right away" }, { value: "Within a month" }, { value: "In one to three months" }, { value: "Just looking for now" }];
