"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import type { StepOption } from "@/data/enquirySteps";
import type { EnquiryKind } from "@/lib/enquiry";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** A single answer moves on by itself after this long, so the choice is seen before the next question appears. */
const ADVANCE_MS = 260;

/** The answers so far, by question key. A single-answer question holds one value; a multi-answer one holds several. */
export type Answers = Record<string, string[]>;

export interface WizardStep {
  key: string;
  question: string | ((answers: Answers) => string);
  help?: string;
  options: StepOption[];
  /** More than one answer allowed (then the question has a Continue button instead of moving on by itself) */
  multi?: boolean;
  /** With multi: an answer that stands alone and clears the others ("Not sure yet") */
  exclusive?: string;
}

export interface DetailField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "area";
  auto?: string;
  /** What to say when it is left empty. A field with none is not checked. */
  missing?: string;
}

export interface WizardConfig {
  /** A line above the first question, e.g. the role being applied for */
  intro?: string;
  /** The option questions, in order. The last question, who to reply to, is added after them. */
  steps: WizardStep[];
  fields: DetailField[];
  kind: (answers: Answers) => EnquiryKind;
  submitLabel: (answers: Answers) => string;
  done: (answers: Answers) => { title: string; text: string };
  /** What is sent: the typed details plus whatever the answers add */
  payload: (answers: Answers, details: Record<string, string>) => Parameters<typeof submitEnquiry>[1];
  /** Opens the form with answers already made, e.g. from a link. Called once the form is on the page; returns its cleanup. */
  link?: (open: (answers: Answers, step: number) => void, currentStep: () => number) => () => void;
}

