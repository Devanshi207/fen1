"use client";

import Link from "next/link";
import QrCode from "@/components/QrCode";
import StepWizard from "@/components/StepWizard";
import { CONTACT } from "@/data/contact";
import { CONTACT_WIZARD } from "@/lib/wizards";

/**
 * The last section: the enquiry as five short questions, one at a time (see StepWizard), with the demo QR code beside it.
 * #demo and #question scroll here and pick the first answer.
 */
export default function ContactSection() {
  return (
    <section id="contact" data-section="contact" className="contact-sec">
      <span id="demo" className="sec-anchor" aria-hidden="true" />
      <span id="question" className="sec-anchor" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 contact-grid">
        <div className="contact-side">
          <div className="qr-card">
            <div className="qr-left">
              <QrCode path="/book" label="QR code that opens the demo booking page" />
              <Link href="/book" className="qr-link">
                Book a slot
              </Link>
            </div>
            <div>
              <h2 className="qr-title">Book a demo from your phone</h2>
              <p className="qr-text">Scan the code, choose a day and a time, and leave your details. The request comes straight to the team.</p>
            </div>
          </div>
          <ul className="contact-direct" aria-label="Contact details">
            <li>
              <span>Phone</span>
              <a href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phone}</a>
            </li>
            <li>
              <span>Email</span>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>
        <div className="contact-form">
          <StepWizard config={CONTACT_WIZARD} />
        </div>
      </div>
    </section>
  );
}
