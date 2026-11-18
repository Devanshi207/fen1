"use client";

import StepWizard from "@/components/StepWizard";
import { BOOK_WIZARD } from "@/lib/wizards";

/** The page the demo QR code opens: a phone-sized form for a day, a time and the visitor's details. */
export default function BookSection() {
  return (
    <section id="book" data-section="book" className="contact-sec">
      <div className="max-w-xl mx-auto px-4 sm:px-6 contact-grid book-grid">
        <div className="contact-form">
          <StepWizard config={BOOK_WIZARD} />
        </div>
      </div>
    </section>
  );
}
