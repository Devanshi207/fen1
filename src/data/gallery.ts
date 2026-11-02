export interface Photo {
  src: string;
  alt: string;
  /** CSS object-position for the photo */
  position?: string;
}

/** Full-size Unsplash photographs; next/image serves each one resized for the screen. */
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=85`;

/** The photograph beside the home headline: a glass curtain-wall tower, sharp against a clear sky. */
export const HERO_PHOTO: Photo = { src: U("photo-1720421112998-d2239ba1c2c7"), alt: "A glass curtain-wall tower rising into a blue sky with clouds" };

/** Beside the enquiry form: curtain-wall glazing and a revolving door. */
export const CONTACT_PHOTO: Photo = { src: U("photo-1786604132656-b2d6e2c9e262"), alt: "Curtain-wall glazing above a revolving entrance door, with clouds reflected in the glass" };

/** What the engineering drawing resolves into: finished aluminium-framed glazing. */
export const DRAWING_PHOTO: Photo = { src: U("photo-1787491581136-9aa210574b49"), alt: "Slim aluminium-framed windows and doors opening onto a timber deck" };

/** One photograph per industry on the Solutions section, keyed by the industry's id (see data/solutions.ts). */
export const SOLUTION_PHOTOS: Record<string, Photo> = {
  "windows-doors": { src: U("photo-1783125127079-7cbd3bc4c468"), alt: "Floor-to-ceiling black aluminium window frames in a bright room" },
  glass: { src: U("photo-1641787354718-46774dd8f94a"), alt: "A structural glass wall held by point-fixed fittings, with the sky reflected in it" },
  fabrication: { src: U("photo-1738966523829-5d3c195abce3"), alt: "Aluminium profiles lying on blue steel racking in a workshop" },
  contractors: { src: U("photo-1751486403820-7cf45ebec080"), alt: "A new window frame being installed, with protective film and tape, and scaffolding outside" },
  dealers: { src: U("photo-1761714500078-1ffb601924c2"), alt: "A bright glazed entrance hall with long shadows on the floor" },
};

/** The photographs on the full-screen menu, one per link, in the order of the links. */
export const MENU_PHOTOS: Photo[] = [HERO_PHOTO, SOLUTION_PHOTOS["windows-doors"], SOLUTION_PHOTOS.glass, SOLUTION_PHOTOS.fabrication, SOLUTION_PHOTOS.contractors, CONTACT_PHOTO];
