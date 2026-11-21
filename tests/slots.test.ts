import { describe, expect, it } from "vitest";
import { DAYS_AHEAD_LAST, SLOT_TIMES, bookableRange, formatDate, isBookableDate, isBookableSlot, isWeekday, monthGrid, parseSlot, slotId } from "@/lib/slots";

// Friday 8 January 2027, 09:00 UTC
const NOW = new Date(Date.UTC(2027, 0, 8, 9, 0));

describe("slot rules", () => {
  it("opens from tomorrow and closes about two months ahead", () => {
    expect(bookableRange(NOW)).toEqual({ first: "2027-01-09", last: "2027-03-09" });
    expect(DAYS_AHEAD_LAST).toBe(60);
  });

  it("allows weekdays only: Saturday and Sunday are off, Monday is on", () => {
    expect(isWeekday("2027-01-09")).toBe(false); // Saturday
    expect(isWeekday("2027-01-10")).toBe(false); // Sunday
    expect(isWeekday("2027-01-11")).toBe(true); // Monday
    expect(isBookableDate("2027-01-09", NOW)).toBe(false);
    expect(isBookableDate("2027-01-11", NOW)).toBe(true);
  });

  it("refuses today, the past, dates beyond the window and dates that do not exist", () => {
    expect(isBookableDate("2027-01-08", NOW)).toBe(false);
    expect(isBookableDate("2026-12-30", NOW)).toBe(false);
    expect(isBookableDate("2027-03-10", NOW)).toBe(false);
    expect(isBookableDate("2027-02-31", NOW)).toBe(false);
    expect(isBookableDate("tomorrow", NOW)).toBe(false);
  });

  it("builds a slot from a day and one of the fixed times, and reads it back", () => {
    const id = slotId("2027-01-12", SLOT_TIMES[0]);
    expect(id).toBe("2027-01-12T10:00");
    expect(parseSlot(id)).toEqual({ date: "2027-01-12", time: "10:00" });
    expect(isBookableSlot(id, NOW)).toBe(true);
    expect(isBookableSlot("2027-01-12T13:30", NOW)).toBe(false); // not one of the times
    expect(isBookableSlot("2027-01-16T10:00", NOW)).toBe(false); // a Saturday
    expect(isBookableSlot(42, NOW)).toBe(false);
  });

  it("writes a date in words, and lays a month out Monday first", () => {
    expect(formatDate("2027-01-12")).toBe("Tuesday 12 January 2027");
    const weeks = monthGrid(2027, 0);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0].indexOf("2027-01-01")).toBe(4); // 1 January 2027 is a Friday
    expect(weeks.flat().filter(Boolean)).toHaveLength(31);
  });
});
