import { ArrowRight } from "lucide-react";

export function ScrollCue() {
  return (
    <p className="hz-scroll-cue" aria-hidden="true">
      Scroll or drag <ArrowRight className="w-3.5 h-3.5" />
    </p>
  );
}
