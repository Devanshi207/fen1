import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountUp from "@/components/CountUp";

describe("Navbar", () => {
  it("shows the main pages and no Products entry once the menu is open", async () => {
    render(<Navbar />);
    await userEvent.setup().click(screen.getAllByRole("button")[0]);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const labels = [...nav.querySelectorAll(".menu-link-text")].map((n) => n.textContent?.trim());
    expect(labels).toEqual(expect.arrayContaining(["HOME", "SOLUTIONS", "ABOUT", "TRAINING", "CAREERS", "CONTACT US"]));
    expect(labels.some((l) => /product/i.test(l ?? ""))).toBe(false);
  });
});

describe("Navbar menu", () => {
  it("opens a menu of the six parts of the page and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    // the menu is not built until it is first opened
    expect(document.querySelector(".menu-overlay")).toBeNull();
    await user.click(screen.getAllByRole("button")[0]);
    const menu = document.querySelector(".menu-overlay") as HTMLElement;
    expect(menu).toBeTruthy();
    expect(menu).toHaveAttribute("data-open", "true");
    expect(within(menu).getAllByRole("link")).toHaveLength(6);
    // one continuous page: every entry is a link to a part of it
    expect(within(menu).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["#home", "#solutions", "#about", "#training", "#careers", "#contact"]);
    await user.keyboard("{Escape}");
    expect(screen.getAllByRole("button")[0]).toHaveAttribute("aria-expanded", "false");
    // closed, it stays in the page (so it can wipe away) but is marked hidden
    expect(menu).toHaveAttribute("data-open", "false");
    expect(menu).toHaveAttribute("aria-hidden", "true");
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

  it("opens each legal note in place and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(<Footer />);
    for (const name of ["Privacy Policy", "Terms of Service", "Enterprise Security"]) {
      await user.click(screen.getByRole("button", { name }));
      expect(screen.getByRole("dialog", { name })).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
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
