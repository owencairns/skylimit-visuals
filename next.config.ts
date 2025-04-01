import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/skylimit-visuals.firebasestorage.app/o/**",
      },
      {
        protocol: "https",
        hostname: "www.ddinstagram.com",
      },
    ],
  },
};

export default nextConfig;
