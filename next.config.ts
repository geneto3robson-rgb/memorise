import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Autorise les avatars Google
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // (Au cas où tu aurais des images Unsplash plus tard)
      }
    ],
  },
};

export default nextConfig;