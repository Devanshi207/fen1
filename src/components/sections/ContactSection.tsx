"use client";

import Image from "next/image";
import StepWizard from "@/components/StepWizard";
import { CONTACT_PHOTO } from "@/data/gallery";
import { CONTACT_WIZARD } from "@/lib/wizards";

const PHOTO = CONTACT_PHOTO;

/**
 * The last section: the enquiry as five short questions, one at a time (see StepWizard), with a photograph beside it.
 * #demo and #question scroll here and pick the first answer. Both columns are ordinary blocks with room around them, so
 * nothing is cropped and no text sits against an edge.
 */
export default function ContactSection() {
  return (
    <section id="contact" data-section="contact" className="contact-sec">
      <span id="demo" className="sec-anchor" aria-hidden="true" />
      <span id="question" className="sec-anchor" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 contact-grid">
        <div className="contact-photo">
          <Image src={PHOTO.src} alt={PHOTO.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" quality={85} className="object-cover" style={PHOTO.position ? { objectPosition: PHOTO.position } : undefined} />
        </div>
        <div className="contact-form">
          <StepWizard config={CONTACT_WIZARD} />
        </div>
      </div>
    </section>
  );
}
