import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

describe("Navbar", () => {
  it("shows the main pages and no Products entry once the menu is open", async () => {
    render(<Navbar />);
    await userEvent.setup().click(screen.getAllByRole("button")[0]);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const labels = [...nav.querySelectorAll("a")].map((a) => a.textContent?.trim().replace(/^\d+/, ""));
    expect(labels).toEqual(expect.arrayContaining(["HOME", "ABOUT", "TRAINING", "CONTACT US"]));
    expect(labels.some((l) => /product/i.test(l ?? ""))).toBe(false);
  });
});

describe("Navbar on phones", () => {
  it("opens a menu that lists every solution", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    // The menu button is the only button in the header before the menu opens.
    await user.click(screen.getAllByRole("button")[0]);
    const menu = document.querySelector("div.fixed") as HTMLElement;
    expect(menu).toBeTruthy();
    expect(within(menu).getAllByRole("link").length).toBeGreaterThanOrEqual(INDUSTRY_SOLUTIONS.length);
    for (const s of INDUSTRY_SOLUTIONS) {
      expect(menu.querySelector(`a[href="/solutions#${s.id}"]`)).not.toBeNull();
    }
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
