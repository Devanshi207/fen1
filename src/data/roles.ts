export interface FEN1Role {
  id: string;
  roleTitle: string;
  department: string;
  tagline: string;
  responsibilities: string[];
  primaryModules: string[];
  keyActions: string[];
  sampleKpis: { label: string; value: string; badge: string }[];
  dashboardFocus: string;
}

export const FEN1_ROLES: FEN1Role[] = [
  {
    id: "ceo",
    roleTitle: "CEO & Managing Director",
    department: "Executive Leadership",
    tagline: "Total operational clarity, cash flow oversight & enterprise EBITDA across all business units.",
    responsibilities: [
      "Real-time visibility into overall pipeline, factory utilization, and EBITDA margin.",
      "Executive approval on high-value tenders, major capital purchases, and credit limits.",
      "Strategic benchmarking of raw material scrap rates and plant OEE.",
    ],
    primaryModules: ["REPORTS & ANALYTICS", "ACCOUNT", "PROJECT MANAGEMENT", "CRM"],
    keyActions: [
      "Review Enterprise P&L & Cash Flow Cockpit",
      "Approve Tender Submissions > $500K",
      "Monitor Plant Scrap & OEE Benchmarks",
    ],
    sampleKpis: [
      { label: "Active Project Pipeline", value: "$18.4M", badge: "SAMPLE DATA" },
      { label: "Overall Plant OEE", value: "92.4%", badge: "SAMPLE DATA" },
      { label: "Linear Extrusion Scrap", value: "3.1%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Executive Command Center with consolidated revenue, project burn rates, and financial health.",
  },
  {
    id: "sales-manager",
    roleTitle: "Sales & Commercial Manager",
    department: "Commercial & Business Development",
    tagline: "Drive enquiry conversion, manage dealer price books, and close profitable architectural orders.",
    responsibilities: [
      "Track incoming architectural enquiries, site tenders, and builder RFQs.",
      "Manage client negotiation stages, revisions, and official quotation releases.",
      "Coordinate handovers between sales teams, estimators, and project directors.",
    ],
    primaryModules: ["CRM", "ESTIMATION", "TASK MANAGEMENT", "REPORTS & ANALYTICS"],
    keyActions: [
      "Track Pipeline by Project Stage",
      "Authorize Commercial Discounts",
      "Convert Won Quotations to Sales Orders",
    ],
    sampleKpis: [
      { label: "Enquiries in Pipeline", value: "48 Open", badge: "SAMPLE DATA" },
      { label: "Quote Conversion Rate", value: "38.2%", badge: "SAMPLE DATA" },
      { label: "Avg Quote Turnaround", value: "4.2 Hours", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Commercial funnel with stage-wise probability, client accounts, and target achievements.",
  },
  {
    id: "estimator",
    roleTitle: "Senior Fenestration Estimator",
    department: "Technical Estimation",
    tagline: "Turn complex architectural elevations into millimetric BOMs and accurate costings in minutes.",
    responsibilities: [
      "Import DXF/PDF elevations and configure parametric sliding, casement, and curtain wall typologies.",
      "Calculate wind deflection, moments of inertia, and glass U-values.",
      "Generate dynamic Bill of Materials factoring profiles, glass, gaskets, hardware, labor, and margins.",
    ],
    primaryModules: ["ESTIMATION", "DESIGN", "STORE", "CRM"],
    keyActions: [
      "Execute Parametric Elevation Takeoff",
      "Run Glass Thermal & Stress Calculations",
      "Generate Multi-Tier Tender Proposals",
    ],
    sampleKpis: [
      { label: "Takeoff Processing Time", value: "< 3 Mins", badge: "SAMPLE DATA" },
      { label: "Estimates Generated (Mo)", value: "142 Tenders", badge: "SAMPLE DATA" },
      { label: "BOM Profile Accuracy", value: "99.8%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Parametric takeoff workspace with live die cross-sections, hardware calculations, and margin toggles.",
  },
  {
    id: "surveyor",
    roleTitle: "Site Survey Engineer",
    department: "Site Operations",
    tagline: "Capture millimetric site reality and structural conditions before cutting a single bar.",
    responsibilities: [
      "Conduct laser measurement of structural openings, floor levels, and masonry plumbness.",
      "Photograph substrate conditions, anchor bracket locations, and access restrictions.",
      "Secure digital sign-off from site architects before releasing drawings to production.",
    ],
    primaryModules: ["SURVEY", "DESIGN", "TASK MANAGEMENT", "MY PORTAL (ESS)"],
    keyActions: [
      "Log Laser Dimensions via Mobile App",
      "Upload Site Condition Photos",
      "Generate Client Survey Sign-Off",
    ],
    sampleKpis: [
      { label: "Openings Verified", value: "420 Openings", badge: "SAMPLE DATA" },
      { label: "Site Tolerance Variance", value: "< 1.2 mm", badge: "SAMPLE DATA" },
      { label: "Digital Sign-Off Rate", value: "100%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Mobile-first site survey matrix with opening schedules, laser tolerances, and photo annotations.",
  },
  {
    id: "designer",
    roleTitle: "Glazing CAD & Design Engineer",
    department: "Engineering & Design",
    tagline: "Transform site dimensions into certified shop drawings, fabrication packs, and CNC saw files.",
    responsibilities: [
      "Translate surveyed dimensions into detailed 2D/3D fabrication drawing packages.",
      "Validate extrusion die structural moment of inertia against regional building codes.",
      "Export direct G-code files to double-miter saws and 4-axis machining centers.",
    ],
    primaryModules: ["DESIGN", "SURVEY", "PRODUCTION", "ADMIN & SETTINGS"],
    keyActions: [
      "Import DXF Opening Geometries",
      "Generate CNC G-Code Saw Files",
      "Issue Certified Fabrication Drawing Packs",
    ],
    sampleKpis: [
      { label: "Profile Dies Mapped", value: "1,420 Dies", badge: "SAMPLE DATA" },
      { label: "Drawing Approval Cycle", value: "1.8 Days", badge: "SAMPLE DATA" },
      { label: "Automated G-Code Export", value: "100% Direct", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Engineering CAD workspace with structural wind-load charts, die catalogs, and saw file generators.",
  },
  {
    id: "project-manager",
    roleTitle: "Senior Project Manager",
    department: "Project Management",
    tagline: "Deliver multi-million dollar high-rises on time, with synchronized factory and site milestones.",
    responsibilities: [
      "Manage master project schedules, floor-by-floor panel matrices, and crane hoisting windows.",
      "Coordinate material deliveries between factory dispatch and site erection teams.",
      "Track progressive milestone valuations, certified claims, and snagging registers.",
    ],
    primaryModules: ["PROJECT MANAGEMENT", "PRODUCTION", "LOGISTICS & DISPATCH", "ACCOUNT"],
    keyActions: [
      "Monitor Floor-by-Floor Panel Matrix",
      "Approve Site Snag Sign-Offs",
      "Generate Progressive Monthly Billing Claim",
    ],
    sampleKpis: [
      { label: "Active Project Phases", value: "12 Towers", badge: "SAMPLE DATA" },
      { label: "Milestone Adherence", value: "98.4%", badge: "SAMPLE DATA" },
      { label: "Uncertified WIP Value", value: "$840K", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "High-rise elevation matrix with panel status (Fabricated, In Transit, Hoisted, Snagged, Handed Over).",
  },
  {
    id: "purchase-manager",
    roleTitle: "Procurement & Purchase Manager",
    department: "Supply Chain",
    tagline: "Procure raw aluminium billets, glass, and hardware at optimal lead times and rates.",
    responsibilities: [
      "Consolidate project material requisitions into mill-level purchase orders.",
      "Negotiate extrusion die rates, glass coatings, and bulk hardware contracts.",
      "Track vendor delivery schedules, weight discrepancies, and 3-way invoice matching.",
    ],
    primaryModules: ["PURCHASE MANAGEMENT", "STORE", "ACCOUNT", "PROJECT MANAGEMENT"],
    keyActions: [
      "Issue Automated RFQ to Approved Mills",
      "Compare Multi-Vendor Bids",
      "Authorize Extrusion Requisitions",
    ],
    sampleKpis: [
      { label: "Open Material POs", value: "34 Orders", badge: "SAMPLE DATA" },
      { label: "Vendor On-Time Rate", value: "95.2%", badge: "SAMPLE DATA" },
      { label: "Purchase Price Variance", value: "< 0.6%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Procurement board with requisition queues, supplier lead-time scorecards, and price trend trackers.",
  },
  {
    id: "store-manager",
    roleTitle: "Warehouse & Store Manager",
    department: "Inventory & Stores",
    tagline: "Millimetric stock accuracy for 6.5m profile bars, off-cut vaults, and A-frame glass stillages.",
    responsibilities: [
      "Receive raw material, verify theoretical vs actual extrusion weights, and generate GRNs.",
      "Catalog off-cut remnants in barcode bins to maximize material reuse in upcoming jobs.",
      "Issue reserved profile lots and glass crates strictly against approved production work orders.",
    ],
    primaryModules: ["STORE", "PURCHASE MANAGEMENT", "PRODUCTION", "ACCOUNT"],
    keyActions: [
      "Generate GRN with Extrusion Weight Check",
      "Catalog Profile Off-Cuts in Remnant Vault",
      "Issue Material to CNC Saw Line",
    ],
    sampleKpis: [
      { label: "Stock Accuracy", value: "99.9%", badge: "SAMPLE DATA" },
      { label: "Off-Cut Remnant Reuse", value: "92.4%", badge: "SAMPLE DATA" },
      { label: "Active Glass Stillages", value: "112 Tracked", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Warehouse rack layout, barcode scanning queue, off-cut remnant catalog, and safety stock alerts.",
  },
  {
    id: "production-manager",
    roleTitle: "Plant & Production Manager",
    department: "Plant Operations",
    tagline: "Maximize machine throughput, enforce linear nesting, and minimize scrap.",
    responsibilities: [
      "Schedule daily cutting batches across double-miter saws and machining centers.",
      "Balance assembly line bays, structural silicone curing racks, and packaging teams.",
      "Track shift OEE, machine downtime, cycle times, and scrap percentages.",
    ],
    primaryModules: ["PRODUCTION", "MAINTENANCE", "STORE", "QUALITY CONTROL"],
    keyActions: [
      "Run 1D Linear Profile Optimization",
      "Dispatch Work Orders to Machine Tablets",
      "Monitor Real-Time Line OEE & Cycle Times",
    ],
    sampleKpis: [
      { label: "Linear Extrusion Scrap", value: "< 3.2%", badge: "SAMPLE DATA" },
      { label: "Daily Assembled Units", value: "96 Units", badge: "SAMPLE DATA" },
      { label: "Shop Floor OEE", value: "93.1%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Live factory floor telemetry with saw cutting queues, assembly bay status, and curing timers.",
  },
  {
    id: "qc-inspector",
    roleTitle: "Quality Assurance & QC Engineer",
    department: "Quality Assurance",
    tagline: "Zero defect tolerance from incoming powder coating to final pre-dispatch inspection.",
    responsibilities: [
      "Inspect incoming extrusion coating thickness, color uniformity, and anodizing micron depth.",
      "Perform corner crimping pull tests, gasket fitment audits, and DGU argon gas checks.",
      "Issue digital QC compliance certificates and manage Non-Conformance Reports (NCRs).",
    ],
    primaryModules: ["QUALITY CONTROL", "PRODUCTION", "LOGISTICS & DISPATCH", "TASK MANAGEMENT"],
    keyActions: [
      "Record Powder Coat Micron Readings",
      "Perform Structural Sealant Adhesion Pull Test",
      "Issue Digital Pre-Dispatch QC Stamp",
    ],
    sampleKpis: [
      { label: "First-Time QC Pass Rate", value: "99.4%", badge: "SAMPLE DATA" },
      { label: "Open Non-Conformances", value: "1 NCR", badge: "SAMPLE DATA" },
      { label: "Inspection Certs Issued", value: "100% Digital", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Inspection checkpoint log, digital caliper recordings, NCR escalation board, and compliance stamps.",
  },
  {
    id: "logistics-officer",
    roleTitle: "Logistics & Fleet Dispatch Officer",
    department: "Logistics & Dispatch",
    tagline: "Safe transit of fragile glass and custom unitized frames from plant to high-rise crane.",
    responsibilities: [
      "Plan vehicle loading matrices factoring A-frame stillage tare weights and center of gravity.",
      "Coordinate site gate delivery passes, road permits, and crane hoisting slots.",
      "Obtain digital electronic Proof of Delivery (e-POD) with signature and photo capture.",
    ],
    primaryModules: ["LOGISTICS & DISPATCH", "PRODUCTION", "PROJECT MANAGEMENT", "ACCOUNT"],
    keyActions: [
      "Generate Stillage Loading Matrix",
      "Book Site Crane Hoist Window",
      "Capture Digital e-POD on Delivery",
    ],
    sampleKpis: [
      { label: "On-Time Delivery Rate", value: "98.9%", badge: "SAMPLE DATA" },
      { label: "Zero-Breakage Transit", value: "99.7%", badge: "SAMPLE DATA" },
      { label: "Returnable Stillages Located", value: "100%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Fleet dispatch board, A-frame stillage loading visualizer, route map, and e-POD signature logs.",
  },
  {
    id: "accountant",
    roleTitle: "Financial Controller & Chief Accountant",
    department: "Finance & Accounts",
    tagline: "Complete project costing, automated 3-way invoice matching, and live P&L visibility.",
    responsibilities: [
      "Reconcile actual job costing (material + saw scrap + machine hours + site labor) against estimates.",
      "Manage progressive milestone billing, retention reserves, and uncertified claims.",
      "Execute automated 3-way matching between POs, GRNs, and vendor tax invoices.",
    ],
    primaryModules: ["ACCOUNT", "PROJECT MANAGEMENT", "PURCHASE MANAGEMENT", "HR & ATTENDANCE"],
    keyActions: [
      "Audit Actual vs Estimated Project Costing",
      "Generate Tax Invoices for Milestone Claims",
      "Track Retention Money & Bank Guarantees",
    ],
    sampleKpis: [
      { label: "Gross Margin Tracking", value: "Real-Time", badge: "SAMPLE DATA" },
      { label: "Uncertified WIP Value", value: "$420K", badge: "SAMPLE DATA" },
      { label: "3-Way Invoice Match Rate", value: "100%", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Real-time project P&L, aging receivables, retention release schedules, and statutory VAT ledgers.",
  },
  {
    id: "hr-manager",
    roleTitle: "Human Resources & Payroll Director",
    department: "Human Resources",
    tagline: "Manage plant shift rotas, piece-rate incentives, site allowances, and compliance.",
    responsibilities: [
      "Manage factory shift rosters, biometric attendance, and overtime authorizations.",
      "Calculate fenestration piece-rate incentives and site erection engineer allowances.",
      "Run automated monthly payroll with statutory deductions and digital payslip dispatch.",
    ],
    primaryModules: ["HR & ATTENDANCE", "MY PORTAL (ESS)", "ACCOUNT", "TASK MANAGEMENT"],
    keyActions: [
      "Approve Factory Floor Overtime Shifts",
      "Compute Piece-Rate Fabrication Incentives",
      "Process Monthly Automated Payroll",
    ],
    sampleKpis: [
      { label: "Active Plant Workforce", value: "284 Staff", badge: "SAMPLE DATA" },
      { label: "Shift Attendance Rate", value: "97.2%", badge: "SAMPLE DATA" },
      { label: "Payroll Processing Time", value: "< 45 Mins", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Workforce attendance board, shift rota scheduler, leave approval inbox, and payroll summary.",
  },
  {
    id: "employee",
    roleTitle: "Shop Floor & Site Engineer",
    department: "Field & Factory Operations",
    tagline: "Self-service mobile portal for clocking in, task checklists, and payslip downloads.",
    responsibilities: [
      "Clock in/out with geo-fenced GPS verification at site or factory gate.",
      "View assigned work order checklists, assembly instructions, and site snag lists.",
      "Submit leave applications, expense claims, and view official digital payslips.",
    ],
    primaryModules: ["MY PORTAL (ESS)", "TASK MANAGEMENT", "HR & ATTENDANCE"],
    keyActions: [
      "Mobile Clock-In with Site GPS",
      "Complete Assigned Task Checklist",
      "Download Monthly Payslip",
    ],
    sampleKpis: [
      { label: "Tasks Completed Today", value: "8 Items", badge: "SAMPLE DATA" },
      { label: "Checklist Compliance", value: "100%", badge: "SAMPLE DATA" },
      { label: "Leave Approval Status", value: "Approved", badge: "SAMPLE DATA" },
    ],
    dashboardFocus: "Clean mobile employee dashboard with shift timer, daily action items, and personal documents.",
  },
];
