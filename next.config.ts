import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  outputFileTracingIncludes: {
    "/api/:path*": ["./node_modules/.prisma/client/**"],
    "/api": ["./node_modules/.prisma/client/**"],
  },
};

export default nextConfig;
