import Link from "next/link";
import { ArrowRight, CheckCircle2, Gauge, Recycle, Ruler } from "lucide-react";
import { money, priceQuote, type QuoteLine } from "@/lib/quote";

const SAMPLE_LINES: QuoteLine[] = [
  { item: "Sliding window, 2-track", size: "1800 × 1200", qty: 4, unit: 420 },
  { item: "Casement window, top-hung", size: "900 × 1500", qty: 6, unit: 310 },
  { item: "Glazed entrance door", size: "1000 × 2100", qty: 1, unit: 980 },
  { item: "Fixed glass panel, toughened", size: "1200 × 2400", qty: 2, unit: 560 },
];

const BENEFITS = [
  { Icon: Gauge, title: "Faster quotations", text: "Price straight from the drawing or survey instead of rebuilding the job in a spreadsheet." },
  { Icon: Ruler, title: "Consistent calculations", text: "Every quote uses the same sizes, rules and margins, whoever prepares it." },
  { Icon: Recycle, title: "Less material waste", text: "Profile and glass are nested before you buy, so the quote reflects real usage." },
];

const FEATURES = [
  "Pricing from the actual opening sizes",
  "Margins and discounts set by rule",
  "Several options on one quotation",
  "Client-ready PDF export",
  "Dealer quotation portal",
  "Quote becomes the order, nothing re-typed",
];

export default function QuotationSpotlight() {
  const quote = priceQuote(SAMPLE_LINES, 0.05);

  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <span data-reveal="up" className="inline-block text-[11px] uppercase tracking-widest font-semibold text-[#1B4FD6]">
              Quotation
            </span>
            <h2 data-reveal="up" data-delay="80" className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
              QUOTE FROM THE ACTUAL OPENING SIZES.
            </h2>
            <p data-reveal="up" data-delay="160" className="text-sm sm:text-base text-[#4A5B7A] leading-relaxed max-w-xl">
              FEN1 turns a drawing or a site survey into a priced quotation, and the same record carries on into the order.
            </p>
          </div>

          <ul className="space-y-5">
            {BENEFITS.map(({ Icon, title, text }, i) => (
              <li key={title} data-reveal="up" data-delay={i * 90} className="flex gap-4">
                <span className="grid place-items-center shrink-0 w-11 h-11 rounded-2xl bg-[#1B4FD6] text-white">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-[#0B1530]">{title}</h3>
                  <p className="text-sm text-[#4A5B7A] leading-relaxed mt-0.5">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <ul data-reveal="up" className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#0B1530]">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#4F7556]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/request-demo"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4FD6]"
          >
            See a quotation in a demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Sample quotation sheet */}
        <div className="lg:col-span-6" data-reveal="zoom" data-delay="120" role="img" aria-label="Illustration of a quotation with sample data">
          <div className="glass-surface rounded-[28px] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#D0DCF0]/70">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-semibold text-[#1B4FD6]">Quotation</div>
                <div className="text-base font-semibold text-[#0B1530]">Q-0001 · Apartment block, level 3</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7686A6]">Sample data</span>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_7rem_3rem_5.5rem_6rem] gap-x-3 gap-y-3 text-sm items-baseline">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#7686A6]">Item</div>
                <div className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-[#7686A6]">Size (mm)</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#7686A6] text-right">Qty</div>
                <div className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-[#7686A6] text-right">Unit</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-[#7686A6] text-right">Total</div>

                {quote.lines.map((l) => (
                  <div key={l.item} className="contents">
                    <div className="text-[#0B1530] font-medium leading-snug">{l.item}</div>
                    <div className="hidden sm:block text-[#4A5B7A] tabular-nums">{l.size}</div>
                    <div className="text-right text-[#4A5B7A] tabular-nums">{l.qty}</div>
                    <div className="hidden sm:block text-right text-[#4A5B7A] tabular-nums">{money(l.unit)}</div>
                    <div className="text-right text-[#0B1530] font-semibold tabular-nums">{money(l.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-[#D0DCF0]/70 space-y-2 text-sm">
              <div className="flex justify-between text-[#4A5B7A]">
                <span>Subtotal</span>
                <span className="tabular-nums">{money(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#4A5B7A]">
                <span>Discount (5%)</span>
                <span className="tabular-nums">−{money(quote.discount)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="font-semibold text-[#0B1530]">Total, USD</span>
                <span className="font-display text-2xl text-[#0B1530] tabular-nums">{money(quote.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
