import type { Metadata } from "next";
import ApplySection from "@/components/sections/ApplySection";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for a FEN1 opening: your details and your resume.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <ApplySection />
    </div>
  );
}
