"use client";

import SlotBooking from "@/components/SlotBooking";

/** The page the demo QR code and the "Book a slot" buttons open: a calendar, a time, then the visitor's details. */
export default function BookSection() {
  return (
    <section id="book" data-section="book" className="contact-sec">
      <div className="max-w-xl mx-auto px-4 sm:px-6 contact-grid book-grid">
        <div className="contact-form">
          <SlotBooking />
        </div>
      </div>
    </section>
  );
}
