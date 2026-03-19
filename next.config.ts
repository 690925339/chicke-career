import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/chicke-career",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
