import type { ReactNode } from "react";

/** The opening of a section: a heading and one short paragraph. The heading and paragraph reveal on scroll. */
export default function SectionHead({ title, children, more = [], align = "left" }: { title: string; children?: ReactNode; more?: string[]; align?: "left" | "center" }) {
  return (
    <div className={`sec-head ${align === "center" ? "text-center mx-auto" : ""}`}>
      <h2 className="sec-title">{title}</h2>
      {children && <p className="sec-lede">{children}</p>}
      {more.map((t) => <p key={t} className="sec-lede sec-lede-more">{t}</p>)}
    </div>
  );
}
