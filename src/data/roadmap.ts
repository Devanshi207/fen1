export interface RoadmapStage {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
}

/** The enquiry-to-handover process as FEN1 runs it. Order matters: the home page renders it top to bottom. */
export const ROADMAP_STAGES: RoadmapStage[] = [
  { step: "01", title: "ENQUIRY", subtitle: "Enquiry Captured", desc: "Customer, project and requirement details are logged in CRM the moment an enquiry arrives." },
  { step: "02", title: "FOLLOW-UPS", subtitle: "Follow-Up Tracking", desc: "Calls, meetings and reminders are scheduled so no enquiry goes cold." },
  { step: "03", title: "DRAWING", subtitle: "Drawings Reviewed", desc: "Architect drawings and opening schedules are attached and checked against the requirement." },
  { step: "04", title: "ESTIMATION", subtitle: "Takeoff & Quotation", desc: "Profiles, glass, hardware and labour are priced from the actual opening sizes, then quoted." },
  { step: "05", title: "SURVEY", subtitle: "Site Survey", desc: "Final opening sizes and site conditions are captured on mobile and linked to the job." },
  { step: "06", title: "DESIGN", subtitle: "Shop Drawings & Cut Lists", desc: "Approved drawings produce bills of material and cutting lists." },
  { step: "07", title: "PURCHASE", subtitle: "Material Purchase", desc: "Profiles, glass and hardware are ordered from approved suppliers against the job." },
  { step: "08", title: "STORE", subtitle: "Store & Inward", desc: "Goods are received, checked and barcoded; stock and off-cuts are tracked bar by bar." },
  { step: "09", title: "JOB WORK", subtitle: "Outside Processing", desc: "Glass toughening, powder coating and other outside work are sent out and tracked until they return." },
  { step: "10", title: "PRODUCTION", subtitle: "Machine-Integrated Production", desc: "Work orders go straight to saws and machining centres, with live progress from the shop floor." },
  { step: "11", title: "QC", subtitle: "Quality Control", desc: "Dimension, hardware and sealant checks are recorded against each unit." },
  { step: "12", title: "INSTALLATION", subtitle: "Site Installation", desc: "Teams fit each unit, log snags and capture photo proof." },
  { step: "13", title: "HANDOVER", subtitle: "Project Handover", desc: "Completion is signed off, final billing is released and documents are archived." },
];
