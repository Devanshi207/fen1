import Image from "next/image";
import KineticHeading from "@/components/KineticHeading";
import EnquiryForm, { type FieldSpec } from "@/components/EnquiryForm";
import { GALLERY } from "@/data/gallery";

const BUSINESS_TYPES = [
  "Aluminium Windows & Doors",
  "Glass Processing & DGU Manufacturing",
  "Glazing Contractors",
  "Aluminium Fabrication Job Shop",
  "Specialist Glazing Contractor",
  "Dealer / Distributor Network",
];

const FIELDS: FieldSpec[] = [
  { key: "name", label: "Full name", required: true, half: true },
  { key: "company", label: "Company", required: true, half: true },
  { key: "email", label: "Work email", type: "email", required: true, half: true },
  { key: "phone", label: "Phone / mobile", type: "tel", required: true, half: true },
  { key: "businessType", label: "Business type", type: "choice", options: BUSINESS_TYPES, allowOther: true, otherLabel: "Describe your business" },
  { key: "currentSystem", label: "Current software", half: true },
  { key: "interestedModules", label: "Modules you want to see", half: true },
  { key: "message", label: "Anything specific you want to see?", type: "area" },
];

const INITIAL = { name: "", company: "", email: "", phone: "", businessType: BUSINESS_TYPES[0], currentSystem: "", interestedModules: "", message: "" };

const PHOTO = GALLERY[2];

export default function RequestDemoPage() {
  return (
    <div className="w-full bg-[#F2F7FF] text-[#0B1530] font-sans grid lg:grid-cols-[5fr_6fr] min-h-dvh">
      {/* Left: photo and the pitch */}
      <section className="relative min-h-[22rem] lg:min-h-0 lg:sticky lg:top-0 lg:h-dvh overflow-hidden text-white">
        <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: PHOTO.position }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1530]/85 via-[#0B1530]/45 to-[#0B1530]/20" />
        <div className="relative z-10 h-full flex flex-col justify-end gap-4 px-6 sm:px-10 pt-28 pb-10 lg:pb-14">
          <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#9CC3F7]">Live demonstration</span>
          <KineticHeading text={"SEE YOUR BUSINESS\nTHROUGH FEN1."} className="text-3xl sm:text-5xl font-bold tracking-tight" />
          <p className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed">
            Explore how your sales, estimation, projects, procurement, production, people, and finance can connect within one unified platform.
          </p>
        </div>
      </section>

      {/* Right: the form */}
      <section className="flex items-center px-6 sm:px-10 lg:px-14 xl:px-20 pt-10 pb-16 lg:pt-28">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Request a demo</h1>
          <EnquiryForm
            kind="demo"
            fields={FIELDS}
            initial={INITIAL}
            submitLabel="Request demo"
            doneTitle="Demo request confirmed"
            doneText="We have received your request and will be in touch to arrange a demonstration for your technical and management team."
          />
        </div>
      </section>
    </div>
  );
}
