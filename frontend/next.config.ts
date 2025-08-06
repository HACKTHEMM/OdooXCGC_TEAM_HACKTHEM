import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Keep this for production builds
  },
  // Remove typescript ignoreBuildErrors for better development experience
};

export default nextConfig;
