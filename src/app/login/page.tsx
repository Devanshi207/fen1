"use client";

import React, { useState } from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import InteractiveLiveDemoModal from "@/components/InteractiveLiveDemoModal";

export default function LoginPage() {
  const [email, setEmail] = useState("enterprise.lead@sapphireglazing.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoInitialTab, setDemoInitialTab] = useState("estimation");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoInitialTab("bi");
    setDemoOpen(true);
  };

  const quickDemoLogin = (tab: string) => {
    setDemoInitialTab(tab);
    setDemoOpen(true);
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden bg-[#F7FAFF] text-[#0B1530]">
      {/* Subtle background CAD grid */}
      <div className="absolute inset-0 bg-cad-grid opacity-25 pointer-events-none" />

      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl p-6 sm:p-8 font-mono shadow-xs relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1B4FD6] text-[#0B1530] mx-auto shadow-xs">
            <div className="w-4 h-4 border border-[#B8D4FB] rotate-45" />
          </div>
          <h2 className="text-xl font-normal text-[#0B1530] tracking-tight">
            Fen1 Enterprise Portal
          </h2>
          <p className="text-xs text-[#4A5B7A] font-sans">
            Secure single-sign-on access for engineering, plant & field teams.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#7686A6] uppercase text-[10px] block">Corporate Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7686A6] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[#7686A6] uppercase text-[10px] block">Password</label>
              <a href="#" className="text-[#1B4FD6] text-[10px] hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7686A6] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] placeholder:text-[#7686A6] focus:border-[#3B82F6] outline-none font-sans"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#4A5B7A] text-[11px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#0B1530]"
              />
              <span>Remember this terminal</span>
            </label>
            <span className="text-[10px] text-[#1B4FD6] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> TLS 1.3
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1B4FD6] text-[#0B1530] font-normal uppercase rounded-full hover:bg-[#BFD3F0] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
          >
            <span>Sign In to Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SSO Options */}
        <div className="pt-2 border-t border-[#D0DCF0] space-y-2">
          <button
            onClick={() => handleLogin({ preventDefault: () => {} } as any)}
            className="w-full py-2.5 bg-[#F7FAFF] border border-[#D0DCF0] text-[#0B1530] font-mono text-xs rounded-full hover:bg-[#D9E7FA] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#1B4FD6]" />
            <span>Sign in with Enterprise SSO (Okta / Azure)</span>
          </button>
        </div>

        {/* Quick Sandbox Role Access */}
        <div className="p-4 bg-[#F7FAFF] rounded-xl border border-[#D0DCF0] space-y-2.5 text-xs shadow-xs">
          <span className="text-[10px] text-[#7686A6] uppercase block text-center">
            Or Explore Live Sandbox Directly:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickDemoLogin("estimation")}
              className="p-2 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] hover:border-[#3B82F6] text-[#4A5B7A] hover:text-[#0B1530] transition-all text-center text-[10px] shadow-xs cursor-pointer"
            >
              Demo: Estimator
            </button>
            <button
              onClick={() => quickDemoLogin("crm")}
              className="p-2 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] hover:border-[#3B82F6] text-[#4A5B7A] hover:text-[#0B1530] transition-all text-center text-[10px] shadow-xs cursor-pointer"
            >
              Demo: Sales Director
            </button>
            <button
              onClick={() => quickDemoLogin("factory")}
              className="p-2 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] hover:border-[#3B82F6] text-[#4A5B7A] hover:text-[#0B1530] transition-all text-center text-[10px] shadow-xs cursor-pointer"
            >
              Demo: CNC Operations
            </button>
            <button
              onClick={() => quickDemoLogin("bi")}
              className="p-2 bg-[#FFFFFF] rounded-lg border border-[#D0DCF0] hover:border-[#3B82F6] text-[#4A5B7A] hover:text-[#0B1530] transition-all text-center text-[10px] shadow-xs cursor-pointer"
            >
              Demo: CEO Cockpit
            </button>
          </div>
        </div>
      </div>

      <InteractiveLiveDemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        initialTab={demoInitialTab}
      />
    </div>
  );
}
