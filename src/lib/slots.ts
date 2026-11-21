/**
 * Demo slots: weekdays, at fixed times, from tomorrow for about two months. Dates are plain "YYYY-MM-DD" strings worked out in UTC,
 * so the page and the server always agree on what a date is. A slot is "YYYY-MM-DDTHH:MM". Change the times, the days ahead or the
 * time zone label here and the calendar, the server checks and the confirmation all follow.
 */
export const SLOT_TIMES = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
/** The time zone the times are in, said next to every time. */
export const SLOT_ZONE = "IST";
export const DAYS_AHEAD_FIRST = 1;
export const DAYS_AHEAD_LAST = 60;

const pad = (n: number) => String(n).padStart(2, "0");

export const dateKey = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const fromKey = (key: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return dateKey(d) === key ? d : null; // rejects 2027-02-31 and the like
};
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

/** The first and last date that can be booked, as of `now`. */
export function bookableRange(now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return { first: dateKey(addDays(today, DAYS_AHEAD_FIRST)), last: dateKey(addDays(today, DAYS_AHEAD_LAST)) };
}

/** Monday to Friday only. */
export function isWeekday(key: string) {
  const d = fromKey(key);
  return !!d && d.getUTCDay() >= 1 && d.getUTCDay() <= 5;
}

export function isBookableDate(key: string, now = new Date()) {
  const { first, last } = bookableRange(now);
  return !!fromKey(key) && key >= first && key <= last && isWeekday(key);
}

export const slotId = (date: string, time: string) => `${date}T${time}`;

export function parseSlot(id: unknown): { date: string; time: string } | null {
  if (typeof id !== "string") return null;
  const [date, time] = id.split("T");
  if (!date || !time || !SLOT_TIMES.includes(time) || !fromKey(date)) return null;
  return { date, time };
}

export function isBookableSlot(id: unknown, now = new Date()) {
  const slot = parseSlot(id);
  return !!slot && isBookableDate(slot.date, now);
}

/** "Tuesday 12 January 2027" */
export function formatDate(key: string) {
  const d = fromKey(key);
  if (!d) return key;
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", { ...o, timeZone: "UTC" });
  return `${part({ weekday: "long" })} ${d.getUTCDate()} ${part({ month: "long" })} ${d.getUTCFullYear()}`;
}

/** The weeks of a month, Monday first; each cell is a date key, or null outside the month. */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => dateKey(new Date(Date.UTC(year, month, i + 1))))];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

export const monthTitle = (year: number, month: number) => new Date(Date.UTC(year, month, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
