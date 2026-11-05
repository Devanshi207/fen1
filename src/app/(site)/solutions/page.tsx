import type { Metadata } from "next";
import SolutionsSection from "@/components/sections/SolutionsSection";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Windows and doors, glass railing and curtain wall: how a job runs in FEN1 for each, step by step.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <SolutionsSection />
    </div>
  );
}
