"use client";

import EnquiryPanel from "@/components/EnquiryPanel";
import { TOPICS, type Topic } from "@/data/enquiryForms";
import { useTopic } from "@/lib/topic";
import HShell from "./HShell";
import Mark from "./Mark";
import { ScrollCue } from "./Parts";

const SIZE = "clamp(4.5rem, 17vw, 15rem)";
/** The page's wordmark follows the choice: DE[photo]MO for a demo, TA[photo]LK for a question */
const WORD: Record<Topic, { left: string; right: string }> = {
  demo: { left: "DE", right: "MO" },
  question: { left: "TA", right: "LK" },
};

/** The enquiry page as a sideways journey: the pitch with the wordmark, then the form (demo or question) on the next screen. */
export default function HorizontalDemo() {
  const [topic, setTopic] = useTopic();
  const { left, right } = WORD[topic];
  const pitch = TOPICS[topic].pitch;
  return (
    <HShell left={left} right={right} size={SIZE} start={2}>
      <article className="hz-panel hz-hero" data-label="Enquiry">
        <div className="hz-hero-body">
          <Mark left={left} right={right} size={SIZE} start={2} />
          <p className="hz-kicker">{pitch.line}</p>
          <p className="hz-lede">{pitch.body}</p>
        </div>
        <ScrollCue />
      </article>

      <article className="hz-panel hz-form" data-label="Request">
        <div className="hz-form-card">
          <EnquiryPanel topic={topic} onTopic={setTopic} headingClass="hz-title" />
        </div>
      </article>
    </HShell>
  );
}
