"use client";

import { useEffect, useState } from "react";
import qrcode from "qrcode-generator";

/**
 * A QR code for a path on this site, drawn as plain SVG squares (no image, no outside service). The address is built in the
 * browser from where the site is being viewed, or from NEXT_PUBLIC_SITE_URL when that is set, so it works on any host.
 */
export default function QrCode({ path, label }: { path: string; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/+$/, "");
    queueMicrotask(() => setUrl(`${base}${path}`));
  }, [path]);

  if (!url) return <div className="qr-box qr-wait" aria-hidden="true" />;
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount();
  const cells: string[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) cells.push(`M${c} ${r}h1v1h-1z`);
  return (
    <div>
      <div className="qr-box">
      <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} role="img" aria-label={label} shapeRendering="crispEdges">
        <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
        <path d={cells.join("")} fill="#1E2B45" />
      </svg>
      </div>
    </div>
  );
}
