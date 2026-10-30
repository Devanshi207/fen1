import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a demo or ask a question",
  description: "Ask for a walkthrough of FEN1 for your glass, aluminium or window business, or send the team a question.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
