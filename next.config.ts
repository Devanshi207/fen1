import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Lets phones and tablets on the same Wi-Fi load the dev server (http://<pc-ip>:3000). Without this Next.js blocks
  // its own scripts for any host but localhost, so the page renders but no JavaScript runs. Dev only; `next build` ignores it.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" },
    ],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/solutions#modules", permanent: true },
      { source: "/products/:slug", destination: "/solutions#modules", permanent: true },
      // Contact and demo are one page now; old /contact links open it on "I have a question"
      { source: "/contact", destination: "/request-demo?topic=question", permanent: true },
    ];
  },
};

export default nextConfig;
