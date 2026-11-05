import type { Metadata } from "next";
import AboutSection from "@/components/sections/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description: "FEN1 is a Kyozon ERP product made for the fenestration industry. One job record runs from the first enquiry to final handover.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <AboutSection />
    </div>
  );
}
