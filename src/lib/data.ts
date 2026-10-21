export interface ModuleInfo {
  id: string;
  slug: string;
  name: string;
  category: "business" | "people" | "operations" | "supply-chain" | "engineering" | "analytics";
  tagline: string;
  description: string;
  iconName: string;
  accent: string;
  kpis: { label: string; value: string; change: string }[];
  features: string[];
  workflowStages: string[];
  industrialHardware: string[];
}

export interface IndustryInfo {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  challenges: string[];
  fen1Solution: string[];
  metrics: { label: string; value: string }[];
  heroImageDesc: string;
}

export interface RoleInfo {
  id: string;
  role: string;
  persona: string;
  headline: string;
  quote: string;
  kpis: { label: string; value: string; trend: string }[];
  primaryActions: string[];
  dashboardWidgets: { title: string; subtitle: string; status: string; metric: string }[];
}

export const MODULE_CATEGORIES = [
  { id: "business", label: "Business", count: 6, desc: "Architectural CRM, parametric estimation, commercial contracts & progress billing." },
  { id: "operations", label: "Operations", count: 5, desc: "Digital shop floor, CNC saw telemetry, structural silicone glazing & site installation." },
  { id: "supply-chain", label: "Supply Chain", count: 5, desc: "Bar-level extrusion inventory, glass stillages, anodizing batches & mill procurement." },
  { id: "engineering", label: "Engineering", count: 5, desc: "Parametric CAD/BOM, wind-load physics, moment of inertia & CNC G-code generation." },
  { id: "people", label: "People", count: 6, desc: "Factory piece-rate payroll, site installer gang tracking & high-altitude HSE safety." },
  { id: "analytics", label: "Analytics", count: 5, desc: "Cross-enterprise OEE, scrap rate heatmaps, material reconciliation & project EBITDA." },
] as const;

