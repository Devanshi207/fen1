import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";

/** The public site: the header, the page itself and the footer once at the end. The admin area has its own layout. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="page" className="flex-1 w-full pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
      <MotionProvider />
    </>
  );
}
