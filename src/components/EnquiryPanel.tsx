"use client";

import { Mail } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { ENQUIRY_INITIAL, TOPICS, TOPIC_ORDER, fieldsFor, type Topic } from "@/data/enquiryForms";

/**
 * The enquiry form with its choice at the top: "I'd like a demo" or "I have a question". One form serves both; the choice
 * changes the wording and the extra questions, and the enquiry is tagged with which one it was.
 */
export default function EnquiryPanel({
  topic,
  onTopic,
  headingAs: Heading = "h2",
  headingClass = "",
}: {
  topic: Topic;
  onTopic: (topic: Topic) => void;
  headingAs?: "h1" | "h2";
  headingClass?: string;
}) {
  const copy = TOPICS[topic];
  return (
    <div className="w-full space-y-5">
      <Heading className={headingClass}>{copy.heading}</Heading>

      {/* Weights are set explicitly (font-[500]) because the site's global scale lifts the named Tailwind weights. */}
      <div role="radiogroup" aria-label="What would you like to do?" className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-[#DCE6F5] bg-[#FFFFFF] p-1">
        {TOPIC_ORDER.map((key) => {
          const on = key === topic;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onTopic(key)}
              className={`rounded-md px-4 py-1.5 text-[0.8rem] font-[500] transition-colors ${on ? "bg-[#0067C0] text-white" : "text-[#55637A] hover:bg-[#F3F7FF] hover:text-[#1E2B45]"}`}
            >
              {TOPICS[key].label}
            </button>
          );
        })}
      </div>

      {/* A direct email, shown only for questions and only when one is configured (NEXT_PUBLIC_CONTACT_EMAIL) */}
      {topic === "question" && process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
        <p className="flex items-center gap-2 text-[0.8rem] text-[#55637A]">
          <Mail className="h-4 w-4 text-[#0067C0]" aria-hidden="true" />
          <span>
            Or email us at <span className="font-[500] text-[#1E2B45]">{process.env.NEXT_PUBLIC_CONTACT_EMAIL}</span>
          </span>
        </p>
      )}

      <EnquiryForm
        kind={copy.kind}
        fields={fieldsFor(topic)}
        initial={ENQUIRY_INITIAL}
        submitLabel={copy.submit}
        doneTitle={copy.doneTitle}
        doneText={copy.doneText}
      />
    </div>
  );
}
