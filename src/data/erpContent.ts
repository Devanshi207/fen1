/**
 * Short notes about the ERP for the pages of the site: a name and two or three plain sentences each. The module and submodule
 * names come from the ERP itself (its sidebar and its "Modules & Sub-Modules" document). Each fact is told once, on the page it
 * belongs to, so no two pages repeat each other:
 *  - Home: the problems and the FEN1 answer to each, as a table (data/aboutContent.ts)
 *  - Solutions: the modules each industry uses, what every solution includes, and the whole job stage by stage (the Workflow,
 *    data/roadmap.ts)
 *  - About: why FEN1 (speed, simplicity, performance and industry expertise), the director's profile and the foundations
 *    underneath the modules
 *  - Training: what each role does day to day (data/trainingContent.ts)
 *  - Careers: the product areas people would build and support
 * Nothing here states a figure, a vendor or a claim the ERP does not back up. The one figure, over 25 years, is the director's
 * experience as given by the company.
 */
export interface Note {
  name: string;
  text: string;
}

/** Why FEN1: the four reasons. */
export const WHY_FEN1: Note[] = [
  { name: "Speed", text: "Quotations, cutting lists and purchase orders are generated using information already available in the system. This eliminates repetitive data entry, reduces manual effort and allows your team to focus on getting the work done efficiently and accurately." },
  { name: "Simplicity", text: "Each team member has access to the modules and information relevant to their role. Workflows follow a logical sequence, making everyday tasks easier to manage and helping new employees learn the system quickly." },
  { name: "Performance", text: "Real-time dashboards, production tracking and comprehensive reports provide clear visibility into the progress of every job. Identify delays, monitor operations and make informed decisions using accurate, up-to-date information." },
  { name: "Industry Expertise", text: "FEN1 is specifically designed for the window, door and façade industry. Its features and workflows reflect the actual requirements of the trade, rather than adapting generic business software to industry-specific processes. Every function is developed with a clear understanding of how the industry operates." },
];

/** About, after the four reasons. */
export const WHY_CLOSING = {
  title: "One Platform. Every Process. Complete Control.",
  text: "FEN1 connects your people, processes and operations through one integrated platform, helping your business improve efficiency, maintain control and achieve better results.",
};

/** About, under the heading: the product in a few lines (the Home page carries the same description, with the three promises). */
export const ABOUT_INTRO = [
  "From the first enquiry to final handover, FEN1 connects every stage of a project through one integrated job record, bringing estimation, design, procurement, production, inventory, dispatch and installation together in a seamless workflow.",
  "One Project. One Connected Workflow. Complete Control.",
  "FEN1 by Kyozon: Technology Designed Around Your Industry.",
];

/** About: the director's profile, from the company's own material. No name or photo is given, so none is shown. */
export const DIRECTOR = {
  eyebrow: "Meet our director",
  title: "Industry experience behind FEN1",
  intro: "With over 25 years in the window and façade industry, our director brings practical knowledge of architectural glazing, aluminium fenestration, project management and large-scale execution.",
  quote: "Technology should be developed around the industry's needs, not the industry around technology.",
  notes: [
    { name: "Industry expertise", text: "A deep understanding of aluminium windows, doors and façade systems, and of how a project is carried out on site. FEN1's workflow follows the route a real job takes." },
    { name: "Landmark project experience", text: "Involved in several prestigious developments, including the Surat Diamond Bourse, recognised as the world's largest office building. Projects of that size show how many teams, orders and deliveries a single job can involve." },
    { name: "From real-world challenges to a digital solution", text: "Seeing the operational complexity of the industry up close led to a platform built for it. FEN1 starts from how the trade really works." },
    { name: "The vision of FEN1", text: "The aim is to simplify business operations and streamline project execution. Window and façade companies should be able to grow with confidence." },
  ] as Note[],
};

