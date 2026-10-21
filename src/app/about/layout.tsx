import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What FEN1 is and how it connects every team, from enquiry to handover.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
