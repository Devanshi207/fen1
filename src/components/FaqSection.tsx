import Link from "next/link";
import { Plus } from "lucide-react";
import { FAQ } from "@/data/faq";

export default function FaqSection() {
  return (
    <section className="section-pad">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <span data-reveal="up" className="inline-block text-[11px] uppercase tracking-widest font-semibold text-[#1B4FD6]">
            Questions
          </span>
          <h2 data-reveal="up" data-delay="80" className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
            WHAT FABRICATORS ASK FIRST.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <details
              key={item.q}
              data-reveal="up"
              data-delay={i * 60}
              className="faq-item glass-surface group rounded-2xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-semibold text-[#0B1530] [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <Plus className="w-5 h-5 shrink-0 text-[#1B4FD6] transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="px-6 pb-6 -mt-1 text-sm sm:text-base text-[#4A5B7A] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="text-center mt-10 text-sm text-[#4A5B7A]">
          Something else?{" "}
          <Link href="/contact" className="font-semibold text-[#1B4FD6] underline underline-offset-4">
            Get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
