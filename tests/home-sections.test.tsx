import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import AudienceCards from "@/components/AudienceCards";
import QuotationSpotlight from "@/components/QuotationSpotlight";
import FaqSection from "@/components/FaqSection";
import { FAQ } from "@/data/faq";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";
import { money, priceQuote } from "@/lib/quote";

describe("priceQuote", () => {
  it("computes line totals, discount and total from the lines", () => {
    const q = priceQuote(
      [
        { item: "A", size: "1x1", qty: 2, unit: 100 },
        { item: "B", size: "1x1", qty: 1, unit: 50.5 },
      ],
      0.1
    );
    expect(q.lines.map((l) => l.total)).toEqual([200, 50.5]);
    expect(q.subtotal).toBe(250.5);
    expect(q.discount).toBe(25.05);
    expect(q.total).toBeCloseTo(225.45, 2);
  });

  it("formats money with two decimals", () => {
    expect(money(1234.5)).toBe("1,234.50");
  });
});

describe("AudienceCards", () => {
  it("links every industry solution to its card on the Solutions page", () => {
    render(<AudienceCards />);
    for (const s of INDUSTRY_SOLUTIONS) {
      const link = screen.getByRole("link", { name: new RegExp(s.title) });
      expect(link).toHaveAttribute("href", `/solutions#${s.id}`);
    }
  });
});

describe("QuotationSpotlight", () => {
  it("shows a sample quotation whose total matches its lines", () => {
    render(<QuotationSpotlight />);
    const sheet = screen.getByRole("img", { name: /quotation with sample data/i });
    // 4x420 + 6x310 + 1x980 + 2x560 = 5,640.00; 5% discount = 282.00; total 5,358.00
    expect(within(sheet).getByText("5,640.00")).toBeInTheDocument();
    expect(within(sheet).getByText("−282.00")).toBeInTheDocument();
    expect(within(sheet).getByText("5,358.00")).toBeInTheDocument();
    expect(within(sheet).getByText(/sample data/i)).toBeInTheDocument();
  });
});

describe("FaqSection", () => {
  it("renders every question as an accessible disclosure with its answer", () => {
    render(<FaqSection />);
    expect(document.querySelectorAll("details")).toHaveLength(FAQ.length);
    for (const item of FAQ) {
      expect(screen.getByText(item.q)).toBeInTheDocument();
      expect(screen.getByText(item.a)).toBeInTheDocument();
    }
  });

  it("only answers with what the site already states (no region-specific or removed terms)", () => {
    const all = JSON.stringify(FAQ);
    expect(all).not.toMatch(/fa[cç]ade|GST|indent/i);
  });
});
