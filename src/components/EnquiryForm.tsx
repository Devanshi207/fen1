"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import type { EnquiryKind } from "@/lib/enquiry";
import { cn } from "@/lib/utils";

export interface FieldSpec {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "area" | "choice";
  required?: boolean;
  options?: string[];
  allowOther?: boolean;
  otherLabel?: string;
  /** The question asked in the chat style (defaults to the label) */
  ask?: string;
  /** Sits beside its neighbour on wide screens */
  half?: boolean;
}

type Variant = "standard" | "dark" | "chat";
type Values = Record<string, string>;

const OTHER = "Other (type your own)";

// The look is picked from the address (?form=standard | dark | chat) so each can be reviewed on its own link.
const subscribe = () => () => {};
function useVariant(): Variant {
  const v = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get("form") ?? "", () => "");
  return v === "dark" || v === "chat" ? v : "standard";
}

const isValid = (f: FieldSpec, value: string) => {
  if (!f.required) return true;
  if (!value.trim()) return false;
  return f.type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) : true;
};

/* ----------------------------- boxed form (standard and dark) ----------------------------- */

function Choice({ field, value, set, dark }: { field: FieldSpec; value: string; set: (v: string) => void; dark: boolean }) {
  const id = useId();
  const options = field.options ?? [];
  const [typing, setTyping] = useState(false);
  const box = inputClass(dark);
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={id} className={labelClass(dark)}>
          {field.label}
        </label>
        <select
          id={id}
          value={typing ? OTHER : value}
          onChange={(e) => {
            if (e.target.value === OTHER) {
              setTyping(true);
              set("");
            } else {
              setTyping(false);
              set(e.target.value);
            }
          }}
          className={cn(box, "cursor-pointer [&>option]:text-[#0B1530]")}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
          {field.allowOther && <option>{OTHER}</option>}
        </select>
      </div>
      {typing && (
        <input
          aria-label={field.otherLabel ?? "Please specify"}
          placeholder={field.otherLabel ?? "Please specify"}
          required
          value={value}
          onChange={(e) => set(e.target.value)}
          className={box}
        />
      )}
    </div>
  );
}

const inputClass = (dark: boolean) =>
  cn(
    "w-full rounded-lg border px-4 py-3 text-base outline-none transition",
    dark
      ? "border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#5CC8FF] focus:ring-4 focus:ring-[#5CC8FF]/20"
      : "border-[#B0C0DD] bg-[#FFFFFF] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#1B4FD6] focus:ring-4 focus:ring-[#1B4FD6]/15"
  );
const labelClass = (dark: boolean) => cn("block text-sm font-semibold mb-1.5", dark ? "text-white/85" : "text-[#0B1530]");

function Boxed({ fields, values, set, dark }: { fields: FieldSpec[]; values: Values; set: (k: string) => (v: string) => void; dark: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
      {fields.map((f) => (
        <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
          {f.type === "choice" ? (
            <Choice field={f} value={values[f.key]} set={set(f.key)} dark={dark} />
          ) : (
            <BoxedField field={f} value={values[f.key]} onChange={set(f.key)} dark={dark} />
          )}
        </div>
      ))}
    </div>
  );
}

function BoxedField({ field, value, onChange, dark }: { field: FieldSpec; value: string; onChange: (v: string) => void; dark: boolean }) {
  const id = useId();
  const common = { id, required: field.required, value, className: inputClass(dark) };
  return (
    <>
      <label htmlFor={id} className={labelClass(dark)}>
        {field.label}
        {!field.required && <span className={dark ? "font-normal text-white/50" : "font-normal text-[#7686A6]"}> (optional)</span>}
      </label>
      {field.type === "area" ? (
        <textarea rows={3} {...common} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={field.type ?? "text"} {...common} onChange={(e) => onChange(e.target.value)} />
      )}
    </>
  );
}

/* ----------------------------------- chat style ----------------------------------- */

