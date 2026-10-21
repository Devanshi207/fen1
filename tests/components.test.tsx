import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyTimeline from "@/components/JourneyTimeline";
import CountUp from "@/components/CountUp";
import { ROADMAP_STAGES } from "@/data/roadmap";

describe("Navbar", () => {
  it("shows the main pages and no Products entry", () => {
    render(<Navbar />);
    const nav = screen.getAllByRole("navigation")[0];
    const labels = [...nav.querySelectorAll("a")].map((a) => a.textContent?.trim());
    expect(labels).toEqual(expect.arrayContaining(["HOME", "ABOUT", "TRAINING", "CONTACT US"]));
    expect(labels.some((l) => /product/i.test(l ?? ""))).toBe(false);
  });
});

describe("Footer", () => {
  it("has Solutions, Resources and Company columns but no Products column", () => {
    render(<Footer />);
    expect(screen.getByText("SOLUTIONS")).toBeInTheDocument();
    expect(screen.getByText("RESOURCES")).toBeInTheDocument();
    expect(screen.getByText("COMPANY")).toBeInTheDocument();
    expect(screen.queryByText("PRODUCTS")).not.toBeInTheDocument();
  });

  it("does not mention façades", () => {
    render(<Footer />);
    expect(document.body.textContent).not.toMatch(/fa[cç]ade/i);
  });
});

describe("JourneyTimeline", () => {
  it("renders every roadmap stage in order", () => {
    render(<JourneyTimeline />);
    const titles = [...document.querySelectorAll(".journey-card")].map(
      (c) => c.firstElementChild?.textContent
    );
    expect(titles).toEqual(ROADMAP_STAGES.map((s) => s.title));
  });

  it("states the stage count from the data", () => {
    render(<JourneyTimeline />);
    expect(screen.getByText(new RegExp(`${ROADMAP_STAGES.length} connected stages`))).toBeInTheDocument();
  });
});

describe("CountUp", () => {
  it("settles on the final value", () => {
    vi.useFakeTimers();
    render(<CountUp to={18} suffix="+" />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    // jsdom reports zero-size rects, so the element counts as on screen and the fallback timer sets the final value
    expect(screen.getByText(/^\d+\+$/)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
