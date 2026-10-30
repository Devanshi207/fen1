"use client";

import Image from "next/image";
import { GALLERY } from "@/data/gallery";

/**
 * A page's name as a wordmark with a photo where one letter would be: "FE[photo]N1", "AB[photo]OUT".
 * On the page the photos take turns on a CSS timer; in the loader `shown` picks which one is on.
 */
export default function Mark({
  left,
  right,
  size,
  start = 0,
  loading = false,
  shown = 0,
  slotRef,
  slotStyle,
  className = "",
}: {
  left: string;
  right: string;
  /** CSS font-size for the wordmark; long words pass a smaller one */
  size?: string;
  /** Which gallery photo comes first */
  start?: number;
  loading?: boolean;
  shown?: number;
  slotRef?: React.Ref<HTMLSpanElement>;
  slotStyle?: React.CSSProperties;
  className?: string;
}) {
  const Tag = loading ? "div" : "h1";
  const n = GALLERY.length;
  const photos = GALLERY.map((_, i) => GALLERY[(i + start) % n]);
  return (
    <Tag className={`hz-mark ${className}`} aria-label={`${left}${right}`} style={{ ...(size ? { ["--mark" as string]: size } : {}), ["--chars" as string]: left.length + right.length }}>
      <span aria-hidden="true">{left}</span>
      <span ref={slotRef} className="hz-mark-img" style={slotStyle} aria-hidden="true">
        {photos.map((g, i) =>
          loading ? (
            <span key={g.src} className="hz-mark-shot" style={{ opacity: i === shown ? 1 : 0 }}>
              <Image src={g.src} alt="" fill priority={i === 0} sizes="30vw" className="object-cover" style={{ objectPosition: g.position }} />
            </span>
          ) : (
            <span key={g.src} className="hero-frame-slide" style={{ animationDelay: `${i * 5}s`, ["--slides" as string]: n }}>
              <Image src={g.src} alt="" fill sizes="30vw" className="object-cover hz-mark-photo" style={{ objectPosition: g.position }} />
            </span>
          )
        )}
      </span>
      <span aria-hidden="true">{right}</span>
    </Tag>
  );
}
