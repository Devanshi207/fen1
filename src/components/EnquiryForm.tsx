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
  "w-full rounded-md border border-[#DCE6F5] bg-[#FFFFFF] px-3 py-1.5 text-[0.85rem] font-[400] leading-5 text-[#1E2B45] outline-none transition placeholder:text-[#6F7C93] focus:border-[#0067C0] focus:ring-4 focus:ring-[#0067C0]/15";
const LABEL = "mb-1 block text-[0.75rem] font-[500] text-[#55637A]";

function Choice({ field, value, set }: { field: FieldSpec; value: string; set: (v: string) => void }) {
  const id = useId();
  const [typing, setTyping] = useState(false);
  return (
    <div className="space-y-2">
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
            className={`${BOX} cursor-pointer appearance-none pr-8`}
          >
            {(field.options ?? []).map((o) => (
              <option key={o}>{o}</option>
            ))}
            {field.allowOther && <option>{OTHER}</option>}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-[70%] rotate-45 border-b-2 border-r-2 border-[#6F7C93]" />
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
        {!field.required && <span className="text-[#6F7C93]"> (optional)</span>}
      </label>
      {field.type === "area" ? (
        <textarea rows={3} {...common} onChange={(e) => onChange(e.target.value)} />
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
  const [trap, setTrap] = useState("");
  const set = (key: string) => (v: string) => setValues((cur) => ({ ...cur, [key]: v }));

  const send = async () => {
    setStatus("sending");
    // Only the fields on screen are sent: a field the visitor never saw (hidden when they changed their mind) must not
    // reach the team with its default value as if it were an answer.
    const shown = Object.fromEntries(fields.map((f) => [f.key, values[f.key] ?? ""]));
    const ok = await submitEnquiry(kind, shown as Parameters<typeof submitEnquiry>[1], trap);
    setStatus(ok ? "sent" : "error");
  };

  if (status === "sent") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-12 h-12 bg-[#0067C0] text-white rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-[#1E2B45]">{doneTitle}</h3>
        <p className="text-sm text-[#55637A] max-w-md mx-auto">{doneText}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-6 py-2.5 border border-[#0067C0] text-[#0067C0] text-sm font-semibold rounded-full hover:bg-[#FFFFFF] transition-colors"
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
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
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

      {/* a spam trap: hidden from people and from the keyboard, so only a bot fills it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-[#FBEAE8] border border-[#E8B9B4] text-[#A85E55] text-sm px-4 py-3">
          Your message could not be sent. Please try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-8 py-2.5 bg-[#0067C0] text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        <span>{status === "sending" ? "Sending..." : submitLabel}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
