import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['https://sommaire-ai.loca.lt'],
  },
};

export default nextConfig;
