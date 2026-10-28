"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "SOLUTIONS", href: "/solutions" },
  { name: "ABOUT", href: "/about" },
  { name: "TRAINING", href: "/training" },
  { name: "CONTACT US", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--read", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the menu; the page behind does not scroll while it is open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      delete document.documentElement.dataset.menu;
    };
  }, [mobileOpen]);

  // Close menus when the route changes (adjusting state during render, as React recommends)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#F2F7FF] border-b border-[#D0DCF0] py-3"
            : "bg-[#F2F7FF] py-4 border-b border-[#D0DCF0]"
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

          {/* Right Action CTAs */}
          <div className="hidden sm:flex ml-auto items-center gap-2.5">
            <Link
              href="/request-demo"
              className="px-4 py-2 rounded-full bg-[#1B4FD6] text-[#0B1530] text-xs font-medium tracking-wide transition-all duration-300 hover:bg-[#BFD3F0] shadow-xs flex items-center gap-1.5"
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1B4FD6]" />
            </Link>
          </div>

          {/* Menu button: three lines that fold into a cross */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="menu-toggle ml-auto sm:ml-3 flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-full bg-[#E3EEFC] border border-[#D0DCF0] text-[#0B1530] hover:bg-[#FFFFFF] transition-colors"
            aria-label="Toggle Navigation"
            aria-expanded={mobileOpen}
            data-open={mobileOpen}
          >
            <span className="hidden sm:block text-xs font-semibold tracking-wide">{mobileOpen ? "CLOSE" : "MENU"}</span>
            <span className="menu-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#F2F7FF] pt-24 px-6 sm:px-10 pb-8 overflow-y-auto flex flex-col justify-center font-sans"
          >
            <nav aria-label="Main" className="max-w-3xl w-full mx-auto">
              <ul className="menu-links" onMouseLeave={() => setHovered(null)}>
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    data-dim={hovered !== null && hovered !== link.name}
                  >
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHovered(link.name)}
                      onFocus={() => setHovered(link.name)}
                      className="flex items-baseline gap-4 py-2 sm:py-3 border-b border-[#D0DCF0] group"
                    >
                      <span className="text-xs font-semibold text-[#1B4FD6] tabular-nums">0{i + 1}</span>
                      <span data-current={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))} className="menu-link-text text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0B1530]">
                        {link.name}
                      </span>
                      <ArrowRight className="ml-auto self-center w-6 h-6 text-[#1B4FD6] -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

            </nav>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
