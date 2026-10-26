import Link from "next/link";
import { ArrowRight, Boxes, Building2, Factory, Layers, Users } from "lucide-react";
import { INDUSTRY_SOLUTIONS } from "@/data/solutions";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "windows-doors": Boxes,
  glass: Layers,
  fabrication: Factory,
  contractors: Building2,
  dealers: Users,
};

export default function AudienceCards() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 space-y-4">
          <span data-reveal="up" className="inline-block text-[11px] uppercase tracking-widest font-semibold text-[#1B4FD6]">
            Who it is for
          </span>
          <h2 data-reveal="up" data-delay="80" className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0B1530] tracking-tight leading-[1.1]">
            BUILT FOR EVERY PART OF THE TRADE.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRY_SOLUTIONS.map((s, i) => {
            const Icon = ICONS[s.id] ?? Boxes;
            return (
              <Link
                key={s.id}
                href={`/solutions#${s.id}`}
                data-reveal="up"
                data-delay={i * 80}
                className="glass-surface group rounded-3xl p-7 flex flex-col gap-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#1B4FD6] text-white">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#0B1530] tracking-tight">{s.title}</h3>
                  <p className="text-sm text-[#4A5B7A] leading-relaxed">{s.subtitle}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B4FD6]">
                  Discover more
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
