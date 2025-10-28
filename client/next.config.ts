import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eduverselmsbucket.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: false,
    minimumCacheTTL: 60,
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // turn off ESLint during builds
  },
};

export default nextConfig;
