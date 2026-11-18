import type { Metadata } from "next";
import BookSection from "@/components/sections/BookSection";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Pick a day and a time for a FEN1 demo and leave your details. The team will confirm the slot.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <BookSection />
    </div>
  );
}
