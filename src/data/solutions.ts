export interface IndustrySolution {
  id: string;
  slug: string;
  number: string;
  title: string;
  /** The sub-parts of the heading, shown smaller beside it, e.g. the materials or system types. */
  parts?: string;
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
    title: "Windows & Doors",
    parts: "Aluminium and uPVC",
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
      "Linear profile nesting that keeps extrusion scrap and off-cuts down",
      "Cutting lists sent to CNC saws and machining centres",
      "Instant dealer quotations with live extrusion pricing",
      "Complete assembly bay scheduling & barcode tracking",
    ],
  },
  {
    id: "glass-railing",
    slug: "glass-railing",
    number: "02",
    title: "Glass Railing",
    subtitle: "Balustrades, balconies, staircases and terraces",
    challenge:
      "Each run is cut to the site: glass sizes, post and clamp positions and fixings depend on exact measurements, so one survey error means glass re-ordered and an installer waiting.",
    solutionSummary:
      "FEN1 turns site measurements into shop drawings and a bill of materials, orders toughened or laminated glass to size, and tracks every panel from the order to its fixing on site.",
    workflow: ["CRM", "ESTIMATION", "SURVEY", "DESIGN", "PURCHASE", "PRODUCTION", "QUALITY", "INSTALLATION"],
    operationalJourney: [
      { step: "01. Quote from the run", action: "Estimator prices each run by length, glass type and fixing system, and the quotation follows from it.", module: "ESTIMATION" },
      { step: "02. Measure the site", action: "Surveyor records each run, level and fixing point on site, and the figures go straight to design.", module: "SURVEY" },
      { step: "03. Order glass to size", action: "Glass and hardware are ordered to the drawn sizes and received against the order.", module: "PURCHASE MANAGEMENT" },
      { step: "04. Fit and hand over", action: "Installers work from the panel list, and the job is handed over with its record.", module: "PROJECT MANAGEMENT" },
    ],
    relevantModules: ["ESTIMATION", "SURVEY", "DESIGN", "PURCHASE MANAGEMENT", "STORE", "PROJECT MANAGEMENT"],
    keyBenefits: [
      "Quotes built from each run, glass type and fixing",
      "Site measurements carried into the drawings without retyping",
      "Glass and hardware ordered to the drawn sizes",
      "Every panel traceable from order to installation",
    ],
  },
  {
    id: "curtain-wall",
    slug: "curtain-wall",
    number: "03",
    title: "Curtain Wall",
    parts: "Unitised, semi-unitised and stick-built",
    subtitle: "Curtain wall systems for commercial and high-rise buildings",
    challenge:
      "A curtain wall is thousands of parts and units that must arrive in order and fit tight tolerances, so one late or wrong component can hold up the programme.",
    solutionSummary:
      "FEN1 breaks the curtain wall into units and components, plans purchasing and production against the installation programme, and tracks each unit from the factory to its place on the building.",
    workflow: ["CRM", "ESTIMATION", "SURVEY", "DESIGN", "PROJECT", "PURCHASE", "PRODUCTION", "QUALITY", "LOGISTICS", "INSTALLATION"],
    operationalJourney: [
      { step: "01. Estimate by system", action: "Estimation prices unitised, semi-unitised and stick-built systems from the same elevations.", module: "ESTIMATION" },
      { step: "02. Detail and release", action: "Design produces shop drawings and part lists, released in the order the site needs them.", module: "DESIGN" },
      { step: "03. Build and check", action: "Units are assembled and checked in the factory, or components cut and packed for stick-built work.", module: "PRODUCTION" },
      { step: "04. Deliver and install", action: "Each unit is dispatched in sequence and installed against the programme.", module: "LOGISTICS & DISPATCH" },
    ],
    relevantModules: ["ESTIMATION", "DESIGN", "PROJECT MANAGEMENT", "PURCHASE MANAGEMENT", "PRODUCTION", "QUALITY CONTROL", "LOGISTICS & DISPATCH"],
    keyBenefits: [
      "One job record for unitised, semi-unitised and stick-built systems",
      "Purchasing and production planned against the installation programme",
      "Units and components tracked from the factory to their place on the building",
      "Drawings, part lists and site changes kept on the same job",
    ],
  },
];
