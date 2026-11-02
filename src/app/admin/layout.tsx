import type { Metadata } from "next";
import Link from "next/link";
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
        <Link href="/" className="adm-brand">
          <span className="adm-mark" aria-hidden="true" />
          <span>FEN1</span>
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
