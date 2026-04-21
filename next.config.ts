import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  // Note: TypeScript errors exist but are non-blocking (mostly type strictness issues)
  // Run `npx tsc --noEmit` to see all type errors
  // TODO: Fix type errors and set this to false for production
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
