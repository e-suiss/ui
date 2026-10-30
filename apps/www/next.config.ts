import path from "node:path"
import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    deviceSizes: [640, 828, 1080, 1280, 1920, 2560],
    imageSizes: [384],
  },
  reactStrictMode: true,
  agentRules: false,
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
