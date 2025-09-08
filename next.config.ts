import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Appwrite Sites (static hosting)
  output: "export",
  // Next/Image needs to be unoptimized when exporting static HTML
  images: {
    unoptimized: true,
  },
  // Optional: nicer static hosting URLs
  // trailingSlash: true,
};

export default nextConfig;
