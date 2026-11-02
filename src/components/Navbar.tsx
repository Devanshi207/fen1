"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { GALLERY } from "@/data/gallery";
import { watchCentre } from "@/lib/inview";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "#home", note: "The FEN1 overview" },
  { name: "Solutions", href: "#solutions", note: "Industries and every module" },
  { name: "About", href: "#about", note: "Why FEN1 exists" },
  { name: "Training", href: "#training", note: "Getting your team up to speed" },
  { name: "Careers", href: "#careers", note: "Work with us" },
  { name: "Contact us", href: "#contact", note: "Talk to the team" },
];
const IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // the menu (and its photos) is only built once someone opens it; after that it stays and is shown or hidden with CSS
  const [menuBuilt, setMenuBuilt] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  // the part of the page in the middle of the screen: the page is one continuous scroll, so this is the "current page"
  const [current, setCurrent] = useState(IDS[0]);

  // The header gains a shadow once the page has moved: a 1px marker near the top of the page tells us when it has
  // scrolled out of view (IntersectionObserver, so there is no scroll listener)
  const top = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = top.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const els = IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    return watchCentre(els, (el) => {
      setCurrent(el.id);
      // keep the address in step with where you are (a link into the middle of a part, like #glass or #question, is left alone)
      const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null;
      if (target && target.closest("[data-section]") === el) return;
      const url = el.id === IDS[0] ? window.location.pathname + window.location.search : `#${el.id}`;
      window.history.replaceState(window.history.state, "", url);
    });
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

  return (
    <>
      <div ref={top} aria-hidden="true" className="absolute left-0 top-5 h-px w-px pointer-events-none" />
      <header data-scrolled={scrolled} className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#DCE6F5] py-4">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          {/* FEN1 Brand Logo */}
          <Link href="#home" aria-label="FEN1, back to the top" className="flex items-center">
            <Image src="/brand/fen1-logo.png" alt="FEN1" width={900} height={294} priority sizes="120px" className="h-9 w-auto" />
          </Link>

          {/* Page links, one click away on wide screens (the full-screen menu is for smaller ones) */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
            {NAV_LINKS.map((link) => {
              const isCurrentLink = link.href === `#${current}`;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isCurrentLink ? "page" : undefined}
                  className={cn("nav-link text-sm font-medium", isCurrentLink ? "text-[#0067C0]" : "text-[#55637A] hover:text-[#1E2B45]")}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Menu button: three lines that fold into a cross */}
          <button
            onClick={() => {
              setMenuBuilt(true);
              setMobileOpen(!mobileOpen);
            }}
            className="menu-toggle lg:hidden ml-auto sm:ml-3 flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-full bg-[#F3F7FF] border border-[#DCE6F5] text-[#1E2B45] hover:bg-[#FFFFFF] transition-colors"
            aria-label="Toggle Navigation"
            aria-expanded={mobileOpen}
            data-open={mobileOpen}
          >
            <span className="hidden sm:block text-sm font-medium">{mobileOpen ? "Close" : "Menu"}</span>
            <span className="menu-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen menu: links on one side, a photo that follows the link under the pointer on the other */}
      {menuBuilt && (
          <div data-open={mobileOpen} aria-hidden={!mobileOpen} className="menu-overlay z-40 bg-white grid md:grid-cols-2 overflow-y-auto font-sans">
            <nav aria-label="Main" className="flex flex-col justify-start md:justify-center px-5 sm:px-10 lg:px-14 pt-24 pb-10 min-h-dvh" onMouseLeave={() => setHovered(null)}>
              <ul className="menu-links">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.name} style={{ "--i": i } as React.CSSProperties} data-dim={hovered !== null && hovered !== link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      onMouseEnter={() => setHovered(link.name)}
                      onFocus={() => setHovered(link.name)}
                      className="flex items-center gap-4 py-2.5 sm:py-4 border-b border-[#DCE6F5] group"
                    >
                      <span className="text-xs font-semibold text-[#0067C0] tabular-nums w-6">0{i + 1}</span>
                      <span>
                        <span
                          data-current={link.href === `#${current}`}
                          className="menu-link-text block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#1E2B45]"
                        >
                          {link.name}
                        </span>
                        <span className="block text-xs sm:text-sm text-[#55637A] mt-1">{link.note}</span>
                      </span>
                      <ArrowRight className="ml-auto w-5 h-5 text-[#0067C0] -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden md:block relative overflow-hidden" aria-hidden="true">
              {NAV_LINKS.map((link, i) => {
                const shown = (hovered ?? NAV_LINKS.find((l) => l.href === `#${current}`)?.name ?? NAV_LINKS[0].name) === link.name;
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
            </div>
          </div>
      )}
    </>
  );
}
