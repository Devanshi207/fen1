import type { Metadata } from "next";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Request a FEN1 demo or ask the team a question, in a few short clicks.",
};

export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <ContactSection />
    </div>
  );
}
