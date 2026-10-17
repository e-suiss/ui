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
  ...(process.env.NODE_ENV === "development" && {
    rewrites: () =>
      Promise.resolve({
        beforeFiles: [
          { source: "/", destination: "/en" },
          {
            source:
              "/:path((?!en(?:/|$)|tr(?:/|$)|_next|og/|images/|icon|apple-icon|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|llms\\.txt).+)",
            destination: "/en/:path",
          },
        ],
        afterFiles: [],
        fallback: [],
      }),
  }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
