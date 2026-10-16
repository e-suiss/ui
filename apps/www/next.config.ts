import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
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
