"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StepWizard from "@/components/StepWizard";
import { SLOT_TIMES, SLOT_ZONE, bookableRange, formatDate, isBookableDate, monthGrid, monthTitle, slotId } from "@/lib/slots";
import { bookWizard } from "@/lib/wizards";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Book a demo: pick a day on the calendar and a time under it, then give your details. The slot is kept for the visitor the
 * moment they send them (see /api/booking); slots that are already taken cannot be picked, and a day with no free time is off.
 */
export default function SlotBooking() {
  const router = useRouter();
  const range = useMemo(() => bookableRange(), []);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [load, setLoad] = useState<"loading" | "ready" | "unavailable">("loading");
  const [view, setView] = useState(() => ({ year: Number(range.first.slice(0, 4)), month: Number(range.first.slice(5, 7)) - 1 }));
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [stage, setStage] = useState<"pick" | "details">("pick");

  /** Back to the page the visitor came from (the QR code or a button), or Home when this page was opened directly. */
  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else router.push("/");
  };

  const refresh = () =>
    fetch("/api/booking", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        const data = (await r.json()) as { taken?: string[] };
        setTaken(new Set(data.taken ?? []));
        setLoad("ready");
      })
      .catch(() => setLoad("unavailable"));

  useEffect(() => {
    void refresh();
  }, []);

  const free = (d: string) => SLOT_TIMES.filter((t) => !taken.has(slotId(d, t)));
  const canPrev = view.year * 12 + view.month > Number(range.first.slice(0, 4)) * 12 + Number(range.first.slice(5, 7)) - 1;
  const canNext = view.year * 12 + view.month < Number(range.last.slice(0, 4)) * 12 + Number(range.last.slice(5, 7)) - 1;
  const move = (by: number) => setView((v) => {
    const n = v.year * 12 + v.month + by;
    return { year: Math.floor(n / 12), month: n % 12 };
  });

  const wizard = useMemo(
    () =>
      date && time
        ? bookWizard({ date, time }, () => {
            setStage("pick");
            setTime(null);
            void refresh();
          })
        : null,
    [date, time]
  );

  if (stage === "details" && date && time && wizard) {
    return (
      <div className="slot-book">
        <button type="button" className="slot-back" onClick={() => setStage("pick")}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Change day or time</span>
        </button>
        <StepWizard key={slotId(date, time)} config={wizard} />
      </div>
    );
  }

  return (
    <div className="slot-book">
      <button type="button" className="slot-back" onClick={goBack}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back</span>
      </button>
      <p className="wiz-intro">Book a FEN1 demo</p>
      <h2 className="contact-form-title">Pick a day and a time</h2>

      {load === "unavailable" && (
        <p role="alert" className="wiz-failed">
          Booking is not available right now. Please use the Contact page and we will arrange a time with you.
        </p>
      )}

      <div className="cal" aria-busy={load === "loading"}>
        <div className="cal-head">
          <button type="button" className="cal-nav" aria-label="Previous month" disabled={!canPrev} onClick={() => move(-1)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <p className="cal-title" aria-live="polite">
            {monthTitle(view.year, view.month)}
          </p>
          <button type="button" className="cal-nav" aria-label="Next month" disabled={!canNext} onClick={() => move(1)}>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="cal-grid" role="group" aria-label={monthTitle(view.year, view.month)}>
          {WEEK.map((w) => (
            <span key={w} className="cal-dow" aria-hidden="true">
              {w}
            </span>
          ))}
          {monthGrid(view.year, view.month).flat().map((d, i) => {
            if (!d) return <span key={`b${i}`} className="cal-blank" aria-hidden="true" />;
            const ok = load === "ready" && isBookableDate(d) && free(d).length > 0;
            return (
              <button
                key={d}
                type="button"
                className={`cal-day${d === date ? " is-on" : ""}`}
                disabled={!ok}
                aria-pressed={d === date}
                aria-label={`${formatDate(d)}${ok ? "" : isBookableDate(d) && load === "ready" ? ", fully booked" : ", not available"}`}
                onClick={() => {
                  setDate(d);
                  setTime((t) => (t && !taken.has(slotId(d, t)) ? t : null));
                }}
              >
                {Number(d.slice(8))}
              </button>
            );
          })}
        </div>
      </div>

      {date && (
        <div className="cal-times" role="group" aria-label={`Times on ${formatDate(date)}`}>
          <p className="cal-times-title">
            {formatDate(date)} <span>({SLOT_ZONE})</span>
          </p>
          <div className="cal-time-list">
            {SLOT_TIMES.map((t) => {
              const gone = taken.has(slotId(date, t));
              return (
                <button key={t} type="button" className={`cal-time${t === time ? " is-on" : ""}`} disabled={gone} aria-pressed={t === time} onClick={() => setTime(t)}>
                  {t}
                  {gone && <span className="cal-gone"> booked</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="wiz-actions">
        <button type="button" className="wiz-next" disabled={!date || !time} onClick={() => setStage("details")}>
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
