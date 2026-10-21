"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#E3EEFC] text-[#4A5B7A] border-t border-[#D0DCF0] relative font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-14 border-b border-[#D0DCF0]">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#1B4FD6] rounded-sm flex items-center justify-center shadow-xs">
                <div className="w-2.5 h-2.5 border border-[#B8D4FB] rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0B1530]">
                FEN1
              </span>
            </Link>
            <p className="text-xs text-[#4A5B7A] max-w-sm leading-relaxed">
              THE OPERATING SYSTEM FOR GLASS, ALUMINIUM & WINDOWS.
            </p>
            <p className="text-xs text-[#4A5B7A] max-w-sm leading-relaxed">
              From estimation to installation, FEN1 connects sales, engineering, procurement, production, projects, people, finance and analytics in one integrated ERP platform.
            </p>
            <div className="pt-2">
              <Link
                href="/request-demo"
                className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0B1530] hover:text-[#1B4FD6] transition-colors"
              >
                <span>REQUEST A FEN1 DEMO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#1B4FD6] tracking-widest block font-semibold">
              SOLUTIONS
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/solutions#windows-doors" className="hover:text-[#0B1530] transition-colors">Windows & Doors</Link></li>
              <li><Link href="/solutions#glass" className="hover:text-[#0B1530] transition-colors">Glass Processing & IGUs</Link></li>
              <li><Link href="/solutions#fabrication" className="hover:text-[#0B1530] transition-colors">Aluminium Fabrication</Link></li>
              <li><Link href="/solutions#contractors" className="hover:text-[#0B1530] transition-colors">Glazing Contractors</Link></li>
              <li><Link href="/solutions#dealers" className="hover:text-[#0B1530] transition-colors">Dealer Networks</Link></li>
              <li><Link href="/solutions#modules" className="hover:text-[#0B1530] transition-colors">All Modules</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#1B4FD6] tracking-widest block font-semibold">
              RESOURCES
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/training" className="hover:text-[#0B1530] transition-colors">Training</Link></li>
              <li><Link href="/training#roles" className="hover:text-[#0B1530] transition-colors">Role-Based Training</Link></li>
              <li><Link href="/about#philosophy" className="hover:text-[#0B1530] transition-colors">Platform Philosophy</Link></li>
              <li><Link href="/contact" className="hover:text-[#0B1530] transition-colors">Technical Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <span className="text-[10px] font-mono uppercase text-[#1B4FD6] tracking-widest block font-semibold">
              COMPANY
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/about" className="hover:text-[#0B1530] transition-colors">About FEN1</Link></li>
              <li><Link href="/contact" className="hover:text-[#0B1530] transition-colors">Contact Us</Link></li>
              <li><Link href="/request-demo" className="hover:text-[#0B1530] transition-colors">Request a Demo</Link></li>
              <li className="pt-2 text-[10px] font-mono uppercase text-[#1B4FD6]">LEGAL</li>
              <li><span className="text-xs text-[#4A5B7A]">Privacy Policy</span></li>
              <li><span className="text-xs text-[#4A5B7A]">Terms of Service</span></li>
              <li><span className="text-xs text-[#4A5B7A]">Enterprise Security</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#4A5B7A]">
          <span>© {new Date().getFullYear()} FEN1 SYSTEMS. All rights reserved.</span>
          <span className="text-[11px] text-[#1B4FD6]">
            THE OPERATING SYSTEM FOR GLASS, ALUMINIUM & WINDOWS.
          </span>
        </div>
      </div>
    </footer>
  );
}
