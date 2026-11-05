import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * A heading whose lines rise through a mask one after another (a clean reveal, not letter by letter). The text is
 * split on the server, so there is no layout shift and no JavaScript is needed for the animation. Screen readers get
 * the plain text through `aria-label`; the split lines are hidden from them. Use "\n" for line breaks.
 */
export default function KineticHeading({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** Lines' worth of delay before the first line moves. */
  delay?: number;
}) {
  return (
    <Tag className={cn("kinetic", className)} aria-label={text.replace(/~/g, "").replace(/\n/g, " ")}>
      {text.split("\n").map((line, li) => {
        // a line that starts with "~" is the accent line: it is set in the brand blue
        const accent = line.startsWith("~");
        return (
          <span key={li} className={cn("kinetic-line", accent && "kinetic-accent")} aria-hidden="true">
            <span className="kinetic-inner" style={{ ["--i" as string]: li + delay }}>
              {accent ? line.slice(1) : line}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
