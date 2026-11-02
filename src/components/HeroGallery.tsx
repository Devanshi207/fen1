import Image from "next/image";
import { GALLERY } from "@/data/gallery";

/**
 * The photograph beside the hero headline: one real project photo, framed, so the first screen shows the industry
 * rather than a screenshot of the software. It is a single still; its reveal is in app/motion.css.
 */
export default function HeroGallery() {
  const g = GALLERY[0];
  return (
    <figure className="hero-frame" aria-label={g.alt}>
      <Image src={g.src} alt={g.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: g.position }} />
    </figure>
  );
}
