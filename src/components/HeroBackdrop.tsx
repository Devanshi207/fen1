import Image from "next/image";

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=75`;

const SLIDES = [
  { src: U("photo-1745015446589-7ee6f702d8c1"), alt: "" },
  { src: U("photo-1712319160624-8498ace8debe"), alt: "" },
  { src: U("photo-1758830596893-7aa7c7caf245"), alt: "" },
];

/** Crossfading, slowly zooming photo backdrop for the hero. Purely decorative. */
export default function HeroBackdrop() {
  return (
    <div className="hero-backdrop absolute inset-0 -z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {SLIDES.map((s, i) => (
        <div key={s.src} className="hero-slide absolute inset-0" style={{ animationDelay: `${i * 8}s` }}>
          <Image src={s.src} alt={s.alt} fill sizes="100vw" className="object-cover" priority={i === 0} />
        </div>
      ))}
      <div className="absolute inset-0 hero-backdrop-veil" />
    </div>
  );
}
