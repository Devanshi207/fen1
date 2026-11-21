import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description: "FEN1 is a purpose-built ERP solution designed specifically for the window, door and façade industry.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <AboutSection />
    </div>
  );
}
