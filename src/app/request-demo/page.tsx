"use client";

import Image from "next/image";
import KineticHeading from "@/components/KineticHeading";
import EnquiryPanel from "@/components/EnquiryPanel";
import { TOPICS } from "@/data/enquiryForms";
import { useHorizontalLayout } from "@/lib/horizontal";
import { useTopic } from "@/lib/topic";
import HorizontalDemo from "@/components/horizontal/HorizontalDemo";
import { GALLERY } from "@/data/gallery";

const PHOTO = GALLERY[2];

/** The one enquiry page: a demo request or a question, chosen at the top of the form (?topic=question opens on the question). */
export default function RequestDemoPage() {
  // Layout under review: ?layout=horizontal shows this page as a sideways journey (see lib/horizontal)
  const horizontal = useHorizontalLayout();
  const [topic, setTopic] = useTopic();
  if (horizontal) return <HorizontalDemo />;
  const pitch = TOPICS[topic].pitch;

  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans grid lg:grid-cols-[5fr_6fr] min-h-dvh">
      {/* Left: photo and the pitch, which follows the choice */}
      <section className="relative min-h-[22rem] lg:min-h-0 lg:sticky lg:top-0 lg:h-dvh overflow-hidden text-white">
        <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: PHOTO.position }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/85 via-[#0B1530]/45 to-[#0B1530]/20" />
        <div className="relative z-10 h-full flex flex-col justify-end gap-4 px-6 sm:px-10 pt-28 pb-10 lg:pb-14">
          <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#9CC3F7]">{pitch.kicker}</span>
          <KineticHeading key={topic} text={pitch.heading} className="text-3xl sm:text-5xl font-bold tracking-tight" />
          <p className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed">{pitch.body}</p>
        </div>
      </section>

      {/* Right: the choice and the form */}
      <section className="flex items-center px-6 sm:px-10 lg:px-14 xl:px-20 pt-10 pb-16 lg:pt-28">
        <div className="w-full max-w-xl mx-auto">
          <EnquiryPanel topic={topic} onTopic={setTopic} headingAs="h1" headingClass="text-2xl sm:text-3xl font-bold tracking-tight" />
        </div>
      </section>
    </div>
  );
}
