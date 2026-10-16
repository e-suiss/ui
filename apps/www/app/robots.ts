import type { MetadataRoute } from "next"

import { absolute, site } from "@/lib/site"

const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
]

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/ui/api/", "/ui/source/"]
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      {
        userAgent: aiCrawlers,
        allow: ["/", "/llms.txt", "/ui/llms.txt", "/ui/llms-full.txt"],
        disallow,
      },
    ],
    sitemap: [absolute("/sitemap.xml"), absolute("/ui/sitemap.xml")],
    host: site.url,
  }
}

export const dynamic = "force-static"
