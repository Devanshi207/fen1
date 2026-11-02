"use client";

import Image from "next/image";
import EnquiryPanel from "@/components/EnquiryPanel";
import { GALLERY } from "@/data/gallery";
import { TOPICS } from "@/data/enquiryForms";
import { useTopic } from "@/lib/topic";

const PHOTO = GALLERY[1];

/**
 * The last section: the one enquiry form ("I'd like a demo" or "I have a question") with a photo and the pitch beside it.
 * #demo and #question scroll here and pick the choice. Both columns are ordinary blocks with room around them, so
 * nothing is cropped and no text sits against the edge.
 */
export default function ContactSection() {
  const [topic, setTopic] = useTopic();
  const pitch = TOPICS[topic].pitch;

  return (
    <section id="contact" data-section="contact" className="page-sec">
      <span id="demo" className="sec-anchor" aria-hidden="true" />
      <span id="question" className="sec-anchor" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 contact-grid">
        <div className="contact-side">
          <div className="contact-photo">
            <Image src={PHOTO.src} alt={PHOTO.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" style={{ objectPosition: PHOTO.position }} />
          </div>
          <div className="contact-pitch">
            <p className="tech sec-eyebrow">{pitch.kicker}</p>
            <h2 className="contact-title" aria-label={pitch.line}>
              {pitch.heading.split("\n").map((l) => (
                <span key={l} className="block" aria-hidden="true">
                  {l}
                </span>
              ))}
            </h2>
            <p className="sec-lede">{pitch.body}</p>
          </div>
        </div>
        <div className="contact-form">
          <EnquiryPanel topic={topic} onTopic={setTopic} headingClass="contact-form-title" />
        </div>
      </div>
    </section>
  );
}
