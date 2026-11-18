import type { ReactNode } from "react";

/** The opening of a section: a heading and one short paragraph. The heading and paragraph reveal on scroll. */
export default function SectionHead({ title, children, align = "left" }: { title: string; children?: ReactNode; align?: "left" | "center" }) {
  return (
    <div className={`sec-head ${align === "center" ? "text-center mx-auto" : ""}`}>
      <h2 className="sec-title">{title}</h2>
      {children && <p className="sec-lede">{children}</p>}
    </div>
  );
}
