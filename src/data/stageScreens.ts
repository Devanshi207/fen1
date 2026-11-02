export interface StageScreen {
  src: string;
  alt: string;
}

/**
 * Three ERP screens for each workflow stage, keyed by the stage's step number ("01" ... "13").
 *
 * RIGHT NOW THESE ARE DEMO IMAGES: wireframe placeholders in /public/erp, marked "Demo image" on the picture and showing no
 * data. To use real FEN1 screenshots, put them in /public/erp and change the file names below (keep three per stage; PNG,
 * WebP or JPG at 1600x1000 or similar, 16:10 works best). Nothing else needs to change.
 */
const slugs: Record<string, { slug: string; title: string }> = {
  "01": { slug: "enquiry", title: "Enquiry" },
  "02": { slug: "crm", title: "CRM" },
  "03": { slug: "estimation", title: "Estimation" },
  "04": { slug: "survey", title: "Survey" },
  "05": { slug: "design", title: "Design" },
  "06": { slug: "project-management", title: "Project management" },
  "07": { slug: "purchase", title: "Purchase management" },
  "08": { slug: "store", title: "Store" },
  "09": { slug: "production", title: "Production" },
  "10": { slug: "quality-control", title: "Quality control" },
  "11": { slug: "logistics", title: "Logistics and dispatch" },
  "12": { slug: "installation", title: "Installation" },
  "13": { slug: "handover", title: "Handover" },
};

export const STAGE_SCREENS: Record<string, StageScreen[]> = Object.fromEntries(
  Object.entries(slugs).map(([step, { slug, title }]) => [
    step,
    [1, 2, 3].map((n) => ({ src: `/erp/${slug}-${n}.svg`, alt: `Demo image of FEN1's ${title} screen ${n} (to be replaced with a real screenshot)` })),
  ])
);
