import type { Metadata } from "next";
import TrainingSection from "@/components/sections/TrainingSection";

export const metadata: Metadata = {
  title: "Training",
  description: "Each team is trained on the modules it works in, following the same workflow from enquiry to handover.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <TrainingSection />
    </div>
  );
}
