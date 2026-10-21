import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" },
    ],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/solutions#modules", permanent: true },
      { source: "/products/:slug", destination: "/solutions#modules", permanent: true },
    ];
  },
};

export default nextConfig;
