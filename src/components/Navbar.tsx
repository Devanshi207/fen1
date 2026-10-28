"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "HOME", href: "/" },
  { name: "SOLUTIONS", href: "/solutions" },
  { name: "ABOUT", href: "/about" },
  { name: "TRAINING", href: "/training" },
  { name: "CONTACT US", href: "/contact" },
];

const SOLUTIONS_ITEMS = [
  { name: "Aluminium Windows & Doors", href: "/solutions#windows-doors" },
  { name: "Glass Processing & IGUs", href: "/solutions#glass" },
  { name: "Aluminium Fabrication", href: "/solutions#fabrication" },
  { name: "Glazing Contractors", href: "/solutions#contractors" },
  { name: "Dealer Networks", href: "/solutions#dealers" },
];

// Fast start, slow finish: the panel wipes across and the lines draw in with the same curve.
const EASE = [0.77, 0, 0.18, 1] as const;

const ROW_STEP = 0.09;
const ROWS_START = 0.35;

const list: Variants = {
  hidden: {},
  show: { transition: { delayChildren: ROWS_START, staggerChildren: ROW_STEP } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

// People who prefer reduced motion keep the wipe, the fades and the drawn lines, but nothing slides vertically.
const rowVariants = (travel: number): Variants => ({
  hidden: { opacity: 0, y: travel },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -travel / 2, transition: { duration: 0.25 } },
});

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
  exit: { scaleX: 0, transition: { duration: 0.3 } },
};

// The block under the list arrives after the last menu row.
const tailVariants = (travel: number): Variants => ({
  hidden: { opacity: 0, y: travel },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: ROWS_START + NAV_LINKS.length * ROW_STEP + 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
});

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const row = rowVariants(reduce ? 0 : 28);
  const tail = tailVariants(reduce ? 0 : 20);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the menu when the route changes (adjusting state during render, as React recommends)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);

  // While open: lock page scroll, close on Escape, keep keyboard focus inside the menu, hand focus back on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const toggle = toggleRef.current;
    const focusTimer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus(), 120);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggle, ...(panelRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])].filter(
        (el): el is HTMLElement => !!el
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      toggle?.focus({ preventScroll: true });
    };
  }, [open, close]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <MotionConfig reducedMotion="never">
      <header
        data-menu-open={open}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#F2F7FF]/95 backdrop-blur-md border-b border-[#D0DCF0] py-3 shadow-xs"
            : "bg-[#F2F7FF]/80 backdrop-blur-xs py-4 border-b border-[#D0DCF0]/60"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* FEN1 Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" onClick={close}>
            <div
              className={cn(
                "relative w-7 h-7 rounded-sm flex items-center justify-center overflow-hidden shadow-xs transition-colors duration-500",
                open ? "bg-white" : "bg-[#1B4FD6]"
              )}
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 border rotate-45 transition-all group-hover:rotate-90 duration-500",
                  open ? "border-[#1B4FD6]" : "border-[#B8D4FB]"
                )}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-base font-semibold tracking-tight leading-none transition-colors duration-500",
                  open ? "text-white" : "text-[#0B1530]"
                )}
              >
                FEN1
              </span>
              <span
                className={cn(
                  "text-[9px] uppercase tracking-widest mt-0.5 transition-colors duration-500",
                  open ? "text-white/80" : "text-[#1B4FD6]"
                )}
              >
                ERP
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-5 sm:gap-6">
            <Link
              href="/request-demo"
              tabIndex={open ? -1 : 0}
              className={cn(
                "hidden sm:flex px-4 py-2 rounded-full bg-[#1B4FD6] text-white text-xs font-medium tracking-wide shadow-xs items-center gap-1.5 transition-opacity duration-300",
                open && "opacity-0 pointer-events-none"
              )}
            >
              <span>GET IN TOUCH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={cn(
                "nav-toggle relative overflow-hidden px-1 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-500",
                open ? "text-white" : "text-[#0B1530]"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  className="block"
                  initial={{ y: reduce ? 0 : 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduce ? 0 : -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? "CLOSE MENU" : "OPEN MENU"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu: the panel wipes in from the right, then rows and their lines draw in one after another */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.7, ease: EASE } }}
            exit={{ clipPath: "inset(0% 0% 0% 100%)", transition: { duration: 0.6, ease: EASE, delay: 0.3 } }}
            className="fixed top-0 left-0 w-full h-dvh z-40 overflow-y-auto bg-gradient-to-br from-[#1B4FD6] via-[#1741BC] to-[#102F9E] text-white"
          >
            <nav aria-label="Main" className="max-w-7xl mx-auto min-h-full px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex flex-col">
              <motion.ul variants={list} initial="hidden" animate="show" exit="exit" className="ml-auto w-full max-w-xl">
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.href} variants={row} className="overflow-hidden">
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "group block py-3 sm:py-4 text-right font-display text-3xl sm:text-4xl uppercase tracking-tight transition-all duration-300 hover:-translate-x-2",
                        isActive(link.href) ? "text-white" : "text-white/75 hover:text-white"
                      )}
                    >
                      {link.name}
                    </Link>
                    <motion.span variants={rule} className="block h-px bg-white/70 origin-right" aria-hidden="true" />
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                variants={tail}
                initial="hidden"
                animate="show"
                exit="exit"
                className="mt-auto pt-10 ml-auto w-full max-w-xl"
              >
                <span className="block h-px bg-white/70" aria-hidden="true" />
                <div className="pt-5 flex flex-col items-end gap-4 text-right">
                  <ul className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-widest">
                    {SOLUTIONS_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={close} className="text-white/80 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] font-semibold uppercase tracking-wider leading-relaxed text-white/80">
                    FEN1 ERP
                    <br />
                    The operating system for glass, aluminium &amp; windows.
                  </p>
                  <Link
                    href="/request-demo"
                    onClick={close}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white hover:gap-3 transition-all"
                  >
                    Request a demo <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
