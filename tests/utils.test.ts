import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });

  it("lets the later Tailwind utility win", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
