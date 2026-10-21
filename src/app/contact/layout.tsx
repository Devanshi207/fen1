import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the FEN1 team.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
