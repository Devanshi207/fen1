export interface FaqItem {
  q: string;
  a: string;
}

/** Answers only restate what the modules, solutions and roadmap on this site already describe. */
export const FAQ: FaqItem[] = [
  {
    q: "Can I price a job from the actual opening sizes?",
    a: "Yes. Estimation prices profiles, glass, hardware and labour from the actual opening sizes, then produces the quotation.",
  },
  {
    q: "Can my dealers quote on their own?",
    a: "Dealer networks get a self-service quotation portal with their own pricing rules, and accepted quotes go straight to the factory as orders.",
  },
  {
    q: "What happens after a quotation is accepted?",
    a: "The same record becomes the sales order and continues through survey, design, purchase, store, production, QC, installation and handover, so nothing is typed in twice.",
  },
  {
    q: "Does it connect to our cutting machines?",
    a: "Production sends work orders and cutting lists to saws and machining centres and shows live progress from the shop floor. Which machines are supported for your setup is confirmed during a demo.",
  },
  {
    q: "How does it deal with leftover profile and glass?",
    a: "The store tracks bars and off-cuts, and nesting reduces waste on both profile and glass sheets.",
  },
  {
    q: "Who is FEN1 built for?",
    a: "Window and door makers, glass processors, aluminium fabricators, glazing contractors and dealer networks.",
  },
];