export const MODULES: ModuleInfo[] = [
  {
    id: "estimation",
    slug: "estimation",
    name: "Estimation & Takeoff",
    category: "business",
    tagline: "Parametric window, door & unitized glazing takeoff with dynamic BOM calculation in seconds.",
    description: "Built on specialized fenestration algorithms. Fen1 calculates exact profile linear meters, glass area, gasket perimeters, corner cleats, anchor brackets, structural silicone volume, cutting loss, and fabrication/erection labor in real-time.",
    iconName: "Calculator",
    accent: "#2563EB",
    kpis: [
      { label: "Takeoff Velocity", value: "8.4x faster", change: "+740%" },
      { label: "BOM Margin Accuracy", value: "99.85%", change: "Zero leakage" },
      { label: "Tender Win Rate", value: "41.2%", change: "+14.6%" },
    ],
    features: [
      "Parametric Window, Sliding Door & Unitized Curtain Wall Grid Engine",
      "Dynamic System Die Selection (Mullions, Transoms, Pressure Plates, Sub-frames)",
      "Wind Load (kPa) & Deflection Check per IS 875 / BS 6399 / ASTM E330 (L/200, L/300)",
      "Glass Stress & Thickness Modeling per ASTM E1300 (Monolithic, DGU, Laminated)",
      "Structural Silicone Bite & Contact Width Formula per ASTM C1401",
      "Dynamic Hardware Matrix & EPDM Gasket Perimeter Auto-Costing",
    ],
    workflowStages: [
      "Architectural Elevation Import",
      "System Profile & Die Selection",
      "Glass & Interlayer Specification",
      "Hardware Kit & Gasket Matrix",
      "Fabrication & Installation Rates",
      "Dynamic Margin Tender BOQ",
    ],
    industrialHardware: [
      "Schüco FWS 50 / AWS 75",
      "Reynaers MasterLine 8 / CW 50",
      "Cortizo Cor Vision Plus",
      "Dowsil 983 / Sika SG-500",
    ],
  },
  {
    id: "crm",
    slug: "crm",
    name: "CRM & Tender Pipeline",
    category: "business",
    tagline: "Track architectural enquiries, tender revisions, and consultant submittals from lead to award.",
    description: "Purpose-built for commercial fenestration, glass processors, and glazing contractors. Track main contractors, architects, glazing consultants, sample submittal registers, and tender revision deltas.",
    iconName: "Target",
    accent: "#2563EB",
    kpis: [
      { label: "Pipeline Value", value: "$48.6M", change: "+22% YoY" },
      { label: "Avg Sales Cycle", value: "38 Days", change: "-19 Days" },
      { label: "Lead-to-Order Conversion", value: "28.4%", change: "+6.8%" },
    ],
    features: [
      "Multi-Tier Stakeholder Mapping (Developer, GC, Architect, Glazing Consultant)",
      "Tender Revision Delta Tracker (Rev A vs Rev B elevation & glass area changes)",
      "Architectural Sample Submittal & Mock-Up Test Approval Register",
      "Automated Site Measurement & Laser Survey Scheduler",
      "Competitor Pricing Analysis & Bid Win Probability Matrix",
      "Direct Conversion from Tender BOQ to Engineering Project Work Order",
    ],
    workflowStages: [
      "Architect Inception & Tender RFP",
      "Site Laser Survey & Feasibility",
      "Costing & Multi-Option Bid",
      "Consultant Review & Revision Delta",
      "Commercial Negotiation",
      "Contract Award & Advance Locked",
    ],
    industrialHardware: ["Leica 3D Disto", "Matterport Pro3", "AutoCAD Plugin", "Procore Bridge"],
  },
  {
    id: "engineering",
    slug: "engineering",
    name: "Engineering & CAD/BOM",
    category: "engineering",
    tagline: "Parametric design rules, moment of inertia physics, and automated CNC cut lists.",
    description: "Bridge the gap between design engineering and the factory shop floor. Fen1 transforms architectural drawings into detailed manufacturing BOMs, CNC machine G-codes, and structural glass stress models.",
    iconName: "Ruler",
    accent: "#2563EB",
    kpis: [
      { label: "BOM Generation Speed", value: "< 2.5s", change: "Instantaneous" },
      { label: "Shop Drawing Rework", value: "0.4%", change: "-92%" },
      { label: "Extrusion Scrap Rate", value: "3.4%", change: "Down from 15%" },
    ],
    features: [
      "Automated 2D/3D DXF / DWG System Profile Section Ingestion",
      "Moment of Inertia (Ixx, Iyy in cm⁴) & Section Modulus Structural Verification",
      "Thermal Transmittance (U-Value & SHGC) Calculation per EN ISO 10077-2",
      "CNC Saw Cutting Lists with 45°/90°/Compound Miter Angles",
      "Automatic Routing Coordinates for Water Drainage, Handle Locks & Corner Cleats",
      "Unitized Curtain Wall Bracket & Anchor Load Simulation",
    ],
    workflowStages: [
      "CAD Elevation Import",
      "System Die Assignment",
      "Structural Wind-Load Verification",
      "Cutting List Nesting",
      "CNC G-Code Export",
      "Fabrication Job Card Release",
    ],
    industrialHardware: [
      "Elumatec SBZ 151 / 140",
      "Emmegi Satellite XT",
      "FOM Industrie Blitz 60",
      "Schüco AF 500 CNC",
    ],
  },
  {
    id: "procurement",
    slug: "procurement",
    name: "Procurement & Requisitions",
    category: "supply-chain",
    tagline: "Automated profile mill requisitions, glass purchase orders, and 3-way invoice matching.",
    description: "Prevent project delays caused by long-lead custom anodized aluminium dies or specialized acoustic interlayers. Auto-generate mill requisitions and supplier purchase orders directly from engineering BOMs.",
    iconName: "ShoppingBag",
    accent: "#2563EB",
    kpis: [
      { label: "PO Cycle Time", value: "3.8 hrs", change: "-84%" },
      { label: "Vendor Compliance", value: "98.6%", change: "+14%" },
      { label: "Material Cost Savings", value: "9.2%", change: "Bulk mill optimization" },
    ],
    features: [
      "Automated Extrusion Mill Orders with Die Number & Length (6.0m / 6.5m / Custom)",
      "Anodizing (15-25 micron) & PVDF 3-Coat Powder Coating Subcontract Orders",
      "Jumbo Glass Sheet (6000x3210mm) & Cut-Size IGU Requisitioning",
      "Hardware, Gasket & Silicone Barrel Multi-Vendor RFQ Comparison",
      "3-Way Matching: Purchase Order vs Goods Receipt (GRN) vs Vendor Tax Invoice",
      "Lead-Time Forecasting Linked to Site Erection Milestones",
    ],
    workflowStages: [
      "BOM Explosion to Requisitions",
      "Purchase Requisition Approval",
      "Multi-Vendor RFQ Dispatch",
      "PO Generation & LME Hedging",
      "Goods Receipt Inspection (GRN)",
      "Mill Test Certificate Vault",
    ],
    industrialHardware: [
      "6063-T6 Aluminium Billet",
      "Jumbo Float Glass (6000x3210mm)",
      "Kuraray SentryGlas (SGP)",
      "Qualicoat Class 2 Powder",
    ],
  },
  {
    id: "inventory",
    slug: "inventory",
    name: "Inventory Control & Off-Cuts",
    category: "supply-chain",
    tagline: "Bar-level aluminium tracking, 90%+ off-cut reuse, and A-frame glass stillage tracking.",
    description: "Never lose an aluminium off-cut or damage a Low-E glass pack. Fen1 tags every single profile bar, off-cut, and glass stillage with QR barcodes, tracking exact slot locations in cantilever racks and stillages.",
    iconName: "Boxes",
    accent: "#2563EB",
    kpis: [
      { label: "Off-Cut Recovery Rate", value: "94.2%", change: "+$310k saved/yr" },
      { label: "Stock Accuracy", value: "99.94%", change: "Zero discrepancy" },
      { label: "Material Pick Velocity", value: "3.2 mins", change: "-68%" },
    ],
    features: [
      "Bar-Level Profile Tracking with Heat Number & Mill Test Certificate (MTC)",
      "Automated Off-Cut 1D Linear Nesting & Priority Inventory Re-entry (>800mm)",
      "Anodized & Powder-Coated Bundle Location Matrix in Cantilever Racks",
      "Glass A-Frame Stillage & Crate RFID/QR Location Heatmap",
      "Batch Expiry & Temperature Tracking for Structural Silicones & Polyurethanes",
      "Work Order Stock Allocation vs Free Usable Stock Balance",
    ],
    workflowStages: [
      "Bar Inwarding & QR Tagging",
      "Cantilever / A-Frame Slotting",
      "Kitting for Work Order",
      "Off-Cut Tagging & Return to Stock",
      "Dynamic Cycle Count Audit",
    ],
    industrialHardware: [
      "Cantilever Profile Racks",
      "Motorized Glass A-Frames",
      "Zebra TC57 Rugged Scanners",
      "Dowsil 983 Structural Silicone",
    ],
  },
  {
    id: "production",
    slug: "production",
    name: "Digital Factory & CNC",
    category: "operations",
    tagline: "Real-time CNC saw telemetry, corner crimping QA, and structural silicone glazing bays.",
    description: "Convert engineering BOMs into digital work orders. Stream live cutting lists directly to double-miter saws, CNC machining centers, corner crimpers, and two-part structural silicone glazing stations.",
    iconName: "Factory",
    accent: "#2563EB",
    kpis: [
      { label: "Overall Equipment Efficiency (OEE)", value: "91.4%", change: "+18.2%" },
      { label: "Daily Frame Output", value: "380 Units", change: "+34%" },
      { label: "First-Pass QA Yield", value: "99.2%", change: "+4.8%" },
    ],
    features: [
      "Direct OPC-UA & Industrial IoT Bridge to Double-Miter Saws & CNC Centers",
      "Corner Cleat Jointing & Hydraulic Crimping Pull-Test Verification",
      "Two-Part Structural Silicone Meter-Mix Ratio, Snap Time & Butterfly Testing Log",
      "21-Day Silicone Curing Bay Floor Management with Sensor Tracking",
      "Unitized Curtain Wall Assembly Line Station-by-Station Workflow",
      "Digital Paperless Kiosks with 3D Assembly Step Previews",
    ],
    workflowStages: [
      "Profile Cut & Compound Miter",
      "CNC Machining & Drainage Routing",
      "Frame Assembly & Corner Crimp",
      "Structural Glazing & Silicone QA",
      "21-Day Curing Bay Transit",
      "Final Inspection & Stillage Pack",
    ],
    industrialHardware: [
      "Elumatec DG 244 Double Miter Saw",
      "Emmegi Satellite XT 5-Axis",
      "Glaston FC Series Tempering",
      "Lisec Two-Part Sealing Robot",
    ],
  },
  {
    id: "supply-chain",
    slug: "supply-chain",
    name: "Supply Chain & Material Flow",
    category: "supply-chain",
    tagline: "End-to-end visibility from aluminium smelting billet to project site delivery.",
    description: "Manage complex multi-tier supply chains. Track extrusion dies, powder coating subcontractors, specialized glass processing, and high-security hardware deliveries with predictive ETA algorithms.",
    iconName: "Truck",
    accent: "#2563EB",
    kpis: [
      { label: "On-Time In Full (OTIF)", value: "97.8%", change: "+15.2%" },
      { label: "Supply Chain Risk Score", value: "Low (0.09)", change: "-52%" },
      { label: "Transit Lead-Time", value: "2.8 Days", change: "-2.1 Days" },
    ],
    features: [
      "Subcontractor Coating & Anodizing Batch Tracking",
      "Raw Aluminium LME Price Index Hedging Tracker",
      "International Glass Shipment Container Tracking",
      "Tier-1 & Tier-2 Vendor Bottleneck Forecast",
      "Multi-Plant Material Balancing & Inter-Branch Transfers",
      "Automated Customs & Material Test Certificate (MTC) Vault",
    ],
    workflowStages: [
      "Extruder Ingot",
      "Die Extrusion",
      "Surface Finishing",
      "Glass Float Production",
      "Insulating Line",
      "Factory Delivery",
    ],
    industrialHardware: [
      "Qualicoat Class 2",
      "ASTM B221 Billet",
      "Saint-Gobain Glass",
      "Kuraray SentryGlas",
    ],
  },
  {
    id: "logistics",
    slug: "logistics",
    name: "Logistics & Fleet Dispatch",
    category: "operations",
    tagline: "A-frame glass stillage planning, crane delivery windows, and live GPS tracking.",
    description: "Transporting fragile glass and heavy architectural unitized panels requires specialized logistics. Fen1 optimizes stillage weight distribution, route permits, and on-site crane hoisting schedules.",
    iconName: "Truck",
    accent: "#2563EB",
    kpis: [
      { label: "Damage in Transit", value: "0.01%", change: "Near zero" },
      { label: "Fleet Utilization", value: "95.4%", change: "+23%" },
      { label: "Site Delivery Accuracy", value: "99.6%", change: "±10 min window" },
    ],
    features: [
      "Specialized Glass A-Frame & Stillage 3D Weight Balancing",
      "Floor-by-Floor / Elevation-by-Elevation Panel Crating Sequencing",
      "City Delivery Permit & Tower Crane Hoisting Slot Booking",
      "Live GPS Fleet Telemetry with Shock & Tilt Sensor Alerts",
      "Driver Mobile App for Digital Proof of Delivery (e-POD)",
      "Reverse Logistics for Empty Returnable Steel Stillages",
    ],
    workflowStages: [
      "Stillage Loading Plan",
      "Vehicle Weighbridge & Inspection",
      "Route & Permit Optimization",
      "GPS Transit & Tilt Alerting",
      "Tower Crane Unloading",
      "Digital e-POD Signoff",
    ],
    industrialHardware: [
      "Hydraulic Glass Inloader Trailer",
      "Custom Steel Stillage Racks",
      "ShockWatch & TiltWatch Sensors",
      "Hiab Truck Crane",
    ],
  },
  {
    id: "project-management",
    slug: "project-management",
    name: "Glazing Project Management",
    category: "operations",
    tagline: "Engineered for large glazing projects, commercial skylights, and residential envelopes.",
    description: "Manage high-rise unitized curtain walls, punched windows, and commercial glazing projects. Track submittals, RFI logs, mock-up test chamber certifications, and progressive floor execution.",
    iconName: "Building",
    accent: "#2563EB",
    kpis: [
      { label: "Project Schedule Variance", value: "-1.2 Days", change: "Ahead of schedule" },
      { label: "RFI Turnaround", value: "1.2 Days", change: "-65%" },
      { label: "Erected Panels Tracked", value: "148,000+", change: "Zero loss" },
    ],
    features: [
      "Floor-by-Floor Unitized Panel Installation Matrix (Floor 01 to Floor 100+)",
      "Embedded Bracket Survey & 3D Laser Alignment Coordinate Logs",
      "Glazing Performance Test Chamber Result Archiving (AAMA / CWCT)",
      "Integrated RFI, Submittal & Drawing Revision Vault",
      "BIM 4D/5D Timeline Integration (Revit / Navisworks / IFC)",
      "Main Contractor BOQ Milestone Reconciliation",
    ],
    workflowStages: [
      "Engineering Submittal",
      "Visual Mock-Up (VMU)",
      "Performance Mock-Up (PMU)",
      "Shop Floor Release",
      "Tower Crane Hoisting",
      "Floor Handover",
    ],
    industrialHardware: [
      "CWCT Test Standard",
      "AAMA 501.1 Air/Water Test",
      "BIM 360 / Procore Bridge",
      "Leica Total Station",
    ],
  },
  {
    id: "installation",
    slug: "installation",
    name: "Site Installation & Snagging",
    category: "operations",
    tagline: "Mobile field QA, floor-by-floor panel erection, torque checks, and digital snagging.",
    description: "Equip site engineers and installer gangs with a mobile-first field app. Track bracket anchoring, perimeter firestop inspection, sealant curing, water hose testing, and client snagging.",
    iconName: "Wrench",
    accent: "#2563EB",
    kpis: [
      { label: "Snag Rectification Time", value: "1.4 Days", change: "-78%" },
      { label: "Daily Site Panels Installed", value: "52 Panels/gang", change: "+38%" },
      { label: "Final Client Signoff", value: "100% Digital", change: "Zero paperwork" },
    ],
    features: [
      "Floor Grid & Elevation Mobile Panel QR Check-In",
      "Anchor Bracket Torque Verification & Pull-Out Test Logging",
      "AAMA 501.2 Site Water Hose Testing Checklists with Geotagged Photos",
      "Perimeter Fire-Stop & Smoke Seal Compliance Logging",
      "Visual Snagging Punch-List with Photo Annotation & Subcontractor Tasking",
      "Architect Final Practical Completion (PC) Certificate Signoff",
    ],
    workflowStages: [
      "Bracket Anchoring & Survey",
      "Panel Hoisting & Hook Engagement",
      "Gasket & Pressure Plate Fix",
      "Firestop & Perimeter Sealant",
      "Water Hose Testing",
      "Digital Snag Closure",
    ],
    industrialHardware: [
      "Mini Spider Crane Unic",
      "Glass Vacuum Lifters Wirth",
      "AAMA 501.2 Calibrated Nozzle",
      "Hilti Anchor Laser & Torque Wrench",
    ],
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance, Progress Billing & Costing",
    category: "business",
    tagline: "Progressive milestone billing, retention tracking, material reconciliation, and project EBITDA.",
    description: "Tailored specifically for project-based manufacturing. Track uncertified claims, retention bank guarantees, variation orders, foreign currency extrusion hedging, and real-time project profitability.",
    iconName: "CreditCard",
    accent: "#2563EB",
    kpis: [
      { label: "Cash Flow Visibility", value: "Realtime", change: "100% accurate" },
      { label: "Billing Cycle Speed", value: "1.4 Days", change: "-80%" },
      { label: "Gross Margin Retention", value: "+4.8%", change: "Zero margin leak" },
    ],
    features: [
      "Progress Milestone Billing & Measurement Sheets",
      "Certified vs Claimed Quantities Reconciliation Matrix",
      "Material Reconciliation: Estimated BOM vs Issued vs Installed vs Scrap",
      "Retention Money & Bank Guarantee Expiry Watchlist with Auto-Alerts",
      "Variation Order (VO) Commercial Impact Estimator & Claim Filing",
      "Live Cost-to-Complete (CTC) & Forecast Cost at Completion (EAC)",
    ],
    workflowStages: [
      "Advance Deposit Inwarding",
      "Progress Bill Submission",
      "Consultant Measurement Audit",
      "Payment Certification",
      "Retention Guarantee Release",
      "Final Account Settlement",
    ],
    industrialHardware: [
      "IFRS 15 Compliance",
      "Automated VAT/VAT e-Invoicing",
      "Bank Guarantee Vault",
      "SAP / Tally Prime Connector",
    ],
  },
  {
    id: "hrms",
    slug: "hrms",
    name: "HRMS & Workforce OS",
    category: "people",
    tagline: "Factory piece-rate payroll, site installer gang tracking, and HSE working-at-height safety.",
    description: "The fenestration industry requires diverse talent: glazing engineers, CNC programmers, factory fabricators, and high-altitude site installers. Manage safety passports, piece-rate payroll, and attendance.",
    iconName: "Users",
    accent: "#2563EB",
    kpis: [
      { label: "Payroll Accuracy", value: "100%", change: "Zero manual edits" },
      { label: "Site Safety Compliance", value: "99.9%", change: "Zero violations" },
      { label: "Worker Retention", value: "93.8%", change: "+20%" },
    ],
    features: [
      "Biometric Face & RFID Factory Turnstile Integration",
      "Factory Fabrication Piece-Rate Pay Calculator (per m² / per frame)",
      "High-Altitude Work & Working-at-Heights Safety Passport Vault",
      "Site Installer Gang Daily Productivity & Elevation Output Tracking",
      "Shift Rostering for 24/7 Glass Tempering Furnace Operations",
      "Mobile Employee Portal for Overtime, Leave & Digital Pay Slips",
    ],
    workflowStages: [
      "Recruitment & Skills Testing",
      "EHS Safety Induction",
      "Shift / Gang Rostering",
      "Biometric Daily Punch-In",
      "Piece-Rate Verification",
      "Direct Payroll Disbursement",
    ],
    industrialHardware: [
      "Anviz Face Biometrics",
      "IRATA Rope Access Passports",
      "OSHA 1926 Safety Standard",
      "Factory Turnstile Gates",
    ],
  },
  {
    id: "task-management",
    slug: "task-management",
    name: "Task & Milestone Engine",
    category: "operations",
    tagline: "Gantt dependencies, engineering design reviews, and site punch-lists.",
    description: "Eliminate delays between CAD submittal approvals, raw material inwarding, and factory cutting. Create hard dependencies that alert project heads the moment a drawing revision blocks fabrication.",
    iconName: "CheckSquare",
    accent: "#2563EB",
    kpis: [
      { label: "Task SLA Adherence", value: "97.4%", change: "+26%" },
      { label: "Drawing Approval Cycle", value: "2.8 Days", change: "-6 Days" },
      { label: "Bottleneck Resolution", value: "3.5 hrs", change: "-82%" },
    ],
    features: [
      "Hard Dependency Engine (Design → Inwarding → Cut → Crimp → Glaze → Install)",
      "Automated Milestone Escalations via WhatsApp & Email Webhooks",
      "Interactive Kanban Boards with Department Swimlanes",
      "Architect Review Approval Clock with SLA Countdown",
      "Resource Workload Balancing across Factory & Site Teams",
      "Integrated Drawing & Document Attachment Preview",
    ],
    workflowStages: [
      "Task Inception",
      "Dependency Assignment",
      "Execution Phase",
      "Quality Gate Review",
      "Milestone Signoff",
    ],
    industrialHardware: [
      "Gantt Dependency Matrix",
      "Automated Webhooks",
      "Push Notifications",
      "SLA Timers",
    ],
  },
  {
    id: "analytics",
    slug: "analytics",
    name: "Executive BI & Control Tower",
    category: "analytics",
    tagline: "Cross-enterprise analytics: scrap rates, OEE, project margins, and cash velocity.",
    description: "Empower business owners and executives with actionable data. Uncover which profile systems yield highest margin, machine idle times, contractor payment delays, and annual extrusion consumption.",
    iconName: "BarChart3",
    accent: "#2563EB",
    kpis: [
      { label: "Scrap Reduction", value: "7.2% saved", change: "+$420k/yr" },
      { label: "Factory OEE", value: "92.4%", change: "+15.8%" },
      { label: "Cash Velocity", value: "32 Days", change: "-14 Days" },
    ],
    features: [
      "Live Enterprise Executive Cockpit with Multi-Plant Drilldown",
      "Machine OEE (Availability, Performance, Quality) Live Stream",
      "Aluminium Off-Cut Waste & Glass Scrap Loss Analysis by Die Profile",
      "Project Margin Variance: Quoted Estimate vs Actual Production Cost",
      "Installer Gang Productivity Benchmarking Matrix",
      "Cash Flow Forecasting Model & Retention Ledger",
    ],
    workflowStages: [
      "Data Ingestion",
      "Cross-Module Correlation",
      "Anomaly Detection",
      "Executive Alerting",
      "Quarterly Trend Forecast",
    ],
    industrialHardware: [
      "Apache Kafka Data Bus",
      "Grafana Telemetry Engine",
      "PostgreSQL Timescale",
      "PowerBI / Tableau Export",
    ],
  },
];

