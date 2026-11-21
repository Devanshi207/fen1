import type { Metadata } from "next";
import CareersSection from "@/components/sections/CareersSection";

export const metadata: Metadata = {
  title: "Careers",
  description: "Build the future of fenestration with Kyozon: areas where we love to meet talent, who should connect with us, and the current openings.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <CareersSection />
    </div>
  );
}
