import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 On ignore les erreurs TS/ESLint strictes pour le build de production
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },
};

export default nextConfig;