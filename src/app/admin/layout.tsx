import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./admin.css";

// The admin area is for the team: keep it out of search results.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="adm-header">
        <Link href="/" className="adm-brand" aria-label="FEN1, back to the website">
          <Image src="/brand/fen1-logo.png" alt="FEN1" width={900} height={294} className="h-8 w-auto" />
          <span className="tech adm-brand-sub">Admin</span>
        </Link>
        <Link href="/" className="adm-link">
          Back to the website
        </Link>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
}
