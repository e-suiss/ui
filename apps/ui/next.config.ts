import { existsSync, readdirSync } from "node:fs"
import path from "node:path"
import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

import { basePath } from "./lib/base-path"

const bases = path.join(import.meta.dirname, "../../packages/web/bases")
const primitiveBases = readdirSync(bases, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      existsSync(path.join(bases, entry.name, "files.json"))
  )
  .map((entry) => entry.name)
  .sort(
    (a, b) =>
      Number(b === "radix") - Number(a === "radix") || a.localeCompare(b)
  )

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  env: {
    PRIMITIVE_BASES: primitiveBases.join(","),
  },
  reactStrictMode: true,
  agentRules: false,
  ...(process.env.NODE_ENV === "development" && {
    rewrites: () =>
      Promise.resolve({
        beforeFiles: [
          { source: "/docs.md", destination: "/llms.mdx/docs.md" },
          {
            source: "/docs/:path*.md",
            destination: "/llms.mdx/docs/:path*.md",
          },
          {
            source: "/r/:style(radix-[^/]+|new-york|default)/:file",
            destination: "/r/radix/:file",
          },
          {
            source: "/r/:style(aria-[^/]+)/:file",
            destination: "/r/aria/:file",
          },
          {
            source: "/r/:style((?!(?:base|radix|aria|rn-[^/]+)/)[^/]+)/:file",
            destination: "/r/base/:file",
          },
          {
            source: "/r/:file((?!(?:base|radix|aria)$)[^/]+)",
            destination: "/r/base/:file",
          },
        ],
        afterFiles: [],
        fallback: [],
      }),
  }),
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
