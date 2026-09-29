import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build to plain static files in `out/` so the site can stay on Firebase Hosting.
  output: "export",
  // The default image optimizer needs a server; static exports serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
