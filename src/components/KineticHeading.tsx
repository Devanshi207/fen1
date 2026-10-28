import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * A heading whose letters rise into place one after another. The text is split on the server, so there is no
 * layout shift and no JavaScript is needed for the animation. Screen readers get the plain text through
 * `aria-label`; the split letters are hidden from them. Use "\n" for line breaks.
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
  /** Extra letters' worth of delay before the first letter moves. */
  delay?: number;
}) {
  let index = delay;
  return (
    <Tag className={cn("kinetic", className)} aria-label={text.replace(/\n/g, " ")}>
      {text.split("\n").map((line, li) => (
        <span key={li} className="kinetic-line" aria-hidden="true">
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="kinetic-word">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="kinetic-char" style={{ ["--i" as string]: index++ }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
