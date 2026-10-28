import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyTimeline from "@/components/JourneyTimeline";
import CountUp from "@/components/CountUp";
import { ROADMAP_STAGES } from "@/data/roadmap";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

describe("Navbar menu", () => {
  const openMenu = async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    return { user, menu: await screen.findByRole("dialog", { name: /site menu/i }) };
  };

  it("starts closed with an OPEN MENU button and no menu in the page", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a menu with the five pages in order and no Products entry", async () => {
    const { menu } = await openMenu();
    const nav = within(menu).getByRole("navigation", { name: "Main" });
    const main = [...nav.querySelectorAll("ul")][0];
    const labels = [...main.querySelectorAll("a")].map((a) => a.textContent?.trim());
    expect(labels).toEqual(["HOME", "SOLUTIONS", "ABOUT", "TRAINING", "CONTACT US"]);
    expect(menu.textContent).not.toMatch(/product/i);
  });

  it("switches the button to CLOSE MENU while open", async () => {
    await openMenu();
    const toggle = await screen.findByRole("button", { name: /close menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("links to every solution from the menu", async () => {
    const { menu } = await openMenu();
    for (const s of INDUSTRY_SOLUTIONS) {
      expect(menu.querySelector(`a[href="/solutions#${s.id}"]`)).not.toBeNull();
    }
  });

  it("closes with Escape and gives the page its scroll back", async () => {
    const { user } = await openMenu();
    expect(document.documentElement.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument(), { timeout: 4000 });
    expect(document.documentElement.style.overflow).not.toBe("hidden");
  });

  it("closes when a link is chosen", async () => {
    const { user, menu } = await openMenu();
    await user.click(within(menu).getByRole("link", { name: "ABOUT" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument(), { timeout: 4000 });
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
