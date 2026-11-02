import Image from "next/image";
import { GALLERY } from "@/data/gallery";

/**
 * A framed photo beside the hero headline. The project photos crossfade on a CSS timer (no script), so the first screen
 * shows the industry rather than a screenshot of the software.
 */
export default function HeroGallery() {
  const n = GALLERY.length;
  return (
    <figure className="hero-frame" aria-label="Project photography">
      {GALLERY.map((s, i) => (
        <div key={s.src} className="hero-frame-slide" style={{ animationDelay: `${i * 5}s`, ["--slides" as string]: n }}>
          <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: s.position }} />
        </div>
      ))}
    </figure>
  );
}
