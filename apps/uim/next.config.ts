import path from "node:path";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@fontsource/inter/files/inter-latin-*-normal.woff", "./registry/**/*"],
  },
  reactStrictMode: true,
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
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
