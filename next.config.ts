import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/ask": ["./data/hcps.json"],
  },
};

export default nextConfig;
