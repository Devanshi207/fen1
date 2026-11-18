export const PROBLEMS = [
  { n: "01", name: "Excel Spreadsheets", issue: "Enquiries, follow-ups and estimates live in files that only one person understands." },
  { n: "02", name: "WhatsApp & Paper Slips", issue: "Site measurements and snag photos get lost between the site and the design office." },
  { n: "03", name: "Standalone Machine Software", issue: "Operators re-type dimensions into saws, risking miscuts and wasted profile." },
  { n: "04", name: "Separate Accounting Tools", issue: "Finance cannot see job costs or billing status until the month ends." },
  { n: "05", name: "Manual Purchasing", issue: "Orders are placed without knowing which stock and off-cuts are already in the store." },
  { n: "06", name: "Untracked Production", issue: "There is no live view of which jobs are cut, assembled, glazed or ready to ship." },
];

/** The FEN1 answer to each problem above, in the same order: one row of the comparison on the About page. */
export const PRINCIPLES = [
  {
    label: "ENQUIRY TO DRAWINGS",
    title: "One record from the first call",
    text: "Enquiry, follow-ups, drawings, estimation and quotation stay in one record, and the survey and design teams pick up from it.",
  },
  {
    label: "SITE TO OFFICE",
    title: "Measurements stay with the job",
    text: "Site measurements and photos are saved against the job from the site itself, so the design office works from them directly.",
  },
  {
    label: "DESIGN TO SAWS",
    title: "Machines connected",
    text: "Machine integration sends the cutting lists straight to the saws, so operators do not type dimensions in again.",
  },
  {
    label: "JOB TO ACCOUNTS",
    title: "Finance on the same job",
    text: "Invoices, payments and project costs sit on the job record, so finance sees cost and billing status as the work goes on.",
  },
  {
    label: "STORE TO PURCHASE",
    title: "Stock checked before buying",
    text: "Purchase requests are raised against what the store already holds, including bars and off-cuts.",
  },
  {
    label: "SHOP FLOOR",
    title: "A live view of production",
    text: "Job cards and production tracking show where every job stands on the floor, from the first cut to the last pack.",
  },
];

/** After the comparison: the part of the job the table does not cover. */
export const CLOSING = {
  title: "Every job closed properly",
  text: "Quality checks, installation and handover are recorded on the same job, ready for billing and reports.",
};
