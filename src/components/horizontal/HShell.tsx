"use client";

import { useCallback, useState } from "react";
import Curtain from "./Curtain";
import HScroll from "./HScroll";

/** One sideways page: the loading curtain for its wordmark, then the scrolling track of panels. */
export default function HShell({ left, right, size, start = 0, children }: { left: string; right: string; size?: string; start?: number; children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <>
      {!ready && <Curtain left={left} right={right} size={size} start={start} onDone={done} />}
      <HScroll ready={ready}>{children}</HScroll>
    </>
  );
}
