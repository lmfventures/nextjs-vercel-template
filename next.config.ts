import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't ship the "X-Powered-By" header.
  poweredByHeader: false,

  // Build-time savers. Opt in per project with Vercel env vars when type
  // checking already runs elsewhere (e.g. editor / pre-push hook).
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPECHECK === "1",
  },

  // Source maps for the browser bundle are slow to generate and rarely needed.
  productionBrowserSourceMaps: false,
};

export default nextConfig;
