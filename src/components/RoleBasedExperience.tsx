"use client";

import React, { useState } from "react";
import {
  Users,
  Calculator,
  Factory,
  Wrench,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { ROLES_DATA, RoleInfo } from "@/lib/data";
import { cn } from "@/lib/utils";

const ROLE_ICONS: { [key: string]: React.ElementType } = {
  ceo: TrendingUp,
  estimator: Calculator,
  "production-manager": Factory,
  "site-engineer": Wrench,
};

export default function RoleBasedExperience() {
  const [selectedRole, setSelectedRole] = useState<RoleInfo>(ROLES_DATA[0]);

  const IconComponent = ROLE_ICONS[selectedRole.id] || Users;

  return (
    <section className="py-20 bg-[#D9E7FA] text-[#4A5B7A] relative overflow-hidden border-b border-[#D0DCF0]">
      <div className="absolute inset-0 bg-cad-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono uppercase text-[#1B4FD6] tracking-widest block">
            Tailored Command Centers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#0B1530] tracking-tight">
            Fen1 Adapts to Every Role
          </h2>
          <p className="text-sm sm:text-base text-[#4A5B7A] font-sans">
            From managing multi-million dollar tower tenders in the boardroom to laser-scanning unitized brackets on the 40th floor.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {ROLES_DATA.map((role) => {
            const isSelected = selectedRole.id === role.id;
            const RoleIcon = ROLE_ICONS[role.id] || Users;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 flex items-center gap-2 border cursor-pointer",
                  isSelected
                    ? "bg-[#1B4FD6] border-[#3B82F6] text-[#0B1530] shadow-xs font-normal"
                    : "bg-[#FFFFFF] border-[#D0DCF0] text-[#4A5B7A] hover:border-[#3B82F6] hover:text-[#0B1530]"
                )}
              >
                <RoleIcon className={cn("w-3.5 h-3.5", isSelected ? "text-[#1B4FD6]" : "text-[#4A5B7A]")} />
                <span>{role.role}</span>
              </button>
            );
          })}
        </div>

        {/* Role Dashboard Cockpit Display */}
        <div className="bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-10 shadow-xs relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Persona & Testimonial */}
            <div className="lg:col-span-5 space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-mono uppercase text-[#1B4FD6]">
                  {selectedRole.persona}
                </span>
                <h3 className="text-xl font-normal text-[#0B1530] tracking-tight">
                  {selectedRole.headline}
                </h3>
              </div>

              <blockquote className="p-4 rounded-xl bg-[#F7FAFF] border-l-2 border-[#B8D4FB] border-y border-r border-[#D0DCF0] text-xs sm:text-sm text-[#0B1530] italic leading-relaxed font-sans shadow-xs">
                &ldquo;{selectedRole.quote}&rdquo;
              </blockquote>

              <div className="space-y-2 font-mono text-xs">
                <span className="text-[10px] text-[#7686A6] uppercase tracking-widest block">
                  Key Daily Actions
                </span>
                {selectedRole.primaryActions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-[#F7FAFF] rounded-lg border border-[#D0DCF0] text-[#0B1530]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4FD6] shrink-0" />
                    <span className="truncate">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Custom Role Command Cockpit */}
            <div className="lg:col-span-7 bg-[#F7FAFF] border border-[#D0DCF0] rounded-xl p-5 sm:p-6 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D0DCF0]">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-3.5 h-3.5 text-[#1B4FD6]" />
                  <span className="text-xs text-[#0B1530] uppercase">{selectedRole.role} Cockpit</span>
                </div>
                <span className="text-[10px] text-[#0B1530] bg-[#D9E7FA] px-2 py-0.5 rounded-full border border-[#D0DCF0]">
                  LIVE WORKSPACE
                </span>
              </div>

              {/* Role KPIs */}
              <div className="grid grid-cols-3 gap-3">
                {selectedRole.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-3 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] shadow-xs">
                    <span className="text-[10px] text-[#7686A6] uppercase block truncate">
                      {kpi.label}
                    </span>
                    <span className="text-base font-normal text-[#0B1530] mt-1 block">
                      {kpi.value}
                    </span>
                    <span className="text-[10px] text-[#1B4FD6] block mt-0.5">
                      {kpi.trend}
                    </span>
                  </div>
                ))}
              </div>

              {/* Live Role Dashboard Widgets */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#7686A6] uppercase tracking-widest block">
                  Active Mission-Critical Feeds
                </span>
                {selectedRole.dashboardWidgets.map((widget, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] flex items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div>
                      <div className="text-xs text-[#0B1530]">{widget.title}</div>
                      <div className="text-[11px] text-[#7686A6] font-sans">{widget.subtitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#0B1530] font-medium">{widget.metric}</div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#D9E7FA] text-[#4A5B7A] uppercase">
                        {widget.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
