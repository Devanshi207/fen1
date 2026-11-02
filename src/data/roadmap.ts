export interface RoadmapStage {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  /** The FEN1 module this stage is worked in (the name as it appears in the module list) */
  module: string;
  /** What the stage leaves in the job record for the next one */
  record: string;
}

/**
 * The enquiry-to-handover workflow as FEN1 runs it: enquiry, then the module chain from CRM to Logistics, then
 * installation and handover. Order matters: the home page renders it as given. `module` names match src/data/modules.ts.
 */
export const ROADMAP_STAGES: RoadmapStage[] = [
  { step: "01", title: "Enquiry", subtitle: "Enquiry captured", desc: "Customer, project and requirement details are logged the moment an enquiry arrives.", module: "CRM", record: "Enquiry record with customer, project and requirement" },
  { step: "02", title: "CRM", subtitle: "Follow-up tracking", desc: "Calls, meetings and reminders are scheduled against the enquiry, so none goes cold.", module: "CRM", record: "Client and follow-up history" },
  { step: "03", title: "Estimation", subtitle: "Takeoff and quotation", desc: "Architect drawings and opening schedules are checked, then profiles, glass, hardware and labour are priced from the actual opening sizes and quoted.", module: "Estimation", record: "Quotation and bill of materials" },
  { step: "04", title: "Survey", subtitle: "Site survey", desc: "Final opening sizes and site conditions are captured on mobile and linked to the job.", module: "Survey", record: "Verified opening sizes" },
  { step: "05", title: "Design", subtitle: "Shop drawings and cutting lists", desc: "Approved drawings produce bills of material and cutting lists.", module: "Design", record: "Shop drawings, bills of material and cutting lists" },
  { step: "06", title: "Project management", subtitle: "Project set-up", desc: "The accepted order becomes a project with milestones and tasks, and one record the whole team works from.", module: "Project management", record: "Project plan with milestones" },
  { step: "07", title: "Purchase", subtitle: "Material purchase", desc: "Profiles, glass and hardware are ordered from approved suppliers against the job.", module: "Purchase management", record: "Purchase orders linked to the job" },
  { step: "08", title: "Store", subtitle: "Store and inward", desc: "Goods are received, checked and barcoded; stock and off-cuts are tracked bar by bar.", module: "Store", record: "Stock and off-cut records" },
  { step: "09", title: "Production", subtitle: "Machine-integrated production", desc: "Work orders go straight to saws and machining centres, with live progress from the shop floor. Outside processing such as toughening and powder coating is tracked until it returns.", module: "Production", record: "Work orders and shop-floor progress" },
  { step: "10", title: "Quality control", subtitle: "Inspection", desc: "Dimension, hardware and sealant checks are recorded against each unit.", module: "Quality control", record: "Inspection record per unit" },
  { step: "11", title: "Logistics", subtitle: "Dispatch", desc: "Loads are planned and dispatched, and each delivery is followed to site.", module: "Logistics & dispatch", record: "Dispatch and delivery record" },
  { step: "12", title: "Installation", subtitle: "Site installation", desc: "Teams fit each unit, log snags and capture photo proof.", module: "Project management", record: "Installation log, snags and photos" },
  { step: "13", title: "Handover", subtitle: "Project handover", desc: "Completion is signed off, final billing is released and documents are archived.", module: "Project management", record: "Completion sign-off and archived documents" },
];
