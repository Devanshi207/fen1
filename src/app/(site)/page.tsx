import HomeIntro from "@/components/HomeIntro";
import HomeSection from "@/components/sections/HomeSection";
import SolutionsSection from "@/components/sections/SolutionsSection";
import AboutSection from "@/components/sections/AboutSection";
import TrainingSection from "@/components/sections/TrainingSection";
import CareersSection from "@/components/sections/CareersSection";
import ContactSection from "@/components/sections/ContactSection";

/**
 * The whole site is this one continuous page: Home, Solutions, About, Training, Careers and Contact in order, with the
 * footer once at the end. The header links scroll to each part and highlight the one you are in (see Navbar).
 */
export default function Page() {
  return (
    <div className="w-full bg-white text-[#1E2B45] font-sans">
      <HomeIntro />
      <HomeSection />
      <SolutionsSection />
      <AboutSection />
      <TrainingSection />
      <CareersSection />
      <ContactSection />
    </div>
  );
}
