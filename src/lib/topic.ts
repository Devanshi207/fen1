import { useCallback, useEffect, useState } from "react";
import type { Topic } from "@/data/enquiryForms";

/** Reads ?topic= from an old link. Anything but "question" is a demo, the default. */
export function resolveTopic(param: string | null): Topic {
  return param === "question" ? "question" : "demo";
}

/** The part of the page a link opens: "#question" and "#demo" both scroll to the enquiry form and pick that choice. */
export function topicHref(topic: Topic): string {
  return topic === "question" ? "#question" : "#demo";
}

/** What a page address asks for: the hash (#question, #demo) first, then an old ?topic=question; null when it asks for nothing. */
export function topicFromLocation(hash: string, search: string): Topic | null {
  if (hash === "#question") return "question";
  if (hash === "#demo") return "demo";
  return new URLSearchParams(search).get("topic") === "question" ? "question" : null;
}

/**
 * Which choice the enquiry form is on. It starts as a demo, takes whatever the address asked for when the page opened
 * (#question, #demo, or an old ?topic=question), then follows the visitor: the choice at the top of the form, or any
 * "Request a demo" / "Ask a question" link they click (those change the hash, which the browser announces as an event).
 * Client components only.
 */
export function useTopic(): [Topic, (topic: Topic) => void] {
  const [topic, setTopic] = useState<Topic>("demo");
  useEffect(() => {
    const asked = topicFromLocation(window.location.hash, window.location.search);
    // reading the address needs the browser, so it happens after mount
    if (asked) queueMicrotask(() => setTopic(asked));
    const onHash = () => {
      const next = topicFromLocation(window.location.hash, "");
      if (next) setTopic(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const choose = useCallback((next: Topic) => setTopic(next), []);
  return [topic, choose];
}
