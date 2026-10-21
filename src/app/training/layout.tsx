import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training",
  description: "Role-based training for every team that uses FEN1.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
