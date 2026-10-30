"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GALLERY } from "@/data/gallery";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "HOME", href: "/", note: "The FEN1 overview" },
  { name: "SOLUTIONS", href: "/solutions", note: "Verticals and every module" },
  { name: "ABOUT", href: "/about", note: "Why FEN1 exists" },
  { name: "TRAINING", href: "/training", note: "Getting your team up to speed" },
  { name: "CONTACT US", href: "/request-demo?topic=question", note: "Talk to the team" },
];

/** A link's path without its query (the contact link carries ?topic=question), for working out which page is current */
const pathOf = (href: string) => href.split("?")[0];
const isCurrent = (pathname: string, href: string) => pathname === pathOf(href) || (pathOf(href) !== "/" && pathname.startsWith(pathOf(href)));

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
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          {/* FEN1 Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 bg-[#1B4FD6] rounded-sm flex items-center justify-center overflow-hidden shadow-xs">
              <div className="w-2.5 h-2.5 border border-[#B8D4FB] rotate-45 transition-transform group-hover:rotate-90 duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-[#0B1530] leading-none">
                FEN1
              </span>
              <span className="text-[11px] font-mono uppercase text-[#1B4FD6] tracking-widest mt-0.5">
                ERP
              </span>
            </div>
          </Link>

          {/* Page links, one click away on wide screens (the full-screen menu is for smaller ones) */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8 mx-auto">
            {NAV_LINKS.map((link) => {
              const current = isCurrent(pathname, link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={cn("nav-link text-xs font-semibold tracking-wider", current ? "text-[#1B4FD6]" : "text-[#4A5B7A] hover:text-[#0B1530]")}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex ml-auto lg:ml-0 items-center gap-2.5">
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
            className="menu-toggle lg:hidden ml-auto sm:ml-3 flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-full bg-[#E3EEFC] border border-[#D0DCF0] text-[#0B1530] hover:bg-[#FFFFFF] transition-colors"
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

      {/* Full-screen menu: links on one side, a photo that follows the link under the pointer on the other */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#F2F7FF] grid md:grid-cols-2 overflow-y-auto font-sans"
          >
            <nav aria-label="Main" className="flex flex-col justify-start md:justify-center px-5 sm:px-10 lg:px-14 pt-24 pb-10 min-h-dvh" onMouseLeave={() => setHovered(null)}>
              <ul className="menu-links">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    data-dim={hovered !== null && hovered !== link.name}
                  >
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHovered(link.name)}
                      onFocus={() => setHovered(link.name)}
                      className="flex items-center gap-4 py-2.5 sm:py-4 border-b border-[#D0DCF0] group"
                    >
                      <span className="text-xs font-semibold text-[#1B4FD6] tabular-nums w-6">0{i + 1}</span>
                      <span>
                        <span
                          data-current={isCurrent(pathname, link.href)}
                          className="menu-link-text block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#0B1530]"
                        >
                          {link.name}
                        </span>
                        <span className="block text-xs sm:text-sm text-[#4A5B7A] mt-1">{link.note}</span>
                      </span>
                      <ArrowRight className="ml-auto w-5 h-5 text-[#1B4FD6] -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="hidden md:block relative overflow-hidden" aria-hidden="true">
              {NAV_LINKS.map((link, i) => {
                const shown = (hovered ?? NAV_LINKS.find((l) => pathOf(l.href) === pathname)?.name ?? NAV_LINKS[0].name) === link.name;
                const slide = GALLERY[i % GALLERY.length];
                return (
                  <Image
                    key={link.name}
                    src={slide.src}
                    alt=""
                    fill
                    sizes="50vw"
                    priority={i === 0}
                    className="object-cover transition-all duration-700 ease-out"
                    style={{ opacity: shown ? 1 : 0, transform: shown ? "scale(1)" : "scale(1.08)", objectPosition: slide.position }}
                  />
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/55 via-transparent to-[#0B1530]/10" />
              <p className="absolute left-8 bottom-8 right-8 text-white text-sm font-semibold">
                {GALLERY[Math.max(0, NAV_LINKS.findIndex((l) => l.name === (hovered ?? "HOME"))) % GALLERY.length].title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
