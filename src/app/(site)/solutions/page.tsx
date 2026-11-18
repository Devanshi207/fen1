import type { Metadata } from "next";
import SolutionsSection from "@/components/sections/SolutionsSection";
import Workflow from "@/components/Workflow";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Windows and doors, glass railing and curtain wall: what each one uses, and the whole job from enquiry to handover, stage by stage.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <SolutionsSection />
      <Workflow />
    </div>
  );
}
