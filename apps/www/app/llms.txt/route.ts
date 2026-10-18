import { dictionary } from "@/lib/dictionary"
import { libraries, products } from "@/lib/products"
import { absolute, site } from "@/lib/site"

const UI_FACTS = [
  "Web: React components for Next.js and Vite, built with Tailwind CSS v4 on a choice of three primitive bases: Base UI, Radix or React Aria.",
  "Mobile: React Native and Expo components styled with Uniwind, NativeWind or StyleSheet, plus native SwiftUI (Swift Package Manager) and Jetpack Compose libraries.",
  "One design on every platform: the same component names, parts and design tokens, with light and dark mode.",
  "Install: `npx @esuiss/ui@latest init`, then `npx @esuiss/ui@latest add button`. Every component is copied into your project, so you own the code.",
  "Registry: any project with a components.json can add items from `https://suiss.app/ui/r/{style}/{name}.json` under the `@esuiss` namespace.",
  `Docs: [Introduction](${absolute("/ui/docs")}), [Installation](${absolute("/ui/docs/installation")}), [Components](${absolute("/ui/docs/components")}), [CLI](${absolute("/ui/docs/cli")}), full text for AI at ${absolute("/ui/llms-full.txt")}.`,
  "License: MIT. Source: https://github.com/e-suiss/ui",
]

export function GET() {
  const lines = [
    `# ${site.name}`,
    `> ${dictionary.description}`,
    "suiss is an agent-native infrastructure ecosystem of eight products. Each product does one job for people and AI agents alike: One understands, Access authorizes, Relay communicates, Money holds, Pay moves money, Commerce buys and sells, Serve fulfills and Work coordinates. One, Access, Relay and Work are in development; Money, Pay, Commerce and Serve are planned. The open-source component library suiss/ui, for React, React Native, SwiftUI and Jetpack Compose, is available now.",
    `## Products\n\n${products
      .map(
        (product) =>
          `- [suiss ${product.name}](${absolute(`/${product.slug}`)}): ${product.category} (${product.status === "development" ? "in development" : "planned"}). ${product.summary} Core question: ${product.question}`
      )
      .join("\n")}`,
    `## Developers\n\n${libraries
      .map(
        (library) =>
          `- [${library.name}](${library.url}): ${library.tagline} Start with \`${library.install}\`. Documentation for AI: ${library.url}/llms.txt`
      )
      .join("\n")}`,
    `## suiss/ui at a glance\n\n${UI_FACTS.map((fact) => `- ${fact}`).join("\n")}`,
    `## Optional\n\n- [GitHub](${site.github})\n- [npm](${site.npm})`,
  ]
  return new Response(lines.join("\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export const dynamic = "force-static"
