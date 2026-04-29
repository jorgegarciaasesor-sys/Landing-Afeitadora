import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["zod"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
