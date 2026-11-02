import type { ReactNode } from "react";

/** The opening of a section: a mono eyebrow, a heading and one short paragraph. The heading and paragraph reveal on scroll. */
export default function SectionHead({ eyebrow, title, children, align = "left" }: { eyebrow: string; title: string; children?: ReactNode; align?: "left" | "center" }) {
  return (
    <div className={`sec-head ${align === "center" ? "text-center mx-auto" : ""}`}>
      <p className="sec-eyebrow tech">{eyebrow}</p>
      <h2 className="sec-title">{title}</h2>
      {children && <p className="sec-lede">{children}</p>}
    </div>
  );
}
