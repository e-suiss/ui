import path from "node:path";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@fontsource/inter/files/inter-latin-*-normal.woff", "./components/**/*", "./registry/**/*"],
  },
  reactStrictMode: true,
  agentRules: false,
  cacheComponents: true,
  cacheLife: {
    default: { stale: 300, revalidate: 60 * 60 * 24 * 30, expire: 60 * 60 * 24 * 365 },
  },
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/docs/ui", destination: "/docs", permanent: true },
      { source: "/docs/ui/:path*", destination: "/docs/:path*", permanent: true },
      { source: "/docs/:product(uim|access|relay|work|one)/:path*", destination: "/docs", permanent: true },
    ];
  },
  async rewrites() {
    const markdown = [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }];
    return {
      beforeFiles: [
        { source: "/docs.md", destination: "/llms.mdx/docs" },
        { source: "/docs/:path*.md", destination: "/llms.mdx/docs/:path*" },
        { source: "/docs", has: markdown, destination: "/llms.mdx/docs" },
        { source: "/docs/:path*", has: markdown, destination: "/llms.mdx/docs/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [{ source: "/docs/:path*", headers: [{ key: "Vary", value: "Accept" }] }];
  },
  turbopack: {
    resolveAlias: {
      "@/tests/story-kit": "./lib/story-kit.ts",
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
