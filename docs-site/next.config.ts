import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  turbopack: { root: process.cwd() },
  agentRules: false
};

export default nextConfig;