export const INDUSTRIAL_STAGES = [
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

export const ROLES_DATA: RoleInfo[] = [
  {
    id: "ceo",
    role: "Managing Director / CEO",
    persona: "Executive Leadership",
    headline: "Total visibility over project profitability, order book, and factory capacity.",
    quote: "With Fen1, I can see my company's real-time gross margin across 40 live tower projects without waiting for end-of-month accounting reconciliations.",
    kpis: [
      { label: "Active Pipeline", value: "$64.2M", trend: "+24% YoY" },
      { label: "Blended Gross Margin", value: "28.4%", trend: "+3.2%" },
      { label: "Factory Utilization", value: "91.8%", trend: "+11.4%" },
    ],
    primaryActions: ["Review Multi-Project Financial Cockpit", "Authorize High-Value Tender Bids", "Monitor Group Cash Velocity"],
    dashboardWidgets: [
      { title: "Group Revenue Run-Rate", subtitle: "Q3 Forecast vs Actuals", status: "On Track", metric: "$18.4M / $17.5M Target" },
      { title: "Capacity Load (Next 90 Days)", subtitle: "Unitized Curtain Wall Lines", status: "Optimal", metric: "92% Booked" },
      { title: "Outstanding Retention Claims", subtitle: "Bank Guarantee Release", status: "Action Req", metric: "$1.42M due in 30d" },
    ],
  },
  {
    id: "estimator",
    role: "Senior Estimation Engineer",
    persona: "Pre-Construction & Costing",
    headline: "Generate complex architectural takeoffs in minutes with zero Excel errors.",
    quote: "Configuring a 45-storey unitized glazing system with custom thermal break dies used to take 3 weeks in Excel. In Fen1, parametric formulas build the cut-list in 4 minutes.",
    kpis: [
      { label: "Bids Completed / Wk", value: "18 Projects", trend: "+300%" },
      { label: "Estimation Accuracy", value: "99.85%", trend: "Zero leakage" },
      { label: "Average Markup Margin", value: "24.6%", trend: "+2.1%" },
    ],
    primaryActions: ["Import Architectural Elevations", "Auto-Nest Extrusions on 6.5m Bars", "Generate Detailed BOQ Client Tender"],
    dashboardWidgets: [
      { title: "Live Takeoff: Sapphire Tower", subtitle: "Schüco FWS 50 + DGU Low-E", status: "Complete", metric: "$4,280,450 BOM" },
      { title: "Raw Material Price Index", subtitle: "LME Aluminium Cash Sync", status: "Updated", metric: "$2,410 / MT" },
      { title: "Tender Bid Submissions", subtitle: "Awaiting Client Review", status: "Active", metric: "7 Bids ($14.8M)" },
    ],
  },
  {
    id: "production-manager",
    role: "Factory Operations Director",
    persona: "Plant & CNC Management",
    headline: "Direct CNC machine feeding, zero paper drawings, and live furnace telemetry.",
    quote: "Our double-miter saws and 4-axis machining centers pull cut lists straight from Fen1. Scrap dropped from 14% to 3.4% in our first quarter.",
    kpis: [
      { label: "Overall Equipment Efficiency (OEE)", value: "89.4%", trend: "+16.2%" },
      { label: "Daily Frame Output", value: "380 Units", trend: "+28%" },
      { label: "Aluminium Scrap Rate", value: "3.4%", trend: "-10.6%" },
    ],
    primaryActions: ["Balance Production Line Queues", "Dispatch G-Code to CNC Saws", "Review Quality Gate Rejection Logs"],
    dashboardWidgets: [
      { title: "Elumatec SBZ 151 Telemetry", subtitle: "Line 2 Machining Center", status: "Running", metric: "94.2% Availability" },
      { title: "Tempering Furnace Bed Load", subtitle: "10mm Toughened Glass Queue", status: "Optimal", metric: "91% Bed Fill" },
      { title: "Stillage Packing Queue", subtitle: "Ready for Dispatch", status: "Ready", metric: "14 Stillages (Floor 18-20)" },
    ],
  },
  {
    id: "site-engineer",
    role: "Site Installation Lead",
    persona: "Field Execution",
    headline: "Mobile panel tracking, crane lift sequencing, and instant digital snagging.",
    quote: "I can scan a unitized panel barcode with my phone, verify its exact torque specs, mark it installed, and log water-hose tests in 30 seconds.",
    kpis: [
      { label: "Panels Erected / Day", value: "48 Units", trend: "+38%" },
      { label: "Snag Closure Speed", value: "1.4 Days", trend: "-68%" },
      { label: "Safety Audit Score", value: "100%", trend: "Zero Incidents" },
    ],
    primaryActions: ["Scan Incoming Stillages", "Log Water Hose Testing", "Submit Floor Completion Certificate"],
    dashboardWidgets: [
      { title: "Tower 2: Level 28 Glazing", subtitle: "Unitized Panel Hang", status: "Active", metric: "38 / 42 Panels Done" },
      { title: "Crane Delivery Window", subtitle: "Slot 14:00 - 16:30", status: "Confirmed", metric: "Stillage #442 On-Site" },
      { title: "Open Punch-List Items", subtitle: "Perimeter Sealant Touchup", status: "In Progress", metric: "3 minor snags" },
    ],
  },
];

export const INDUSTRIES_DATA: IndustryInfo[] = [
  {
    id: "architectural-glass",
    slug: "architectural-glass",
    title: "Architectural Glass Processors",
    subtitle: "Toughening, laminating, double/triple IGU lines, and custom CNC glass processing.",
    description: "Built to handle jumbo float glass optimization, ceramic frit printing, autoclave lamination cycles, and automated spacer bar bending.",
    challenges: [
      "High glass breakage and edge-damage scrap during multi-stage processing",
      "Complex furnace bed scheduling resulting in idle energy waste",
      "Strict acoustic & structural safety compliance traceability (SGP, PVB)",
      "Tracking custom irregular shapes and CNC cut-out coordinates",
    ],
    fen1Solution: [
      "Dynamic 2D Jumbo Float Sheet Cutting Table Nesting (>95% yield)",
      "Automated furnace bed queue packing based on glass thickness and Low-E coating type",
      "Complete batch traceability from float manufacturer to final installed pane",
      "Direct DXF import for waterjet cutouts and countersunk hinge holes",
    ],
    metrics: [
      { label: "Scrap Waste Reduction", value: "7.8%" },
      { label: "Furnace Energy Yield", value: "+24%" },
      { label: "IGU Defect Rate", value: "< 0.06%" },
    ],
    heroImageDesc: "Architectural monolithic Low-E glass wall with structural silicone glazing",
  },
  {
    id: "windows-doors",
    slug: "windows-doors",
    title: "Aluminium Window & Door Manufacturers",
    subtitle: "High-volume residential and commercial sliding, casement, and tilt-and-turn systems.",
    description: "From dealer showroom takeoffs to automated factory saws and delivery fleets. Fen1 accelerates order-to-install cycles for bespoke and standard systems.",
    challenges: [
      "Thousands of profile variants, thermal break strips, and gasket permutations",
      "Manual cut-list drafting causing costly cutting errors at the shop floor",
      "Dealer network price quotation delays causing lost homeowner bids",
      "Managing complex hardware kits (multi-point locks, concealed hinges)",
    ],
    fen1Solution: [
      "Instant parametric window configurator for dealer showrooms & factory estimators",
      "Direct G-code streaming to double-miter saws with automated barcode label printing",
      "Hardware kit explosion with automatic multi-tier pricing",
      "Automated off-cut reuse engine saving over 90% of leftover aluminium profile bars",
    ],
    metrics: [
      { label: "Dealer Takeoff Time", value: "2 mins" },
      { label: "Cutting Error Rate", value: "0.01%" },
      { label: "Order Velocity", value: "4.8x faster" },
    ],
    heroImageDesc: "Sleek minimalist slim-profile aluminium sliding doors opening to architectural patio",
  },
  {
    id: "fabricators",
    slug: "fabricators",
    title: "Aluminium Fabricators & Job Shops",
    subtitle: "Custom architectural metalwork, louvers, ACP cladding, and bespoke fenestration.",
    description: "For specialized fabrication shops handling custom profiles, sheet metal bending, powder coating, and rapid batch manufacturing.",
    challenges: [
      "High variation in project specifications preventing standardized production",
      "Bottlenecks in subcontracted powder coating, anodizing, and PVDF finishes",
      "Untracked off-cuts cluttering factory floor and driving up raw material expense",
      "Inaccurate labor hour estimation leading to margin erosion on custom jobs",
    ],
    fen1Solution: [
      "Flexible job-order routing across cutting, punching, welding, and assembly stations",
      "Subcontractor batch tracking with automatic certificate of conformance (CoC) vault",
      "Automated off-cut tagging and priority reuse during nesting algorithms",
      "Digital shop floor time-tracking measuring actual labor versus quoted estimate",
    ],
    metrics: [
      { label: "Job Margin Leakage", value: "0%" },
      { label: "Coating Batch Sync", value: "100%" },
      { label: "Off-Cut Recovery", value: "94%" },
    ],
    heroImageDesc: "Precision CNC aluminium milling and corner crimping in industrial digital workshop",
  },
];

export const COMPARISON_DATA = [
  {
    capability: "Estimation & Takeoff Speed",
    excel: "3-5 days per high-rise tender. Fragile spreadsheet formulas prone to broken VLOOKUPs and manual area errors.",
    fen1: "Under 4 minutes with parametric CAD rules, automated glass area, moment of inertia, and live hardware matrix explosion.",
  },
  {
    capability: "Aluminium Cut-List & Scrap",
    excel: "Manual calculation causing 12% - 18% scrap waste and unusable warehouse scrap piles.",
    fen1: "Linear nesting algorithm achieves < 3.4% scrap and automatically registers off-cuts > 800mm for priority reuse.",
  },
  {
    capability: "CNC Machine Integration",
    excel: "Zero connection. Operators manually key dimensions into saw controllers, causing frequent operator cut errors.",
    fen1: "Direct IoT/OPC-UA connection sends G-code files directly to Elumatec, Emmegi, FOM Industrie, and Schüco CNCs.",
  },
  {
    capability: "Project Profitability & Costing",
    excel: "Post-project retrospective accounting reconciliations 60 days after project handover.",
    fen1: "Real-time live project EBITDA showing exact material consumed, labor hours, and milestone cashflow.",
  },
  {
    capability: "Site Installation & Snagging",
    excel: "Paper forms, WhatsApp chat groups, lost photo attachments, and delayed client signoffs.",
    fen1: "Mobile app with floor panel QR scans, AAMA water test logging, and instant digital completion certs.",
  },
  {
    capability: "Data Fragmentation",
    excel: "8+ disconnected systems: Excel, WhatsApp, AutoCAD, Tally/SAP, Paper, Email, Folders.",
    fen1: "Single unified operating system: One data flow from architectural lead to final building handover.",
  },
];

export const INTEGRATIONS_LIST = [
  { name: "Elumatec CNC Saws", category: "Machining", logo: "Saw", desc: "Direct G-code streaming to SBZ 151, 140, and DG 244 saws." },
  { name: "Emmegi Machines", category: "Machining", logo: "Ruler", desc: "Seamless CAMplus code sync for Satellite XT and Phantomatic." },
  { name: "FOM Industrie", category: "Machining", logo: "Ruler", desc: "Direct cutting list sync for Blitz 60 and Mirage machining lines." },
  { name: "Orgadata LogiKal", category: "Engineering", logo: "Layers", desc: "Bi-directional system catalog and fabrication cut-list sync." },
  { name: "AutoCAD & Revit BIM", category: "CAD / BIM", logo: "Box", desc: "Direct elevation DXF takeoff and IFC 4.0 model data exchange." },
  { name: "SAP S/4HANA", category: "Enterprise ERP", logo: "Database", desc: "Enterprise ledger synchronization and consolidated balance sheets." },
  { name: "Tally Prime", category: "Accounting", logo: "FileText", desc: "Automated VAT/VAT e-invoice and vendor ledger synchronization." },
  { name: "Procore", category: "Construction", logo: "Briefcase", desc: "Site RFI, submittal, and drawing revision synchronization." },
];

export const FAQS_DATA = [
  {
    q: "How does Fen1 differ from generic ERP systems like SAP, Oracle, or NetSuite?",
    a: "Generic ERPs are built for standard discrete manufacturing (like electronics or FMCG) and lack understanding of dimensional fenestration logic. They cannot calculate profile linear nesting, glass U-values, wind-load deflection physics, or unitized panel crane hoisting. Fen1 is built ground-up for glass, windows, and glazing.",
  },
  {
    q: "Can Fen1 connect directly to our existing CNC saws and double-miter cutting machines?",
    a: "Yes. Fen1 natively exports standard machine protocols (NC, CSV, DXF, G-code) compatible with Elumatec, Emmegi, Schüco, Biesse, Lisec, and Hegla equipment, completely eliminating manual operator entry at the saw console.",
  },
  {
    q: "How long does a typical Fen1 enterprise deployment take?",
    a: "Because Fen1 comes pre-loaded with comprehensive aluminium profile system catalogs (Schüco, Reynaers, Alupure, Cortizo, etc.) and standard glass databases, deployment takes 4 to 8 weeks—compared to 12-18 months for heavily customized generic ERPs.",
  },
  {
    q: "Does Fen1 support multi-currency, multi-branch, and multi-plant operations?",
    a: "Yes. Fen1 is built for global enterprises. You can manage multiple extrusion fabrication plants, decentralized glass processing hubs, and international commercial glazing contracts with automated inter-company transfers and real-time forex hedging.",
  },
  {
    q: "Can site engineers and installers use Fen1 on mobile devices without internet connection?",
    a: "Yes. The Fen1 Field Mobile App supports offline mode for remote high-rise construction sites. Site engineers can scan panel QR codes, take snag photos, and record torque tests; data automatically syncs once internet connectivity is restored.",
  },
];
