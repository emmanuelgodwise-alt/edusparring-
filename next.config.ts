import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    'preview-chat-c044950b-c7a4-4fad-a0b3-0c629b941ed2.space.z.ai',
    '.space.z.ai',
  ],
};

export default nextConfig;
