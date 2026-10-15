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
      "../../packages/web/lib/**/*",
      "../../packages/web/examples/**/*",
      "../../packages/mobile/components/**/*",
      "../../packages/mobile/uniwind/components/**/*",
      "../../packages/mobile/nativewind/components/**/*",
      "../../packages/mobile/stylesheet/components/**/*",
      "../../packages/mobile/swiftui/Sources/**/*",
      "../../packages/mobile/kotlin/ui/src/main/**/*",
      "../../packages/mobile/stories/**/*",
      "../../packages/mobile/swiftui/Catalog/Catalog/Stories/**/*",
      "../../packages/mobile/kotlin/catalog/src/main/kotlin/com/esuiss/catalog/stories/**/*",
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
        {
          source: "/r/:style(radix-[^/]+|new-york|default)/:file",
          destination: "/r/radix/:file",
        },
        {
          source: "/r/:style((?!(?:base|radix|rn-[^/]+)/)[^/]+)/:file",
          destination: "/r/base/:file",
        },
        {
          source: "/r/:file((?!(?:base|radix)$)[^/]+)",
          destination: "/r/base/:file",
        },
      ],
      afterFiles: [],
      fallback: [],
    })
  },
  headers() {
    return Promise.resolve([
      {
        source: "/:path*",
        headers: [{ key: "X-Build", value: process.env.BUILD_SHA ?? "dev" }],
      },
      { source: "/docs/:path*", headers: [{ key: "Vary", value: "Accept" }] },
      {
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400",
          },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ])
  },
  turbopack: {
    root: path.join(import.meta.dirname, "../.."),
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
