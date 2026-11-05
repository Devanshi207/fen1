import HomeIntro from "@/components/HomeIntro";
import HomeSection from "@/components/sections/HomeSection";

/**
 * The home page: the hero, the drawing that resolves into a window, and the workflow. Solutions, About, Training, Careers and
 * Contact are pages of their own (see the other folders in app/(site)); the header and footer are shared (app/(site)/layout.tsx).
 */
export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <HomeIntro />
      <HomeSection />
    </div>
  );
}
