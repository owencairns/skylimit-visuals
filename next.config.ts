import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/films',
        destination: '/wedding-videography',
        permanent: true,
      },
      {
        source: '/photos',
        destination: '/wedding-photography',
        permanent: true,
      },
      {
        source: '/investment',
        destination: '/wedding-photography-videography-pricing',
        permanent: true,
      },
    ];
  },
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
