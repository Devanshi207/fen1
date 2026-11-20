import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/Footer";

describe("how to reach the team", () => {
  it("shows the phone number and the email on the Contact page, as links", () => {
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "+91 93276 68052" })).toHaveAttribute("href", "tel:+919327668052");
    expect(screen.getByRole("link", { name: "info@kyozon.in" })).toHaveAttribute("href", "mailto:info@kyozon.in");
  });

  it("keeps Contact us, Request a demo and Book a meeting together under Contact us in the footer, with About us holding the company links", () => {
    render(<Footer />);
    const col = (title: string) => screen.getByText(title, { selector: "span" }).parentElement as HTMLElement;
    const contact = col("Contact us");
    for (const name of ["Contact us", "Request a demo", "Book a meeting", "+91 93276 68052", "info@kyozon.in"]) expect(Array.from(contact.querySelectorAll("a")).map((a) => a.textContent)).toContain(name);
    for (const name of ["Request a demo", "Book a meeting"]) expect(Array.from(contact.querySelectorAll("a")).map((a) => a.textContent)).toContain(name);
    const about = col("About us");
    expect(Array.from(about.querySelectorAll("a")).map((a) => a.textContent)).toEqual(["About FEN1"]);
    expect(screen.queryByText("Company")).toBeNull();
  });
});
