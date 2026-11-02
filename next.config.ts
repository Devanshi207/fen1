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
      // The site is one continuous page; every old page address opens the matching part of it
      { source: "/products", destination: "/#modules", permanent: true },
      { source: "/products/:slug", destination: "/#modules", permanent: true },
      { source: "/solutions", destination: "/#solutions", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/training", destination: "/#training", permanent: true },
      { source: "/careers", destination: "/#careers", permanent: true },
      { source: "/request-demo", destination: "/#demo", permanent: true },
      { source: "/contact", destination: "/#question", permanent: true },
    ];
  },
};

export default nextConfig;
