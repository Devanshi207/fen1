"use client";

import { useId, useState } from "react";
import type React from "react";

/**
 * Form fields shared by the contact and demo forms: a plain line with the label sitting on it, which lifts out of the
 * way once there is something to read. No boxes, no filled backgrounds.
 */
const LINE =
  "peer block w-full bg-transparent border-0 border-b border-[#B0C0DD] px-0 pt-6 pb-2 text-base text-[#0B1530] outline-none transition-colors focus:border-[#1B4FD6] focus:border-b-2";
const LABEL =
  "pointer-events-none absolute left-0 top-2 origin-left text-[0.8rem] font-semibold text-[#4A5B7A] transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-[0.8rem] peer-focus:font-semibold peer-focus:text-[#1B4FD6]";

interface BaseProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function TextField({ label, value, onChange, required, type = "text" }: BaseProps & { type?: string }) {
  const id = useId();
  return (
    <div className="relative">
      <input id={id} type={type} required={required} value={value} placeholder=" " onChange={(e) => onChange(e.target.value)} className={LINE} />
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
    </div>
  );
}

export function TextAreaField({ label, value, onChange, required, rows = 3 }: BaseProps & { rows?: number }) {
  const id = useId();
  return (
    <div className="relative">
      <textarea id={id} rows={rows} required={required} value={value} placeholder=" " onChange={(e) => onChange(e.target.value)} className={`${LINE} resize-none`} />
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
    </div>
  );
}

const OTHER = "Other (type your own)";

/**
 * A choice list that also accepts a typed answer: pick "Other" and a text line appears. `value` is always the final
 * answer (the picked option, or whatever was typed), so the caller never needs to know which it was.
 */
export function ChoiceField({
  label,
  options,
  value,
  onChange,
  otherLabel = "Please specify",
  allowOther = true,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  otherLabel?: string;
  allowOther?: boolean;
}) {
  const id = useId();
  const [typing, setTyping] = useState(allowOther && !options.includes(value) && value !== "");

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          id={id}
          value={typing ? OTHER : value}
          onChange={(e) => {
            if (e.target.value === OTHER) {
              setTyping(true);
              onChange("");
            } else {
              setTyping(false);
              onChange(e.target.value);
            }
          }}
          className={`${LINE} appearance-none pr-6 cursor-pointer`}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
          {allowOther && <option>{OTHER}</option>}
        </select>
        <label htmlFor={id} className="pointer-events-none absolute left-0 top-2 text-[0.8rem] font-semibold text-[#4A5B7A]">
          {label}
        </label>
        <span aria-hidden="true" className="pointer-events-none absolute right-1 bottom-3.5 h-2 w-2 rotate-45 border-b-2 border-r-2 border-[#4A5B7A]" />
      </div>
      {typing && <TextField label={otherLabel} value={value} onChange={onChange} required />}
    </div>
  );
}

/* Inline fields for the sentence-style form: they sit in the line of text and grow with what is typed. */
const BLANK =
  "sentence-blank inline-block align-baseline bg-transparent border-0 border-b-2 border-dashed border-[#9CC3F7] px-1 text-[#1B4FD6] placeholder:text-[#B0C0DD] placeholder:font-normal outline-none transition-colors focus:border-solid focus:border-[#1B4FD6] focus:bg-[#E3EEFC] rounded-t";

export function Blank({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
  wide,
}: BaseProps & { placeholder: string; type?: string; wide?: boolean }) {
  return (
    <input
      aria-label={label}
      type={type}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${BLANK} ${wide ? "min-w-[9ch]" : "min-w-[7ch]"} max-w-full`}
      style={{ fieldSizing: "content" } as React.CSSProperties}
    />
  );
}

/** A choice inside the sentence. "Something else" turns it into a blank to type in. */
export function Pick({
  label,
  options,
  value,
  onChange,
  otherLabel,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  otherLabel: string;
}) {
  const [typing, setTyping] = useState(false);
  if (typing) {
    return (
      <>
        <Blank label={otherLabel} placeholder="your business" required value={value} onChange={onChange} wide />
        <button
          type="button"
          onClick={() => {
            setTyping(false);
            onChange(options[0]);
          }}
          className="ml-1 align-baseline text-xs font-semibold uppercase tracking-wider text-[#4A5B7A] underline"
        >
          pick from list
        </button>
      </>
    );
  }
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => {
        if (e.target.value === OTHER) {
          setTyping(true);
          onChange("");
        } else onChange(e.target.value);
      }}
      className={`${BLANK} cursor-pointer max-w-full`}
      style={{ fieldSizing: "content" } as React.CSSProperties}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
      <option>{OTHER}</option>
    </select>
  );
}
