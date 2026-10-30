import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, DM_Sans, Fraunces, Inter, Lexend, Nunito_Sans, Outfit, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./themes.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import ThemeSwitch from "@/components/ThemeSwitch";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-bricolage", display: "swap" });
const outline = Anton({ subsets: ["latin"], weight: "400", variable: "--font-outline", display: "swap" });
const menu = Sora({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-menu", display: "swap" });
const body = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit", display: "swap" });
// Faces for the alternate looks in themes.css. Not preloaded, so the default pages never fetch them.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap", preload: false });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap", preload: false });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito", display: "swap", preload: false });
const altFonts = [fraunces, dmSans, grotesk, inter, lexend, nunito].map((f) => f.variable).join(" ");

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

const HOME_FLAG = `try{var q=new URLSearchParams(location.search),h=q.get("home"),l=q.get("layout"),s=sessionStorage;var studio=h==="studio"||(h!=="default"&&s.getItem("fen1-home")==="studio");var hz=l==="horizontal"||h==="horizontal"||(l!=="default"&&s.getItem("fen1-layout")==="horizontal");var d=document.documentElement;if(studio)d.dataset.home="studio";else if(location.pathname==="/"&&!hz){d.dataset.intro="1";var c=document.createElement("div");c.id="fen1-cover";c.setAttribute("aria-hidden","true");c.style.cssText="position:fixed;inset:0;z-index:150;background:#f0f6fe";d.appendChild(c);setTimeout(function(){c.remove()},8000)}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${display.variable} ${body.variable} ${outline.variable} ${menu.variable} ${altFonts}`}>
      <head>
        {/* Runs at once, before anything paints (next/script's beforeInteractive waits for the site's JavaScript, which is too late): marks the studio home (same rule as lib/studio) so the normal home never flashes, and on a fresh load of the normal home page puts up a cover for its opening animation (components/studio/HomeIntro). The cover is built here, not in a CSS file, because a stylesheet can arrive after the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: HOME_FLAG }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F2F7FF] text-[#0B1530] selection:bg-[#5CC8FF] selection:text-[#FFFFFF]">
        <Navbar />
        <main id="page" className="flex-1 w-full pt-16 sm:pt-20">{children}</main>
        <Footer />
        <MotionProvider />
        <ThemeSwitch />
      </body>
    </html>
  );
}
