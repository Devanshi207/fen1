import nodemailer from "nodemailer";
import { CONTACT } from "@/data/contact";

/**
 * Email, sent over SMTP with the details of any mailbox (Zoho, Google Workspace, the hosting company's mail, ...). Set these where
 * the site runs (on Vercel: Settings > Environment Variables) and redeploy:
 *   SMTP_HOST, SMTP_PORT (465 for a secure connection, 587 otherwise), SMTP_USER, SMTP_PASS
 *   MAIL_FROM          the address mail is sent from (default: SMTP_USER)
 *   ADMIN_NOTIFY_EMAIL where the team's copy goes (default: the contact address on the site)
 * Without SMTP_HOST, SMTP_USER and SMTP_PASS no email is sent; bookings and enquiries are still saved. Sending never throws: a
 * mail that fails is reported as false and never undoes a booking.
 */
export interface MailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  adminTo: string;
}

export function mailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    user,
    pass,
    from: process.env.MAIL_FROM?.trim() || user,
    adminTo: process.env.ADMIN_NOTIFY_EMAIL?.trim() || CONTACT.email,
  };
}

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const config = mailConfig();
  if (!config) return false;
  try {
    const transport = nodemailer.createTransport({ host: config.host, port: config.port, secure: config.port === 465, auth: { user: config.user, pass: config.pass } });
    await transport.sendMail({ from: `FEN1 <${config.from}>`, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html, ...(mail.replyTo ? { replyTo: mail.replyTo } : {}) });
    return true;
  } catch {
    return false;
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** One line, for a subject or a name: no line breaks, so nothing typed in a form can add a header. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim().slice(0, 120);

export interface Booking {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  when: string; // "Tuesday 24 November 2026, 11:00 IST"
  industry?: string;
  companySize?: string;
}

const page = (inner: string) => `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1e2b45;max-width:560px">${inner}</div>`;
const row = (label: string, value: string) => (value ? `<tr><td style="padding:4px 16px 4px 0;color:#55637a">${esc(label)}</td><td style="padding:4px 0">${esc(value)}</td></tr>` : "");

/** The team's copy: who booked which slot, with their details. Replying goes to the visitor. */
export function adminBookingMail(b: Booking, to: string): Mail {
  const rows: [string, string][] = [["When", b.when], ["Name", oneLine(b.name)], ["Company", oneLine(b.company)], ["Email", b.email], ["Phone", b.phone], ["Makes or installs", b.industry ?? ""], ["Team size", b.companySize ?? ""], ["Message", b.message]];
  const text = ["A demo slot has been booked.", "", ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");
  const html = page(`<p><strong>A demo slot has been booked.</strong></p><table>${rows.map(([k, v]) => row(k, v)).join("")}</table>`);
  return { to, subject: `New demo slot: ${b.when}, ${oneLine(b.name)}`, text, html, replyTo: b.email };
}

/** The visitor's confirmation: the slot, and who to write to. */
export function userBookingMail(b: Booking, replyTo: string): Mail {
  const name = oneLine(b.name).split(" ")[0] || "there";
  const text = [`Hello ${name},`, "", "Your FEN1 demo slot is booked.", "", `When: ${b.when}`, "", `If you need to change it, reply to this email or write to ${CONTACT.email}, or call ${CONTACT.phone}.`, "", "FEN1 by Kyozon"].join("\n");
  const html = page(`<p>Hello ${esc(name)},</p><p>Your FEN1 demo slot is booked.</p><table>${row("When", b.when)}</table><p>If you need to change it, reply to this email or write to <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a>, or call ${esc(CONTACT.phone)}.</p><p style="color:#55637a">FEN1 by Kyozon</p>`);
  return { to: b.email, subject: `Your FEN1 demo is booked: ${b.when}`, text, html, replyTo };
}

/** Sends both emails for a booking. Resolves to what happened to each; never throws. */
export async function notifyBooking(b: Booking): Promise<{ admin: boolean; user: boolean }> {
  const config = mailConfig();
  if (!config) return { admin: false, user: false };
  const [admin, user] = await Promise.all([sendMail(adminBookingMail(b, config.adminTo)), sendMail(userBookingMail(b, config.adminTo))]);
  return { admin, user };
}
