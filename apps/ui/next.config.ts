import path from "node:path"
import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/@fontsource/inter/files/inter-latin-*-normal.woff",
      "../../packages/web/components/**/*",
      "../../packages/web/hooks/**/*",
      "../../packages/mobile/components/**/*",
      "../../packages/mobile/uniwind/components/**/*",
      "../../packages/mobile/nativewind/components/**/*",
      "../../packages/mobile/stylesheet/components/**/*",
      "../../packages/mobile/swiftui/Sources/**/*",
      "../../packages/mobile/kotlin/ui/src/main/**/*",
    ],
  },
  reactStrictMode: true,
  agentRules: false,
  cacheComponents: true,
  cacheLife: {
    default: {
      stale: 300,
      revalidate: 60 * 60 * 24 * 30,
      expire: 60 * 60 * 24 * 365,
    },
  },
  partialPrefetching: true,
  redirects() {
    return Promise.resolve([
      { source: "/docs/ui", destination: "/docs", permanent: true },
      {
        source: "/docs/ui/:path*",
        destination: "/docs/:path*",
        permanent: true,
      },
      {
        source: "/docs/:product(uim|access|relay|work|one)/:path*",
        destination: "/docs",
        permanent: true,
      },
    ])
  },
  rewrites() {
    const markdown = [
      {
        type: "header" as const,
        key: "accept",
        value: "(.*)text/markdown(.*)",
      },
    ]
    return Promise.resolve({
      beforeFiles: [
        { source: "/docs.md", destination: "/llms.mdx/docs" },
        { source: "/docs/:path*.md", destination: "/llms.mdx/docs/:path*" },
        { source: "/docs", has: markdown, destination: "/llms.mdx/docs" },
        {
          source: "/docs/:path*",
          has: markdown,
          destination: "/llms.mdx/docs/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    })
  },
  headers() {
    return Promise.resolve([
      { source: "/docs/:path*", headers: [{ key: "Vary", value: "Accept" }] },
    ])
  },
  turbopack: {
    root: path.join(import.meta.dirname, "../.."),
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
}

const withMDX = createMDX()

export default withMDX(nextConfig)