function Chat({ fields, values, set, onSend, sending }: { fields: FieldSpec[]; values: Values; set: (k: string) => (v: string) => void; onSend: () => void; sending: boolean }) {
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const current = fields[index];
  const done = index >= fields.length;

  const next = () => {
    setTyping(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-4" aria-live="polite">
      {fields.slice(0, index).map((f, i) => (
        <div key={f.key} className="space-y-2">
          <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#FFFFFF] border border-[#D0DCF0] px-4 py-2.5 text-sm text-[#0B1530]">{f.ask ?? `${f.label}?`}</p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setTyping(false);
                setIndex(i);
              }}
              title="Change this answer"
              className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#1B4FD6] px-4 py-2.5 text-left text-sm font-semibold text-white"
            >
              {values[f.key] || "Skipped"}
            </button>
          </div>
        </div>
      ))}

      {!done && current && (
        <div className="space-y-3">
          <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#FFFFFF] border border-[#D0DCF0] px-4 py-2.5 text-sm text-[#0B1530]">
            {current.ask ?? `${current.label}?`}
          </p>

          {current.type === "choice" && !typing ? (
            <div className="flex flex-wrap gap-2">
              {(current.options ?? []).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    set(current.key)(o);
                    next();
                  }}
                  className="rounded-full border border-[#1B4FD6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#1B4FD6] hover:bg-[#1B4FD6] hover:text-white transition-colors"
                >
                  {o}
                </button>
              ))}
              {current.allowOther && (
                <button
                  type="button"
                  onClick={() => {
                    set(current.key)("");
                    setTyping(true);
                  }}
                  className="rounded-full border border-dashed border-[#1B4FD6] px-4 py-2 text-sm text-[#1B4FD6]"
                >
                  Something else
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                key={current.key}
                autoFocus
                aria-label={current.label}
                type={current.type === "choice" || current.type === "area" ? "text" : (current.type ?? "text")}
                value={values[current.key]}
                placeholder="Type your answer"
                onChange={(e) => set(current.key)(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isValid(current, values[current.key])) next();
                  }
                }}
                className={cn(inputClass(false), "flex-1")}
              />
              <button
                type="button"
                disabled={!isValid(current, values[current.key])}
                onClick={next}
                aria-label="Next question"
                className="rounded-full bg-[#1B4FD6] px-5 text-white disabled:opacity-40"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {!current.required && (
            <button
              type="button"
              onClick={() => {
                set(current.key)("");
                next();
              }}
              className="text-xs font-semibold uppercase tracking-wider text-[#4A5B7A] underline"
            >
              Skip
            </button>
          )}
        </div>
      )}

      {done && (
        <div className="space-y-3 pt-2">
          <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#FFFFFF] border border-[#D0DCF0] px-4 py-2.5 text-sm text-[#0B1530]">
            That is everything. Tap an answer above to change it, or send it now.
          </p>
          <button
            type="button"
            onClick={onSend}
            disabled={sending}
            className="px-10 py-4 bg-[#1B4FD6] text-white font-semibold uppercase text-xs tracking-wider rounded-full flex items-center gap-2 disabled:opacity-60"
          >
            <span>{sending ? "Sending..." : "Send"}</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------- shell ------------------------------------- */

export default function EnquiryForm({
  kind,
  fields,
  initial,
  submitLabel,
  doneTitle,
  doneText,
}: {
  kind: EnquiryKind;
  fields: FieldSpec[];
  initial: Values;
  submitLabel: string;
  doneTitle: string;
  doneText: string;
}) {
  const variant = useVariant();
  const [values, setValues] = useState<Values>(initial);
  const [status, setStatus] = useState<SubmitState>("idle");
  const set = (key: string) => (v: string) => setValues((cur) => ({ ...cur, [key]: v }));

  const send = async () => {
    setStatus("sending");
    const ok = await submitEnquiry(kind, values as Parameters<typeof submitEnquiry>[1]);
    setStatus(ok ? "sent" : "error");
  };

  if (status === "sent") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-12 h-12 bg-[#1B4FD6] text-white rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-[#0B1530]">{doneTitle}</h3>
        <p className="text-sm text-[#4A5B7A] max-w-md mx-auto">{doneText}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-6 py-2.5 border border-[#1B4FD6] text-[#1B4FD6] text-sm font-semibold rounded-full hover:bg-[#FFFFFF] transition-colors"
        >
          Submit another
        </button>
      </div>
    );
  }

  const error = status === "error" && (
    <p role="alert" className="rounded-lg bg-[#FBEAE8] border border-[#E8B9B4] text-[#A85E55] text-sm px-4 py-3">
      Your message could not be sent. Please try again in a moment.
    </p>
  );

  if (variant === "chat") {
    return (
      <div className="space-y-4">
        <Chat fields={fields} values={values} set={set} onSend={send} sending={status === "sending"} />
        {error}
      </div>
    );
  }

  const dark = variant === "dark";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className={cn("space-y-6", dark && "rounded-2xl bg-[#0B1530] p-6 sm:p-9 shadow-2xl")}
    >
      <Boxed fields={fields} values={values} set={set} dark={dark} />
      {error}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-10 py-4 bg-[#1B4FD6] text-white font-semibold uppercase text-xs tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        <span>{status === "sending" ? "Sending..." : submitLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
