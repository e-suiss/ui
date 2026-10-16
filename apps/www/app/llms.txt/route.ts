import { getDictionary, localePath } from "@/lib/i18n"
import { libraries, products } from "@/lib/products"
import { absolute, site } from "@/lib/site"

export function GET() {
  const dictionary = getDictionary("en")
  const lines = [
    `# ${site.name}`,
    `> ${dictionary.description}`,
    "suiss is an agent-native infrastructure ecosystem of eight products. Each product does one job for people and AI agents alike: One understands, Access authorizes, Relay communicates, Money holds, Pay moves money, Commerce buys and sells, Serve fulfills and Work coordinates. One, Access, Relay and Work are in development; Money, Pay, Commerce and Serve are planned. The open-source component library suiss/ui, for React, React Native, SwiftUI and Jetpack Compose, is available now.",
    `## Products\n\n${products
      .map(
        (product) =>
          `- [suiss ${product.name}](${absolute(localePath("en", `/${product.slug}`))}): ${product.category.en} (${product.status === "development" ? "in development" : "planned"}). ${product.summary.en} Core question: ${product.question.en}`
      )
      .join("\n")}`,
    `## Developers\n\n${libraries
      .map(
        (library) =>
          `- [${library.name}](${library.url}): ${library.tagline.en} Start with \`${library.install}\`. Documentation for AI: ${library.url}/llms.txt`
      )
      .join("\n")}`,
    `## Optional\n\n- [Turkish version](${absolute("/tr")})\n- [GitHub](${site.github})`,
  ]
  return new Response(lines.join("\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export const dynamic = "force-static"
