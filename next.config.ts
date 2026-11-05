import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Lets phones and tablets on the same Wi-Fi load the dev server (http://<pc-ip>:3000). Without this Next.js blocks
  // its own scripts for any host but localhost, so the page renders but no JavaScript runs. Dev only; `next build` ignores it.
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  images: {
    // smaller files for the same photo where the browser can read them
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" },
    ],
  },
  async redirects() {
    return [
      // Each part of the site is a page of its own; these old addresses go to the matching page
      { source: "/products", destination: "/solutions", permanent: true },
      { source: "/products/:slug", destination: "/solutions", permanent: true },
      { source: "/request-demo", destination: "/contact#demo", permanent: true },
    ];
  },
};

export default nextConfig;