/** The options of one question, as big buttons. One answer (radio) or several (checkbox). */
function Options({ label, options, selected, multi, onPick }: { label: string; options: StepOption[]; selected: string[]; multi?: boolean; onPick: (value: string) => void }) {
  const base = useId();
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label} className="wiz-options">
      {options.map((o, i) => {
        const on = selected.includes(o.value);
        // the answer is the button's name; the line under it is its description
        const title = `${base}-t${i}`;
        const hint = `${base}-h${i}`;
        return (
          <button key={o.value} type="button" role={multi ? "checkbox" : "radio"} aria-checked={on} aria-labelledby={title} aria-describedby={o.hint ? hint : undefined} className={`wiz-opt${on ? " is-on" : ""}`} onClick={() => onPick(o.value)}>
            <span className="wiz-opt-text">
              <span id={title} className="wiz-opt-title">
                {o.value}
              </span>
              {o.hint && (
                <span id={hint} className="wiz-opt-hint">
                  {o.hint}
                </span>
              )}
            </span>
            <span className="wiz-opt-mark" aria-hidden="true">
              {on && <Check className="h-4 w-4" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * A form as short questions, one at a time, answered by clicking. A single answer moves on by itself; a question that allows
 * several has a Continue button. Back keeps every answer. The last question, who to reply to, is the only one that needs
 * typing; it sends the enquiry through /api/enquiry. What the questions are, and what is sent, comes from a WizardConfig
 * (see lib/wizards.ts), so the contact enquiry and the job application are the same component.
 */
export default function StepWizard({ config }: { config: WizardConfig }) {
  const { steps, fields } = config;
  const last = steps.length; // the details question comes after the option questions
  const total = steps.length + 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  const [trap, setTrap] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // focus follows the question, but not on first load
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  useEffect(() => {
    if (moved.current) heading.current?.focus({ preventScroll: true });
  }, [step, status]);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  useEffect(() => {
    if (!config.link) return;
    const open = (patch: Answers, to: number) => {
      setAnswers((a) => ({ ...a, ...patch }));
      setStep(to);
    };
    // reading the address needs the browser, so it happens after mount
    let live = true;
    let stop: (() => void) | undefined;
    queueMicrotask(() => {
      if (live) stop = config.link!(open, () => stepRef.current);
    });
    return () => {
      live = false;
      stop?.();
    };
  }, [config]);

  const goTo = (next: number) => {
    moved.current = true;
    setStep(next);
  };
  /** Records a single answer and moves on once the choice has been seen. */
  const pick = (key: string, value: string) => {
    setAnswers((a) => ({ ...a, [key]: [value] }));
    if (timer.current) clearTimeout(timer.current);
    const to = step + 1;
    timer.current = setTimeout(() => goTo(to), ADVANCE_MS);
  };
  const toggle = (s: WizardStep, value: string) =>
    setAnswers((a) => {
      const now = a[s.key] ?? [];
      const has = now.includes(value);
      if (value === s.exclusive) return { ...a, [s.key]: has ? [] : [value] };
      const rest = now.filter((v) => v !== s.exclusive);
      return { ...a, [s.key]: has ? rest.filter((v) => v !== value) : [...rest, value] };
    });

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Record<string, string> = {};
    for (const f of fields) {
      const value = (details[f.key] ?? "").trim();
      if (f.missing && !value) found[f.key] = f.missing;
      else if (f.type === "email" && value && !EMAIL.test(value)) found[f.key] = "Please enter a valid email";
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    const ok = await submitEnquiry(config.kind(answers), config.payload(answers, details), trap);
    setStatus(ok ? "sent" : "error");
  };

  const again = () => {
    moved.current = true;
    setAnswers({});
    setDetails({});
    setErrors({});
    setStatus("idle");
    setStep(0);
  };

  if (status === "sent") {
    const first = (details.name ?? "").trim().split(/\s+/)[0];
    const done = config.done(answers);
    return (
      <div className="wiz wiz-done" role="status">
        <div className="wiz-done-icon">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 ref={heading} tabIndex={-1} className="contact-form-title">
          {done.title}
        </h2>
        <p className="wiz-done-text">
          Thank you{first ? `, ${first}` : ""}. {done.text}
        </p>
        <button type="button" className="wiz-back" onClick={again}>
          Start again
        </button>
      </div>
    );
  }

  const current = steps[step];
  const question = current ? (typeof current.question === "function" ? current.question(answers) : current.question) : "Where can we reach you?";

  return (
    <div className="wiz">
      {config.intro && <p className="wiz-intro">{config.intro}</p>}
      <p className="wiz-kicker tech">
        Question {step + 1} of {total}
      </p>
      <div className="wiz-progress" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < step ? "is-done" : i === step ? "is-now" : ""} />
        ))}
      </div>

      {/* keyed by step, so each question enters afresh */}
      <div key={step} className="wiz-step">
        <h2 ref={heading} tabIndex={-1} className="contact-form-title">
          {question}
        </h2>

        {current && (
          <>
            {current.help && <p className="wiz-help">{current.help}</p>}
            <Options label={question} options={current.options} selected={answers[current.key] ?? []} multi={current.multi} onPick={(value) => (current.multi ? toggle(current, value) : pick(current.key, value))} />
            {current.multi && (
              <div className="wiz-actions">
                <button type="button" className="wiz-next" disabled={(answers[current.key] ?? []).length === 0} onClick={() => goTo(step + 1)}>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}

        {step === last && (
          <form onSubmit={send} noValidate className="wiz-form">
            <div className="wiz-grid">
              {fields
                .filter((f) => f.type !== "area")
                .map((f) => (
                  <div key={f.key} className="wiz-field">
                    <label htmlFor={`wiz-${f.key}`}>{f.label}</label>
                    <input
                      id={`wiz-${f.key}`}
                      type={f.type}
                      autoComplete={f.auto}
                      value={details[f.key] ?? ""}
                      onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))}
                      aria-invalid={errors[f.key] ? true : undefined}
                      aria-describedby={errors[f.key] ? `wiz-${f.key}-err` : undefined}
                    />
                    {errors[f.key] && (
                      <p id={`wiz-${f.key}-err`} role="alert" className="wiz-error">
                        {errors[f.key]}
                      </p>
                    )}
                  </div>
                ))}
            </div>
            {fields
              .filter((f) => f.type === "area")
              .map((f) => (
                <div key={f.key} className="wiz-field">
                  <label htmlFor={`wiz-${f.key}`}>{f.label}</label>
                  <textarea id={`wiz-${f.key}`} rows={3} value={details[f.key] ?? ""} onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))} />
                </div>
              ))}

            {/* a spam trap: hidden from people and from the keyboard, so only a bot fills it in */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </label>
            </div>

            {status === "error" && (
              <p role="alert" className="wiz-failed">
                Your message could not be sent. Please try again in a moment.
              </p>
            )}
            <div className="wiz-actions">
              <button type="submit" className="wiz-next" disabled={status === "sending"}>
                <span>{status === "sending" ? "Sending..." : config.submitLabel(answers)}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>

      {step > 0 && (
        <button type="button" className="wiz-back" onClick={() => goTo(step - 1)}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back</span>
        </button>
      )}
    </div>
  );
}
