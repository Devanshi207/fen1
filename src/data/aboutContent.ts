export const PROBLEMS = [
  { n: "01", name: "Excel Spreadsheets", issue: "Enquiries, follow-ups and estimates are scattered across spreadsheets, often understood and managed by just one person." },
  { n: "02", name: "WhatsApp & Paper Slips", issue: "Site measurements and snagging photographs can easily get lost between the site and the design office." },
  { n: "03", name: "Standalone Machine Software", issue: "Operators manually re-enter dimensions into machines, increasing the risk of cutting errors, material waste and production delays." },
  { n: "04", name: "Separate Accounting Tools", issue: "Finance teams have limited visibility of project costs, invoices and payment status until the end of the month." },
  { n: "05", name: "Manual Purchasing", issue: "Purchase orders are raised without clear visibility of existing stock, available materials or reusable off-cuts." },
  { n: "06", name: "Untracked Production", issue: "There is no clear, real-time view of which jobs have been cut, assembled, glazed or packed and are ready for dispatch." },
];

/** The FEN1 answer to each problem above, in the same order: one row of the comparison on the About page. */
export const PRINCIPLES = [
  {
    label: "ENQUIRY TO DRAWINGS",
    title: "One Record from the First Enquiry",
    text: "All enquiries, follow-ups, drawings, estimates and quotations are managed in one centralised record. Survey and design teams can seamlessly take over from there.",
  },
  {
    label: "SITE TO OFFICE",
    title: "Site Information, All in One Place",
    text: "Measurements and photographs are captured directly against the job from the site, giving the design team immediate access to accurate information.",
  },
  {
    label: "DESIGN TO SAWS",
    title: "Machines Connected to Your Workflow",
    text: "Machine integration sends cutting lists directly to the saws, eliminating manual data entry and reducing the risk of errors.",
  },
  {
    label: "JOB TO ACCOUNTS",
    title: "Finance Connected to Every Job",
    text: "Invoices, payments and project costs are linked to individual job records, giving the finance team real-time visibility of costs and billing status.",
  },
  {
    label: "STORE TO PURCHASE",
    title: "Check Stock Before You Buy",
    text: "Purchase requests are raised with visibility of existing inventory, including available profile bars and off-cuts, helping reduce unnecessary purchases and material waste.",
  },
  {
    label: "SHOP FLOOR",
    title: "Complete Visibility Across Production",
    text: "Job cards and production tracking provide a live view of every job's progress on the factory floor, from the first cut to the final pack.",
  },
];

/** After the comparison: the part of the job the table does not cover. */
export const CLOSING = {
  title: "Every job closed properly",
  text: "Quality checks, installation and handover are recorded on the same job, ready for billing and reports.",
};

/** Home, under the hero: what FEN1 is (the About page opens with the same description). */
export const HOME_INTRO = [
  "FEN1 is a fenestration Business Management Platform solution, designed specifically for the window, door and façade industry.",
  "From the first enquiry to final handover, FEN1 connects every stage of a project through one integrated job record, bringing estimation, design, procurement, production, inventory, dispatch and installation together in a seamless workflow.",
  "One Project. One Connected Workflow. Complete Control.",
  "FEN1: Technology Designed Around Your Industry.",
];

/** Home: the three promises under the description. */
export const HOME_PROMISES = [
  { title: "Industry-Specific by Design", text: "Not a generic ERP adapted for fenestration." },
  { title: "Faster Implementation", text: "Get your business running with structured, industry-focused implementation." },
  { title: "End-to-End Project Control", text: "One connected journey from enquiry to final handover." },
];
