"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitEnquiry, type SubmitState } from "@/lib/submitEnquiry";
import type { EnquiryKind } from "@/lib/enquiry";

export interface FieldSpec {
  key: string;
  label: string;
  type?: "text" | "email" | "tel" | "area" | "choice";
  required?: boolean;
  options?: string[];
  allowOther?: boolean;
  otherLabel?: string;
  /** Sits beside its neighbour on wide screens */
  half?: boolean;
}

type Values = Record<string, string>;

const OTHER = "Other (type your own)";

// Weights are set explicitly (font-[400] / font-[500]) because the site's global scale lifts the named Tailwind weights.
const BOX =
  "w-full rounded-lg border border-[#C5D6F0] bg-[#FFFFFF] px-4 py-3 text-[0.95rem] font-[400] leading-6 text-[#0B1530] outline-none transition placeholder:text-[#7686A6] focus:border-[#1B4FD6] focus:ring-4 focus:ring-[#1B4FD6]/15";
const LABEL = "mb-1.5 block text-[0.85rem] font-[500] text-[#4A5B7A]";

function Choice({ field, value, set }: { field: FieldSpec; value: string; set: (v: string) => void }) {
  const id = useId();
  const [typing, setTyping] = useState(false);
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={id} className={LABEL}>
          {field.label}
        </label>
        <div className="relative">
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
            className={`${BOX} cursor-pointer appearance-none pr-10`}
          >
            {(field.options ?? []).map((o) => (
              <option key={o}>{o}</option>
            ))}
            {field.allowOther && <option>{OTHER}</option>}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-[70%] rotate-45 border-b-2 border-r-2 border-[#7686A6]" />
        </div>
      </div>
      {typing && (
        <input
          aria-label={field.otherLabel ?? "Please specify"}
          placeholder={field.otherLabel ?? "Please specify"}
          required
          value={value}
          onChange={(e) => set(e.target.value)}
          className={BOX}
        />
      )}
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldSpec; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const common = { id, required: field.required, value, className: BOX };
  return (
    <>
      <label htmlFor={id} className={LABEL}>
        {field.label}
        {!field.required && <span className="text-[#7686A6]"> (optional)</span>}
      </label>
      {field.type === "area" ? (
        <textarea rows={4} {...common} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type={field.type ?? "text"} {...common} onChange={(e) => onChange(e.target.value)} />
      )}
    </>
  );
}

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
        {fields.map((f) => (
          <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
            {f.type === "choice" ? (
              <Choice field={f} value={values[f.key]} set={set(f.key)} />
            ) : (
              <Field field={f} value={values[f.key]} onChange={set(f.key)} />
            )}
          </div>
        ))}
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-[#FBEAE8] border border-[#E8B9B4] text-[#A85E55] text-sm px-4 py-3">
          Your message could not be sent. Please try again in a moment.
        </p>
      )}

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
