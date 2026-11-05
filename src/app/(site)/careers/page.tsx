import type { Metadata } from "next";
import CareersSection from "@/components/sections/CareersSection";

export const metadata: Metadata = {
  title: "Careers",
  description: "Work where software meets the shop floor: roles from the trade and from software, and how to apply.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <CareersSection />
    </div>
  );
}
