export interface IndustrySolution {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  challenge: string;
  solutionSummary: string;
  workflow: string[];
  operationalJourney: {
    step: string;
    action: string;
    module: string;
  }[];
  relevantModules: string[];
  keyBenefits: string[];
}

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    id: "windows-doors",
    slug: "windows-doors",
    number: "01",
    title: "Aluminium Windows & Doors",
    subtitle: "High-volume & bespoke residential and commercial systems",
    challenge:
      "Manual profile takeoff errors, incorrect double-miter saw cutting angles, miscalculated corner crimping tolerances, and disconnected dealer pricing led to high scrap and margin leakage.",
    solutionSummary:
      "FEN1 standardizes your entire window and door operation—from parametric CAD dimensioning and dynamic wind-load validation to automated G-code saw file export and progressive dealer billing.",
    workflow: [
      "CRM",
      "ESTIMATION",
      "SURVEY",
      "DESIGN",
      "PROJECT",
      "PURCHASE",
      "PRODUCTION",
      "QUALITY",
      "LOGISTICS",
      "INSTALLATION",
    ],
    operationalJourney: [
      { step: "01. Enquiry & Takeoff", action: "Estimator imports DWG elevations, selects sliding/casement series, and calculates cost BOM in minutes.", module: "ESTIMATION" },
      { step: "02. Millimetrical Survey", action: "Site surveyor records laser plumb levels and masonry tolerance checks via mobile app.", module: "SURVEY" },
      { step: "03. Direct CNC Saws", action: "Production scheduler pushes 1D linear nested cutting lists directly to double-miter saws.", module: "PRODUCTION" },
      { step: "04. Quality & QR Barcoding", action: "Each assembled sash and outer frame receives a QR tracking tag for dispatch and warranty.", module: "QUALITY CONTROL" },
    ],
    relevantModules: ["ESTIMATION", "DESIGN", "STORE", "PRODUCTION", "QUALITY CONTROL", "LOGISTICS & DISPATCH"],
    keyBenefits: [
      "1D linear billet nesting with < 3.4% extrusion scrap",
      "Direct CNC saw integration (Elumatec, Emmegi, Schüco, FOM)",
      "Instant dealer quotations with live extrusion pricing",
      "Complete assembly bay scheduling & barcode tracking",
    ],
  },
  {
    id: "glass",
    slug: "glass",
    number: "02",
    title: "Glass Processing & IGUs",
    subtitle: "Architectural, toughened, laminated & insulated glass manufacturing",
    challenge:
      "Furnace batching inefficiencies, unaccounted glass breakages during edging/toughening, untracked A-frame stillage returns, and complex DGU argon gas certification.",
    solutionSummary:
      "FEN1 provides complete 2D glass sheet optimization, tempering furnace bed batching, automated Low-E coating sensor logs, and GPS-tagged A-frame stillage circulation.",
    workflow: [
      "ENQUIRY",
      "GLASS ESTIMATION",
      "2D CUTTING OPTIMIZATION",
      "PROCESSING (EDGING / CNC)",
      "TEMPERING FURNACE",
      "DGU / IGU ASSEMBLY",
      "QC / DEW POINT",
      "A-FRAME DISPATCH",
    ],
    operationalJourney: [
      { step: "01. Glass Requisition", action: "Automatic glass cut-list extracted from window BOMs with edge polishing & hole allowances.", module: "ESTIMATION" },
      { step: "02. 2D CNC Nesting", action: "Jumbo sheet nesting optimized to maximize yield and minimize off-cut waste.", module: "PRODUCTION" },
      { step: "03. Furnace Bed Queue", action: "Batching by glass thickness and Low-E orientation for automated furnace cycle tracking.", module: "PRODUCTION" },
      { step: "04. Stillage Logistics", action: "A-frame stillage loading matrix calculated with tare weight and digital customer sign-off.", module: "LOGISTICS & DISPATCH" },
    ],
    relevantModules: ["ESTIMATION", "STORE", "PRODUCTION", "QUALITY CONTROL", "LOGISTICS & DISPATCH"],
    keyBenefits: [
      "Dynamic 2D glass sheet nesting reducing raw float waste",
      "A-frame stillage lifecycle & return deposit tracking",
      "Dew-point and argon gas compliance certificate generation",
      "Real-time furnace bed utilization & OEE metrics",
    ],
  },
  {
    id: "fabrication",
    slug: "fabrication",
    number: "03",
    title: "Aluminium Fabrication & Job Shops",
    subtitle: "Architectural metalwork, louvers, railings, partitions & bespoke frames",
    challenge:
      "Tracking diverse custom job orders, managing mixed raw material remnants across multiple clients, unpredictable labor hours, and inaccurate job costing.",
    solutionSummary:
      "FEN1 equips custom fabrication shops with job-card routing, off-cut barcode tracking, machine hour logging, and automated job profitability analysis.",
    workflow: [
      "JOB ENQUIRY",
      "PARAMETRIC ESTIMATE",
      "MATERIAL INDENT",
      "JOB CARD ISSUE",
      "SAWING & TAPPING",
      "WELDING & COATING",
      "JOB QC",
      "DISPATCH & INVOICE",
    ],
    operationalJourney: [
      { step: "01. Job Card Generation", action: "Estimator converts bespoke client drawing into multi-step fabrication job card.", module: "ESTIMATION" },
      { step: "02. Off-Cut Allocation", action: "Store system matches cut lengths with existing remnant warehouse stock before cutting full 6.5m bars.", module: "STORE" },
      { step: "03. Touchscreen Job Logging", action: "Operators log setup and machining times at assembly tablets.", module: "PRODUCTION" },
      { step: "04. Real-Time Job Margin", action: "Accounts review actual material & labor consumed vs quote before dispatch.", module: "ACCOUNT" },
    ],
    relevantModules: ["ESTIMATION", "STORE", "PRODUCTION", "ACCOUNT", "TASK MANAGEMENT"],
    keyBenefits: [
      "Over 90% reuse of profile off-cuts through automated remnant matching",
      "Accurate actual-vs-estimated job margin analytics",
      "Tablet-based shop-floor job card time tracking",
      "Complete inventory traceability per client work order",
    ],
  },
  {
    id: "contractors",
    slug: "contractors",
    number: "04",
    title: "Glazing & Fenestration Contractors",
    subtitle: "Specialist supply-and-install contractors & site project managers",
    challenge:
      "Coordinating multiple factory suppliers, site survey variations, subcontractor claims, weather delays, on-site snag lists, and retention money recovery.",
    solutionSummary:
      "FEN1 provides an end-to-end contracting cockpit linking architectural drawings, supplier purchase orders, site survey audits, mobile snagging, and client progressive valuations.",
    workflow: [
      "CLIENT TENDER",
      "SUPPLIER RFQS",
      "SURVEY AUDIT",
      "SITE MOBILIZATION",
      "DELIVERY RECEIPT",
      "INSTALLATION QA",
      "CLIENT HANDOVER",
      "RETENTION RELEASE",
    ],
    operationalJourney: [
      { step: "01. Supplier RFQ Matrix", action: "Contractor issues RFQs to glass processors and aluminium fabricators with automated comparison.", module: "PURCHASE MANAGEMENT" },
      { step: "02. Site Dimension Audit", action: "Survey team catches structural masonry deviations before suppliers commence production.", module: "SURVEY" },
      { step: "03. Mobile Snag Tracking", action: "Site team marks snags with photos and auto-assigns corrective tasks to installers.", module: "TASK MANAGEMENT" },
      { step: "04. Valuation & Retention", action: "Tracks submitted claims, certified amounts, retention release dates, and bank guarantees.", module: "ACCOUNT" },
    ],
    relevantModules: ["PROJECT MANAGEMENT", "SURVEY", "PURCHASE MANAGEMENT", "TASK MANAGEMENT", "ACCOUNT"],
    keyBenefits: [
      "Real-time site snagging and subcontractor defect management",
      "Automated retention money tracking and bank guarantee register",
      "Full audit trail from initial tender to final project closure",
      "Mobile site engineer app with offline survey capabilities",
    ],
  },
  {
    id: "dealers",
    slug: "dealers",
    number: "05",
    title: "Dealers & Franchise Networks",
    subtitle: "Authorized retail fabricators, showroom distributors & franchise networks",
    challenge:
      "Outdated price books, delayed quotation turnaround for homeowners and architects, lack of visibility into central factory extrusion inventory, and manual order re-entry.",
    solutionSummary:
      "FEN1 gives dealer networks a branded, self-service estimation and quotation portal with real-time central stock checks and seamless factory order transmission.",
    workflow: [
      "RETAIL ENQUIRY",
      "DEALER ESTIMATOR",
      "QUOTATION TO CLIENT",
      "DEALER ORDER SUBMISSION",
      "CENTRAL FACTORY CONFIRMATION",
      "PRODUCTION QUEUE",
      "DISPATCH TRACKING",
    ],
    operationalJourney: [
      { step: "01. Fast Retail Estimate", action: "Dealer inputs opening dimensions and generates customer quote with approved retail margin in under 3 minutes.", module: "ESTIMATION" },
      { step: "02. Central Stock Check", action: "Portal checks parent manufacturer profile and hardware availability instantly.", module: "STORE" },
      { step: "03. One-Click Order Placement", action: "Dealer converts quote to Sales Order, instantly feeding central factory production.", module: "CRM" },
      { step: "04. Live Order Status", action: "Dealer tracks order from cutting to delivery truck without needing to phone the factory.", module: "LOGISTICS & DISPATCH" },
    ],
    relevantModules: ["CRM", "ESTIMATION", "STORE", "LOGISTICS & DISPATCH", "ADMIN & SETTINGS"],
    keyBenefits: [
      "Dedicated dealer portal with multi-tier pricing rules",
      "Elimination of manual quotation re-keying at central plant",
      "Live order fabrication status visible to dealer network",
      "Automated credit limit and payment gateway controls",
    ],
  },
];
