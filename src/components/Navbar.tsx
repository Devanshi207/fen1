"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Layers,
  Calculator,
  Scan,
  Compass,
  Building2,
  ShoppingCart,
  Boxes,
  Factory,
  Wrench,
  ShieldCheck,
  Truck,
  CreditCard,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  CheckSquare,
  Building,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "SOLUTIONS", href: "/solutions", type: "solutions" },
  { name: "ABOUT", href: "/about" },
  { name: "TRAINING", href: "/training" },
  { name: "CONTACT US", href: "/contact" },
];

const SOLUTIONS_ITEMS = [
  { num: "01", name: "Aluminium Windows & Doors", href: "/solutions#windows-doors", desc: "1D linear saw nesting & dealer pricing" },
  { num: "02", name: "Glass Processing & IGUs", href: "/solutions#glass", desc: "2D sheet optimization & A-frame stillages" },
  { num: "03", name: "Aluminium Fabrication", href: "/solutions#fabrication", desc: "Off-cut recovery vault (>90% reuse)" },
  { num: "04", name: "Glazing Contractors", href: "/solutions#contractors", desc: "Site survey audit & subcontractor snags" },
  { num: "05", name: "Dealer Networks", href: "/solutions#dealers", desc: "Instant retail quotes & factory order sync" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#F2F7FF]/95 backdrop-blur-md border-b border-[#D0DCF0] py-3 shadow-xs"
            : "bg-[#F2F7FF]/80 backdrop-blur-xs py-4 border-b border-[#D0DCF0]/60"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* FEN1 Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 bg-[#1B4FD6] rounded-sm flex items-center justify-center overflow-hidden shadow-xs">
              <div className="w-2.5 h-2.5 border border-[#B8D4FB] rotate-45 transition-transform group-hover:rotate-90 duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-[#0B1530] leading-none">
                FEN1
              </span>
              <span className="text-[9px] font-mono uppercase text-[#1B4FD6] tracking-widest mt-0.5">
                ERP
              </span>
            </div>
          </Link>

          {/* Desktop Architectural Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#E3EEFC] px-3 py-1.5 rounded-full border border-[#D0DCF0] shadow-xs">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              // Solutions Dropdown
              if (link.type === "solutions") {
                const isOpen = activeDropdown === "solutions";
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown("solutions")}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setActiveDropdown(null)}
                      className={cn(
                        "px-3.5 py-1 text-xs font-medium tracking-wide transition-all rounded-full flex items-center gap-1 cursor-pointer",
                        isActive || isOpen
                          ? "text-[#0B1530] bg-[#FFFFFF] shadow-xs border border-[#D0DCF0]"
                          : "text-[#4A5B7A] hover:text-[#0B1530]"
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")} />
                    </Link>

                    {/* Solutions Dropdown Menu */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-3 w-[460px] bg-[#FFFFFF] border border-[#D0DCF0] rounded-2xl shadow-xl p-5 z-50 grid grid-cols-2 gap-3 text-left font-sans"
                        >
                          <div className="col-span-2 pb-2 border-b border-[#D0DCF0] flex items-center justify-between text-[10px] text-[#1B4FD6] uppercase font-semibold">
                            <span>INDUSTRY SPECIALIZATIONS</span>
                            <span className="text-[#4A5B7A]">5 VERTICALS</span>
                          </div>

                          {SOLUTIONS_ITEMS.map((sol) => (
                            <Link
                              key={sol.num}
                              href={sol.href}
                              onClick={() => setActiveDropdown(null)}
                              className="group block p-2.5 rounded-xl hover:bg-[#E3EEFC] transition-colors border border-transparent hover:border-[#D0DCF0]"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-[#1B4FD6] font-semibold">{sol.num}</span>
                                <span className="text-xs font-semibold text-[#0B1530] group-hover:text-[#1B4FD6] transition-colors font-sans">
                                  {sol.name}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#4A5B7A] font-sans leading-tight mt-1">
                                {sol.desc}
                              </p>
                            </Link>
                          ))}

                          <div className="col-span-2 pt-2 border-t border-[#D0DCF0] flex items-center justify-between text-xs font-sans">
                            <Link
                              href="/solutions"
                              onClick={() => setActiveDropdown(null)}
                              className="text-[#0B1530] hover:text-[#1B4FD6] flex items-center gap-1 transition-colors font-semibold"
                            >
                              <span>View All Solutions Overview</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Standard Link
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-1 text-xs font-medium tracking-wide transition-all rounded-full relative",
                    isActive
                      ? "text-[#0B1530]"
                      : "text-[#4A5B7A] hover:text-[#0B1530]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 bg-[#FFFFFF] rounded-full -z-10 shadow-xs border border-[#D0DCF0]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/request-demo"
              className="px-4 py-2 rounded-full bg-[#1B4FD6] text-[#0B1530] text-xs font-medium tracking-wide transition-all duration-300 hover:bg-[#BFD3F0] shadow-xs flex items-center gap-1.5"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1B4FD6]" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#E3EEFC] border border-[#D0DCF0] text-[#0B1530] hover:bg-[#FFFFFF]"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Architectural Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#F2F7FF] pt-24 px-6 pb-8 overflow-y-auto flex flex-col justify-between font-mono"
          >
            <div className="space-y-6">
              <div className="border-b border-[#D0DCF0] pb-4">
                <span className="text-[10px] font-mono uppercase text-[#1B4FD6] tracking-widest font-bold">
                  OPERATING SYSTEM NAVIGATION
                </span>
                <h3 className="text-xl font-light text-[#0B1530] mt-1 font-sans">FEN1 ERP</h3>
              </div>

              <div className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-lg font-light text-[#0B1530] hover:text-[#1B4FD6] py-2 border-b border-[#D0DCF0]/60 font-sans"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Quick Mobile Solutions List */}
              <div className="pt-2">
                <span className="text-[10px] uppercase text-[#4A5B7A] tracking-wider block mb-2 font-bold">
                  SOLUTIONS VERTICALS
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link href="/solutions#windows-doors" className="p-2 bg-[#FFFFFF] border border-[#D0DCF0] rounded-md text-[#0B1530]">
                    Windows & Doors
                  </Link>
                  <Link href="/solutions#glass" className="p-2 bg-[#FFFFFF] border border-[#D0DCF0] rounded-md text-[#0B1530]">
                    Glass & IGUs
                  </Link>
                  
                  <Link href="/solutions#dealers" className="p-2 bg-[#FFFFFF] border border-[#D0DCF0] rounded-md text-[#0B1530]">
                    Dealers & Installers
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#D0DCF0] space-y-2">
              <Link
                href="/request-demo"
                className="w-full py-3 bg-[#1B4FD6] text-[#0B1530] font-bold text-xs uppercase tracking-wider text-center rounded-full block shadow-xs font-sans"
              >
                REQUEST A DEMO →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
