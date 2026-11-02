export interface GallerySlide {
  src: string;
  alt: string;
  title: string;
  note: string;
  /** id of the matching card on the Solutions page */
  solution: string;
  /** CSS object-position for the photo */
  position?: string;
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=75`;

/** Photos for the hero and the contact section. Photography is hot-linked from Unsplash (see next.config.ts). */
export const GALLERY: GallerySlide[] = [
  {
    src: U("photo-1745015446589-7ee6f702d8c1"),
    alt: "Glass-clad building exterior",
    title: "Architectural Glass",
    note: "Toughened, laminated and insulated glass",
    solution: "glass",
    position: "50% 30%",
  },
  {
    src: U("photo-1727001496055-ba712f0c7f82"),
    alt: "Large production hall with machining lines",
    title: "Factory Floor",
    note: "CNC saws, nesting and live production status",
    solution: "fabrication",
  },
  {
    src: U("photo-1759367973838-2ad5eabd1f28"),
    alt: "Slim metal-framed glass panels",
    title: "Windows & Doors",
    note: "Slim aluminium systems, priced to the millimetre",
    solution: "windows-doors",
  },
  {
    src: U("photo-1712319160624-8498ace8debe"),
    alt: "Sky seen through a glass roof structure",
    title: "Glass & IGUs",
    note: "Processing, tempering and dispatch",
    solution: "glass",
  },
];

export interface SolutionPhoto {
  src: string;
  alt: string;
  /** CSS object-position for the photo */
  position?: string;
}

/** One photograph per industry on the Solutions section, keyed by the industry's id (see data/solutions.ts). Hot-linked from Unsplash. */
export const SOLUTION_PHOTOS: Record<string, SolutionPhoto> = {
  "windows-doors": { src: U("photo-1759367973838-2ad5eabd1f28"), alt: "Slim metal-framed glass panels" },
  glass: { src: U("photo-1712319160624-8498ace8debe"), alt: "Sky seen through a glass roof structure" },
  fabrication: { src: U("photo-1727001496055-ba712f0c7f82"), alt: "Large production hall with machining lines" },
  contractors: { src: U("photo-1758830596893-7aa7c7caf245"), alt: "Glazed curtain-wall panels reflecting the sky" },
  dealers: { src: U("photo-1745015446589-7ee6f702d8c1"), alt: "Glass-clad building exterior", position: "50% 30%" },
};
