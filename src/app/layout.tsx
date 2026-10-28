import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-bricolage", display: "swap" });
const outline = Anton({ subsets: ["latin"], weight: "400", variable: "--font-outline", display: "swap" });
const body = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#F2F7FF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "FEN1 - The Operating System for Glass, Aluminium & Windows",
    template: "%s | FEN1",
  },
  description:
    "From estimation to installation, FEN1 connects sales, engineering, procurement, production, projects, people, finance and analytics in one integrated ERP platform.",
  keywords: [
    "FEN1",
    "Fen1 ERP",
    "Fen1 ERP Software",
    "Glass ERP",
    "Window ERP",
    "Windows and Doors ERP",
    "Glazing ERP",
    "Fenestration ERP",
    "Aluminium Fabrication ERP",
    "Glass Manufacturing ERP",
    "Window Manufacturing Software",
    "Glass Project Management Software",
    "Fenestration Management Software",
  ],
  authors: [{ name: "FEN1 Systems" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${display.variable} ${body.variable} ${outline.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F2F7FF] text-[#0B1530] selection:bg-[#5CC8FF] selection:text-[#FFFFFF]">
        <Navbar />
        <main id="page" className="flex-1 w-full pt-16 sm:pt-20">{children}</main>
        <Footer />
        <MotionProvider />
      </body>
    </html>
  );
}
