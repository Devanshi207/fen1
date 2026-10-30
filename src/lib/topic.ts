import { useCallback, useState, useSyncExternalStore } from "react";
import type { Topic } from "@/data/enquiryForms";

/** Reads ?topic= from the link. Anything but "question" is a demo, the default. */
export function resolveTopic(param: string | null): Topic {
  return param === "question" ? "question" : "demo";
}

/** The link that opens the enquiry page on a given choice (the old /contact links redirect to the question one). */
export function topicHref(topic: Topic): string {
  return topic === "question" ? "/request-demo?topic=question" : "/request-demo";
}

const subscribe = () => () => {};
const fromUrl = (): Topic => resolveTopic(new URLSearchParams(window.location.search).get("topic"));

/**
 * Which choice the enquiry page is on: what the link asked for (?topic=question), until the visitor picks one. Picking
 * updates the address in place, so a refresh or a shared link keeps it. Client components only.
 */
export function useTopic(): [Topic, (topic: Topic) => void] {
  const linked = useSyncExternalStore(subscribe, fromUrl, (): Topic => "demo");
  const [chosen, setChosen] = useState<Topic | null>(null);
  const choose = useCallback((topic: Topic) => {
    setChosen(topic);
    const url = new URL(window.location.href);
    if (topic === "question") url.searchParams.set("topic", "question");
    else url.searchParams.delete("topic");
    window.history.replaceState(window.history.state, "", url);
  }, []);
  return [chosen ?? linked, choose];
}
