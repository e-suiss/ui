import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/docs/ui", destination: "/docs", permanent: true },
      { source: "/docs/ui/:path*", destination: "/docs/:path*", permanent: true },
      { source: "/docs/:product(uim|access|relay|work|one)/:path*", destination: "/docs", permanent: true },
    ];
  },
  turbopack: {
    resolveAlias: {
      "storybook/test": "./lib/storybook/test.ts",
      "@storybook/react-vite": "./lib/storybook/react-vite.ts",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
