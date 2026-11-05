import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import "./globals.css";
import "./motion.css";
import "./sections.css";

// Headings: IBM Plex Sans. Body and small labels: Inter.
const display = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "FEN1 | ERP for aluminium fabrication, glass processing and glazing",
    template: "%s | FEN1",
  },
  description:
    "FEN1 is an ERP product under Kyozon, built for the fenestration industry: aluminium windows, doors, façades, curtain walls and glass systems.",
  keywords: [
    "FEN1",
    "Fen1 ERP",
    "Fen1 ERP Software",
    "Glass ERP",
    "Curtain Wall ERP",
    "Facade ERP",
    "Kyozon",
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

const HOME_FLAG = `try{var d=document.documentElement,s=sessionStorage;if(location.pathname==="/"&&!location.hash&&!s.getItem("fen1-intro-seen")){d.dataset.intro="1";var c=document.createElement("div");c.id="fen1-cover";c.setAttribute("aria-hidden","true");c.style.cssText="position:fixed;inset:0;z-index:150;background:#ffffff";d.appendChild(c);setTimeout(function(){c.remove()},8000)}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${display.variable} ${body.variable}`}>
      <head>
        {/* Runs at once, before anything paints (next/script's beforeInteractive waits for the site's JavaScript, which is too late): on a first visit to the top of the page it marks the document (data-intro) and puts a cover over it, so the home page never shows before the opening splash (components/HomeIntro). The cover is built here, not in a CSS file, because a stylesheet can arrive after the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: HOME_FLAG }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#1E2B45] selection:bg-[#0078D4] selection:text-[#FFFFFF]">
        {children}
      </body>
    </html>
  );
}