/** Solutions: how each industry uses its own modules, by industry id (see data/solutions.ts). */
export const SOLUTION_MODULES: Record<string, Note[]> = {
  "windows-doors": [
    { name: "Profile optimisation and cutting lists", text: "Profile lengths are optimised against the stock bars to keep off-cuts down. The approved cutting list goes to the saws, so operators are not re-typing sizes." },
    { name: "Material calculation", text: "Aluminium, glass, hardware, finish and locks are calculated for every opening from the product masters. The result becomes the material take-off that purchase works from." },
    { name: "Machining, assembly and packaging", text: "Job cards carry each unit through machining, assembly and packing, with its status updated from the floor. Production tracking shows where each job stands." },
    { name: "Dealer logins", text: "Dealers and dealer heads sign in with their own access to CRM, survey, design and planning. Their enquiries and quotations stay on the same job record as the factory's." },
  ],
  "glass-railing": [
    { name: "Site measurement", text: "Each run, level and fixing point is recorded on site, with photos and a survey report. The sizes go to design without being typed again." },
    { name: "Glass calculation", text: "Glass panel sizes are calculated from the measured runs, with the fixings and hardware worked out from the same sizes. The result feeds the material take-off." },
    { name: "Vendor enquiry and quotation comparison", text: "Glass and hardware are enquired with vendors and the quotations compared side by side. The order is placed against the chosen one, and goods are received against it." },
    { name: "Installation and handover", text: "Installation is scheduled run by run, with site progress and issues logged. A snag list and client sign-off close the job." },
  ],
  "curtain-wall": [
    { name: "Material take-off", text: "The take-off is generated for the whole curtain wall, and the material requirement is approved before purchasing starts. It keeps unitised, semi-unitised and stick-built work on the same footing." },
    { name: "Work orders and schedule", text: "Production and installation work orders are scheduled with a priority and a status. The schedule is tracked against the programme on site." },
    { name: "Material request, receipt and issue", text: "Site requests material, receipts are recorded as it arrives, and issues are logged against the job. Every movement is kept against the project." },
    { name: "Packing and delivery", text: "Packing lists and delivery challans go with every dispatch. Each load is followed until it reaches site." },
  ],
};

/** Solutions, above the industry tabs: what comes with every solution, which no industry tab says. */
export const SOLUTIONS_INCLUDED: Note[] = [
  { name: "Estimates you can explain", text: "Costs are built from the profile, glass, hardware and finish masters, with the profit margin set once. Every revision is kept, so a price can always be explained." },
  { name: "Quality at every stage", text: "Material is checked on arrival, in process and at the end. A failed check goes to rework with the action recorded." },
];

/** About: the foundations underneath the modules. */
export const ABOUT_INSIDE: Note[] = [
  { name: "Master data", text: "Products, product groups, aluminium, glass, hardware, locks, finish, units, tax codes and dealers are set up once. Every quotation, calculation and order reads from them." },
  { name: "Users and roles", text: "Each person signs in with a role such as Admin, Manager, Purchase, Site Engineer or Dealer. The role decides which modules they see." },
  { name: "Approvals", text: "Quotations, designs and material requirements are approved before the next team picks them up. The record shows what was approved." },
  { name: "Documents", text: "CRM, survey, design, production, logistics and quality each keep their documents against the job. Drawings, reports and certificates are found where the work was done." },
  { name: "Dashboards and reports", text: "Every area has its own dashboard and its own reports. Management has one view across all of them." },
];

/** Careers: the product areas people would build and support. */
export const CAREERS_WORK: Note[] = [
  { name: "Calculation and cutting logic", text: "Profile optimisation, glass and material calculation, the take-off and the cutting list carry the trade's rules in code. It is where fabrication knowledge changes the product most." },
  { name: "Site and shop-floor screens", text: "Survey, measurement, job cards, dispatch and installation are used by people at a saw or on a site. They have to be quick and plain." },
  { name: "Buying and stock flows", text: "Purchase requests, vendor quotation comparison, goods receipt and the stock ledger have to agree with each other. Small mistakes here show up as shortages on the job." },
  { name: "Accounts and tax rules", text: "Invoices, receivables, payables, project accounting and bank reconciliation follow the jobs. Getting the rules right means finance can trust the numbers." },
];
