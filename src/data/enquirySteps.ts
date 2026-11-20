import type { Topic } from "@/data/enquiryForms";

/** One answer the visitor can click: the value that is sent, and a short line under it. */
export interface StepOption {
  value: string;
  hint?: string;
}

/** The questions of the enquiry, asked one at a time. The last step is the only one that needs typing. */
export const TOPIC_OPTIONS: (StepOption & { topic: Topic })[] = [
  { topic: "demo", value: "I'd like a demo", hint: "We walk you through FEN1 for your business." },
  { topic: "meeting", value: "I'd like a meeting", hint: "Pick a day and a time, and we confirm it." },
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
  meeting: "What would you like to talk about?",
  question: "What is your question about?",
};

/** A meeting request: a day and a time of day that suit the visitor. The team confirms the exact time; nothing is booked on a calendar. */
export const MEETING_DAY_OPTIONS: StepOption[] = [
  { value: "Monday or Tuesday" },
  { value: "Wednesday or Thursday" },
  { value: "Friday" },
  { value: "Any weekday" },
];
export const MEETING_TIME_OPTIONS: StepOption[] = [{ value: "Morning" }, { value: "Afternoon" }, { value: "Either" }];
